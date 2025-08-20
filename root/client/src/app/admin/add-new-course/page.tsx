import AddNewCourse from '@/component-admin/add-new-course/newCourse/AddNewCourse'
import DraftCourseList from '@/component-admin/add-new-course/draftCourse/DrafterCourseList'
import React from 'react'
import { withAdminAuth } from '@/util/withAdminAuth'

type Props = {}

function page({}: Props) {
  return (
    <>
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col lg:flex-row gap-8">
   
    <AddNewCourse/>
    <DraftCourseList/>
    </div>
    </>
  )
}

export default withAdminAuth(page)