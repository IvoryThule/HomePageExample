import React from "react";
import { twMerge } from "tailwind-merge";

export default function Button({ className = "", children, ...props }) {
  return (
    <button
      className={twMerge(
        "inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg",
        "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700",
        "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

