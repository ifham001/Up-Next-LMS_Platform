"use client";
import VideoEditor from "./VideoEditor";
import QuizBuilder from "./QuizBuilder";
import ResourceEditor from "./ResourceEditor";
import SectionBuilder from "./SectionBuilder";
import React, { useState } from "react";
import { useDispatch } from "react-redux";


import Loading from "@/ui/Loading";
import { useRouter } from "next/navigation";

import {
  Plus,
  Video,
  FileText,
  Paperclip,
  StepBack,
  Save,
  DeleteIcon
} from "lucide-react";
import PopUpModal from "@/ui/PopUpModal";
import Button from "@/ui/Button";
import { deleteCourseApi } from "@/api/admin/manage-course/ManageCourses";
import { publishCourseApi } from "@/api/admin/upload-course/ManageCourse";

const PublishOrDeleteCourse = ({
    courseId,
    onClose,
    type
  }: {
    courseId: string;
    onClose: () => void;
    type: "publish" | "delete";
  }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
  
    const publishOrDeleteCourseHandler = async () => {
      setIsLoading(true);
      if (type === "publish") {
        const response = await publishCourseApi(courseId, dispatch, setIsLoading);
        if (response.success) router.push(`/admin/add-new-course`);
      } else {
        const response = await deleteCourseApi(courseId, dispatch, setIsLoading);
        if (response.success) router.push(`/admin/add-new-course`);
      }
    };
  
    if (isLoading) return <Loading />;
  
    const promptMessage =
      type === "publish"
        ? "Are you sure you want to publish this course?"
        : "Are you sure you want to delete this course?";
  
    return (
      <div className="p-4">
        <h2 className="mb-6">{promptMessage}</h2>
        <div className="space-y-3 flex justify-around">
          <Button
            onClick={onClose}
            className="flex items-center rounded-lg bg-red-500 hover:bg-red-300 active:scale-95 transition transform"
          >
            Cancel
          </Button>
          <Button
            onClick={publishOrDeleteCourseHandler}
            className="flex items-center h-10 rounded-lg bg-green-500 hover:bg-green-300 active:scale-95 transition transform"
          >
            {type === "publish" ? "Publish Course" : "Delete Course"}
          </Button>
        </div>
      </div>
    );
  };
  



interface Props {
    sectionId: string;
    courseId: string;
  }

const AddContent = ({ sectionId, courseId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(null);

  const handleOpen = (component: React.ReactNode) => {
    setActiveComponent(component);
    setIsOpen(true);
  };

  const actions = [
    {
      icon: <Plus className="w-5 h-5" />,
      label: "Create Section",
      onClick: () =>
        handleOpen(
          <SectionBuilder courseId={courseId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
      icon: <Video className="w-5 h-5" />,
      label: "Add Video",
      onClick: () =>
        handleOpen(
          <VideoEditor sectionId={sectionId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Add Quiz",
      onClick: () =>
        handleOpen(
          <QuizBuilder sectionId={sectionId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
      icon: <Paperclip className="w-5 h-5" />,
      label: "Add Resource",
      onClick: () =>
        handleOpen(
          <ResourceEditor sectionId={sectionId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
      icon: <Save className="w-5 h-5" />,
      label: "Publish Course",
      onClick: () =>
        handleOpen(
          <PublishOrDeleteCourse type={'publish'} courseId={courseId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
        icon: <DeleteIcon className="w-5 h-5" />,
        label: "Delete Course",
        onClick: () =>
          handleOpen(
            <PublishOrDeleteCourse type={'delete'} courseId={courseId} onClose={() => setIsOpen(false)} />
          ),
      },
  ];

  return (
    <>
      <PopUpModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {activeComponent}
      </PopUpModal>

      <div  className="p-4  left-0   min-h-screen">
        <h2 className="text-xl font-bold mb-6">Add Content</h2>
        <div className="space-y-3">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-300 active:scale-95 transition transform"
            >
              <div className="bg-white p-2 rounded-md shadow-sm">{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddContent;
