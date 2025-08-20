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
    console.log('sdiuhasiduh')
    if (!videoData) {
      console.log(videoData)
      return dispatch(showNotification({ message: "Video not uploaded", type: "error" }));
    }
    if (!videoDuration) {
      console.log(videoDuration)
      return dispatch(showNotification({ message: "Video duration not found", type: "error" }));
    }

    const payload = {
      title,
      description,
      duration: videoDuration ?? null,
      url: videoData,
    };
    console.log(payload)

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
    <>
      <h1 className="text-xl flex justify-center">Upload Video</h1>
      <div className="bg-white p-3 rounded mb-2">
        <TextInput
          label="Video Title"
          placeholder="Enter title"
          state={[title, setTitle]}
          required
        />
        <TextInput
          label="Description"
          placeholder="Enter description"
          state={[description, setDescription]}
          required
          textarea
        />
        <UploadWithProgress video={true} onUploaded={handleUploadComplete} />

      </div>

      <div className="flex justify-around mt-4">
        <Button onClick={onClose}>Close</Button>
        <Button
          className="bg-green-600 h-10"
          onClick={handleSubmit}
          disabled={!title || !description || !videoData || !videoDuration}
        >
          Upload Video
        </Button>
      </div>
    </>
  );
}
