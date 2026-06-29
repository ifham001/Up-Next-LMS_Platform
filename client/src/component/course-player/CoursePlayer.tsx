"use client";

import { useEffect, useState } from "react";
import SectionList from "./right-panel/SectionList";
import { getCourseContentApi } from "@/api/user/learning/user-learning";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import LeftPanel from "./left-panel";
import { ArrowLeft, List } from "lucide-react";
import { calculateCourseCompletion } from "@/util/calculateCourseCompletion";
import { useRouter } from "next/navigation";

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

export interface Course {
  courseName: string;
  sections: Section[];
  userCourseId: string;
}

interface Props {
  courseId: string;
}

export default function CoursePlayer({ courseId }: Props) {
  const [currentLesson, setCurrentLesson] = useState<Items | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [courseContent, setCourseContent] = useState<Course | null>(null);
  const [showSections, setShowSections] = useState(false);
  const route = useRouter();

  const userId = useSelector((state: RootState) => state.userAuth.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const getContentList = async () => {
      const data = await getCourseContentApi(
        userId,
        courseId,
        dispatch,
        setIsLoading
      );
      console.log(data)
      
      if (data?.success && data.userCourseId) {
        setCourseContent(data);
      }
    };
    getContentList();
  }, [userId, courseId, dispatch]);

  // auto-select first lesson
  useEffect(() => {
    if (courseContent?.sections?.length && !currentLesson) {
      setCurrentLesson(courseContent.sections[0].items[0]);
    }
  }, [courseContent, currentLesson]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="flex w-full max-w-sm flex-col gap-3 px-6">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-6 w-full rounded" />
          <div className="skeleton h-6 w-2/3 rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header — flat bordered bar */}
      <div className="sticky top-0 z-50 flex items-center gap-4 border-b border-border bg-surface px-4 py-3.5 text-text-primary">
        <button
          onClick={() => route.push("/user/learning")}
          aria-label="Back to learning"
          className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-dark">
            Now learning
          </p>
          <h1 className="truncate text-lg font-semibold leading-tight tracking-tight text-text-primary md:text-xl">
            {courseContent?.courseName}
          </h1>
        </div>

        {/* Mobile toggle button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 md:hidden"
          onClick={() => setShowSections(!showSections)}
          aria-label="Toggle course content"
        >
          <List size={20} strokeWidth={1.75} />
        </button>
      </div>

      {/* Layout */}
      <div className="flex h-[calc(100vh-64px)] w-screen bg-bg">
        {/* Left panel - lesson view */}
        <div className="h-full flex-grow overflow-y-auto">
          <LeftPanel
            userCourseId={courseContent?.userCourseId || ""}
            activeItem={currentLesson}
          />
        </div>

        {/* Mobile backdrop */}
        {showSections && (
          <div
            className="fixed inset-0 z-40 bg-text-primary/30 md:hidden"
            onClick={() => setShowSections(false)}
          />
        )}

        {/* Right panel - sections */}
        <div
          className={`
            fixed top-0 right-0 z-50 mt-15 h-full w-72 transform border-l border-border bg-surface transition-transform duration-300 md:mt-0
            md:relative md:w-80 md:translate-x-0
            ${showSections ? "translate-x-0" : "translate-x-full md:translate-x-0"}
          `}
        >
          <div className="h-full overflow-y-auto">
            <SectionList
              completePercent={calculateCourseCompletion(courseContent)}
              sections={courseContent?.sections || []}
              currentLesson={currentLesson}
              setCurrentLesson={(item) => {
                setCurrentLesson(item);
                setShowSections(false); // close on mobile
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
