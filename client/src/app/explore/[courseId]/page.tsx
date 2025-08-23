"use client"
import React from 'react'
import CourseContent from '@/component/course-detail/CourseContent'
import ClientOnly from '@/util/CilentOnly';




type Params = {courseId:string};


async function page({ params }: { params: Promise<Params> }) {
  const {courseId} =  React.use(params);

  return (

    <div> 
      
   
          
      <CourseContent courseId={courseId}/>


   
    
       </div>
  )
}

export default page