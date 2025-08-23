"use client";

import { formatTime } from "@/util";
import { Items } from "./SectionList";
import { SquareLibrary } from "lucide-react";


interface VideoLessonItemProps {
  item: Items;
  isActive: boolean;
  onSelect: () => void;
}

export default function VideoLessonItem({
  item,
  isActive,
  onSelect,
}: VideoLessonItemProps) {
  // Calculate percent watched safely
  const percentWatched =
    item.duration && item.duration > 0
      ? Math.min((item.watchedSeconds / item.duration) * 100, 100)
      : 0;

  return (
    <>
    <div
      className={`flex items-center  p-3 cursor-pointer hover:bg-gray-50 ${
        isActive ? "bg-green-200" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
    <SquareLibrary/>
        <div className="flex flex-col flex-1">
          <span className="text-sm font-medium">{item.title}</span>
          {item.duration && (
            <span className="text-xs text-gray-500">
              {`${formatTime(item.watchedSeconds)}/${formatTime(item.duration)})`}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      
    </div>
    <div className="w-full h-1 bg-gray-200 rounded">
        <div
          className="h-1 bg-blue-500 rounded"
          style={{ width: `${percentWatched}%` }}
        ></div>
      </div>
    </>
  );
}
