import CourseContent from '@/component/course-detail/CourseContent';

export default async function Page({ params }: { params: { courseId: string } }) {
  const { courseId } = params;

  return (
    <div>
      <CourseContent courseId={courseId} />
    </div>
  );
}
