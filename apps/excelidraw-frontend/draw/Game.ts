import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Point = { x: number; y: number };

type Shape =
  | { type: "rect"; id: string; x: number; y: number; width: number; height: number }
  | { type: "circle"; id: string; centerX: number; centerY: number; radius: number }
  | { type: "line"; id: string; startX: number; startY: number; endX: number; endY: number }
  | { type: "arrow"; id: string; startX: number; startY: number; endX: number; endY: number }
  | { type: "pencil"; id: string; points: Point[] };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private roomId: string;
  private clicked: boolean = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private currentPath: Point[] = [];

  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;

  private selectedShape: Shape | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private isDragging: boolean = false;

  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  async init() {
    try {
      this.existingShapes = await getExistingShapes(this.roomId);
      this.clearCanvas();
    } catch (error) {
      console.error("Failed to load existing shapes:", error);
      this.existingShapes = [];
      this.clearCanvas();
    }
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "chat") {
          const parsedShape = JSON.parse(message.message);
          const exists = this.existingShapes.some(s => s.id === parsedShape.shape.id);
          if (!exists) {
            this.existingShapes.push(parsedShape.shape);
            this.clearCanvas();
          }
        } else if (message.type === "update") {
          const parsedData = JSON.parse(message.message);
          const updatedShape = parsedData.shape;
          const index = this.existingShapes.findIndex((s) => s.id === updatedShape.id);
          if (index !== -1) {
            this.existingShapes[index] = updatedShape;
            this.clearCanvas();
          }
        } else if (message.type === "delete") {
          const shapeId = message.shapeId;
          this.existingShapes = this.existingShapes.filter((s) => s.id !== shapeId);
          this.clearCanvas();
        } else if (message.type === "error") {
          console.error("Server error:", message.message);
        }
      } catch (error) {
        console.error("Failed to process WebSocket message:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("wheel", this.zoomHandler);
    this.canvas.removeEventListener("dblclick", this.doubleClickHandler);
    window.removeEventListener("keydown", this.keyDownHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
    this.selectedShape = null;
    this.isDragging = false;
    this.clearCanvas();
  }

  private applyTransform() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
  }

  private getTransformedPoint(x: number, y: number): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (x - rect.left - this.offsetX) / this.scale,
      y: (y - rect.top - this.offsetY) / this.scale,
    };
  }
private drawArrow(startX: number, startY: number, endX: number, endY: number) {
  const headLength = 15 / this.scale; // Arrowhead length (scales with zoom)
  const angle = Math.atan2(endY - startY, endX - startX);

  // Draw the main line
  this.ctx.beginPath();
  this.ctx.moveTo(startX, startY);
  this.ctx.lineTo(endX, endY);
  this.ctx.stroke();

  // Draw the arrowhead (two lines at 30° angles)
  this.ctx.beginPath();
  this.ctx.moveTo(endX, endY);
  this.ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  this.ctx.moveTo(endX, endY);
  this.ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  this.ctx.stroke();
  this.ctx.closePath();
}

  clearCanvas() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.applyTransform();
    this.ctx.strokeStyle = "rgba(255,255,255)";
    this.ctx.lineWidth = 2;

    this.existingShapes.forEach((shape) => {
      // Highlight selected shape
      const isSelected = this.selectedShape && this.selectedShape.id === shape.id;
      
      if (isSelected) {
        this.ctx.strokeStyle = "rgba(255,255,0)";
        this.ctx.lineWidth = 3;
      } else {
        this.ctx.strokeStyle = "rgba(255,255,255)";
        this.ctx.lineWidth = 2;
      }

      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "arrow") {
  this.drawArrow(shape.startX, shape.startY, shape.endX, shape.endY);
}
 else if (shape.type === "pencil") {
        this.ctx.beginPath();
        for (let i = 0; i < shape.points.length - 1; i++) {
          this.ctx.moveTo(shape.points[i].x, shape.points[i].y);
          this.ctx.lineTo(shape.points[i + 1].x, shape.points[i + 1].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });

    // Reset styles
    this.ctx.strokeStyle = "rgba(255,255,255)";
    this.ctx.lineWidth = 2;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  mouseDownHandler = (e: MouseEvent) => {
    const { x, y } = this.getTransformedPoint(e.clientX, e.clientY);

    const shape = this.getShapeAt(x, y);
    if (shape) {
      this.selectedShape = shape;
      this.isDragging = true;
      
      if (shape.type === "rect") {
        this.dragOffsetX = x - shape.x;
        this.dragOffsetY = y - shape.y;
      } else if (shape.type === "circle") {
        this.dragOffsetX = x - shape.centerX;
        this.dragOffsetY = y - shape.centerY;
      } else if (shape.type === "line") {
        this.dragOffsetX = x - shape.startX;
        this.dragOffsetY = y - shape.startY;
      } else if (shape.type === "pencil") {
        this.dragOffsetX = x - shape.points[0].x;
        this.dragOffsetY = y - shape.points[0].y;
      }else if (shape.type === "arrow") {
  this.dragOffsetX = x - shape.startX;
  this.dragOffsetY = y - shape.startY;
}

      
      this.canvas.style.cursor = "grabbing";
      this.clearCanvas();
      return;
    }

    this.clicked = true;
    this.startX = x;
    this.startY = y;
    
    if (this.selectedTool === "pencil") {
      this.currentPath = [{ x, y }];
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    const { x, y } = this.getTransformedPoint(e.clientX, e.clientY);

    if (this.selectedShape && this.isDragging) {
      const dx = x - this.dragOffsetX;
      const dy = y - this.dragOffsetY;
      const s = this.selectedShape;

      if (s.type === "rect") {
        s.x = dx;
        s.y = dy;
      } else if (s.type === "circle") {
        s.centerX = dx;
        s.centerY = dy;
      } else if (s.type === "line") {
        const offsetX = dx - s.startX;
        const offsetY = dy - s.startY;
        s.startX += offsetX;
        s.startY += offsetY;
        s.endX += offsetX;
        s.endY += offsetY;
      }else if (s.type === "arrow") {
  const offsetX = dx - s.startX;
  const offsetY = dy - s.startY;
  s.startX += offsetX;
  s.startY += offsetY;
  s.endX += offsetX;
  s.endY += offsetY;
}

       else if (s.type === "pencil") {
        const offsetX = dx - s.points[0].x;
        const offsetY = dy - s.points[0].y;
        s.points.forEach((p) => {
          p.x += offsetX;
          p.y += offsetY;
        });
      }
      
      this.clearCanvas();
      return;
    }

    const hoveredShape = this.getShapeAt(x, y);
    this.canvas.style.cursor = hoveredShape ? "grab" : "crosshair";

    if (!this.clicked) return;

    const width = x - this.startX;
    const height = y - this.startY;
    this.clearCanvas();
    this.ctx.strokeStyle = "rgba(255,255,255)";

    if (this.selectedTool === "rect") {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      this.ctx.beginPath();
      this.ctx.arc(this.startX + width / 2, this.startY + height / 2, radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (this.selectedTool === "line") {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (this.selectedTool === "arrow") {
  this.drawArrow(this.startX, this.startY, x, y);
}
    else if (this.selectedTool === "pencil") {
      this.currentPath.push({ x, y });
      this.ctx.beginPath();
      for (let i = 0; i < this.currentPath.length - 1; i++) {
        this.ctx.moveTo(this.currentPath[i].x, this.currentPath[i].y);
        this.ctx.lineTo(this.currentPath[i + 1].x, this.currentPath[i + 1].y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    this.canvas.style.cursor = "crosshair";

    if (this.selectedShape && this.isDragging) {
      try {
        this.socket.send(
          JSON.stringify({
            type: "update",
            message: JSON.stringify({ shape: this.selectedShape }),
            roomId: this.roomId,
          })
        );
      } catch (error) {
        console.error("Failed to send shape update:", error);
      }

      this.isDragging = false;
      return;
    }

    const { x, y } = this.getTransformedPoint(e.clientX, e.clientY);
    let shape: Shape | null = null;
    const width = x - this.startX;
    const height = y - this.startY;

    const minSize = 5;
    if (this.selectedTool !== "pencil" && Math.abs(width) < minSize && Math.abs(height) < minSize) {
      this.currentPath = [];
      return;
    }

    const id = this.generateId();

    if (this.selectedTool === "rect") {
      shape = { type: "rect", id, x: this.startX, y: this.startY, width, height };
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      shape = {
        type: "circle",
        id,
        centerX: this.startX + width / 2,
        centerY: this.startY + height / 2,
        radius,
      };
    } else if (this.selectedTool === "line") {
      shape = { type: "line", id, startX: this.startX, startY: this.startY, endX: x, endY: y };
    }else if (this.selectedTool === "arrow") {
  shape = { type: "arrow", id, startX: this.startX, startY: this.startY, endX: x, endY: y };
}
 
    else if (this.selectedTool === "pencil") {
      if (this.currentPath.length > 1) {
        shape = { type: "pencil", id, points: this.currentPath };
      }
    }

    if (!shape) {
      this.currentPath = [];
      return;
    }

    this.existingShapes.push(shape);

    try {
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId: this.roomId,
        })
      );
    } catch (error) {
      console.error("Failed to send shape to server:", error);
      this.existingShapes.pop();
    }

    this.currentPath = [];
    this.clearCanvas();
  };

  // NEW: Double-click to delete
  doubleClickHandler = (e: MouseEvent) => {
    const { x, y } = this.getTransformedPoint(e.clientX, e.clientY);
    const shape = this.getShapeAt(x, y);
    if (shape) {
      this.selectedShape = shape;
      this.deleteSelectedShape();
    }
  };

  // NEW: Keyboard handler for Delete/Backspace
  keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      this.deleteSelectedShape();
    }
  };

  zoomHandler = (e: WheelEvent) => {
    e.preventDefault();
    const { x, y } = this.getTransformedPoint(e.clientX, e.clientY);
    const zoomFactor = 1.1;
    const prevScale = this.scale;
    
    this.scale *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
    this.scale = Math.min(Math.max(this.scale, 0.5), 5);
    
    this.offsetX -= x * this.scale - x * prevScale;
    this.offsetY -= y * this.scale - y * prevScale;
    
    this.clearCanvas();
  };

  private getShapeAt(x: number, y: number): Shape | null {
    for (let i = this.existingShapes.length - 1; i >= 0; i--) {
      const s = this.existingShapes[i];
      
      if (s.type === "rect") {
        const minX = Math.min(s.x, s.x + s.width);
        const maxX = Math.max(s.x, s.x + s.width);
        const minY = Math.min(s.y, s.y + s.height);
        const maxY = Math.max(s.y, s.y + s.height);
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) return s;
      }
      
      if (s.type === "circle") {
        if (Math.hypot(x - s.centerX, y - s.centerY) <= s.radius) return s;
      }
      
      if (s.type === "line") {
        const tolerance = 5 / this.scale;
        const dist = this.pointToLineDistance(x, y, s.startX, s.startY, s.endX, s.endY);
        if (dist <= tolerance) return s;
      }
      
      if (s.type === "pencil") {
        const tolerance = 5 / this.scale;
        for (let j = 0; j < s.points.length - 1; j++) {
          const dist = this.pointToLineDistance(
            x,
            y,
            s.points[j].x,
            s.points[j].y,
            s.points[j + 1].x,
            s.points[j + 1].y
          );
          if (dist <= tolerance) return s;
        }
      }
    }
    return null;
  }

  private pointToLineDistance(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      const shapeId = this.selectedShape.id;
      
      this.existingShapes = this.existingShapes.filter((s) => s.id !== shapeId);
      
      try {
        this.socket.send(
          JSON.stringify({
            type: "delete",
            shapeId: shapeId,
            roomId: this.roomId,
          })
        );
      } catch (error) {
        console.error("Failed to send delete request:", error);
      }

      this.selectedShape = null;
      this.isDragging = false;
      this.clearCanvas();
    }
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("wheel", this.zoomHandler);
    this.canvas.addEventListener("dblclick", this.doubleClickHandler);
    window.addEventListener("keydown", this.keyDownHandler);
    
    this.canvas.style.cursor = "crosshair";
  }
}
