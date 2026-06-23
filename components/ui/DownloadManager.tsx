"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDownloads } from "@/contexts/downloadsContext";
import { FaPlay, FaPause, FaXmark, FaTrashCan } from "react-icons/fa6";

interface DownloadManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadManager({ isOpen, onClose }: DownloadManagerProps) {
  const {
    activeDownloads,
    downloadedMovies,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    deleteDownloaded
  } = useDownloads();

  if (!isOpen) return null;

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  };

  const formatETA = (seconds: number) => {
    if (seconds <= 0) return "Finishing...";
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    }
    return `${seconds}s`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-9998 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-surface/95 backdrop-blur-md border-l border-white/10 z-9999 shadow-2xl flex flex-col font-manrope transition-transform duration-300 animate-slide-in text-white">

        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              📥 Download Manager
            </h2>
            <p className="text-xs text-textSecondary mt-1">
              Manage your offline movies & downloads
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer"
            aria-label="Close panel"
          >
            <FaXmark size={20} className="text-textSecondary hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">

          {/* Active Downloads Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-textSecondary mb-3">
              Active Downloads ({activeDownloads.length})
            </h3>
            {activeDownloads.length === 0 ? (
              <p className="text-sm text-textSecondary italic py-2">No active downloads</p>
            ) : (
              <div className="space-y-4">
                {activeDownloads.map((dl) => (
                  <div key={dl.id} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex gap-3 items-center">
                      <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-black/40">
                        {dl.poster && (
                          <Image
                            src={dl.poster}
                            alt={dl.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate">{dl.title}</h4>
                        <p className="text-xs text-accent mt-0.5">{dl.quality}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {dl.status === "downloading" ? (
                          <button
                            onClick={() => pauseDownload(dl.id)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
                            title="Pause"
                          >
                            <FaPause size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={() => resumeDownload(dl.id)}
                            className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-accent transition cursor-pointer"
                            title="Resume"
                          >
                            <FaPlay size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => cancelDownload(dl.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/35 rounded-lg text-red-400 transition cursor-pointer"
                          title="Cancel"
                        >
                          <FaXmark size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Stats */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-textSecondary">
                        <span>{dl.progress.toFixed(0)}%</span>
                        {dl.status === "downloading" && (
                          <span>
                            {dl.speed.toFixed(1)} MB/s • ETA: {formatETA(dl.eta)}
                          </span>
                        )}
                        {dl.status === "paused" && (
                          <span className="text-amber-400 font-medium">Paused</span>
                        )}
                      </div>
                      <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-accent h-full transition-all duration-300 rounded-full"
                          style={{ width: `${dl.progress}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-textSecondary/80 text-right">
                        {formatSize(dl.downloadedBytes)} / {formatSize(dl.totalBytes)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Downloads Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-textSecondary mb-3">
              Offline Library ({downloadedMovies.length})
            </h3>
            {downloadedMovies.length === 0 ? (
              <p className="text-sm text-textSecondary italic py-2">No downloaded movies yet</p>
            ) : (
              <div className="space-y-3">
                {downloadedMovies.map((dl) => (
                  <div key={dl.movie.id} className="flex gap-3 items-center bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition group">
                    <Link href={`/watch/${dl.movie.id}`} className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-black/40">
                      {dl.movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${dl.movie.poster_path}`}
                          alt={dl.movie.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-xs">Film</div>
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <FaPlay className="text-accent" size={14} />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/watch/${dl.movie.id}`} className="text-sm font-semibold truncate hover:text-accent transition block">
                        {dl.movie.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-textSecondary">
                        <span className="text-accent">{dl.quality}</span>
                        <span>•</span>
                        <span>{dl.fileSize}</span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteDownloaded(dl.movie.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-textSecondary hover:text-red-400 transition cursor-pointer"
                      title="Delete from Offline Library"
                    >
                      <FaTrashCan size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-black/20 flex gap-3">
          <Link
            href="/downloads"
            onClick={onClose}
            className="flex-1 text-center py-3 bg-accent text-black font-semibold rounded-xl hover:brightness-110 transition text-sm"
          >
            Go to Downloads Page
          </Link>
        </div>
      </div>
    </>
  );
}
