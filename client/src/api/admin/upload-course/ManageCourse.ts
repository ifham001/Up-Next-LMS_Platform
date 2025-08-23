import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import { Dispatch } from "redux";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;



interface Course {
    title: string;
    description: string;
    thumbnail: string | null;
    price:number;
    domain: string;
    tagline:string;
    requirements:string[];
    benefits:string[];
    introductoryVideo:string | null;
    duration:number

}

interface Section {
  title: string;
  description: string;
  courseId: string;

}

export const createCourseApi = async (course: Course, dispatch: AppDispatch, setIsLoading: (isLoading: boolean) => void) => {
// '/admin/upload-course']
// return  console.log(course)
console.log(course)
setIsLoading(true)


  
  try {
    const response = await fetch(`${db}/admin/add-course`, {
      method: "POST",
      body: JSON.stringify({
        title:course.title,
        description:course.description,
        price:course.price,
        domain:course.domain,
        tagline:course.tagline,
        requirements:course.requirements,
        benefits:course.benefits,
        thumbnail_url:course.thumbnail,
        url:course.introductoryVideo,
        duration:course.duration
      }),
      headers:{
        "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('admin-token')}`,
    }
      
    });
    const data = await response.json();
 
    
    if (data.success) {
      console.log("success")
      dispatch(showNotification({ message: "Course created successfully", type: "success" }));
      return  data.courseId }
      if(!data.success){
        console.log("fail")
        return dispatch(showNotification({ message: "Failed to create course", type: "error" }));

      }


  } catch  {
   
    return dispatch(showNotification({ message: "Failed to create course", type: "error" }));
  }
  finally {
    setIsLoading(false);
  }
}





export const getDraftCourses = async (setIsLoading: (isLoading: boolean) => void,dispatch: AppDispatch)=>{
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/admin/draft-course`,{
          headers:{
            "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get('admin-token')}`,
        }
        })
        const data = await response.json();
        
        return !data.success ? [] : data.courses 
    } catch (error) {
        return dispatch(showNotification({ message: "Failed to get draft courses", type: "error" }));
    }
    finally {
        setIsLoading(false);
    }
}


  export const publishCourseApi = async (courseId: string, dispatch: AppDispatch, setIsLoading: (isLoading: boolean) => void) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/admin/course-finalized/${courseId}`,{
          headers:{
            "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get('admin-token')}`,
        }
        })
        const data = await response.json();
        if(data.success){
          dispatch(showNotification({ message: "Course published successfully", type: "success" ,  }));
          return data
        }
          
          return dispatch(showNotification({ message: data.message, type: "error" }));
    
        
    } catch (error) {
        return dispatch(showNotification({ message: "Failed to publish course", type: "error" }));
    }
  }

  