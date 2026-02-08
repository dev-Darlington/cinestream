"use client"

import { useEffect, useState } from "react";

type Theme = "default" | "cinema";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("default");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle(
        "theme-cinema",
        saved === "cinema"
      );
    }
  }, []);

  function toggleTheme() {
    const next = theme === "default" ? "cinema" : "default";
    setTheme(next);

    document.documentElement.classList.toggle(
      "theme-cinema",
      next === "cinema"
    );

    localStorage.setItem("theme", next);
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-xl
                 bg-surface hover:bg-surface/80 transition"
      aria-label="Toggle cinema mode"
    >
      <span className="text-lg">
        {theme === "cinema" ? "🎬" : "🌙"}
      </span>
      <span className="text-sm text-textSecondary hidden md:block">
        {theme === "cinema" ? "Cinema" : "Default"}
      </span>
    </button>
  );
}
