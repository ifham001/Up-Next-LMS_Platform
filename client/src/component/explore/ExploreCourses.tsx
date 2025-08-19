'use client';

import CourseCard from '@/ui/CourseCard';
import React, { useState, useTransition ,useEffect } from 'react';
import { useRouter ,useSearchParams } from 'next/navigation';
import { getAllCoursesApi } from '@/api/user/courses/courses';
import { useDispatch } from 'react-redux';
import Loading from '@/ui/Loading';
import Link from 'next/link';


 // adjust import path

type Course = {
  imageUrl?: string;
  lessons?: number;
  courseDuration: string;
  title: string;
  description: string;
  price: number; // Discounted price
  enrollments: number; // used for filtering
};
type ICourse ={
  title:string
  course_duration:number
  tagline:string
  price:number
  domain:string
  total_enrollment:number
  id:string
  lessons:number,
  thumbnailUrl:string
}

const categories = ['All', 'Information Technology', 'Marketing', 'Business','Management', 'Language'];

const ExploreCourses = () => {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain');
  const [isLoading,setIsLoading]= useState(false)
  const disptach = useDispatch()
  const [allCourse,setAllCourse] = useState<ICourse[]>([])

  const filteredCourses =
    selectedDomain === 'All'
      ? allCourse
      : allCourse.filter((course) => course.domain === selectedDomain);

  const categoryHandler = (category: string) => {
    setSelectedDomain(category);
    router.push(`/explore?domain=${category}`);
    // startTransition(() => {
    //   const params = new URLSearchParams(searchParams);
    //   params.set('domain', category);
    //   router.push(`/explore?${params.toString()}`);
    // });
  };
  useEffect(()=>{
    const fetchAllCourses = async()=>{
      const courses = await getAllCoursesApi(disptach,setIsLoading)
 
      if(courses.length>0){
        setAllCourse(courses)
      }
      else{
        setAllCourse([])
      }
    }
    fetchAllCourses()
  },[])
  if(isLoading){
    return <Loading/>
  }

  return (
    <section className="bg-[#f9fafb] px-6 md:px-12 lg:px-24 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Explore Courses</h2>
        <p className="text-gray-600 text-sm md:text-base">
          Find your next skill to master — choose a domain to filter.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto gap-3 mb-10 px-4 lg:justify-center scrollbar-hide">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => categoryHandler(category)}
      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
        selectedDomain === category
          ? 'bg-slate-900 text-white'
          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
      }`}
    >
      {category}
    </button>
  ))}
</div>


      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredCourses.length > 0 ? (
          allCourse.map((course, index) => (
            <Link key={index} href={`/explore/${course.id}`}>
            <CourseCard key={index} 
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
          <p className="text-center col-span-full text-gray-500">No courses found.</p>
        )}
      </div>
    </section>
  );
};

export default ExploreCourses;
