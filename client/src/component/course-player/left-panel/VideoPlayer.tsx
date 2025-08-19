import { getuserCourseVideoApi, updateVideoProgressApi } from '@/api/user/progress/progress';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomVideoPlayer from '@/ui/ReactPlayer';
import Description from './description/Description';
import Comments from './comments/Comments';
import { MessageCircle, NotepadText } from 'lucide-react';

type Props = {
  videoId: string;
  userCourseId?: string;
};

function Video({ videoId, userCourseId }: Props) {
  const [lastPlayedAt, setLastPlayedAt] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'comments'>('description');
  const dispatch = useDispatch();

  const onWatchProgress = async (data: { 
    currentTime: number; 
    duration: number; 
    percentage: number;
    watchedSeconds: number;
  }) => {
    await updateVideoProgressApi(userCourseId!, videoId, data.watchedSeconds);
  };

  useEffect(() => {
    const getItem = async () => {
      const response = await getuserCourseVideoApi(userCourseId!, videoId, dispatch);
      if (response.success) {
        if(response.data.progress){
          setLastPlayedAt(response.data.progress.watchedSeconds);
        }
       
        setVideoUrl(response.data.video.url);
      }
    };
    getItem();
  }, [videoId, dispatch, userCourseId]);

  return (
    <div className="w-full">
      {/* Video Player */}
      <CustomVideoPlayer 
        lastPlayedAt={lastPlayedAt} 
        userCourseId={userCourseId!} 
        videoId={videoId} 
        onProgressUpdate={onWatchProgress} 
        src={videoUrl}
      />

      {/* Tabs */}
      <div className="flex border-b ">
        {[
          { key: 'description', label: 'Description', icon: <NotepadText /> },
          { key: 'comments', label: 'Comments', icon: <MessageCircle /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'description' | 'comments')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors duration-200 
              ${activeTab === tab.key 
                ? 'bg-blue-50 border-b-2 border-gray-700 text-gray-700 font-semibold' 
                : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 min-h-[300px]">
        {activeTab === 'description' && <Description videoId={videoId} />}
        {activeTab === 'comments' && <Comments videoId={videoId} />}
      </div>
    </div>
  );
}

export default Video;
