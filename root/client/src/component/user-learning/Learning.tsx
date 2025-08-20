"use client"
import React, { useEffect, useState } from 'react'
import StudentCourseCard from '@/ui/StudentCourseCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/Store'
import Loading from '@/ui/Loading'
import { getUserCourseApi } from '@/api/user/learning/user-learning'
import { useRouter } from 'next/navigation'
import Button from '@/ui/Button'
import PopUpModal from '@/ui/PopUpModal'
import TextInput from '@/ui/TextInput'
import { generateCertificate } from '@/util/Certificate'

type Props = {}

type courseDetail = {
  progress: number
  courseId: string
  title: string
  tagline: string
  thumbnail: string
  userCourseId: string
}

function Learning({}: Props) {
  const userId = useSelector((state: RootState) => state.userAuth.userId)
  const [isLoading, setIsLoading] = useState(false)
  const [courseDetail, setCourseDetail] = useState<courseDetail[]>([])
 

  const dispatch = useDispatch()
  const route = useRouter()
 

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true)
      const userCourses = await getUserCourseApi(userId, dispatch, setIsLoading)
      console.log(userCourses)
       if(userCourses.success){
        return setCourseDetail(userCourses.courseDetailWithUserProgress)
       }
    
      setIsLoading(false)
    }
    fetchCourse()
  }, [userId, dispatch])

  if (isLoading) {
    return <Loading />
  }

 

  return (
    <>
      {/* PopUp for entering name */}
     
      <div className="p-3 sm:p-6 md:p-10">
        <p className="flex text-center justify-center gap-2 text-2xl sm:text-3xl font-bold">
          Continue To Learning
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courseDetail.length > 0 ? (
            courseDetail.map((course) => (
              <div key={course.courseId} className="flex flex-col gap-2">
                <StudentCourseCard
                  title={course.title}
                  tagline={course.tagline ?? "No tagline available"}
                  progress={course.progress ?? 0}
                  imageUrl={course.thumbnail}
                  courseHandler={() => {
                    route.push(`/user/learning/${course.courseId}`)
                  }}
                />

                {/* ✅ Show download certificate only if this course is 100% complete */}
             
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 text-sm sm:text-base">
              No courses found.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default Learning
