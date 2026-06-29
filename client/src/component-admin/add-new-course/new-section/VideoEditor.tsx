import React, { useState } from "react";
import TextInput from "@/ui/TextInput";
import Button from "@/ui/Button";
import { uploadVideoApi } from "@/api/admin/upload-course/UploadVideos";
import { useDispatch } from "react-redux";
import Loading from "@/ui/Loading";
import { showNotification } from "@/store/slices/common/notification-slice";
import UploadWithProgress from "@/ui/UploadFileWithProgress";

interface Props {
  sectionId: string;
  onClose: () => void;
}

export default function VideoEditor({ sectionId, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoData, setVideoData] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUploadComplete = (url: string, duration: number) => {
  
    setVideoData(url);
    setVideoDuration(duration);
  };

  const handleSubmit = async () => {
    
    if (!videoData) {
   
      return dispatch(showNotification({ message: "Video not uploaded", type: "error" }));
    }
    if (!videoDuration) {
   
      return dispatch(showNotification({ message: "Video duration not found", type: "error" }));
    }

    const payload = {
      title,
      description,
      duration: videoDuration ?? null,
      url: videoData,
    };


    if (!sectionId) {
      return dispatch(showNotification({ message: "Section not found", type: "error" }));
    }

    await uploadVideoApi(payload, dispatch, setIsLoading, sectionId);

    // Reset form
    setVideoData("");
    setTitle("");
    setDescription("");
    setVideoDuration(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-5 p-1">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          Upload video
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add a title, description, and the lesson video file.
        </p>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface-muted p-5">
        <TextInput
          label="Video title"
          placeholder="Lesson title"
          state={[title, setTitle]}
          required
        />
        <TextInput
          label="Description"
          placeholder="What this lesson covers"
          state={[description, setDescription]}
          required
          textarea
        />
        <UploadWithProgress video={true} onUploaded={handleUploadComplete} />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!title || !description || !videoData || !videoDuration}
        >
          Upload video
        </Button>
      </div>
    </div>
  );
}
