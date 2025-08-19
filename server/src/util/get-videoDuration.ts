import ffmpeg from 'fluent-ffmpeg';
import { FfprobeData } from 'fluent-ffmpeg';

export const getVideoDuration = (videoPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err: Error | null, metadata: FfprobeData) => {
      if (err) return reject(err);
      const durationInSeconds = metadata.format.duration;
      resolve(durationInSeconds ?? 0); // fallback if undefined
    });
  });
};
