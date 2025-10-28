import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkuser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkuser(token);
  if (userId == null) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });


  ws.on("message", async function message(data) {
    try {
      let parsedData;
      if (typeof data !== "string") {
        parsedData = JSON.parse(data.toString());
      } else {
        parsedData = JSON.parse(data);
      }

      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        if (user && !user.rooms.includes(parsedData.roomId)) {
          user.rooms.push(parsedData.roomId);
        
        }
      }

      if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (!user) {
          return;
        }
        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
       
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;
        
        // Extract shapeId from the message
        let shapeId: string | null = null;
        try {
        const shapeData = JSON.parse(message);
          shapeId = shapeData.shape?.id || null;
        }
        catch (e) {
          console.error("Failed to parse update message:", e);
          return;
        }
        // Create new shape in database
        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId,
            shapeId,
          },
        });


        // Broadcast to other users in the room
        users.forEach((user) => {
          if (user.rooms.includes(roomId) && user.ws !== ws) {
            user.ws.send(JSON.stringify({ type: "chat", message, roomId }));
          }
        });
      }

      // Handle shape updates
      if (parsedData.type === "update") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;
        
        let shapeId: string | null = null;
        try {
          const shapeData = JSON.parse(message);
          shapeId = shapeData.shape?.id || null;
        } catch (e) {
          console.error("Failed to parse update message:", e);
          return;
        }

        if (!shapeId) {
          console.error("No shapeId found in update message");
          return;
        }

        // Find the existing chat/shape entry in database by shapeId
        const existingChat = await prismaClient.chat.findFirst({
          where: {
            roomId: Number(roomId),
            shapeId: shapeId,
          },
        });

        if (existingChat) {
          // Update the shape in database
          await prismaClient.chat.update({
            where: {
              id: existingChat.id,
            },
            data: {
              message: message,
            },
          });


          // Broadcast update to other users in the room
          users.forEach((user) => {
            if (user.rooms.includes(roomId) && user.ws !== ws) {
              user.ws.send(
                JSON.stringify({
                  type: "update",
                  message,
                  roomId,
                })
              );
            }
          });
        } else {
          console.warn(`Shape ${shapeId} not found in room ${roomId}`);
        }
      }

      // Handle shape deletion
      if (parsedData.type === "delete") {
        const roomId = parsedData.roomId;
        const shapeId = parsedData.shapeId;

        if (!shapeId) {
          console.error("No shapeId provided for deletion");
          return;
        }

        // Find and delete the shape from database
        const existingChat = await prismaClient.chat.findFirst({
          where: {
            roomId: Number(roomId),
            shapeId: shapeId,
          },
        });

        if (existingChat) {
          await prismaClient.chat.delete({
            where: {
              id: existingChat.id,
            },
          });

        

          // Broadcast deletion to other users
          users.forEach((user) => {
            if (user.rooms.includes(roomId) && user.ws !== ws) {
              user.ws.send(
                JSON.stringify({
                  type: "delete",
                  shapeId,
                  roomId,
                })
              );
            }
          });
        } else {
          console.warn(`Shape ${shapeId} not found for deletion in room ${roomId}`);
        }
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: "error", message: "Failed to process message" }));
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    const index = users.findIndex((user) => user.ws === ws);
    if (index !== -1) {

      users.splice(index, 1);
    }
    
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log("WebSocket server running on port 8080");
