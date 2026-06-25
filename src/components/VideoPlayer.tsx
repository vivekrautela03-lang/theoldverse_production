"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, Settings, FastForward, FileText } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  onTimeUpdate?: (currentTime: number) => void;
  hasScreenplay?: boolean;
  isScreenplayOpen?: boolean;
  onToggleScreenplay?: () => void;
}

export default function VideoPlayer({ src, poster, onTimeUpdate, hasScreenplay, isScreenplayOpen, onToggleScreenplay }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);

  useEffect(() => {
    // Reset state on source change
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  // Controls overlay auto-hide timer
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => console.log("Playback error: ", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const muteState = !isMuted;
      videoRef.current.muted = muteState;
      setIsMuted(muteState);
      if (!muteState && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setSpeedDropdownOpen(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Fullscreen request failed: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen to fullscreen changes outside standard triggers
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const seekForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const seekBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none shadow-2xl border border-white/5"
    >
      {/* Video Tag */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Cinematic Tint on Pause / controls show */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10 transition-opacity duration-300 pointer-events-none ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Large Center Play/Pause button */}
      {(!isPlaying || showControls) && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-16 w-16 sm:h-20 sm:w-20 rounded-full glassmorphism flex items-center justify-center border border-white/10 hover:border-oldverse-accent hover:text-oldverse-accent hover:scale-115 transition-all duration-300 text-white shadow-xl cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
          ) : (
            <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-current ml-1" />
          )}
        </button>
      )}

      {/* Custom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 w-full p-4 sm:p-6 z-20 flex flex-col gap-3 transition-all duration-300 ease-out ${
          showControls || !isPlaying 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Progress Seekbar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-grotesk font-semibold text-oldverse-text">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-white/20 accent-oldverse-accent outline-none hover:h-1.5 transition-all"
            style={{
              background: `linear-gradient(to right, #F5A623 0%, #F5A623 ${
                (currentTime / (duration || 1)) * 100
              }%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
          <span className="text-xs font-grotesk font-semibold text-oldverse-secondary">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-oldverse-accent transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>

            {/* Seek 10s back */}
            <button
              onClick={seekBackward}
              className="text-white hover:text-oldverse-accent transition-colors cursor-pointer"
              title="Backward 10s"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Volume controls */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="text-white hover:text-oldverse-accent transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-16 sm:group-hover/volume:w-20 h-1 rounded-full appearance-none bg-white/20 accent-oldverse-accent cursor-pointer outline-none transition-all duration-300 overflow-hidden"
                style={{
                  background: `linear-gradient(to right, #F5A623 0%, #F5A623 ${
                    (isMuted ? 0 : volume) * 100
                  }%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 relative">
            {/* Screenplay Script Toggle */}
            {hasScreenplay && (
              <button
                onClick={onToggleScreenplay}
                className={`flex items-center gap-1.5 text-xs font-grotesk font-semibold hover:text-oldverse-accent px-2.5 py-1 rounded-md border transition-all duration-300 cursor-pointer ${
                  isScreenplayOpen
                    ? "bg-oldverse-accent border-oldverse-accent text-oldverse-bg font-bold shadow-lg shadow-oldverse-accent/20"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
                title="Toggle Screenplay Panel"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Script</span>
              </button>
            )}

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setSpeedDropdownOpen(!speedDropdownOpen)}
                className="flex items-center gap-1 text-xs font-grotesk font-semibold text-white hover:text-oldverse-accent px-2 py-1 rounded bg-white/5 border border-white/5 transition-colors cursor-pointer"
              >
                <FastForward className="h-3.5 w-3.5" />
                {playbackSpeed}x
              </button>

              {speedDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-20 rounded bg-oldverse-card border border-white/10 shadow-2xl overflow-hidden flex flex-col z-30">
                  {[0.5, 1, 1.5, 2].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => changeSpeed(sp)}
                      className={`text-xs font-grotesk font-bold py-1.5 hover:bg-oldverse-accent hover:text-oldverse-bg transition-colors ${
                        playbackSpeed === sp ? "text-oldverse-accent" : "text-white"
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-oldverse-accent transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
