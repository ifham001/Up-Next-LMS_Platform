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
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-50 p-4 flex gap-4 bg-gray-700 text-white items-center">
        <ArrowLeft
          onClick={() => route.push("/user/learning")}
          className="cursor-pointer"
        />
        <h1 className="text-lg md:text-xl font-semibold flex-1">
          {courseContent?.courseName}
        </h1>

        {/* Mobile toggle button */}
        <button
          className="md:hidden p-2 bg-gray-600 rounded"
          onClick={() => setShowSections(!showSections)}
        >
          <List size={20} />
        </button>
      </div>

      {/* Layout */}
      <div className="flex w-screen h-[calc(100vh-64px)]">
        {/* Left panel - lesson view */}
        <div className="flex-grow h-full overflow-y-auto">
          <LeftPanel
            userCourseId={courseContent?.userCourseId || ""}
            activeItem={currentLesson}
          />
        </div>

        {/* Mobile backdrop */}
        {showSections && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={() => setShowSections(false)}
          />
        )}

        {/* Right panel - sections */}
        <div
          className={`
            fixed top-0 right-0 h-full mt-15 md:mt-0 w-72 bg-white border-l border-gray-300 z-50
            transform transition-transform duration-300
            md:relative md:translate-x-0 md:w-80
            ${showSections ? "translate-x-0" : "translate-x-full md:translate-x-0"}
          `}
        >
          <div className="h-full overflow-y-auto  ">
            
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
