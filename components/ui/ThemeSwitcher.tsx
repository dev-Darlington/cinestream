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
      className="w-10 h-10 rounded-full bg-surface hover:bg-white/10 hover:border-accent/30 border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer text-lg text-white"
      aria-label="Toggle cinema mode"
      title={theme === "cinema" ? "Switch to Default Mode" : "Switch to Cinema Mode"}
    >
      {theme === "cinema" ? "🎬" : "🌙"}
    </button>
  );
}
