"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TMDBMovie } from "@/types/tmdb";

export interface ActiveDownload {
  id: number;
  title: string;
  poster: string;
  progress: number; // 0 - 100
  downloadedBytes: number;
  totalBytes: number;
  speed: number; // MB/s
  eta: number; // seconds
  quality: string; // "1080p" | "720p" | "480p"
  status: "downloading" | "paused";
}

export interface DownloadedMovie {
  movie: TMDBMovie;
  quality: string;
  fileSize: string; // e.g. "1.8 GB"
  downloadedAt: string;
}

interface DownloadsContextType {
  downloadedMovies: DownloadedMovie[];
  activeDownloads: ActiveDownload[];
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
  startDownload: (movie: TMDBMovie, quality: string) => void;
  pauseDownload: (id: number) => void;
  resumeDownload: (id: number) => void;
  cancelDownload: (id: number) => void;
  deleteDownloaded: (id: number) => void;
  isDownloaded: (id: number) => boolean;
  triggerRealFileDownload: (movie: TMDBMovie, quality: string) => void;
}

const DownloadsContext = createContext<DownloadsContextType | undefined>(undefined);

const QUALITY_SIZES: Record<string, number> = {
  "1080p": 1.8 * 1024 * 1024 * 1024, // 1.8 GB
  "720p": 980 * 1024 * 1024,        // 980 MB
  "480p": 450 * 1024 * 1024         // 450 MB
};

const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
];

export function DownloadsProvider({ children }: { children: ReactNode }) {
  const [downloadedMovies, setDownloadedMovies] = useState<DownloadedMovie[]>([]);
  const [activeDownloads, setActiveDownloads] = useState<ActiveDownload[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedDownloads = localStorage.getItem("downloadedMovies");
      if (storedDownloads) {
        setDownloadedMovies(JSON.parse(storedDownloads));
      }
      const storedOffline = localStorage.getItem("isOfflineSimulation");
      if (storedOffline) {
        setIsOffline(JSON.parse(storedOffline));
      }
    } catch (e) {
      console.error("Error hydrating downloads context:", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage when completed downloads change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("downloadedMovies", JSON.stringify(downloadedMovies));
    } catch (e) {
      console.error("Error persisting downloads:", e);
    }
  }, [downloadedMovies, mounted]);

  // Save offline status to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("isOfflineSimulation", JSON.stringify(isOffline));
    } catch (e) {
      console.error("Error persisting offline state:", e);
    }
  }, [isOffline, mounted]);

  // Background download progress simulator
  useEffect(() => {
    if (activeDownloads.length === 0) return;

    const interval = setInterval(() => {
      setActiveDownloads((prev) => {
        let updated = [...prev];
        let completedIds: number[] = [];

        updated = updated.map((dl) => {
          if (dl.status !== "downloading") return dl;

          // Realistic download speeds (e.g. between 10MB/s and 25MB/s)
          const currentSpeed = 10 + Math.random() * 15; // MB/s
          const speedInBytes = currentSpeed * 1024 * 1024;
          const newDownloaded = Math.min(dl.downloadedBytes + speedInBytes, dl.totalBytes);
          const progress = Math.min((newDownloaded / dl.totalBytes) * 100, 100);
          const remainingBytes = dl.totalBytes - newDownloaded;
          const eta = Math.ceil(remainingBytes / speedInBytes);

          if (progress >= 100) {
            completedIds.push(dl.id);
          }

          return {
            ...dl,
            downloadedBytes: newDownloaded,
            progress,
            speed: currentSpeed,
            eta: progress >= 100 ? 0 : eta
          };
        });

        // If any downloads completed, move them to completed list
        if (completedIds.length > 0) {
          const completedDownloads = prev.filter((dl) => completedIds.includes(dl.id));

          setDownloadedMovies((prevCompleted) => {
            const newCompleted = [...prevCompleted];
            completedDownloads.forEach((dl) => {
              // Avoid duplicates
              if (!newCompleted.some((item) => item.movie.id === dl.id)) {
                // Find matching movie poster & metadata
                const formattedSize = (QUALITY_SIZES[dl.quality] / (1024 * 1024 * 1024)).toFixed(1) + " GB";
                newCompleted.push({
                  movie: {
                    id: dl.id,
                    title: dl.title,
                    poster_path: dl.poster.replace("https://image.tmdb.org/t/p/w500", ""),
                    overview: "Offline downloaded movie.",
                    backdrop_path: dl.poster.replace("https://image.tmdb.org/t/p/w500", ""), // fallback
                    vote_average: 8.0,
                    release_date: new Date().getFullYear().toString()
                  },
                  quality: dl.quality,
                  fileSize: formattedSize,
                  downloadedAt: new Date().toLocaleDateString()
                });
              }
            });
            return newCompleted;
          });

          // Show in-app notification/alert if possible or standard browser notification
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            completedDownloads.forEach((dl) => {
              new Notification("Download Complete", {
                body: `${dl.title} is now available offline!`,
                icon: dl.poster
              });
            });
          }

          // Filter out completed ones
          updated = updated.filter((dl) => !completedIds.includes(dl.id));
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeDownloads]);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  function setOffline(offline: boolean) {
    setIsOffline(offline);
  }

  function startDownload(movie: TMDBMovie, quality: string) {
    // Avoid double downloads
    if (activeDownloads.some((dl) => dl.id === movie.id)) return;
    if (downloadedMovies.some((dl) => dl.movie.id === movie.id)) return;

    const totalBytes = QUALITY_SIZES[quality] || QUALITY_SIZES["1080p"];
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/placeholder.png";

    const newDownload: ActiveDownload = {
      id: movie.id,
      title: movie.title,
      poster: posterUrl,
      progress: 0,
      downloadedBytes: 0,
      totalBytes,
      speed: 15.0, // initial speed
      eta: Math.ceil(totalBytes / (15.0 * 1024 * 1024)),
      quality,
      status: "downloading"
    };

    setActiveDownloads((prev) => [...prev, newDownload]);
  }

  function pauseDownload(id: number) {
    setActiveDownloads((prev) =>
      prev.map((dl) => (dl.id === id ? { ...dl, status: "paused" } : dl))
    );
  }

  function resumeDownload(id: number) {
    setActiveDownloads((prev) =>
      prev.map((dl) => (dl.id === id ? { ...dl, status: "downloading" } : dl))
    );
  }

  function cancelDownload(id: number) {
    setActiveDownloads((prev) => prev.filter((dl) => dl.id !== id));
  }

  function deleteDownloaded(id: number) {
    setDownloadedMovies((prev) => prev.filter((dl) => dl.movie.id !== id));
  }

  // Helper check
  function isDownloaded(id: number) {
    return downloadedMovies.some((dl) => dl.movie.id === id);
  }

  // Trigger real file download of a sample video in browser
  function triggerRealFileDownload(movie: TMDBMovie, quality: string) {
    const index = Math.abs(movie.id) % SAMPLE_VIDEOS.length;
    const url = SAMPLE_VIDEOS[index];

    const link = document.createElement("a");
    link.href = url;
    link.download = `${movie.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${quality}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <DownloadsContext.Provider
      value={{
        downloadedMovies,
        activeDownloads,
        isOffline,
        setOffline,
        startDownload,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        deleteDownloaded,
        isDownloaded,
        triggerRealFileDownload
      }}
    >
      {children}
    </DownloadsContext.Provider>
  );
}

export function useDownloads() {
  const context = useContext(DownloadsContext);
  if (!context) {
    throw new Error("useDownloads must be used inside a DownloadsProvider");
  }
  return context;
}
