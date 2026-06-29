import React, { useState } from 'react'
import TextInput from '@/ui/TextInput'
import Button from '@/ui/Button';
import Loading from '@/ui/Loading';
import { useDispatch } from 'react-redux';
import { showNotification } from '@/store/slices/common/notification-slice';
import { addResourcesApi } from '@/api/admin/upload-course/AddResource';





 interface Props {
  sectionId: string;
  onClose: () => void;
}

function ResourceEditor({sectionId, onClose}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      dispatch(showNotification({ message: "Title and description are required", type: "error" }));
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
     

        <div className="space-y-5 p-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">
              Add resource
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Attach a PDF or supporting material for this section.
            </p>
          </div>

          <TextInput
            label="Resource title"
            placeholder="Resource name"
            state={[title, setTitle]}
            required
          />

          {/* Bigger multiline input for description */}
          <div>
            <TextInput
              value={description}
              label='Resource description'
              state={[description,setDescription]}
              placeholder="Describe this resource"
              className="min-h-[100px] w-full resize-y"
              required
              textarea={true}
            />
          </div>

          {/* PDF upload */}
          <div className="rounded-lg border border-border bg-surface-muted p-4">
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Attach PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="block w-full rounded-lg border border-dashed border-border-strong bg-surface p-3 text-sm text-text-secondary transition-colors hover:border-border-strong file:mr-4 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-inverted hover:file:bg-brand-light"
            />
            {pdf && <p className="mt-1.5 text-xs text-text-muted">Selected: {pdf.name}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save resource
            </Button>
          </div>
        </div>

    </>
  );
}

export default ResourceEditor;
