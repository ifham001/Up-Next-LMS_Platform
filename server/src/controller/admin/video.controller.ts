import { Context } from "hono";
import { uploadFileToGCS , getSignedUploadUrl } from "../../util/gcs-upload";
import z, { success } from "zod";
import { addVideo } from "../../queries/admin/video.queries";
import { bucket } from "../../config/gcs";




const createVideoSchema = z.object({
 
    title: z.string().min(1),
    description: z.string().min(1),
    duration:z.string().min(1).transform(Number),
    url:z.string().min(1)
  });


  export const getSignedUrlToUploadVideo = async (c: Context) => {
    const fileName = c.req.query("name"); // frontend sends ?name=video.mp4
    if (!fileName) {
      return c.json({ message: "File name is required", success: false }, 400);
    }
  
    const filePath = `videos/${Date.now()}-${fileName}`;
    try {
      const signedUrl = await getSignedUploadUrl(filePath);
      return c.json({ signedUrl, filePath, success: true });
    } catch (error) {
      console.error(error);
      return c.json({ message: "Unable to get signed URL", success: false }, 500);
    }
  };
 
  



export const addNewVideo = async (c: Context) => {
    const section_id = c.req.param("sectionId");
  const body = await c.req.json();
  
const parsed = createVideoSchema.parse(body)
   try{
        const addedVideo = await addVideo({ title: parsed.title, description:parsed.description, section_id: section_id, url: parsed.url,duration:parsed.duration });
        if(!addedVideo[0].id){
            return c.json({message:'try again video upload fails',success:false})
        }
        return c.json({ message: "Video created successfully", video: addedVideo, success:true });
    } catch (error) {
    console.log(error);
    return c.json({ message: "Error uploading video", error: error, success:false }, 500);
  }
};  