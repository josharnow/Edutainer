"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

type VideoPlayerProps = {
  src: string;
  title: string;
};

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/** Wraps native playback with synchronized volume, speed, and fullscreen controls. */
function VideoPlayer({ src, title }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string>();

  useEffect(() => {
    // Fullscreen can end outside this component, such as when Escape is pressed.
    function syncFullscreenState() {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    }

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  function updateVolume(nextVolume: number) {
    const video = videoRef.current;

    if (video) {
      video.muted = false;
      video.volume = nextVolume;
    }

    setVolume(nextVolume);
  }

  function updatePlaybackRate(nextRate: number) {
    const video = videoRef.current;

    if (video) {
      video.playbackRate = nextRate;
    }

    setPlaybackRate(nextRate);
  }

  async function toggleFullscreen() {
    setFullscreenError(undefined);

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await playerRef.current?.requestFullscreen();
      }
    } catch {
      setFullscreenError("Fullscreen is not available in this browser.");
    }
  }

  return (
    <div
      ref={playerRef}
      className={
        isFullscreen ? "flex h-screen flex-col bg-foreground" : "bg-foreground"
      }
    >
      <div className={isFullscreen ? "min-h-0 flex-1" : "aspect-video"}>
        {/* Native control changes must also update the supplemental controls. */}
        <video
          ref={videoRef}
          className="size-full object-contain"
          controls
          playsInline
          preload="metadata"
          src={src}
          aria-label={`Video lesson: ${title}`}
          onRateChange={(event) =>
            setPlaybackRate(event.currentTarget.playbackRate)
          }
          onVolumeChange={(event) =>
            setVolume(event.currentTarget.muted ? 0 : event.currentTarget.volume)
          }
        >
          Your browser does not support HTML video playback.
        </video>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-4 border-t border-background/20 px-4 py-3 text-sm text-background"
        role="group"
        aria-label="Playback settings"
      >
        <label className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-xs">
          <span className="font-semibold">Volume</span>
          <input
            className="h-2 min-w-20 flex-1 cursor-pointer accent-primary"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => updateVolume(Number(event.currentTarget.value))}
          />
          <span className="w-10 text-right tabular-nums">
            {Math.round(volume * 100)}%
          </span>
        </label>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 font-semibold">
            <span>Speed</span>
            <select
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              value={playbackRate}
              onChange={(event) =>
                updatePlaybackRate(Number(event.currentTarget.value))
              }
            >
              {playbackRates.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}×
                </option>
              ))}
            </select>
          </label>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-background/30 bg-transparent text-background shadow-none hover:bg-background/10 focus-visible:outline-background cursor-pointer"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-pressed={isFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={toggleFullscreen}
          >
            <Image
              src={
                isFullscreen
                  ? "/icons/fullscreen-exit.svg"
                  : "/icons/fullscreen-enter.svg"
              }
              alt=""
              width={16}
              height={16}
            />
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </span>
          </Button>
        </div>

        <span className="sr-only" role="status">
          {fullscreenError}
        </span>
      </div>
    </div>
  );
}

export { VideoPlayer };
