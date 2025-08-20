"use client";

import ManageSection from "@/component-admin/add-new-course/new-section/ManageSection";
import { withAdminAuth } from "@/util/withAdminAuth";
import React from "react";

interface Props {
  params:Promise< { courseId: string }>;
}

const  Page:React.FC<Props>=({ params })=> {
  const {courseId} = React.use(params)
  return <ManageSection courseId={courseId} />;
}

export default withAdminAuth(Page);
