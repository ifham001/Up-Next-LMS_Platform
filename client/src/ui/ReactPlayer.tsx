import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  PictureInPicture2,
  Subtitles,
  Keyboard,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import ClientOnly from '@/util/CilentOnly';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  userCourseId: string;
  videoId: string;
  lastPlayedAt: number;
  onProgressUpdate?: (data: {
    currentTime: number;
    duration: number;
    percentage: number;
    watchedSeconds: number;
  }) => void;
  courseId?: string;
  userId?: string;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const formatTime = (time: number) => {
  if (!isFinite(time) || time < 0) time = 0;
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = Math.floor(time % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
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
  // Hidden video used only to render seek-preview thumbnails
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0); // seconds buffered ahead
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [hasCaptions, setHasCaptions] = useState(false);

  // Seek-preview hover state
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverThumb, setHoverThumb] = useState<string | null>(null);

  // Center "ripple" feedback (play/pause + skip)
  const [ripple, setRipple] = useState<{ icon: 'play' | 'pause' | 'fwd' | 'back'; key: number } | null>(null);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stallRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showRipple = (icon: 'play' | 'pause' | 'fwd' | 'back') =>
    setRipple({ icon, key: Date.now() });

  // ---- Core controls -------------------------------------------------------
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      v.play().catch((e) => console.error('Play failed:', e));
      showRipple('play');
    } else {
      v.pause();
      showRipple('pause');
      if (onProgressUpdate) {
        onProgressUpdate({
          currentTime: v.currentTime,
          duration: v.duration,
          percentage: v.duration > 0 ? (v.currentTime / v.duration) * 100 : 0,
          watchedSeconds: v.currentTime,
        });
      }
    }
  }, [onProgressUpdate]);

  const skip = useCallback((seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + seconds));
    showRipple(seconds > 0 ? 'fwd' : 'back');
  }, []);

  const handleVolumeChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeBarRef.current && videoRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      videoRef.current.volume = pct;
      setVolume(pct);
      setIsMuted(pct === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isMuted || volume === 0) {
      const restored = volume || 0.6;
      v.volume = restored;
      setVolume(restored);
      setIsMuted(false);
    } else {
      v.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const seekToClientX = useCallback((clientX: number) => {
    if (progressBarRef.current && videoRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      videoRef.current.currentTime = pct * duration;
      setCurrentTime(pct * duration);
    }
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((e) => console.error('Fullscreen failed:', e));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await v.requestPictureInPicture();
      }
    } catch (e) {
      console.error('PiP failed:', e);
    }
  }, []);

  const toggleCaptions = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.textTracks.length) return;
    const track = v.textTracks[0];
    const next = track.mode !== 'showing';
    track.mode = next ? 'showing' : 'hidden';
    setCaptionsOn(next);
  }, []);

  // ---- Auto-hide controls --------------------------------------------------
  const wakeControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused && !showSettings) setShowControls(false);
    }, 3000);
  }, [showSettings]);

  // ---- Video element events ------------------------------------------------
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => {
      setCurrentTime(v.currentTime);
      // track buffered-ahead range for the loading bar
      try {
        for (let i = 0; i < v.buffered.length; i++) {
          if (v.buffered.start(i) <= v.currentTime && v.currentTime <= v.buffered.end(i)) {
            setBuffered(v.buffered.end(i));
            break;
          }
        }
      } catch { /* buffered can throw before metadata */ }
    };
    const onMeta = () => {
      setDuration(v.duration);
      setIsReady(true);
      setHasCaptions(v.textTracks.length > 0);
      if (lastPlayedAt && lastPlayedAt > 0 && lastPlayedAt < v.duration) {
        v.currentTime = lastPlayedAt;
      }
    };
    const onEnded = () => setIsPlaying(false);
    // Only treat as a fatal error when there's a real source AND the element
    // actually reports an error — ignore transient/empty-src error events.
    const onErr = () => {
      if (v.currentSrc && v.error) setVideoError(true);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => {
      setIsBuffering(true);
      // graceful stall retry: nudge the element if it stays stuck
      if (stallRetryRef.current) clearTimeout(stallRetryRef.current);
      stallRetryRef.current = setTimeout(() => {
        if (videoRef.current && !videoRef.current.paused) {
          const t = videoRef.current.currentTime;
          videoRef.current.currentTime = t; // re-trigger fetch of the current range
        }
      }, 6000);
    };
    const onPlaying = () => {
      setIsBuffering(false);
      if (stallRetryRef.current) clearTimeout(stallRetryRef.current);
    };
    const onProgress = () => {
      try {
        if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
      } catch { /* noop */ }
    };

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('ended', onEnded);
    v.addEventListener('error', onErr);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('progress', onProgress);
    v.addEventListener('canplay', onPlaying);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('error', onErr);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('progress', onProgress);
      v.removeEventListener('canplay', onPlaying);
      if (stallRetryRef.current) clearTimeout(stallRetryRef.current);
    };
  }, [src, lastPlayedAt]);

  // Reset state on source change
  useEffect(() => {
    setVideoError(false);
    setIsReady(false);
    setCurrentTime(0);
    setBuffered(0);
  }, [src]);

  // PiP state sync
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const enter = () => setIsPiP(true);
    const leave = () => setIsPiP(false);
    v.addEventListener('enterpictureinpicture', enter);
    v.addEventListener('leavepictureinpicture', leave);
    return () => {
      v.removeEventListener('enterpictureinpicture', enter);
      v.removeEventListener('leavepictureinpicture', leave);
    };
  }, [src]);

  // Fullscreen sync
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // Progress beacon on unload
  useEffect(() => {
    const beacon = () => {
      const v = videoRef.current;
      if (v && !v.paused && !v.ended) {
        const db = process.env.NEXT_PUBLIC_API_URL;
        navigator.sendBeacon(
          `${db}/user/add-progress-to-video`,
          JSON.stringify({ userCourseId, videoId, watchedSeconds: v.currentTime })
        );
      }
    };
    window.addEventListener('beforeunload', beacon);
    return () => window.removeEventListener('beforeunload', beacon);
  }, [userCourseId, videoId]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      switch (e.key.toLowerCase()) {
        case ' ': case 'k': e.preventDefault(); togglePlay(); break;
        case 'arrowleft': case 'j': e.preventDefault(); skip(-10); break;
        case 'arrowright': case 'l': e.preventDefault(); skip(10); break;
        case 'arrowup':
          e.preventDefault();
          setVolume((v) => { const n = Math.min(1, v + 0.1); if (videoRef.current) videoRef.current.volume = n; setIsMuted(false); return n; });
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume((v) => { const n = Math.max(0, v - 0.1); if (videoRef.current) videoRef.current.volume = n; setIsMuted(n === 0); return n; });
          break;
        case 'f': e.preventDefault(); toggleFullscreen(); break;
        case 'm': e.preventDefault(); toggleMute(); break;
        case 'p': e.preventDefault(); togglePiP(); break;
        case 'c': e.preventDefault(); toggleCaptions(); break;
        case '?': e.preventDefault(); setShowShortcuts((s) => !s); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, toggleFullscreen, toggleMute, skip, togglePiP, toggleCaptions]);

  // ---- Seek-preview thumbnail generation -----------------------------------
  const onScrubHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = pct * duration;
    setHoverPct(pct);
    setHoverTime(t);

    const pv = previewVideoRef.current;
    const canvas = previewCanvasRef.current;
    if (pv && canvas) {
      // seek the hidden preview video; draw on 'seeked'
      const draw = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(pv, 0, 0, canvas.width, canvas.height);
          try { setHoverThumb(canvas.toDataURL('image/jpeg', 0.6)); } catch { /* CORS-tainted */ }
        }
        pv.removeEventListener('seeked', draw);
      };
      pv.addEventListener('seeked', draw);
      if (Math.abs(pv.currentTime - t) > 0.4) pv.currentTime = t;
    }
  }, [duration]);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;
  const VolIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // ---- Error state ---------------------------------------------------------
  if (videoError) {
    return (
      <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl bg-black shadow-lg">
        <div className="flex h-96 w-full flex-col items-center justify-center bg-black text-center">
          <AlertTriangle className="mb-3 h-10 w-10 text-brand-light" strokeWidth={1.5} />
          <p className="text-white">This video couldn&apos;t be loaded</p>
          <p className="mt-1 text-sm text-white/50">The source may be unavailable. Try again later.</p>
          <button
            onClick={() => { setVideoError(false); videoRef.current?.load(); }}
            className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl bg-black shadow-lg">
        <div
          ref={containerRef}
          className="relative group select-none"
          onMouseMove={wakeControls}
          onMouseLeave={() => isPlaying && !showSettings && setShowControls(false)}
          onDoubleClick={toggleFullscreen}
        >
          {/* Main video — NO crossOrigin so it plays from any source (playback first) */}
          <video
            ref={videoRef}
            className="h-auto max-h-[78vh] w-full cursor-pointer bg-black"
            src={src || undefined}
            poster={poster || undefined}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            preload="auto"
            playsInline
            onClick={togglePlay}
          />

          {/* Hidden preview video + canvas for scrub thumbnails.
              crossOrigin here is best-effort: if the source isn't CORS-enabled
              the canvas stays blank but playback (above) is unaffected. */}
          <video
            ref={previewVideoRef}
            src={src || undefined}
            preload="metadata"
            muted
            crossOrigin="anonymous"
            className="hidden"
          />
          <canvas ref={previewCanvasRef} width={160} height={90} className="hidden" />

          {/* Poster / initial loading shimmer (before metadata) */}
          {!isReady && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black">
              {poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
              )}
              <Loader2 className="relative h-10 w-10 animate-spin text-white/80" strokeWidth={2} />
            </div>
          )}

          {/* Buffering spinner (mid-playback stalls) */}
          {isReady && isBuffering && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-12 w-12 animate-spin text-white" strokeWidth={2} />
                <span className="text-xs font-medium text-white/80">Buffering…</span>
              </div>
            </div>
          )}

          {/* Center ripple feedback (play/pause/skip) */}
          {ripple && (
            <div
              key={ripple.key}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/55 text-white [animation:ripplePop_0.5s_ease-out_forwards]">
                {ripple.icon === 'play' && <Play size={30} className="fill-current" />}
                {ripple.icon === 'pause' && <Pause size={30} className="fill-current" />}
                {ripple.icon === 'fwd' && <RotateCw size={28} />}
                {ripple.icon === 'back' && <RotateCcw size={28} />}
              </span>
            </div>
          )}

          {/* Big center play button when paused & ready */}
          {isReady && !isPlaying && !isBuffering && !ripple && (
            <button
              onClick={togglePlay}
              aria-label="Play"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand/90 text-white shadow-[0_8px_30px_-6px_rgba(240,86,122,0.7)] transition-transform hover:scale-105">
                <Play size={32} className="ml-1 fill-current" />
              </span>
            </button>
          )}

          {/* Keyboard shortcuts overlay */}
          {showShortcuts && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-6" onClick={() => setShowShortcuts(false)}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 rounded-2xl border border-white/10 bg-black/60 p-6 text-sm text-white backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
                <div className="col-span-2 mb-1 font-semibold text-white/90">Keyboard shortcuts</div>
                {[
                  ['Space / K', 'Play / pause'], ['← / J', 'Back 10s'], ['→ / L', 'Forward 10s'],
                  ['↑ / ↓', 'Volume'], ['F', 'Fullscreen'], ['M', 'Mute'],
                  ['P', 'Picture-in-picture'], ['C', 'Captions'], ['?', 'Toggle this'],
                ].map(([k, d]) => (
                  <React.Fragment key={k}>
                    <kbd className="justify-self-start rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-xs">{k}</kbd>
                    <span className="text-white/70">{d}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Controls bar */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            {/* Scrub bar with buffered range + hover preview */}
            <div className="relative mb-3">
              {/* hover thumbnail tooltip */}
              {hoverPct !== null && (
                <div
                  className="pointer-events-none absolute bottom-6 z-10 -translate-x-1/2"
                  style={{ left: `${hoverPct * 100}%` }}
                >
                  <div className="overflow-hidden rounded-lg border border-white/15 bg-black shadow-lg">
                    {hoverThumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={hoverThumb} alt="" className="block h-[90px] w-[160px] object-cover" />
                    ) : (
                      <div className="h-[90px] w-[160px] bg-white/5" />
                    )}
                  </div>
                  <div className="mt-1 text-center font-mono text-xs text-white">{formatTime(hoverTime)}</div>
                </div>
              )}

              <div
                ref={progressBarRef}
                className="group/scrub relative h-1.5 cursor-pointer rounded-full bg-white/20"
                onClick={(e) => seekToClientX(e.clientX)}
                onMouseMove={onScrubHover}
                onMouseLeave={() => { setHoverPct(null); setHoverThumb(null); }}
              >
                {/* buffered-ahead */}
                <div className="absolute inset-y-0 left-0 rounded-full bg-white/35" style={{ width: `${bufferedPct}%` }} />
                {/* played */}
                <div className="absolute inset-y-0 left-0 rounded-full bg-brand" style={{ width: `${progressPct}%` }}>
                  <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand opacity-0 shadow transition-opacity group-hover/scrub:opacity-100" />
                </div>
                {/* hover marker */}
                {hoverPct !== null && (
                  <span className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-white/70" style={{ left: `${hoverPct * 100}%` }} />
                )}
              </div>
            </div>

            {/* Buttons row */}
            <div className="flex items-center justify-between gap-2 text-white">
              <div className="flex items-center gap-3 sm:gap-4">
                <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="transition-colors hover:text-brand-light">
                  {isPlaying ? <Pause size={22} className="fill-current" /> : <Play size={22} className="fill-current" />}
                </button>
                <button onClick={() => skip(-10)} aria-label="Back 10 seconds" className="transition-colors hover:text-brand-light">
                  <RotateCcw size={19} />
                </button>
                <button onClick={() => skip(10)} aria-label="Forward 10 seconds" className="transition-colors hover:text-brand-light">
                  <RotateCw size={19} />
                </button>

                <div className="group/vol flex items-center gap-2">
                  <button onClick={toggleMute} aria-label="Mute" className="transition-colors hover:text-brand-light">
                    <VolIcon size={20} />
                  </button>
                  <div
                    ref={volumeBarRef}
                    className="h-1 w-0 cursor-pointer overflow-hidden rounded-full bg-white/25 transition-all duration-300 group-hover/vol:w-20"
                    onClick={handleVolumeChange}
                  >
                    <div className="h-full rounded-full bg-white" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
                  </div>
                </div>

                <span className="font-mono text-xs tabular-nums text-white/90">
                  {formatTime(currentTime)} <span className="text-white/40">/ {formatTime(duration)}</span>
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                {hasCaptions && (
                  <button onClick={toggleCaptions} aria-label="Captions" className={`transition-colors hover:text-brand-light ${captionsOn ? 'text-brand-light' : ''}`}>
                    <Subtitles size={19} />
                  </button>
                )}
                <button onClick={() => setShowShortcuts((s) => !s)} aria-label="Keyboard shortcuts" className="hidden transition-colors hover:text-brand-light sm:block">
                  <Keyboard size={19} />
                </button>
                <button onClick={togglePiP} aria-label="Picture in picture" className={`transition-colors hover:text-brand-light ${isPiP ? 'text-brand-light' : ''}`}>
                  <PictureInPicture2 size={19} />
                </button>

                {/* Settings (speed) */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings((s) => !s)}
                    aria-label="Settings"
                    className={`flex items-center gap-1 transition-colors hover:text-brand-light ${showSettings ? 'text-brand-light' : ''}`}
                  >
                    <Settings size={19} />
                    {playbackRate !== 1 && <span className="font-mono text-[11px]">{playbackRate}x</span>}
                  </button>
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-3 min-w-[150px] rounded-xl border border-white/10 bg-black/80 p-2 text-sm backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)]">
                      <p className="px-2 py-1 text-xs uppercase tracking-wide text-white/40">Playback speed</p>
                      {SPEEDS.map((rate) => (
                        <button
                          key={rate}
                          onClick={() => { changePlaybackRate(rate); setShowSettings(false); }}
                          className={`block w-full rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/10 ${playbackRate === rate ? 'bg-brand/30 font-medium text-white' : 'text-white/80'}`}
                        >
                          {rate === 1 ? 'Normal' : `${rate}x`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen} aria-label="Fullscreen" className="transition-colors hover:text-brand-light">
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
