"use client";

import { Items,  } from "./SectionList";
import { HelpCircle } from "lucide-react";

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
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
        isActive ? "bg-yellow-200" : ""
      }`}
      onClick={onSelect}
    >
      <HelpCircle size={18} className="text-yellow-500" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{item.title}</span>
        
      </div>
    </div>
  );
}
