"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import VideoLessonItem from "./VideoLessonItem";
import QuizLessonItem from "./QuizLessonItem";
import ResourceLessonItem from "./ResourceLessonItem";
import { useEffect, useState } from "react";

export type Items = {
  id: string;
  title: string;
  content_type: "video" | "quiz" | "resource";
  duration: number;
  completed?: boolean;
  url?: string;
  item_id: string;
  watchedSeconds: number;
};

export type Section = {
  id: string;
  title: string;
  items: Items[];
  section_number: number;
};

interface SectionListProps {
  sections: Section[];
  currentLesson: Items | null;
  setCurrentLesson: (item: Items) => void;
  completePercent: number;
}

export default function SectionList({
  sections,
  currentLesson,
  setCurrentLesson,
  completePercent,
}: SectionListProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // ✅ Open first section and select its first item on mount
  useEffect(() => {
    if (sections.length > 0) {
      const firstSection = sections[0];
      setExpandedSection(firstSection.id);

      if (firstSection.items.length > 0 && !currentLesson) {
        setCurrentLesson(firstSection.items[0]);
      }
    }
  }, [sections, setCurrentLesson, currentLesson]);

 
    return (
      <div className="w-full h-screen flex flex-col bg-white border-l border-gray-300">
        {/* Fixed header */}
        <h2 className="p-4 text-lg font-bold border-b border-gray-300 flex justify-between items-center">
          <span>Course content</span>
          <span className="text-sm font-normal text-gray-500">
            {completePercent}% complete
          </span>
        </h2>
    
        {/* Scrollable section list */}
        <div className="flex-1 overflow-y-auto">
          {sections?.map((section) => (
            <div key={section.id}>
              <button
                className="w-full flex justify-between items-center bg-gray-600 text-white p-4 font-semibold hover:bg-gray-600"
                onClick={() =>
                  setExpandedSection(expandedSection === section.id ? null : section.id)
                }
              >
                Section {section.section_number}: {section.title}
                {expandedSection === section.id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
    
              {expandedSection === section.id && (
                <div className="border-b border-gray-300">
                  {section.items.map((item) => {
                    const isActive = currentLesson?.id === item.id;
                    const onSelect = () => setCurrentLesson(item);
    
                    if (item.content_type === "video") {
                      return (
                        <VideoLessonItem
                          key={item.id}
                          item={item}
                          isActive={isActive}
                          onSelect={onSelect}
                        />
                      );
                    }
                    if (item.content_type === "quiz") {
                      return (
                        <QuizLessonItem
                          key={item.id}
                          item={item}
                          isActive={isActive}
                          onSelect={onSelect}
                        />
                      );
                    }
                    return (
                      <ResourceLessonItem
                        key={item.id}
                        item={item}
                        isActive={isActive}
                        onSelect={onSelect}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
    
}
