"use client"
import React, { useEffect, useState } from "react";
        import DraftCourseCard, { DraftCourseCardProps } from "./DraftCourseCard";
import { getDraftCourses } from "@/api/admin/upload-course/ManageCourse";
import { useDispatch } from "react-redux";
import Loading from "@/ui/Loading";



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

      if (isLoading) {
        return <Loading />;
      }
    
  return (
    <div className="w-full lg:w-1/3">
      <h2 className="text-xl font-semibold mb-4">Draft Preview</h2>
      {draftCourses.length > 0 ? (
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
        <p>No draft courses found</p>
      )}
    </div>
  );
}
