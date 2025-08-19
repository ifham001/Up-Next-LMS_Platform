import React, { useState } from 'react'
import TextInput from '@/ui/TextInput'
import PopUpModal from '@/ui/PopUpModal'
import Button from '@/ui/Button'
import { BookOpen } from "lucide-react";
import Loading from '@/ui/Loading';
import { useDispatch } from 'react-redux';
import { addResourcesApi } from '@/api/admin/upload-course/AddResource';





 interface Props {
  sectionId: string;
  onClose: () => void;
}

function ResourceEditor({sectionId, onClose}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [isLoading,setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdf(e.target.files[0]||null);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required!");
      return;
    }
    const formData = new FormData()
     if(pdf){
        formData.append('resources',pdf)
     }
     formData.append('title',title)
     formData.append('description',description)
    
    
 await addResourcesApi(formData,dispatch,setIsLoading,sectionId)
   
    onClose()
 
  };
  if(isLoading){
    return <Loading/>
  }


  return (
    <>
     

        <div className="space-y-4 p-4">
          <TextInput
            label="Resource Title"
            placeholder="Enter resource name"
            state={[title, setTitle]}
            required
          />

          {/* Bigger multiline input for description */}
          <div>
            
            <TextInput
              value={description}
              label='Resource Description'
              state={[description,setDescription]}
              placeholder="Enter resource description"
              className="w-full p-2 border rounded min-h-[100px] resize-y"
              required
              textarea={true}
            />
          </div>

          {/* URL input */}
          {/* <TextInput
            label="Resource URL"
            placeholder="Enter resource link"
            state={[url, setUrl]}
          /> */}

          {/* PDF upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Attach PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {pdf && <p className="text-xs mt-1">Selected: {pdf.name}</p>}
          </div>
            <div className='flex justify-between'>
            <Button
            onClick={onClose}
            className="bg-red-600 text-white mt-4"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSubmit}
            className="bg-green-600 text-white mt-4"
          >
            Save Resource
          </Button>

            </div>
          
        </div>

    </>
  );
}

export default ResourceEditor;
