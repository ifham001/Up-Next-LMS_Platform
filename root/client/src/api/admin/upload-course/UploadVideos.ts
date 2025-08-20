import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface Video {
  duration: number 
  title: string;
  description: string;
  url: string;
}



export const uploadVideoApi = async (
  videoData: Video,
  dispatch: AppDispatch,
  setIsLoading: (isLoading: boolean) => void,
  sectionId: string
) => {
 
  setIsLoading(true)
    try {
      const response = await fetch(`${db}/admin/upload-video/${sectionId}`,{
        method:"POST",
        body:JSON.stringify({
          title:videoData.title,
          description:videoData.description,
          url:videoData.url,
          duration:videoData.duration.toString()
        }),
        headers:{
          "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get('admin-token')}`,
      }
      })
      const data = await response.json()
      if(data.success){
        return dispatch(showNotification({message:'Video submit sucessfully',type:"success"}))
      }
      return dispatch(showNotification({message:'Video not submit try again!',type:"error"}))
      
    } catch (error) {
      return dispatch(showNotification({message:'Video not submit try again!',type:"error"}))
    }
    finally{
      setIsLoading(false)
    }
};




export const uploadVideoOnGcs =async(video:File ,dispatch:AppDispatch)=>{

  try {
    // Step 1: Request signed URL from backend
    const signedUrlRes = await fetch(`${db}/admin/signed-url-from-gcs?name=${encodeURIComponent(video.name),{
      headers:{
        "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('admin-token')}`,
    }
    }}`
    );
    const signedUrlData = await signedUrlRes.json();
    

    if (!signedUrlData?.signedUrl?.url || !signedUrlData?.filePath) {
       
      dispatch(showNotification({ message: "Failed to get signed URL", type: "error" }));
      return;
    }
    return signedUrlData.signedUrl.url
  }
  catch (error) {
  return dispatch(showNotification({message:'something went wrong try again' , type:"error"}))
}

}