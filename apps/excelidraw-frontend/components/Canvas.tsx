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
  Moon,
  Sun,
  Move,
} from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "line" | "arrow" | "text" | "pencil" | "select";

export type Theme = "light" | "dark";

export interface ThemeColors {
  background: string;
  stroke: string;
  fill: string;
  selected: string;
  text: string;
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    background: "#ffffff",
    stroke: "#1f2937",
    fill: "#3b82f6",
    selected: "#f59e0b",
    text: "#111827",
  },
  dark: {
    background: "#0a0a0a",
    stroke: "#e5e7eb",
    fill: "#60a5fa",
    selected: "#fbbf24",
    text: "#f9fafb",
  },
};

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [theme, setTheme] = useState<Theme>("dark");
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    game?.setTheme(theme);
  }, [theme, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket, theme);
      setGame(g);
      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket, theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className="h-screen overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: themes[theme].background,
        color: themes[theme].text,
      }}
    >
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
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
  onDelete,
  theme,
  onToggleTheme,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  onDelete: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const isDark = theme === "dark";

  return (
    <div
      className="fixed top-4 left-110 z-10 flex gap-2 backdrop-blur-md rounded-xl p-2 shadow-md border transition-colors duration-300"
      style={{
        backgroundColor: isDark
          ? "rgba(38, 38, 38, 0.6)"
          : "rgba(255, 255, 255, 0.6)",
        borderColor: isDark
          ? "rgba(64, 64, 64, 1)"
          : "rgba(229, 231, 235, 1)",
      }}
    >
      {[
        { tool: "select", icon: <Move size={20} />, label: "Select/Drag" },
        { tool: "line", icon: <Minus size={20} />, label: "Line" },
        { tool: "rect", icon: <RectangleHorizontalIcon size={20} />, label: "Rectangle" },
        { tool: "circle", icon: <Circle size={20} />, label: "Circle" },
        { tool: "pencil", icon: <Pencil size={20} />, label: "Pencil" },
        { tool: "arrow", icon: <ArrowRight size={20} />, label: "Arrow" },
        { tool: "text", icon: <TypeOutline size={20} />, label: "Text" },
      ].map(({ tool, icon, label }) => (
        <div key={tool} title={label}>
          <IconButton
            onClick={() => setSelectedTool(tool as Tool)}
            activated={selectedTool === tool}
            icon={icon}
          />
        </div>
      ))}
      <IconButton onClick={onDelete} activated={false} icon={<Trash2 size={20} />} />
      <div
        className="w-px mx-1"
        style={{
          backgroundColor: isDark ? "rgba(64, 64, 64, 1)" : "rgba(209, 213, 219, 1)",
        }}
      />
      <IconButton
        onClick={onToggleTheme}
        activated={false}
        icon={isDark ? <Sun size={20} /> : <Moon size={20} />}
      />
    </div>
  );
}