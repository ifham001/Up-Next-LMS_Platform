

import CourseContent from '@/component/course-detail/CourseContent';

type Params = { courseId: string };

export default async function Page({ params }: { params: Params }) {
  const { courseId } = await params;

  return (
    <div>
      <CourseContent courseId={courseId} />
    </div>
  );
}
