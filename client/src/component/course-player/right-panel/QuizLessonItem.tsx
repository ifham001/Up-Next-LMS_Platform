"use client";

import { Items,  } from "./SectionList";
import { Check, HelpCircle } from "lucide-react";

interface QuizLessonItemProps {
  item: Items;
  isActive: boolean;
  onSelect: () => void;
}

export default function QuizLessonItem({
  item,
  isActive,
  onSelect,
}: QuizLessonItemProps) {
  return (
    <div
      className={`group flex cursor-pointer items-center gap-3 rounded-md border-l-2 px-3 py-2.5 transition-colors ${
        isActive
          ? "border-brand bg-brand-50 text-brand-dark"
          : "border-transparent hover:bg-surface-muted"
      }`}
      onClick={onSelect}
    >
      {item.completed ? (
        <Check size={18} strokeWidth={1.75} className="text-success shrink-0" />
      ) : (
        <HelpCircle
          size={18}
          strokeWidth={1.75}
          className={`shrink-0 transition-colors ${isActive ? "text-brand" : "text-text-muted group-hover:text-text-secondary"}`}
        />
      )}
      <span className={`text-sm font-medium leading-snug truncate ${isActive ? "text-brand-dark" : "text-text-primary"}`}>
        {item.title}
      </span>
    </div>
  );
}
