"use client"
import React, { useEffect, useState } from "react";
        import DraftCourseCard, { DraftCourseCardProps } from "./DraftCourseCard";
import { getDraftCourses } from "@/api/admin/upload-course/ManageCourse";
import { FileClock } from "lucide-react";
import { useDispatch } from "react-redux";



export default function DraftCourseList() {
    const [draftCourses, setDraftCourses] = useState<DraftCourseCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        const fetchDraftCourses = async () => {
          const data = await getDraftCourses(setIsLoading, dispatch);
          setDraftCourses(data);
        };
        fetchDraftCourses();
        console.log(draftCourses);
      }, []);

  return (
    <div className="w-full animate-fadeInUp delay-1 lg:w-1/3">
      <h2 className="mb-5 text-lg font-semibold tracking-tight text-text-primary">
        Drafts
      </h2>
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="card overflow-hidden p-0">
              <div className="skeleton aspect-video w-full rounded-none" />
              <div className="flex flex-col gap-2.5 p-5">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : draftCourses.length > 0 ? (
        draftCourses.map((course, index) => (
          <DraftCourseCard
            key={index}
            id={course.id}
            courseId={course.id}
            title={course.title}
            thumbnail={course.thumbnail}
            price={course.price}
          />
        ))
      ) : (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-brand-50 text-brand-dark">
            <FileClock size={20} strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-text-primary">No drafts yet</p>
          <p className="mt-1.5 text-xs text-text-muted">Drafts you save will appear here.</p>
        </div>
      )}
    </div>
  );
}
