'use client';

import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import Image from 'next/image';

type VideoThumbnailProps = {
  thumbnailUrl: string;
  duration: number; // in seconds
  videoUrl: string;
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ thumbnailUrl, duration, videoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={thumbnailUrl}
          alt="Video Thumbnail"
          width={640}
          height={360}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-700 bg-opacity-50 rounded-full p-3 group-hover:bg-opacity-70 transition">
            <Play size={32} className="text-white" />
          </div>
        </div>

        {/* Duration Label */}
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-3"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-lg overflow-hidden animate-fadeInScale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-white hover:text-gray-300 p-2"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Video */}
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default VideoThumbnail;
