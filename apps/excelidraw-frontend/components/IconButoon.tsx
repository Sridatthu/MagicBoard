"use client";

import React from "react";

interface IconButtonProps {
  onClick: () => void;
  activated: boolean;
  icon: React.ReactNode;
}

export function IconButton({ onClick, activated, icon }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
        activated
          ? "bg-blue-500 text-white shadow-lg"
          : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
      style={{
        width: "36px",
        height: "36px",
        cursor: "pointer",
        border: "none",
      }}
    >
      {icon}
    </button>
  );
}