"use client"
import React, { useEffect, useState } from 'react'
import StudentCourseCard from '@/ui/StudentCourseCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/Store'
import { getUserCourseApi } from '@/api/user/learning/user-learning'
import { useRouter } from 'next/navigation'
import Button from '@/ui/Button'

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
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="skeleton h-8 w-48 rounded-md" />
        <div className="skeleton h-4 w-72 rounded-md mt-3" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-[180px] w-full rounded-none" />
              <div className="p-6 space-y-4">
                <div className="skeleton h-5 w-3/4 rounded-md" />
                <div className="skeleton h-4 w-full rounded-md" />
                <div className="skeleton h-2 w-full rounded-full" />
                <div className="skeleton h-9 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <span className="eyebrow">My courses</span>
        <h1 className="display text-3xl text-text-primary mt-3">
          My <span className="text-accent">learning</span>
        </h1>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          Pick up where you left off.
        </p>
      </div>

      {courseDetail.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseDetail.map((course) => (
            <StudentCourseCard
              key={course.courseId}
              title={course.title}
              tagline={course.tagline ?? "No tagline available"}
              progress={course.progress ?? 0}
              imageUrl={course.thumbnail}
              courseHandler={() => {
                route.push(`/user/learning/${course.courseId}`)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="card mt-10 overflow-hidden flex flex-col sm:flex-row items-center">
          <div className="relative h-44 w-full sm:h-48 sm:w-64 shrink-0">
            <img
              src="https://picsum.photos/seed/learning-desk-books/512/384"
              alt="A desk with books and a notebook"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 text-center sm:text-left">
            <h2 className="font-display text-xl font-semibold text-text-primary">No courses yet</h2>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-[42ch]">
              Enroll in a course and it will show up here so you can track your progress.
            </p>
            <div className="mt-5">
              <Button variant="primary" onClick={() => route.push('/courses')}>
                Browse courses
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Learning
