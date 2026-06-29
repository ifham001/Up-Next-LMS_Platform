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
      <div className="p-1">
        <h2 className="mb-6 text-lg font-semibold tracking-tight text-text-primary">{promptMessage}</h2>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {type === "publish" ? (
            <Button onClick={publishOrDeleteCourseHandler}>
              Publish course
            </Button>
          ) : (
            <Button variant="danger" onClick={publishOrDeleteCourseHandler}>
              Delete course
            </Button>
          )}
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
      icon: <Plus className="h-5 w-5" strokeWidth={1.75} />,
      label: "Create section",
      onClick: () =>
        handleOpen(
          <SectionBuilder courseId={courseId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
      icon: <Video className="h-5 w-5" strokeWidth={1.75} />,
      label: "Add video",
      onClick: () =>
        handleOpen(
          <VideoEditor sectionId={sectionId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
      icon: <FileText className="h-5 w-5" strokeWidth={1.75} />,
      label: "Add quiz",
      onClick: () =>
        handleOpen(
          <QuizBuilder sectionId={sectionId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
      icon: <Paperclip className="h-5 w-5" strokeWidth={1.75} />,
      label: "Add resource",
      onClick: () =>
        handleOpen(
          <ResourceEditor sectionId={sectionId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
      icon: <Save className="h-5 w-5" strokeWidth={1.75} />,
      label: "Publish course",
      onClick: () =>
        handleOpen(
          <PublishOrDeleteCourse type={'publish'} courseId={courseId} onClose={() => setIsOpen(false)} />
        ),
    },
    {
        icon: <DeleteIcon className="h-5 w-5" strokeWidth={1.75} />,
        label: "Delete course",
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

      <div className="card sticky top-6 h-fit w-full shrink-0 p-5 lg:w-64 animate-fadeInUp">
        <h2 className="mb-4 text-sm font-semibold tracking-tight text-text-primary">Add content</h2>
        <div className="space-y-1">
          {actions.map((action, idx) => {
            const isDanger = action.label === "Delete course";
            return (
              <button
                key={idx}
                onClick={action.onClick}
                className={
                  isDanger
                    ? "group flex w-full items-center gap-3 rounded-md p-2 text-error transition-colors hover:bg-error-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-error/40"
                    : "group flex w-full items-center gap-3 rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                }
              >
                <div
                  className={
                    isDanger
                      ? "flex size-8 items-center justify-center rounded-md border border-border bg-error-soft text-error"
                      : "flex size-8 items-center justify-center rounded-md border border-border bg-surface-muted text-text-secondary group-hover:text-text-primary"
                  }
                >
                  {action.icon}
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AddContent;
