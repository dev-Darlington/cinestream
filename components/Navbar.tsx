"use client"

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaXmark, FaDownload } from "react-icons/fa6" 
import SearchBar from "./ui/SearchBar";
import FavoritesCounter from "@/components/ui/FavoritesCounter";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import NavLink from "./ui/NavLink";
import MobileMenu from "./ui/MobileMenu";
import { useDownloads } from "@/contexts/downloadsContext";
import DownloadManager from "./ui/DownloadManager";


const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [downloadManagerOpen, setDownloadManagerOpen] = useState(false)
  const { activeDownloads } = useDownloads()

  const activeCount = activeDownloads.length

  return (
    <nav className="sticky top-0 w-full text-white z-999 bg-bg backdrop-blur border-b border-white/5 font-manrope">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 text-white cursor-pointer group select-none">
                <svg className="w-8 h-8 transition-transform duration-500 group-hover:rotate-12" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-accent)" />
                      <stop offset="100%" stopColor="var(--color-accent-2)" />
                    </linearGradient>
                    <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <circle cx="64" cy="64" r="54" stroke="url(#brandGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="240 80" transform="rotate(-45 64 64)" opacity="0.3" />
                  <path d="M96 32C87.5 23.5 76 18.5 64 18.5C38.9 18.5 18.5 38.9 18.5 64C18.5 89.1 38.9 109.5 64 109.5C76 109.5 87.5 104.5 96 96" stroke="url(#brandGrad)" strokeWidth="8" strokeLinecap="round" filter="url(#logoGlow)" />
                  <path d="M54 44.5V83.5L86 64L54 44.5Z" fill="url(#brandGrad)" stroke="url(#brandGrad)" strokeWidth="4" strokeLinejoin="round" filter="url(#logoGlow)" />
                </svg>
                <h2 className="text-xl lg:text-2xl font-extrabold uppercase tracking-widest bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent group-hover:brightness-110 transition duration-300 font-outfit">
                  cinestream
                </h2>
            </Link>
            <div className="hidden md:flex items-center gap-1 lg:gap-3 text-sm font-medium text-textSecondary group-hover:text-textPrimary">
                <NavLink />
                <FavoritesCounter />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <SearchBar />
            <div className="flex items-center gap-2">
              
              {/* Download Manager Trigger Icon */}
              <button
                onClick={() => setDownloadManagerOpen(!downloadManagerOpen)}
                className="relative p-2.5 rounded-xl bg-surface hover:bg-surface/80 transition cursor-pointer text-white flex items-center justify-center border border-white/5"
                aria-label="Toggle download manager"
              >
                <FaDownload size={16} className={activeCount > 0 ? "text-accent animate-pulse" : ""} />
                {activeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-2 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-md animate-bounce">
                    {activeCount}
                  </span>
                )}
              </button>

              <ThemeSwitcher />
              
              <button className="md:hidden hover:bg-surface text-accent cursor-pointer" onClick={()=>setOpen(!open)} aria-label="Toggle menu">
              {open ? <FaXmark size={20} /> : <FaBars size={20} />}
              </button>
            </div>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
      <DownloadManager isOpen={downloadManagerOpen} onClose={() => setDownloadManagerOpen(false)} />
    </nav>
  )
}
export default Navbar