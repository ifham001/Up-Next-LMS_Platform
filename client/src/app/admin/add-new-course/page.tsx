"use client"
import AddNewCourse from '@/component-admin/add-new-course/newCourse/AddNewCourse'
import DraftCourseList from '@/component-admin/add-new-course/draftCourse/DrafterCourseList'
import React from 'react'
import { withAdminAuth } from '@/util/withAdminAuth'

type Props = {}

function page({}: Props) {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <AddNewCourse/>
        <DraftCourseList/>
      </div>
    </div>
  )
}

export default withAdminAuth(page)