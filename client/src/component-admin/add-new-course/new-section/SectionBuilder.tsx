import TextInput from '@/ui/TextInput';
import React, { useState } from 'react'
import { createSectionApi } from '@/api/admin/upload-course/ManageSections';
import { showNotification } from '@/store/slices/common/notification-slice';
import { useDispatch } from 'react-redux';
import Loading from '@/ui/Loading';
import Button from '@/ui/Button';

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
    <div className="flex flex-col gap-5 p-1">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          New section
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add a title and short description for this section.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <TextInput
          label="Title"
          title="title"
          state={[title, setTitle]}
          value={title}
          placeholder="Section title"
          required
        />
        <TextInput
          label="Description (50 characters minimum)"
          title="Description"
          state={[description, setDescription]}
          required
          placeholder="Describe what this section covers"
          textarea={true}
        />
      </div>
      <div className="mt-2 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={sectionDetailHandler}>
          Save section
        </Button>
      </div>
    </div>
  )
}

export default SectionBuilder