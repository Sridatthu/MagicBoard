"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Circle,
  Minus,
  Pencil,
  RectangleHorizontalIcon,
  PenLine as TypeOutline,
  Trash2,
  Moon,
  Sun,
  Move,
  LogOutIcon,
} from "lucide-react"
import { Game } from "@/draw/Game"
import { AnimatePresence, type MotionValue, motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useRouter } from "next/navigation"

export type Tool = "circle" | "rect" | "line" | "arrow" | "text" | "pencil" | "select"

export type Theme = "light" | "dark"

export interface ThemeColors {
  background: string
  stroke: string
  fill: string
  selected: string
  text: string
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
}

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string
  socket: WebSocket
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<Tool>("circle")
  const [theme, setTheme] = useState<Theme>("dark")
  const [game, setGame] = useState<Game>()

  useEffect(() => {
    game?.setTool(selectedTool)
  }, [selectedTool, game])

  useEffect(() => {
    game?.setTheme(theme)
  }, [theme, game])

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket, theme)
      setGame(g)
      return () => {
        g.destroy()
      }
    }
  }, [canvasRef, roomId, socket, theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <div
      className="h-screen overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: themes[theme].background,
        color: themes[theme].text,
      }}
    >
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="w-full h-full"></canvas>

      <TopBar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onDelete={() => game?.deleteSelectedShape()}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  )
}

function TopBar({
  selectedTool,
  setSelectedTool,
  onDelete,
  theme,
  onToggleTheme,
}: {
  selectedTool: Tool
  setSelectedTool: (s: Tool) => void
  onDelete: () => void
  theme: Theme
  onToggleTheme: () => void
}) {
  const isDark = theme === "dark"
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
const router=useRouter();
  const tools = [
    { tool: "select" as Tool, icon: <Move size={20} />, label: "Select/Drag" },
    { tool: "line" as Tool, icon: <Minus size={20} />, label: "Line" },
    { tool: "rect" as Tool, icon: <RectangleHorizontalIcon size={20} />, label: "Rectangle" },
    { tool: "circle" as Tool, icon: <Circle size={20} />, label: "Circle" },
    { tool: "pencil" as Tool, icon: <Pencil size={20} />, label: "Pencil" },
    { tool: "arrow" as Tool, icon: <ArrowRight size={20} />, label: "Arrow" },
    { tool: "text" as Tool, icon: <TypeOutline size={20} />, label: "Text" },
  ]

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-3 backdrop-blur-md rounded-2xl p-3 shadow-lg border transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "rgba(38, 38, 38, 0.7)" : "rgba(255, 255, 255, 0.7)",
        borderColor: isDark ? "rgba(64, 64, 64, 1)" : "rgba(229, 231, 235, 1)",
      }}
    >
      {tools.map(({ tool, icon, label }) => (
        <ToolIcon
          key={tool}
          mouseX={mouseX}
          tool={tool}
          icon={icon}
          label={label}
          isSelected={selectedTool === tool}
          onClick={() => setSelectedTool(tool)}
          isDark={isDark}
        />
      ))}

      {/* Divider */}
      <div
        className="w-px mx-1"
        style={{
          backgroundColor: isDark ? "rgba(64, 64, 64, 1)" : "rgba(209, 213, 219, 1)",
        }}
      />

      {/* Delete Button */}
      <ToolIcon
        mouseX={mouseX}
        tool="delete"
        icon={<Trash2 size={20} />}
        label="Delete"
        isSelected={false}
        onClick={onDelete}
        isDark={isDark}
      />

      {/* Theme Toggle */}
      <ToolIcon
        mouseX={mouseX}
        tool="theme"
        icon={isDark ? <Sun size={20} /> : <Moon size={20} />}
        label={isDark ? "Light Mode" : "Dark Mode"}
        isSelected={false}
        onClick={onToggleTheme}
        isDark={isDark}
      />
       <ToolIcon
        mouseX={mouseX}
        tool="exit"
        icon={<LogOutIcon size={20} />}
        label="exit"
        isSelected={false}
        onClick={()=>router.push("/")}
        isDark={isDark}
      />
    </motion.div>
  )
}

interface ToolIconProps {
  mouseX: MotionValue
  tool: string
  icon: React.ReactNode
  label: string
  isSelected: boolean
  onClick: () => void
  isDark: boolean
}

function ToolIcon({ mouseX, tool, icon, label, isSelected, onClick, isDark }: ToolIconProps) {
  const buttonref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const bounds = buttonref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40])
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40])
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 30, 20])
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 30, 20])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 120,
    damping: 12,
  })
  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.button
      ref={buttonref}
      style={{ width, height }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex aspect-square items-center justify-center rounded-full transition-all duration-200 ${
        isSelected
          ? isDark
            ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
            : "bg-amber-500 shadow-lg shadow-amber-500/50"
          : isDark
            ? "bg-neutral-700 hover:bg-neutral-600"
            : "bg-gray-300 hover:bg-gray-400"
      }`}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-8 left-1/2 w-fit rounded-md border px-2 py-0.5 text-xs whitespace-nowrap font-medium"
            style={{
              backgroundColor: isDark ? "rgba(30, 30, 30, 0.95)" : "rgba(245, 245, 245, 0.95)",
              borderColor: isDark ? "rgba(64, 64, 64, 1)" : "rgba(209, 213, 219, 1)",
              color: isDark ? "#f9fafb" : "#111827",
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center text-white"
      >
        {icon}
      </motion.div>
    </motion.button>
  )
}
