import { showNotification } from "@/store/slices/common/notification-slice";
import { AppDispatch } from "@/store/Store";
import Cookies from "js-cookie";
const db = process.env.NEXT_PUBLIC_API_URL;

interface Section {
    title: string;
    description: string;
    courseId: string;
}



export const createSectionApi = async (section: Section, dispatch: AppDispatch, setIsLoading: (isLoading: boolean) => void) => {
 
    setIsLoading(true)
  try {
    const response = await fetch(`${db}/admin/add-section`, {
      method: "POST",
      body: JSON.stringify({title:section.title,description:section.description,courseId:section.courseId}),
      headers:{
        "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('admin-token')}`,
    }
    });
    const data = await response.json();
   
    if(data.draft){
        dispatch(showNotification({message:`First complete section ${data.sectionNumber} to add new section`,type:"error"}))
      return data.sectionId;
    }
    if(data.success){
        dispatch(showNotification({message:"Section created successfully",type:"success"}))
        return data.sectionId;
    }
  
    return data.sectionId;
       
    

  } catch (error) {
    return dispatch(showNotification({ message: "Failed to create section", type: "error" }));
  }
  finally {
    setIsLoading(false);
  }
}




export const getSectionApi = async (courseId:string,setIsLoading: (isLoading: boolean) => void,dispatch: AppDispatch)=>{
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/admin/draft-section/${courseId}`,{
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('admin-token')}`,
            }
        })
        const data = await response.json();
        if(data.success){
            return data.draftCourseSection
        }else{
            return dispatch(showNotification({ message: "Failed to get section", type: "error" }));
        }
    } catch (error) {
        return dispatch(showNotification({ message: "Failed to get section", type: "error" }));
    }
    finally {
        setIsLoading(false);
    }
}
export const deleteSectionApi = async (sectionId: string, dispatch: AppDispatch, setIsLoading: (isLoading: boolean) => void) => {
    setIsLoading(true)
   
    try {
        const response = await fetch(`${db}/admin/delete-section/${sectionId}`, {
            method: "DELETE",
        })
        const data = await response.json();
  
        if(data.success){
            return dispatch(showNotification({ message: "section Delete Successfully", type: "success" }));
        }
            return dispatch(showNotification({ message: "Failed to delete section", type: "error" }));
        
        
        
    } catch (error) {
        return dispatch(showNotification({ message: "Failed to delete section", type: "error" }));
    }
    finally {
        setIsLoading(false);
    }
}



export const sectionFinalSubmitApi = async (sectionId: string, dispatch: AppDispatch, setIsLoading: (isLoading: boolean) => void) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${db}/admin/section-finalized/${sectionId}`,{
            headers:{
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get('admin-token')}`,
            }
        })
        const data = await response.json();
        console.log(data)
        if(data.success){
            return dispatch(showNotification({ message: "Section Submit Successfully", type: "success" }));
        }
        return dispatch(showNotification({ message: "Failed to final submit section", type: "error" }));

    } catch (error) {
        return dispatch(showNotification({ message: "Failed to final submit section", type: "error" }));
    }
    finally {
        setIsLoading(false);
    }
}   



export const getSectionItemListApi = async (sectionId: string, dispatch: AppDispatch, setIsLoading: (isLoading: boolean) => void) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${db}/admin/get-section-item/${sectionId}`,{
        headers:{
            "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get('admin-token')}`,
        }
      })
      const sectionItems = await res.json()
      if(!res.ok){
          dispatch(showNotification({message:"No section item found",type:"error"}))
          return []
      }
      if(sectionItems.sectionItem.length > 0){
          return sectionItems
      }else{
          
          return []
      }
  
  
    } catch (err) {
      return dispatch(showNotification({message:"Failed to get section item list",type:"error"}))
    }
    finally{
      setIsLoading(false)
    }
  }