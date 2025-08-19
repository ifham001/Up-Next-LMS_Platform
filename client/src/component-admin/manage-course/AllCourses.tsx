"use client"
import { getlifeTimeCourseDetailApi } from '@/api/admin/manage-course/ManageCourses'
import AdminCourseCard from '@/ui/AdminCourseCard'
import Loading from '@/ui/Loading'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

type Props = {}

type Data = {
  courseId: string
  courseName: string
  thumbnail: string
  totalEnrolled: number
  price: number
  status:string
}

function AllCourses({}: Props) {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [courseDetails, setCourseDetails] = useState<Data[]>([])

  const courseArchiveHandler = (id: string) => {
    console.log("Archive course:", id)
  }

  const coursePriceChangeHandler = (id: string) => {
    console.log("Change price for course:", id)
  }

  const courseDeleteHandler = (id: string) => {
    console.log("Delete course:", id)
  }

  useEffect(() => {
    const getDetails = async () => {
      const response = await getlifeTimeCourseDetailApi(dispatch, setIsLoading)
      if (response?.success && response.data) {
        console.log(response)
        setCourseDetails(response.data)
      }
    }
    getDetails()
  }, [dispatch])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courseDetails.length > 0 ? (
        courseDetails.map(course => (
          <AdminCourseCard
            key={course.courseId}
            id={course.courseId}
            title={course.courseName}
            thumbnail={course.thumbnail}
            price={course.price.toString()}
            studentsEnrolled={course.totalEnrolled}
            onArchive={() => courseArchiveHandler(course.courseId)}
            onChangePrice={() => coursePriceChangeHandler(course.courseId)}
            onDelete={() => courseDeleteHandler(course.courseId)}
            courseStatus={course.status}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No courses found.
        </p>
      )}
    </div>
  )
}

export default AllCourses
