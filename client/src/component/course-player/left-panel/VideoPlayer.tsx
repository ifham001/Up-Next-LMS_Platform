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
      <div className="flex border-b border-border bg-surface">
        {[
          { key: 'description', label: 'Description', icon: <NotepadText size={18} /> },
          { key: 'comments', label: 'Comments', icon: <MessageCircle size={18} /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'description' | 'comments')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40
              ${activeTab === tab.key
                ? 'bg-brand-50 border-b-2 border-brand text-brand font-semibold'
                : 'border-b-2 border-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 min-h-[300px] bg-surface">
        {activeTab === 'description' && <Description videoId={videoId} />}
        {activeTab === 'comments' && <Comments videoId={videoId} />}
      </div>
    </div>
  );
}

export default Video;
