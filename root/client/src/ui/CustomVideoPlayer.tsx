"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  Vurl: string; // HLS video URL (required)
  onEnded?: () => void;
  onWatchProgress?: (time: number) => void; // Callback to send watch time
}

export default function CustomVideoPlayer({
  Vurl,
  onEnded,
  onWatchProgress,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [levels, setLevels] = useState<{ height: number; index: number }[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(-1);
  const hlsRef = useRef<Hls | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!Vurl || !videoRef.current) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(Vurl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const qualityLevels = data.levels.map((level: any, index: number) => ({
          height: level.height,
          index,
        }));
        setLevels(qualityLevels);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setSelectedLevel(data.level);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = Vurl;
    }

    if (videoRef.current && onEnded) {
      videoRef.current.addEventListener("ended", onEnded);
    }

    // Track watch time every 10 seconds
    // progressTimerRef.current = setInterval(() => {
    //   if (videoRef.current && !videoRef.current.paused) {
    //     const currentTime = Math.floor(videoRef.current.currentTime);
    //     if (onWatchProgress) {
    //       onWatchProgress(currentTime);
    //     }
    //   }
    // }, 10000);

    return () => {
      if (hls) hls.destroy();
      if (videoRef.current && onEnded) {
        videoRef.current.removeEventListener("ended", onEnded);
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [Vurl, onEnded, onWatchProgress]);

  const handleQualityChange = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
    }
    setSelectedLevel(levelIndex);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        controlsList="nodownload"
      />

      {levels.length > 0 && (
        <div className="absolute bottom-16 right-4 bg-black bg-opacity-70 text-white text-sm rounded px-2 py-1">
          <label className="mr-2">Quality:</label>
          <select
            value={selectedLevel}
            onChange={(e) => handleQualityChange(Number(e.target.value))}
            className="bg-transparent border border-gray-500 rounded px-1 py-0.5 text-white"
          >
            <option value={-1}>Auto</option>
            {levels.map((level) => (
              <option key={level.index} value={level.index}>
                {level.height}p
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
