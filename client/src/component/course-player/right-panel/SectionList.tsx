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
    <div className="flex h-full w-full flex-col bg-surface">
      {/* Fixed progress header */}
      <div className="shrink-0 p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight text-text-primary">
            Course content
          </h2>
          <span className="tnum shrink-0 text-sm font-semibold text-text-primary">
            {completePercent}%
          </span>
        </div>
        <div className="bar-track h-1.5">
          <div
            className="bar-fill h-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${completePercent}%` }}
          />
        </div>
      </div>

      <div className="divider mx-5" />

      {/* Scrollable section list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sections?.map((section) => {
          const isOpen = expandedSection === section.id;
          return (
            <div
              key={section.id}
              className="overflow-hidden rounded-lg border border-border"
            >
              <button
                className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40 ${
                  isOpen ? "bg-surface-muted text-text-primary" : "text-text-primary hover:bg-surface-muted"
                }`}
                onClick={() =>
                  setExpandedSection(isOpen ? null : section.id)
                }
              >
                <span className="leading-snug min-w-0">
                  <span className="mb-0.5 block text-xs font-medium text-text-muted">
                    Section {section.section_number}
                  </span>
                  <span className="text-sm font-medium">{section.title}</span>
                </span>
                {isOpen ? (
                  <ChevronUp size={18} strokeWidth={1.75} className="shrink-0 text-text-secondary" />
                ) : (
                  <ChevronDown size={18} strokeWidth={1.75} className="shrink-0 text-text-muted" />
                )}
              </button>

              {isOpen && (
                <div className="space-y-1 px-2 pb-2">
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
          );
        })}
      </div>
    </div>
  );
}
