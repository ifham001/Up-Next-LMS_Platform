'use client';

import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { getAllCoursesApi } from '@/api/user/courses/courses';
import { useDispatch } from 'react-redux';
import Loading from './Loading';
import Link from 'next/link';

type ICourse = {
  title: string;
  course_duration: number;
  tagline: string;
  price: number;
  total_enrollment: number;
  id: string;
  lessons: number;
  thumbnailUrl: string;
};

const CourseSlider = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [allCourse, setAllCourse] = useState<ICourse[]>([]);

  useEffect(() => {
    const fetchAllCourses = async () => {
      const courses = await getAllCoursesApi(dispatch, setIsLoading);
      if (courses && courses.length > 0) {
        setAllCourse(courses);
      } else {
        setAllCourse([]);
      }
    };
    fetchAllCourses();
  }, [dispatch]); // ✅ added dispatch in deps

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-4">
        <span className="eyebrow">Catalog</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mb-8">Explore <span className="text-accent">courses</span></h2>
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
        {allCourse.length > 0 ? (
          allCourse.map((course, index) => (
            <Link
              key={course.id}
              href={`/explore/${course.id}`}
              className={`animate-fadeInUp ${index < 4 ? `delay-${index + 1}` : ''}`}
            >
              <CourseCard
                imageUrl={course.thumbnailUrl}
                title={course.title}
                description={course.tagline}
                price={course.price}
                courseDuration={course.course_duration.toString()}
                lessons={course.lessons}
                enrollments={course.total_enrollment}
              />
            </Link>
          ))
        ) : (
          <div className="card w-full flex flex-col sm:flex-row items-center gap-6 p-8">
            <img
              src="https://picsum.photos/seed/empty-course-catalog/240/160"
              alt="An empty bookshelf"
              className="w-full sm:w-60 h-40 object-cover rounded-md border border-border"
            />
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-text-primary">No courses yet</h3>
              <p className="text-sm text-text-secondary mt-1.5 leading-relaxed max-w-[40ch]">
                New courses will appear here as soon as they are published. Check back shortly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSlider;
