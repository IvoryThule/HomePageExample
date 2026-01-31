import React from "react";
import { twMerge } from "tailwind-merge";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={twMerge(
        "w-full bg-gray-900/70 border border-gray-700/80 rounded-md px-3 py-1.5",
        "text-xs text-gray-100 placeholder:text-gray-500",
        "focus:outline-none focus:ring-1 focus:ring-blue-500/70 focus:border-blue-500/70",
        "transition-colors",
        className
      )}
      {...props}
    />
  );
}


