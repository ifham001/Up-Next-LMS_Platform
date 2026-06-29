"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getSectionApi } from '@/api/admin/upload-course/ManageSections';
import { ArrowLeft, RotateCw } from "lucide-react";
import Loading from '@/ui/Loading';
import Button from '@/ui/Button';
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
   <div className="min-h-screen px-4 py-6">
    <header className="mb-6 flex items-center gap-4 border-b border-border pb-5 animate-fadeInUp">
        <button
          onClick={onReturnHandler}
          aria-label="Go back"
          className="flex items-center justify-center rounded-md border border-border bg-surface p-2.5 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Course <span className="text-accent">builder</span>
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create sections and preview your course content.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={getSectionHandler} className="ml-auto">
          <RotateCw size={15} strokeWidth={1.75} /> Reload data
        </Button>
      </header>

   <div className="flex flex-col gap-4 lg:flex-row">

   <AddContentMenu courseId={courseId} sectionId={currentWorkingSectionId || ''} />

   <div className="h-[calc(100vh-160px)] flex-1 overflow-y-auto">
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

      </div>
  )
}

export default ManageSection