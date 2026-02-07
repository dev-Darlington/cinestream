"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFavorites } from "@/contexts/favoritesContext";

export default function FavoritesCounter() {
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false)

  useEffect(()=>{
    setMounted(true)
  }, [])

  if(!mounted) return null;
  
  return (
    <Link
      href="/favorites"
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl
                 hover:bg-surface transition group"
    >

      <span className="text-sm font-medium text-textSecondary group-hover:text-textPrimary">
        Favorites
      </span>

      {favorites.length > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[20px] h-[20px]
                     bg-accent text-black text-sm font-semibold
                     rounded-full flex items-center justify-center"
        >
          {favorites.length}
        </span>
      )}
    </Link>
  );
}
