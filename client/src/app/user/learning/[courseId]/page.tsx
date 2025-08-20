"use client";

import React from "react";
import CoursePlayer from "@/component/course-player/CoursePlayer";
import { withAuth } from "@/util/withAuth";

type Params = { courseId: string };

const Page = ({ params }: { params: Promise<Params> }) => {
  const { courseId } = React.use(params);

  return <CoursePlayer courseId={courseId} />;
};

export default withAuth(Page);
