
import { bucket } from "../config/gcs";



export const getSignedUploadUrl = async (filePath: string) => {
  const file = bucket.file(filePath);
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 min
    contentType: "application/octet-stream",
  });
  return { url };
};

export const getSignedReadUrl = async (filePath: string) => {
  const file = bucket.file(filePath);
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 min
  });
  return { url };
};




export const uploadFileToGCS = async (file: File, folder = "videos"): Promise<string> => {
    if (!file) {
      throw new Error("No file provided");
    }
  
    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
  
    // Create unique filename
    const gcsFileName = `${folder}/${Date.now()}-${file.name}`;
    const blob = bucket.file(gcsFileName);
  
    // Upload
    await blob.save(buffer, {
      resumable: false,
      contentType: file.type,
    });
  
    // Public URL
    return `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
  };

  export const uploadThumbnailToGCS = async (thumbnail: File, folder = "thumbnails"): Promise<string> => {
    if (!thumbnail) {
      throw new Error("No thumbnail provided");
    }
  
    // Convert File to buffer
    const arrayBuffer = await thumbnail.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
  
    // Create unique filename
    const gcsFileName = `${folder}/${Date.now()}-${thumbnail.name}`;
    const blob = bucket.file(gcsFileName);
  
    // Upload
    await blob.save(buffer, {
      resumable: false,
      contentType: thumbnail.type,
    });
  
    // Public URL
    return `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
  };
  export const uploadResourcesToGCS = async (pdf: File, folder = "pdf"): Promise<string> => {
    if (!pdf) {
      throw new Error("No thumbnail provided");
    }
  
    // Convert File to buffer
    const arrayBuffer = await pdf.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
  
    // Create unique filename
    const gcsFileName = `${folder}/${Date.now()}-${pdf.name}`;
    const blob = bucket.file(gcsFileName);
  
    // Upload
    await blob.save(buffer, {
      resumable: false,
      contentType: pdf.type,
    });
  
    // Public URL
    return `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
  };


  export const deleteFilesFromGCS = async (urls: string[]): Promise<void> => {
    if (!urls || urls.length === 0) return;
  
    const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;
  
    const deletions = urls.map((url) => {
      const filePath = url.replace(baseUrl, ""); // Extract the GCS path
      const file = bucket.file(filePath);
      return file.delete().catch((err) => {
        console.error(`Failed to delete ${filePath}:`, err.message);
      });
    });
  
    await Promise.all(deletions);
  };