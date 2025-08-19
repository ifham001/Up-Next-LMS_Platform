import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings
} from 'lucide-react';
import ClientOnly from '@/util/CilentOnly';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  userCourseId:string;
  videoId:string;
  lastPlayedAt:number;

  onProgressUpdate?: (data: { 
    currentTime: number; 
    duration: number; 
    percentage: number;
    watchedSeconds: number;
  }) => void;
  courseId?: string;
  userId?: string;
}

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({
  src ,
  poster = '',
  autoPlay = false,
  loop = false,
  muted = false,
  onProgressUpdate,
  courseId,
  userId,
  userCourseId,
  videoId,
  lastPlayedAt,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false); // ✨ ADDED: State for buffering/loading

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format time helper (no changes)
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause (no changes)
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (onProgressUpdate) {
            const progressData = {
              currentTime: videoRef.current.currentTime,
              duration: videoRef.current.duration,
              percentage: videoRef.current.duration > 0 ? (videoRef.current.currentTime / videoRef.current.duration) * 100 : 0,
              watchedSeconds: videoRef.current.currentTime
            };
            onProgressUpdate(progressData);
        }
      } else {
        videoRef.current.play().catch(e => console.error('Play failed:', e));
      }
    }
  }, [isPlaying, onProgressUpdate, courseId, userId]);

  // Handle volume change (no changes)
  const handleVolumeChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeBarRef.current && videoRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const newVolume = percentage / 100;
      
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  // Toggle mute (no changes)
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setVolume(volume || 0.5);
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setVolume(0);
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  // Handle progress bar click (no changes)
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const newTime = (percentage / 100) * duration;
      
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  // Skip forward/backward (no changes)
  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  }, [currentTime, duration]);

  // Toggle fullscreen (no changes)
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(e => console.error('Fullscreen failed:', e));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  // Change playback speed (no changes)
  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  }, []);

  // Show/hide controls with delay (no changes)
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  // ✨ MERGED & UPDATED: Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (lastPlayedAt && lastPlayedAt > 0) {
        video.currentTime = lastPlayedAt;
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setVideoError(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    // ✨ ADDED: Buffering event handlers
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting); // ✨ Listen for waiting event
    video.addEventListener('playing', handlePlaying); // ✨ Listen for playing event (resumed after buffering)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting); // ✨ Cleanup
      video.removeEventListener('playing', handlePlaying); // ✨ Cleanup
    };
  }, [src, lastPlayedAt]); // ✨ Merged dependencies

  // Handle fullscreen changes (no changes)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle unload events (no changes)
  useEffect(() => {
    const sendProgressBeacon = () => {
        if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
          const progressData = {
              courseId: courseId,
              userId: userId,
              currentTime: videoRef.current.currentTime,
              duration: videoRef.current.duration,
              percentage: videoRef.current.duration > 0 ? (videoRef.current.currentTime / videoRef.current.duration) * 100 : 0,
              watchedSeconds: videoRef.current.currentTime
          };
           const db = process.env.NEXT_PUBLIC_API_URL;
          const success = navigator.sendBeacon(`${db}/user/add-progress-to-video`, JSON.stringify({
            userCourseId,videoId,watchedSeconds:progressData.watchedSeconds
          }));
          
          if (success) {
            console.log('Progress Update (Before Unload): Data sent via sendBeacon.');
          } else {
            console.error('Progress Update (Before Unload): Failed to send data via sendBeacon.');
          }
        }
    };

    window.addEventListener('beforeunload', sendProgressBeacon);
    return () => {
      window.removeEventListener('beforeunload', sendProgressBeacon);
    };
  }, [courseId, userId, userCourseId, videoId]);

  // Keyboard shortcuts (no changes)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      
      switch(e.key) {
        case ' ': e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft': e.preventDefault(); skip(-10); break;
        case 'ArrowRight': e.preventDefault(); skip(10); break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(v => {
            const newVolume = Math.min(1, v + 0.1);
            if (videoRef.current) videoRef.current.volume = newVolume;
            return newVolume;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(v => {
            const newVolume = Math.max(0, v - 0.1);
            if (videoRef.current) videoRef.current.volume = newVolume;
            return newVolume;
          });
          break;
        case 'f': e.preventDefault(); toggleFullscreen(); break;
        case 'm': e.preventDefault(); toggleMute(); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, toggleFullscreen, toggleMute, skip]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (videoError) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
        <div className="w-full h-96 bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="mb-4">Unable to load video</p>
            <p className="text-gray-400 text-sm">Please check the video URL</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
    <div className="w-full max-w-6xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      <div 
        ref={containerRef}
        className="relative group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-auto max-h-[80vh] bg-black cursor-pointer"
          src={src || undefined}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          onClick={togglePlay}
        />

        {/* ✨ ADDED: Buffering Spinner Overlay */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div 
            ref={progressBarRef}
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-4 group/progress"
            onClick={handleProgressClick}
          >
            <div className="relative h-full">
              <div 
                className="h-full bg-blue-500 rounded-full relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Control Buttons (no changes) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={() => skip(-10)} className="text-white hover:text-blue-400 transition-colors">
                <SkipBack size={20} />
              </button>
              <button onClick={() => skip(10)} className="text-white hover:text-blue-400 transition-colors">
                <SkipForward size={20} />
              </button>
              <div className="flex items-center gap-2 group/volume">
                <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div 
                  ref={volumeBarRef}
                  className="w-0 group-hover/volume:w-24 transition-all duration-300 h-1 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
                  onClick={handleVolumeChange}
                >
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setShowSettings(!showSettings)} className="text-white hover:text-blue-400 transition-colors">
                  <Settings size={20} />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 min-w-[120px]">
                    <div className="text-white text-sm">
                      <p className="px-2 py-1 text-gray-400">Speed</p>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`block w-full text-left px-2 py-1 hover:bg-gray-700 rounded ${playbackRate === rate ? 'bg-gray-700' : ''}`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ClientOnly>
  );
};

export default CustomVideoPlayer;