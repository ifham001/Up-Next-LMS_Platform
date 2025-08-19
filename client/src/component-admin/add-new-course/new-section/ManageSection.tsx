"use client"
import React, { useEffect, useState } from 'react'
import Button from '@/ui/Button';
import { useDispatch } from 'react-redux';
import { getSectionApi } from '@/api/admin/upload-course/ManageSections';
import { ArrowLeft } from "lucide-react";
import Loading from '@/ui/Loading';
import AddContentMenu from './AddContentMenu';
import SectionContentList from './SectionContentList';



type Props = {
  courseId: string;
}


interface SectionItem {
  id: string;
  title: string;
  description: string;
  section_number: number;
  section_status: 'in_progress' | 'completed';
 
}


function ManageSection({courseId}: Props) {
    const [sections, setSections] = useState<SectionItem[]>([]);
    const [PopUp,setPopUp] = useState(false)
    const [isLoading,setIsLoading]= useState(false)
    const dispatch = useDispatch()


      
       if(isLoading){
        return <Loading/>
      }
      const getSectionHandler =async ()=>{
        const data = await getSectionApi(courseId,setIsLoading,dispatch)
        setSections(data)

      }
      const onReturnHandler =()=>{
        localStorage.removeItem(`sectionId`)
        window.history.back()
      }
      const currentWorkingSectionId = sections.find((section)=>section.section_status === 'in_progress')?.id;
  return (
   <> 
    <header className="flex items-center gap-3 p-4 bg-white shadow-sm mb-6">
        <button
          onClick={onReturnHandler}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Create New Section & Preview</h1>
      </header>


   <div className='flex justify-end'>
   <Button onClick={getSectionHandler} className='text-end mr-10 text-sm'>Reload Data</Button>
   </div>
   <div className='flex gap-4'>

   <AddContentMenu courseId={courseId} sectionId={currentWorkingSectionId || ''} />
   
   <div className="h-[calc(100vh-100px)] overflow-y-auto p-4">
    <div className="flex flex-wrap gap-4"> 
    {sections.map((section, index) => (
      <SectionContentList
        sectionId={section.id}
        sectionStatus={section.section_status}
        key={index}
        title={section.title}
        sectionNumber={section.section_number}
      />
    ))}

          </div>
          </div>


     </div>

      </>
  )
}

export default ManageSection