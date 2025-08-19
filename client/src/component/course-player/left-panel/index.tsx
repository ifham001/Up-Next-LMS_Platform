import VideoPlayer from "./VideoPlayer";
import ResourceViewer from "./ResourceViewer";
import QuizInterface from "./QuizInterface";
import { Items } from "../CoursePlayer";

interface Props {
  activeItem: Items | null;
  userCourseId?:string
}

export default function LeftPanel({ activeItem,userCourseId }: Props) {
  if (!activeItem) return <div className="p-4">Select an item</div>;

  switch (activeItem.content_type) {
    case "video":
      return <VideoPlayer userCourseId={userCourseId} videoId={activeItem.item_id} />;
    case "resource":
      return <ResourceViewer resourceId={activeItem.item_id} />;
    case "quiz":
      return <QuizInterface quizId={activeItem.item_id} />;
    default:
      return <div>Unsupported item type</div>;
  }
}
