"use client";
import React from "react";
import { useRouter } from "next/navigation";

export interface DraftCourseCardProps {
  title: string;
  thumbnail?: File | null;
  price: string | number;
  courseId:string;
  id:string;
}

export default function DraftCourseCard({
  courseId,
  title,
  thumbnail,
  price,
 
}: DraftCourseCardProps) {
  const router = useRouter();
 const getDraftCourses =()=>{
  router.push(`/admin/add-new-course/${courseId}`)
 }
  return (
    <div
      onClick={getDraftCourses}
      className="flex flex-col items-center border rounded-lg p-4 bg-white shadow hover:shadow-lg cursor-pointer transition"
    >
      {/* Thumbnail */}
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Course Thumbnail"
          className="w-full h-40 object-cover rounded mb-4"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-4">
          <p className="text-gray-500">No Thumbnail</p>
        </div>
      )}

      {/* Course Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center line-clamp-2">
        {title || "Untitled Course"}
      </h3>

      {/* Course Price */}
      <p className="text-gray-600 font-medium">
        {price ? `₹${price}` : "Free"}
      </p>
    </div>
  );
}
