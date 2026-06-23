"use client"

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { TMDBMovie } from "../../types/tmdb";
import { FaMagnifyingGlass, FaCircleXmark } from "react-icons/fa6";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isMac, setIsMac] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect OS for shortcut label
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  // Keyboard shortcut to focus search: Ctrl+K or Meta+K or "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputActive = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      
      // Ctrl+K / Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
      
      // "/" keybind
      if (e.key === "/" && !isInputActive) {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside detection to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results
  async function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Search API fetch error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Keyboard navigation within search results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const displayedResults = results.slice(0, 5);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocused(true);
      setActiveIndex((prev) => 
        prev === displayedResults.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocused(true);
      setActiveIndex((prev) => 
        prev <= 0 ? displayedResults.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < displayedResults.length) {
        e.preventDefault();
        const selectedMovie = displayedResults[activeIndex];
        router.push(`/movies/${selectedMovie.id}`);
        clearSearch();
      }
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    setFocused(false);
  };

  const displayedResults = results.slice(0, 5);

  return (
    <div ref={containerRef} className="relative z-50 font-manrope">
      
      {/* Search Input Box */}
      <div 
        className={`flex items-center gap-2 bg-surface/50 border rounded-xl px-3 py-1.5 transition-all duration-300 w-44 sm:w-56 lg:w-64 focus-within:w-48 sm:focus-within:w-64 lg:focus-within:w-72 ${
          focused 
            ? "border-accent/40 bg-surface/85 ring-4 ring-accent/10 shadow-lg shadow-accent/5" 
            : "border-white/5 hover:border-white/10"
        }`}
      >
        {/* Search Icon */}
        <FaMagnifyingGlass 
          size={14} 
          className={`transition-colors duration-300 flex-shrink-0 ${
            focused ? "text-accent" : "text-textSecondary"
          }`} 
        />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleSearchChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setFocused(true)}
          placeholder="Search movies..."
          className="bg-transparent border-0 outline-0 p-0 text-xs w-full text-white placeholder-textSecondary/80 focus:ring-0 focus:outline-hidden"
        />

        {/* Clear / Shortcut Indicators */}
        <div className="flex items-center flex-shrink-0 select-none">
          {loading ? (
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-r-2 border-accent" />
          ) : query ? (
            <button 
              onClick={clearSearch}
              className="text-textSecondary hover:text-white transition cursor-pointer"
              aria-label="Clear search"
            >
              <FaCircleXmark size={14} />
            </button>
          ) : (
            <span className="hidden sm:block text-[9px] bg-white/10 border border-white/5 text-textSecondary px-1.5 py-0.5 rounded font-mono font-bold tracking-tight">
              {isMac ? "⌘K" : "Ctrl+K"}
            </span>
          )}
        </div>
      </div>

      {/* Search Results Rich Dropdown */}
      {focused && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-md border border-white/10 rounded-2xl mt-2 p-2 shadow-2xl z-9999 overflow-hidden flex flex-col gap-1 w-64 sm:w-72 md:w-80 animate-slide-in">
          
          {loading && results.length === 0 ? (
            <div className="p-4 text-center text-xs text-textSecondary flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-t border-accent" />
              <span>Fetching matching titles...</span>
            </div>
          ) : !loading && results.length === 0 ? (
            <div className="p-5 text-center text-xs text-textSecondary flex flex-col items-center gap-1.5">
              <span>🎬</span>
              <span>No results found for &ldquo;<span className="text-white font-bold">{query}</span>&rdquo;</span>
            </div>
          ) : (
            <>
              {displayedResults.map((movie, index) => {
                const isItemActive = index === activeIndex;
                const year = movie.release_date?.slice(0, 4) || "N/A";
                const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

                return (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    onClick={clearSearch}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex gap-3 items-center p-2 rounded-xl transition-all duration-300 border ${
                      isItemActive 
                        ? "bg-accent/10 border-accent/25 text-white" 
                        : "border-transparent hover:bg-white/5 text-textSecondary hover:text-white"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-9 h-12 rounded overflow-hidden bg-black/40 flex-shrink-0">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] bg-zinc-800">No Img</div>
                      )}
                    </div>

                    {/* Movie Info Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate">{movie.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] opacity-75">
                        <span className="text-accent font-semibold">⭐ {rating}</span>
                        <span>•</span>
                        <span>{year}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              {results.length > 5 && (
                <div className="border-t border-white/5 pt-2 pb-1 text-center">
                  <p className="text-[10px] text-textSecondary italic">
                    +{results.length - 5} more results available
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
