'use client';
import { useDispatch } from 'react-redux';

import React, { useRef, useState } from 'react';
import { VideoIcon, XIcon } from 'lucide-react';

type VideoUploaderProps = {
  onFileSelect: (file: File | null) => void;
  label?: string;
};

const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect, label = 'Upload Video' }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
    return;
   
  };

  const handleReset = () => {
    setFileName(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileSelect(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full  max-w-md">
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        htmlFor="video-upload"
        className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:border-blue-400 transition"
      >
        <VideoIcon className="w-10 h-10 text-blue-500 mb-2" />
        <span className="text-sm text-gray-600">{label}</span>
        <input
          ref={inputRef}
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {fileName && (
        <div className="mt-3 flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
          <span className="text-sm text-gray-700 truncate">{fileName}</span>
          <button
            onClick={handleReset}
            className="ml-4 text-gray-500 hover:text-red-600 transition"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
