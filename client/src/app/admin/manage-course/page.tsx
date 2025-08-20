"use client"
import AllCourses from '@/component-admin/manage-course/AllCourses'
import { withAdminAuth } from '@/util/withAdminAuth'
import React from 'react'


type Props = {}

function page({}: Props) {
  return (
    <div>
        <AllCourses/>
    </div>
  )
}

export default withAdminAuth(page)