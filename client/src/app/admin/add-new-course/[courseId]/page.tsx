import React from 'react'
import ManageSection from '@/component-admin/add-new-course/new-section/ManageSection'
import { withAdminAuth } from '@/util/withAdminAuth';

async function page({params}: {params: {courseId: string}}) { 
    const {courseId} = await params;
    
  return (
    <>
    
    <ManageSection courseId={courseId}/>
    
    
    </>
  )
}

export default withAdminAuth(page)