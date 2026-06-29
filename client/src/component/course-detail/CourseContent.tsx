'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/component/course-detail/Header';
import YouWillLearn from '@/component/course-detail/YouWillLearn';
import Sidebar from '@/component/course-detail/SideBar';
import Requirements from '@/component/course-detail/Requirements';
import Description from '@/component/course-detail/Description';
import { fetchCourseById } from '@/api/user/courses/courses';
import { useDispatch } from 'react-redux';
import Loading from '@/ui/Loading';

interface Props {
  courseId: string;
}
interface ICourse {
  price:number
  title: string;
  tagline: string;
  total_enrollment: number;
  resources: number;
  quizzez: number;
  benefits: string[];
  requirements: string[];
  description: string;
  duration?: number;
  preview_video:string
  preview_video_duration:number
  thumbnail:string // if you have it
}

const CourseContent = ({ courseId }: Props) => {
  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      const response = await fetchCourseById(courseId, dispatch, setIsLoading);
    
      if (response && response.length > 0) {
       return setCourse(response[0]);
      }
      
      
    };
    getCourse();
  }, [courseId, dispatch]);

  if (isLoading || !course) {
    return <Loading />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 space-y-10">
      {/* Title, meta, thumbnail */}
      <Header
        tagline={course.tagline}
        title={course.title}
        total_enrollment={course.total_enrollment}
        quizzez={course.quizzez}
        resources={course.resources}
        duration={course.duration ?? 0}
      />

      {/* Content column + sticky purchase panel */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <YouWillLearn benefits={course.benefits} />
          <Requirements requirements={course.requirements} />
          <Description description={course.description} />
        </div>
        <Sidebar
          courseId={courseId}
          thumbnail_url={course.thumbnail}
          preview_video={course.preview_video}
          preview_video_duration={course.preview_video_duration}
          course_duration={course.duration ?? 0}
          resources={course.resources}
          quizzez={course.quizzez}
          price={course.price} // replace with actual course.price if you have it
        />
      </div>
    </main>
  );
};

export default CourseContent;
