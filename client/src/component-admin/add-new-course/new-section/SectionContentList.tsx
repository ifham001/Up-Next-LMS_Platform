'use client';

import React, { useState, useEffect } from 'react';
import {
  Video as VideoIcon,
  HelpCircle,
  FileText,
  UploadIcon,
  TrashIcon,
  GripVertical,
} from 'lucide-react';
import Button from '@/ui/Button';
import PopUpModal from '@/ui/PopUpModal';
import { deleteSectionApi, sectionFinalSubmitApi ,getSectionItemListApi } from '@/api/admin/upload-course/ManageSections';
import { createQuizApi } from '@/api/admin/upload-course/AddQuiz';
import { useDispatch } from 'react-redux';
import Loading from '@/ui/Loading';

interface SectionItem {
  id: string;
  content_type: 'video' | 'quiz' | 'resource';
  title: string;
  description: string;
  order: number;
  item_id: string;
  section_id: string;
}

type Props = {
  sectionNumber: number;
  title: string;
  sectionId: string;
  sectionStatus: 'in_progress' | 'completed';
 
};

const SectionContentList: React.FC<Props> = ({
  sectionNumber,
  title,
  sectionId,
  sectionStatus,    

}) => {
  const [sectionItemList, setSectionItemList] = useState<SectionItem[]>([]);
  const [clickedVideos, setClickedVideos] = useState<string[]>([]);
  const [popUpType, setPopUpType] = useState<null | 'delete' | 'submit'>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sectionCompleted = sectionStatus === 'completed';

  const dispatch = useDispatch();

  useEffect(() => {
    const getSectionItemList = async () => {
      const data = await getSectionItemListApi(sectionId, dispatch, setIsLoading);
      
      const sectionItemList = data.sectionItem;

        if(sectionItemList?.length > 0){
        return setSectionItemList(sectionItemList);
      }
       setSectionItemList([]);
    };

    getSectionItemList();
  }, [sectionId]);

  const handleVideoClick = (id: string) => {
    setClickedVideos((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleFinalSubmit = async () => {
    await sectionFinalSubmitApi(sectionId, dispatch, setIsLoading);
    setPopUpType(null);
  };

  const handleDeleteSection = async () => {
    await deleteSectionApi(sectionId, dispatch, setIsLoading);
    setPopUpType(null);
  };

  const popUpContent = {
    delete: {
      title: 'Delete Section',
      description: 'Are you sure you want to delete this section?',
      action: handleDeleteSection,
      buttonText: 'Delete',
      buttonVariant: 'danger' as const,
    },
    submit: {
      title: 'Final Submit',
      description: 'Are you sure you want to final submit this section?',
      action: handleFinalSubmit,
      buttonText: 'Final Submit',
      buttonVariant: 'primary' as const,
    },
  };

  const currentPopUp = popUpType ? popUpContent[popUpType] : null;

  const quizzes = sectionItemList.filter((item) => item.content_type === 'quiz').length;
  const resources = sectionItemList.filter((item) => item.content_type === 'resource').length;
  const videos = sectionItemList.filter((item) => item.content_type === 'video').length;

  let videoCounter = 0;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <PopUpModal isOpen={!!popUpType} onClose={() => setPopUpType(null)}>
        {currentPopUp && (
          <div className="flex flex-col gap-5 p-1">
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">{currentPopUp.title}</h1>
            <p className="text-sm leading-relaxed text-text-secondary">{currentPopUp.description}</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setPopUpType(null)}>
                Cancel
              </Button>
              <Button variant={currentPopUp.buttonVariant} onClick={currentPopUp.action}>
                {currentPopUp.buttonText}
              </Button>
            </div>
          </div>
        )}
      </PopUpModal>

      <div className="card flex h-full w-120 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand-dark">Section <span className="tnum">{sectionNumber}</span></span>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-text-primary">{title}</h2>
          </div>
          <span
            className={
              sectionCompleted
                ? "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-success-soft px-3 py-1 text-xs font-medium text-success"
                : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-warning-soft px-3 py-1 text-xs font-medium text-warning"
            }
          >
            <span className={sectionCompleted ? "size-1.5 rounded-full bg-success" : "size-1.5 rounded-full bg-warning"} />
            {sectionCompleted ? "Completed" : "In progress"}
          </span>
        </div>

        <div className="mt-5 flex justify-between gap-2 rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <VideoIcon size={16} strokeWidth={1.75} className="text-text-muted" />
            <span>Videos</span>
            <span className="tnum font-display font-bold text-text-primary">{videos}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle size={16} strokeWidth={1.75} className="text-text-muted" />
            <span>Quizzes</span>
            <span className="tnum font-semibold text-text-primary">{quizzes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText size={16} strokeWidth={1.75} className="text-text-muted" />
            <span>Resources</span>
            <span className="tnum font-semibold text-text-primary">{resources}</span>
          </div>
        </div>

        {sectionItemList.length === 0 && (
          <p className="mt-4 flex-1 rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-text-muted">
            No content yet. Add a video, quiz, or resource.
          </p>
        )}

        <ul className="mt-4 flex-1 space-y-2 overflow-y-auto">
          {sectionItemList.map((item) => {
            let icon;
            let label = item.title;

            if (item.content_type === 'video') {
              videoCounter++;
              icon = <VideoIcon className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} />;
              label = `${videoCounter}. ${item.title}`;
            } else if (item.content_type === 'quiz') {
              icon = <HelpCircle className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} />;
            } else if (item.content_type === 'resource') {
              icon = <FileText className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.75} />;
            }

            return (
              <li
                key={item.id}
                className="group flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary transition-colors hover:border-border-strong hover:bg-surface-muted"
                onClick={() => item.content_type === 'video' && handleVideoClick(item.id)}
              >
                <GripVertical size={14} strokeWidth={1.75} className="shrink-0 text-text-muted opacity-50 transition-opacity group-hover:opacity-100" />
                {icon}
                <span>
                  {label}
                  {item.content_type === 'video' && clickedVideos.includes(item.id) && (
                    <span className="ml-1 text-xs font-medium text-success">+1</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex justify-between gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setPopUpType('delete')}
          >
            <TrashIcon size={16} strokeWidth={1.75} /> Remove
          </Button>
          {sectionCompleted ? (
            <Button variant="secondary" size="sm" disabled>
              <UploadIcon size={16} strokeWidth={1.75} /> Already finalized
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setPopUpType('submit')}>
              <UploadIcon size={16} strokeWidth={1.75} /> Final submit
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default SectionContentList;
