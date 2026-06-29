import VideoPlayer from "./VideoPlayer";
import ResourceViewer from "./ResourceViewer";
import QuizInterface from "./QuizInterface";
import { Items } from "../CoursePlayer";
import { Compass } from "lucide-react";

interface Props {
  activeItem: Items | null;
  userCourseId?:string
}

export default function LeftPanel({ activeItem,userCourseId }: Props) {
  if (!activeItem)
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="flex max-w-sm flex-col items-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-dark">
            <Compass size={24} strokeWidth={1.75} />
          </span>
          <h2 className="mt-5 text-xl font-semibold tracking-tight text-text-primary">
            Select a lesson to begin
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Pick any item from the curriculum to start learning.
          </p>
        </div>
      </div>
    );

  switch (activeItem.content_type) {
    case "video":
      return <VideoPlayer userCourseId={userCourseId} videoId={activeItem.item_id} />;
    case "resource":
      return <ResourceViewer resourceId={activeItem.item_id} />;
    case "quiz":
      return <QuizInterface quizId={activeItem.item_id} />;
    default:
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="card px-6 py-5 text-sm text-text-muted">
            Unsupported item type
          </div>
        </div>
      );
  }
}
