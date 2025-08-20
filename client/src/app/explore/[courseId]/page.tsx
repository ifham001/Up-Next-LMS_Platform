"use client"
import React from 'react'
import CourseContent from '@/component/course-detail/CourseContent'



type Props = {
  params:Promise<{courseId:string}>;
}

async function page({params}: Props) {
  const {courseId} =  React.use(params);

  return (
    <div> <CourseContent courseId={courseId}/> </div>
  )
}

export default page