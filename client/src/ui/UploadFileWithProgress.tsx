"use client";
import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/common/notification-slice";
import { getVideoDuration } from "@/util/GetVideoDuration";
import { uploadVideoOnGcs } from "@/api/admin/upload-course/UploadVideos";

interface UploadWithProgressProps {
  onUploaded: ( publicUrl: string ,duration:number ) => void;
  thumbnail?: boolean;
  video?: boolean;
}

const UploadWithProgress: React.FC<UploadWithProgressProps> = ({
  onUploaded,
  thumbnail = false,
  video = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [videoDuration,setVideoDuration] = useState<number>()

  const dispatch = useDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("");
      setProgress(0);
    }
  };

  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(file as any);
    }
    setFile(null);
    setProgress(0);
    setStatus("");
  };

  

  const uploadFile = async () => {
    if (!file) {
      setStatus("⚠️ Please select a file first.");
      return;
    }
   
     
      
  


    setUploading(true);
    setStatus("");

    try {
    
      const signedUrl = await uploadVideoOnGcs(file, dispatch);

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          setStatus("✅ Uploaded successfully!");
          const publicUrl = signedUrl.split("?")[0];
          // let durationOfVideo:
 
         
          return onUploaded(publicUrl,videoDuration!);
        
         
      
      
        } else {
          setStatus(`❌ Upload failed: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setStatus("❌ Upload failed: Network error");
      };

      xhr.send(file);
    } catch (error) {
      setUploading(false);
      setStatus("❌ Upload failed");
    }
  };
  useEffect(()=>{
    const getDuration = async()=>{
      if(file && video){
        const duration = await getVideoDuration(file)
       return setVideoDuration(duration)
      }
      if(file && thumbnail){
          return setVideoDuration(0)
      }
     
    }
   
      getDuration()
   

  },[file,video])
  

  return (
    
      <div
        className={`p-6 border rounded-xl shadow-sm w-full max-w-lg transition-all duration-200
          ${
            video
              ? "bg-brand-50 border-brand"
              : thumbnail
              ? "bg-success-soft border-success"
              : "bg-surface border-border"
          }`}
      >
        {/* Type Label */}
        <p
          className={`text-sm font-semibold mb-2 ${
            video ? "text-brand" : thumbnail ? "text-success" : "text-text-secondary"
          }`}
        >
          {video ? "🎥 Upload a Video" : thumbnail ? "🖼️ Upload a Thumbnail" : "📁 Upload File"}
        </p>
  
        {/* File Selector */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept={video ? "video/*" : thumbnail ? "image/*" : "*"}
            onChange={handleFileChange}
            className="flex-1 border border-input-border rounded-lg p-2 text-sm bg-input-bg text-text-primary file:mr-3 file:rounded-md file:border-0 file:bg-surface-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text-secondary"
          />
          <button
            onClick={uploadFile}
            disabled={uploading}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-text-inverted shadow-sm transition-all duration-150 active:scale-[0.97]
              ${uploading ? "bg-text-muted cursor-not-allowed" : "bg-brand hover:bg-brand-dark hover:shadow-md"}`}
          >
            <Upload className="w-5 h-5" />
            Upload
          </button>
        </div>
  
        {/* File name & Remove */}
        {file && (
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-text-secondary truncate">📄 {file.name}</p>
              <button
                onClick={removeFile}
                className="text-error text-sm font-medium hover:underline"
              >
                Remove
              </button>
            </div>

            {/* Preview */}
            {video && file.type.startsWith("video/") && (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="mt-2 rounded-lg w-full max-h-64 object-contain border border-border"
              />
            )}

            {thumbnail && file.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(file)}
                alt="thumbnail preview"
                className="mt-2 rounded-lg w-full max-h-64 object-contain border border-border"
              />
            )}
          </div>
        )}
  
        {/* Progress bar */}
        {uploading && (
          <div className="mt-4">
            <div className="bar-track h-2 w-full">
              <div
                className="bar-fill h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-sm font-medium text-text-secondary tnum">{progress}%</p>
          </div>
        )}

        {/* Status message */}
        {status && (
          <p className="mt-3 text-sm font-medium text-text-secondary">{status}</p>
        )}
      </div>
    );
  
};

export default UploadWithProgress;
