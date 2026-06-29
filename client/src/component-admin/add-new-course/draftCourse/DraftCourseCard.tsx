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
  const seed = encodeURIComponent(title || "untitled-course");
  const imgSrc = thumbnail
    ? (thumbnail as unknown as string)
    : `https://picsum.photos/seed/${seed}/480/270`;

  return (
    <div
      onClick={getDraftCourses}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && getDraftCourses()}
      className="card-interactive group mb-4 flex cursor-pointer flex-col overflow-hidden p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden bg-surface-muted">
        <img
          src={imgSrc}
          alt={`Thumbnail for ${title || "untitled course"}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-col gap-2.5 p-5">
        {/* Course title */}
        <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-text-primary">
          {title || "Untitled course"}
        </h3>

        {/* Course price */}
        <span className="chip tnum font-display w-fit">
          {price ? `₹${price}` : "Free"}
        </span>
      </div>
    </div>
  );
}
