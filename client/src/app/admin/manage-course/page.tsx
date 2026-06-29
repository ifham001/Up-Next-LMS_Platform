"use client"
import AllCourses from '@/component-admin/manage-course/AllCourses'
import { withAdminAuth } from '@/util/withAdminAuth'
import React from 'react'


type Props = {}

function page({}: Props) {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 animate-fadeInUp">
          <span className="eyebrow mb-4">Catalog</span>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Published <span className="text-accent">courses</span>
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-text-secondary">
            View and manage all your published courses.
          </p>
        </header>
        <AllCourses/>
      </div>
    </div>
  )
}

export default withAdminAuth(page)