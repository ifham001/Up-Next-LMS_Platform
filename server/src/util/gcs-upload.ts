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

// Single generic uploader. Previously this file had three near-identical
// functions (videos / thumbnails / resources) that differed only by default
// folder. They are now thin wrappers over this one implementation.
export const uploadToGCS = async (file: File, folder: string): Promise<string> => {
  if (!file) {
    throw new Error(`No file provided for "${folder}" upload`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const gcsFileName = `${folder}/${Date.now()}-${file.name}`;
  const blob = bucket.file(gcsFileName);

  await blob.save(buffer, {
    resumable: false,
    contentType: file.type,
  });

  return `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
};

// Backwards-compatible named wrappers so existing callers keep working.
export const uploadFileToGCS = (file: File, folder = "videos") =>
  uploadToGCS(file, folder);

export const uploadThumbnailToGCS = (thumbnail: File, folder = "thumbnails") =>
  uploadToGCS(thumbnail, folder);

export const uploadResourcesToGCS = (pdf: File, folder = "pdf") =>
  uploadToGCS(pdf, folder);

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
