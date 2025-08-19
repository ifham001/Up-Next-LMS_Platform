import TextInput from '@/ui/TextInput';
import React, { useState } from 'react'
import Button from '@/ui/Button';
import { createSectionApi } from '@/api/admin/upload-course/ManageSections';
import { showNotification } from '@/store/slices/common/notification-slice';
import { useDispatch } from 'react-redux';
import Loading from '@/ui/Loading';

type Props = {
    onClose: () => void;
    courseId: string;
}

function SectionBuilder({onClose,courseId}: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);


    const sectionDetailHandler = async () => {
        
        if(title.length < 3 || title.length > 30){
            return dispatch(showNotification({message:"Title should be less then 20 character and greater then 3",type:"error"}))
          }
          if(description.length < 50 || description.length >300){
            return dispatch(showNotification({message:"Description should be less then 300 character and greater then 50",type:"error"}))
          }
           await  createSectionApi({title,description,courseId},dispatch,setIsLoading)
          
            onClose()
         
          setTitle("");
          setDescription("");
    }   
    if(isLoading){
        return <Loading/>
      }
  return (
    <>
    <h1 className="text-xl  text-center">Fill Section Details</h1> 
    <div className="flex flex-col">
     <TextInput 
     label="Title"
     title="title"
     state={[title,setTitle]}
     value={title}
     placeholder={"add title..."}
     required
     />
     <TextInput
     
     label="Description (50 character atleast)"
     title="Decription"
     state={[description,setDescription]}
     required
     placeholder="add description..."
     textarea={true}/>
     <div className="flex justify-around mt-5">
      <Button onClick={onClose} className="bg-red-600">
       cancel
      </Button>
      <Button onClick={sectionDetailHandler} className="bg-green-700">
       Submit
      </Button>

     </div>
  

    </div>
    
    </>
    
  )
}

export default SectionBuilder