'use client';

import React, { useState, useEffect } from 'react';
import {
  Video as VideoIcon,
  HelpCircle,
  FileText,
  UploadIcon,
  TrashIcon,
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
      buttonClass: 'bg-red-500',
    },
    submit: {
      title: 'Final Submit',
      description: 'Are you sure you want to final submit this section?',
      action: handleFinalSubmit,
      buttonText: 'Final Submit',
      buttonClass: 'bg-green-600',
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
          <div className="flex flex-col gap-5">
            <h1 className="text-xl text-center">{currentPopUp.title}</h1>
            <p className="text-center">{currentPopUp.description}</p>
            <div className="flex justify-around">
              <Button onClick={() => setPopUpType(null)}>Cancel</Button>
              <Button className={currentPopUp.buttonClass} onClick={currentPopUp.action}>
                {currentPopUp.buttonText}
              </Button>
            </div>
          </div>
        )}
      </PopUpModal>

      <div className="rounded-2xl border border-gray-300 h-full bg-white p-4 shadow-sm w-120 flex flex-col">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Section {sectionNumber}</h2>
          <p className="text-sm text-gray-600">{title}</p>
        </div>

        <div className="space-y-2 flex justify-between mt-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <VideoIcon size={16} />
            <span>Videos</span>
            <span>{videos}</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle size={16} />
            <span>Quizzes</span>
            <span>{quizzes}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span>Resources</span>
            <span>{resources}</span>
          </div>
        </div>

        <ul className="space-y-2 mt-4 flex-1 overflow-y-auto">
          {sectionItemList.map((item) => {
            let icon;
            let label = item.title;

            if (item.content_type === 'video') {
              videoCounter++;
              icon = <VideoIcon className="w-4 h-4 text-blue-600" />;
              label = `${videoCounter}. ${item.title}`;
            } else if (item.content_type === 'quiz') {
              icon = <HelpCircle className="w-4 h-4 text-green-600" />;
            } else if (item.content_type === 'resource') {
              icon = <FileText className="w-4 h-4 text-purple-600" />;
            }

            return (
              <li
                key={item.id}
                className="cursor-pointer p-2 rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
                onClick={() => item.content_type === 'video' && handleVideoClick(item.id)}
              >
                {icon}
                <span>
                  {label}
                  {item.content_type === 'video' && clickedVideos.includes(item.id) && ' +1'}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex justify-between">
          <Button
            onClick={() => setPopUpType('delete')}
            className="text-sm flex items-center gap-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            <TrashIcon size={16} /> Remove
          </Button>
          <Button
            disabled={sectionCompleted}
            onClick={() => setPopUpType('submit')}
            className={
                sectionCompleted ? "text-sm flex items-center gap-2 rounded-md bg-gray-400 text-white hover:bg-gray-500" : 
                "text-sm flex items-center gap-2 rounded-md bg-green-700 text-white hover:bg-green-800"}
          >
            <UploadIcon size={16} />
            {sectionCompleted ? "Already Finalized" : "Final Submit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SectionContentList;
