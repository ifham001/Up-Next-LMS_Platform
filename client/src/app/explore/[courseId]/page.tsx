import React from 'react'
import CourseContent from '@/component/course-detail/CourseContent'



type Props = {}

async function page({params}: {params: {courseId: string}}) {
  const {courseId} = await params;

  return (
    <div> <CourseContent courseId={courseId}/> </div>
  )
}

export default page