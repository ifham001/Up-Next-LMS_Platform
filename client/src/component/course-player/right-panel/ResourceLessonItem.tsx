"use client";

import { Items } from "./SectionList";
import { FileText } from "lucide-react";

interface ResourceLessonItemProps {
  item: Items;
  isActive: boolean;
  onSelect: () => void;
}

export default function ResourceLessonItem({
  item,
  isActive,
  onSelect,
}: ResourceLessonItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
        isActive ? "bg-blue-50" : ""
      }`}
      onClick={onSelect}
    >
      <FileText size={18} className="text-purple-500" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{item.title}</span>
       
      </div>
    </div>
  );
}
