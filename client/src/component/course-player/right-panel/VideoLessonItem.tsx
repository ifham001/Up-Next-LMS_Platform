"use client";

import { formatTime } from "@/util";
import { Items } from "./SectionList";
import { Check, PlayCircle } from "lucide-react";


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
    <div
      className={`group cursor-pointer rounded-md border-l-2 px-3 py-2.5 transition-colors ${
        isActive
          ? "border-brand bg-brand-50 text-brand-dark"
          : "border-transparent hover:bg-surface-muted"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        {item.completed ? (
          <Check size={18} strokeWidth={1.75} className="text-success shrink-0" />
        ) : (
          <PlayCircle
            size={18}
            strokeWidth={1.75}
            className={`shrink-0 transition-colors ${isActive ? "text-brand" : "text-text-muted group-hover:text-text-secondary"}`}
          />
        )}
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <span className={`text-sm font-medium leading-snug truncate ${isActive ? "text-brand-dark" : "text-text-primary"}`}>
            {item.title}
          </span>
          {item.duration && (
            <span className={`tnum text-xs ${isActive ? "text-brand-dark/70" : "text-text-muted"}`}>
              {`${formatTime(item.watchedSeconds)} / ${formatTime(item.duration)}`}
            </span>
          )}
        </div>
      </div>
      <div className="bar-track mt-2 h-1">
        <div
          className="bar-fill h-1 transition-all duration-300"
          style={{ width: `${percentWatched}%` }}
        />
      </div>
    </div>
  );
}
