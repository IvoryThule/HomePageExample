import React from "react";
import { twMerge } from "tailwind-merge";

export default function Badge({ className = "", children }) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2 py-0.5 rounded-full",
        "bg-gray-800 text-[10px] text-gray-300 border border-gray-700",
        className
      )}
    >
      {children}
    </span>
  );
}

