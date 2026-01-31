import React from "react";

export default function CategoryCard({ title, children }) {
  return (
    <section className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          {title}
        </h3>
      </div>
      <div className="space-y-2 bg-gray-900/60 border border-gray-800 rounded-xl p-3">
        {children}
      </div>
    </section>
  );
}

