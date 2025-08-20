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
    <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-8">
        <Header
          tagline={course.tagline}
          title={course.title}
          total_enrollment={course.total_enrollment}
          quizzez={course.quizzez}
          resources={course.resources}
          duration={course.duration ?? 0}
        />
        <YouWillLearn benefits={course.benefits} />
        <Requirements requirements={course.requirements} />
        <Description description={course.description} />
      </div>
      <Sidebar 
        courseId={courseId}
       thumbnail_url={course.thumbnail}
        preview_video = {course.preview_video}
        preview_video_duration = {course.preview_video_duration}
        course_duration={course.duration ?? 0}
        resources={course.resources}
        quizzez={course.quizzez}
        price={course.price} // replace with actual course.price if you have it
      />
    </main>
  );
};

export default CourseContent;
