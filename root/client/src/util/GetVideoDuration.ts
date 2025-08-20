export const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('video/')) {
        return reject(new Error('File is not a video'));
      }
  
      const video = document.createElement('video');
      video.preload = 'metadata';
  
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
  
      video.onerror = () => {
      return  reject(new Error('Failed to load video metadata'));
      };
  
      video.src = URL.createObjectURL(file);
    });
  };
  