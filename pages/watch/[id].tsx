"use client"

import React, { useRef, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchMovieDetails } from "@/lib/tmdb";
import { TMDBMovieDetails } from "@/types/tmdb";
import { 
  FaPlay, FaPause, FaVolumeHigh, FaVolumeXmark, 
  FaArrowLeft, FaMaximize, FaMinimize, FaForward, FaBackward,
  FaClosedCaptioning, FaGear, FaExpand, FaCompress
} from "react-icons/fa6";

const SAMPLE_VIDEOS = [
  {
    name: "Big Buck Bunny",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    name: "Sintel",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    name: "Tears of Steel",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },
  {
    name: "Elephants Dream",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  }
];

const SUBTITLES = [
  { time: 1, text: "🍿 Grab your popcorn and enjoy the film!" },
  { time: 6, text: "You are currently streaming on Cinestream in premium quality." },
  { time: 12, text: "Try adjusting the volume, playback speed, or video quality in the control bar." },
  { time: 20, text: "This custom video player supports full theater mode and keyboard shortcuts." },
  { time: 28, text: "Press Space to Pause, Left/Right Arrows to seek, Up/Down for volume." },
  { time: 36, text: "You can also download this movie and stream it offline in our Downloads page!" },
  { time: 45, text: "Cinestream - The ultimate movie companion." },
  { time: 60, text: "Thanks for checking out our new streaming player feature!" }
];

interface WatchProps {
  movie: TMDBMovieDetails | null;
}

export const getServerSideProps: GetServerSideProps<WatchProps> = async ({ params }) => {
  const id = params?.id as string;
  const movie = await fetchMovieDetails(id);

  return {
    props: {
      movie,
    },
  };
};

export default function WatchPage({ movie }: WatchProps) {
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#06070C] text-white flex flex-col items-center justify-center font-manrope">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <Link href="/" className="px-4 py-2 bg-accent text-black font-semibold rounded-xl hover:brightness-110 transition">
          Return Home
        </Link>
      </div>
    );
  }

  const sampleIndex = Math.abs(movie.id) % SAMPLE_VIDEOS.length;
  const videoSource = SAMPLE_VIDEOS[sampleIndex].url;

  // Player state
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState("1080p");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowControls(false);
      setShowSpeedMenu(false);
      setShowQualityMenu(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "t":
          e.preventDefault();
          setIsTheaterMode(prev => !prev);
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          seek(-10);
          break;
        case "arrowright":
          e.preventDefault();
          seek(10);
          break;
        case "arrowup":
          e.preventDefault();
          setVolume(prev => Math.min(prev + 0.1, 1));
          setIsMuted(false);
          break;
        case "arrowdown":
          e.preventDefault();
          setVolume(prev => Math.max(prev - 0.1, 0));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted]);

  // Sync volume with video tag
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Subtitle synchronization
  useEffect(() => {
    if (!subtitlesEnabled) {
      setCurrentSubtitle("");
      return;
    }
    const currentSub = SUBTITLES.reduce((acc, sub) => {
      if (currentTime >= sub.time) {
        if (currentTime - sub.time < 5) {
          return sub.text;
        }
      }
      return acc;
    }, "");
    setCurrentSubtitle(currentSub);
  }, [currentTime, subtitlesEnabled]);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    if (hours > 0) {
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    }
    return `${minutes}:${formattedSeconds}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.error("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const value = parseFloat(e.target.value);
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleProgressBarHover = (e: React.MouseEvent<HTMLInputElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const hoverVal = percentage * duration;
    setHoverTime(hoverVal);
    setHoverPosition(percentage * 100);
  };

  const handleProgressBarLeave = () => {
    setHoverTime(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const handleQualityChange = (newQuality: string) => {
    if (!videoRef.current) return;
    setIsBuffering(true);
    const savedTime = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;

    setQuality(newQuality);
    setShowQualityMenu(false);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = savedTime;
        if (wasPlaying) {
          videoRef.current.play().catch(e => console.error(e));
        }
      }
      setIsBuffering(false);
    }, 800);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.error("PiP error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070C] text-white font-manrope">
      
      {/* Back Header Banner */}
      <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent fixed top-0 w-full z-40">
        <Link 
          href={`/movies/${movie.id}`}
          className="flex items-center gap-2 text-sm text-textSecondary hover:text-white transition group py-2 px-3 rounded-lg bg-black/40 backdrop-blur-xs"
        >
          <FaArrowLeft className="group-hover:-translate-x-0.5 transition" /> Back to Movie Info
        </Link>
        <div className="text-right">
          <h1 className="text-base font-bold truncate max-w-[200px] sm:max-w-md">{movie.title}</h1>
          <p className="text-xs text-textSecondary">Now Playing</p>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 py-20 flex flex-col ${isTheaterMode ? "max-w-none px-0 py-16" : ""}`}>
        
        {/* Immersive Video Player Container */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className={`relative bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/5 z-30 group/player ${
            isTheaterMode ? "rounded-none border-x-0 w-full" : ""
          } ${isFullscreen ? "h-screen w-screen rounded-none aspect-none" : ""}`}
        >
          {/* Main Video Element */}
          <video
            ref={videoRef}
            src={videoSource}
            className="w-full h-full object-contain"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onClick={togglePlay}
          />

          {/* Buffering Spinner */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
            </div>
          )}

          {/* Subtitles Overlay */}
          {subtitlesEnabled && currentSubtitle && (
            <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-xl text-center text-sm md:text-lg max-w-[80%] border border-white/10 text-white z-10 transition-all font-medium pointer-events-none">
              {currentSubtitle}
            </div>
          )}

          {/* Big Center Play Indicator (When Paused) */}
          {!isPlaying && !isBuffering && (
            <button 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center z-10 hover:bg-black/10 transition group/center"
            >
              <div className="p-5 md:p-6 bg-accent text-black rounded-full hover:scale-110 transition shadow-lg shadow-accent/25 group-hover/center:scale-105">
                <FaPlay size={24} className="ml-1" />
              </div>
            </button>
          )}

          {/* Player Custom Controls Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-3 transition-opacity duration-300 z-25 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
            
            {/* Timeline & Scrubber */}
            <div className="relative group/timeline w-full">
              {/* Hover Tooltip */}
              {hoverTime !== null && (
                <div 
                  className="absolute bottom-6 bg-black/90 text-xs px-2 py-1 rounded border border-white/10 text-accent font-semibold pointer-events-none"
                  style={{ left: `calc(${hoverPosition}% - 25px)` }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleProgressChange}
                onMouseMove={handleProgressBarHover}
                onMouseLeave={handleProgressBarLeave}
                className="w-full h-1 bg-white/20 hover:h-2 rounded-lg appearance-none cursor-pointer accent-accent transition-all"
                style={{
                  background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${(currentTime / (duration || 100)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 100)) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="hover:text-accent transition cursor-pointer" aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                </button>

                {/* Back 10s */}
                <button onClick={() => seek(-10)} className="hover:text-accent transition cursor-pointer" title="Seek Back 10s">
                  <FaBackward size={16} />
                </button>

                {/* Forward 10s */}
                <button onClick={() => seek(10)} className="hover:text-accent transition cursor-pointer" title="Seek Forward 10s">
                  <FaForward size={16} />
                </button>

                {/* Volume Section */}
                <div className="flex items-center gap-2 group/volume">
                  <button onClick={toggleMute} className="hover:text-accent transition cursor-pointer" aria-label={isMuted ? "Unmute" : "Mute"}>
                    {isMuted || volume === 0 ? <FaVolumeXmark size={18} /> : <FaVolumeHigh size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* Time Display */}
                <span className="text-xs text-textSecondary font-mono">
                  {formatTime(currentTime)} <span className="opacity-40">/</span> {formatTime(duration)}
                </span>
              </div>

              {/* Right Side Settings */}
              <div className="flex items-center gap-4 relative">
                
                {/* Subtitles Toggle */}
                <button
                  onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                  className={`transition cursor-pointer ${subtitlesEnabled ? "text-accent" : "text-textSecondary hover:text-white"}`}
                  title="Toggle Subtitles"
                >
                  <FaClosedCaptioning size={18} />
                </button>

                {/* Playback Speed Setting */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowSpeedMenu(!showSpeedMenu);
                      setShowQualityMenu(false);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold hover:text-accent transition cursor-pointer"
                  >
                    <span>{playbackSpeed}x</span>
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-8 right-0 bg-surface border border-white/10 rounded-xl p-2 flex flex-col gap-1 w-24 shadow-xl z-30">
                      {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg transition hover:bg-white/10 ${
                            playbackSpeed === s ? "text-accent font-bold" : "text-textSecondary"
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Quality Setting */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowQualityMenu(!showQualityMenu);
                      setShowSpeedMenu(false);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold hover:text-accent transition cursor-pointer"
                  >
                    <FaGear size={16} />
                    <span>{quality}</span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute bottom-8 right-0 bg-surface border border-white/10 rounded-xl p-2 flex flex-col gap-1 w-28 shadow-xl z-30">
                      {["1080p", "720p", "480p"].map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQualityChange(q)}
                          className={`text-left text-xs px-2 py-1.5 rounded-lg transition hover:bg-white/10 ${
                            quality === q ? "text-accent font-bold" : "text-textSecondary"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PiP Mode */}
                <button 
                  onClick={togglePiP} 
                  className="hover:text-accent transition cursor-pointer hidden sm:block" 
                  title="Picture in Picture"
                >
                  <FaClosedCaptioning size={16} />
                </button>

                {/* Theater Mode Toggle */}
                {!isFullscreen && (
                  <button 
                    onClick={() => setIsTheaterMode(!isTheaterMode)} 
                    className={`transition cursor-pointer hidden md:block ${isTheaterMode ? "text-accent" : "hover:text-accent"}`}
                    title="Theater Mode"
                  >
                    <FaExpand size={16} />
                  </button>
                )}

                {/* Fullscreen Toggle */}
                <button 
                  onClick={toggleFullscreen} 
                  className="hover:text-accent transition cursor-pointer" 
                  title="Fullscreen"
                >
                  {isFullscreen ? <FaCompress size={18} /> : <FaMaximize size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Section below player */}
        <div className={`mt-8 px-6 space-y-6 ${isTheaterMode ? "max-w-6xl mx-auto px-6" : ""}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold">{movie.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-textSecondary">
                <span className="text-accent font-bold">⭐ {movie.vote_average.toFixed(1)}</span>
                <span>{movie.runtime} min</span>
                <span>{movie.release_date?.slice(0, 4)}</span>
                <span className="truncate">
                  {movie.genres?.map((g) => g.name).join(", ")}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link 
                href={`/movies/${movie.id}`} 
                className="px-4 py-2.5 bg-surface border border-white/10 hover:bg-white/10 rounded-xl transition text-sm font-semibold"
              >
                View Details
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Overview</h3>
            <p className="text-textSecondary leading-relaxed text-sm md:text-base max-w-4xl">{movie.overview}</p>
          </div>

          {/* Similar Content / Sidebar */}
          {movie.similar?.results?.length > 0 && (
            <div className="pt-6">
              <h3 className="text-xl font-bold mb-4">You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movie.similar.results.slice(0, 6).map((sim) => (
                  <Link href={`/movies/${sim.id}`} key={sim.id} className="group relative overflow-hidden rounded-xl bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="aspect-[2/3] relative overflow-hidden bg-black/40">
                      {sim.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${sim.poster_path}`}
                          alt={sim.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-textSecondary p-2 text-center">
                          {sim.title}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold truncate group-hover:text-accent transition">{sim.title}</h4>
                      <p className="text-[10px] text-accent mt-0.5">⭐ {sim.vote_average.toFixed(1)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
