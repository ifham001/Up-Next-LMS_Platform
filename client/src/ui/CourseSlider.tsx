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
    <div className="w-full px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Explore Courses</h2>
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
        {allCourse.length > 0 ? (
          allCourse.map((course, index) => (
            <Link key={course.id} href={`/explore/${course.id}`}>
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
          <p className="text-center col-span-full text-gray-500">
            No courses found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseSlider;
