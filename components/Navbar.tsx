"use client"

import { useState } from "react";
import { FaPlay, FaBars, FaXmark } from "react-icons/fa6" 
import SearchBar from "./ui/SearchBar";
import FavoritesCounter from "@/components/ui/FavoritesCounter";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import NavLink from "./ui/NavLink";
import MobileMenu from "./ui/MobileMenu";



const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 w-full text-white z-999 bg-bg backdrop-blur border-b border-white/5 font-manrope">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 text-amber-400">
                <FaPlay/>
                <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-wide">cinestream</h2>
            </div>
            <div className="hidden md:flex items-center gap-1 lg:gap-3 text-sm font-medium text-textSecondary group-hover:text-textPrimary">
                <NavLink />
                <FavoritesCounter />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <SearchBar />
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <button className="md:hidden hover:bg-surface text-accent cursor-pointer" onClick={()=>setOpen(!open)} aria-label="Toggle menu">
              {open ? <FaXmark size={20} /> : <FaBars size={20} />}
              </button>
            </div>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </nav>
  )
}
export default Navbar