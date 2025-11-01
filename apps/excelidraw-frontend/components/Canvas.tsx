"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButoon";
import {
  ArrowRight,
  Circle,
  Minus,
  Pencil,
  RectangleHorizontalIcon,
  TypeOutline,
  Trash2,
} from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "line" | "arrow" | "text" | "pencil" | "select";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);
      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <div className="h-screen overflow-hidden bg-white text-black dark:bg-neutral-900 dark:text-white transition-colors duration-300">
     
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="w-full h-full"
      ></canvas>

     
      <TopBar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onDelete={() => game?.deleteSelectedShape()}
      />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
  onDelete,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed top-4 left-4 z-10 flex gap-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md rounded-xl p-2 shadow-md border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
      {[
        { tool: "line", icon: <Minus /> },
        { tool: "rect", icon: <RectangleHorizontalIcon /> },
        { tool: "circle", icon: <Circle /> },
        { tool: "pencil", icon: <Pencil /> },
        { tool: "arrow", icon: <ArrowRight /> },
        { tool: "text", icon: <TypeOutline /> },
      ].map(({ tool, icon }) => (
        <IconButton
          key={tool}
          onClick={() => setSelectedTool(tool as Tool)}
          activated={selectedTool === tool}
          icon={icon}
        />
      ))}
      <IconButton onClick={onDelete} activated={false} icon={<Trash2 />} />
    </div>
  );
}
