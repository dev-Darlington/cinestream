"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDownloads, DownloadedMovie } from "@/contexts/downloadsContext";
import { FaPlay, FaTrashCan, FaDownload, FaWifi, FaCircleExclamation } from "react-icons/fa6";

export default function DownloadsPage() {
  const { 
    downloadedMovies, 
    deleteDownloaded, 
    isOffline, 
    setOffline,
    triggerRealFileDownload
  } = useDownloads();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center font-manrope">
        <div className="animate-pulse text-textSecondary">Loading library...</div>
      </div>
    );
  }

  // Handle trigger for actual physical file download
  const handlePhysicalDownload = (dl: DownloadedMovie) => {
    triggerRealFileDownload(dl.movie, dl.quality);
  };

  return (
    <main className="min-h-screen bg-bg text-white px-6 py-10 font-manrope">
      
      {/* Page Header & Offline Toggle Control */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            📥 Offline Downloads
          </h1>
          <p className="text-textSecondary mt-2">
            Watch your downloaded content anytime, even without an internet connection.
          </p>
        </div>

        {/* Offline Mode Simulator Switch */}
        <div className="flex items-center gap-4 bg-surface border border-white/10 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <FaWifi className={isOffline ? "text-red-400 animate-pulse" : "text-emerald-400"} size={20} />
            <div>
              <p className="text-sm font-bold">Offline Mode Simulator</p>
              <p className="text-[10px] text-textSecondary">Toggle to test offline playback</p>
            </div>
          </div>
          
          <button
            onClick={() => setOffline(!isOffline)}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              isOffline ? "bg-red-500" : "bg-zinc-700"
            }`}
            aria-label="Toggle Offline Mode"
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                isOffline ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Simulator Info Banner */}
        {isOffline && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3">
            <FaCircleExclamation className="mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Simulator Active:</span> You are currently in offline simulation. 
              Only the Downloads page and Movie Player will load. Other online catalog routes (Home, Genre, Trending) 
              will display a custom offline fallback. Toggle the switch off to restore internet connection.
            </div>
          </div>
        )}

        {downloadedMovies.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-surface/50 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
            <div className="text-6xl text-textSecondary">🎬</div>
            <h2 className="text-xl font-bold">Your Offline Library is Empty</h2>
            <p className="text-textSecondary text-sm max-w-sm">
              Explore our trending movies and add them to your offline downloads to watch them without connection.
            </p>
            <Link 
              href="/"
              className="px-6 py-3 bg-accent text-black font-semibold rounded-xl hover:brightness-110 transition text-sm cursor-pointer"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          /* Grid of Offline Content */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {downloadedMovies.map((dl) => (
              <div 
                key={dl.movie.id} 
                className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 hover:border-white/10 transition-all duration-300 group flex flex-col"
              >
                {/* Poster image container */}
                <div className="aspect-[2/3] relative overflow-hidden bg-black/40">
                  {dl.movie.poster_path ? (
                    <Image 
                      src={`https://image.tmdb.org/t/p/w500${dl.movie.poster_path}`} 
                      alt={dl.movie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-textSecondary bg-zinc-800">
                      Poster Unavailable
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Link 
                      href={`/watch/${dl.movie.id}`}
                      className="p-4 bg-accent text-black rounded-full hover:scale-110 transition duration-300 shadow-lg shadow-accent/25"
                      title="Play Movie"
                    >
                      <FaPlay size={20} className="ml-0.5" />
                    </Link>
                  </div>

                  {/* Quality Tag */}
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-accent text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/10">
                    {dl.quality}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base line-clamp-1 group-hover:text-accent transition">
                      {dl.movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-textSecondary">
                      <span>{dl.fileSize}</span>
                      <span>•</span>
                      <span>Added {dl.downloadedAt}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {/* Watch Offline Link */}
                    <Link
                      href={`/watch/${dl.movie.id}`}
                      className="flex-1 flex justify-center items-center gap-1.5 py-2 px-3 bg-accent text-black hover:brightness-110 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      <FaPlay size={10} /> Watch
                    </Link>
                    
                    {/* Download to local disk (real file) */}
                    <button
                      onClick={() => handlePhysicalDownload(dl)}
                      className="p-2 bg-white/5 hover:bg-white/15 border border-white/10 text-white rounded-xl transition cursor-pointer"
                      title="Save MP4 Video File to Disk"
                    >
                      <FaDownload size={12} />
                    </button>

                    {/* Delete offline download */}
                    <button
                      onClick={() => deleteDownloaded(dl.movie.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition cursor-pointer"
                      title="Delete from Offline Library"
                    >
                      <FaTrashCan size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
