"use client";
import React, { Dispatch, SetStateAction } from "react";
import TextInput from "@/ui/TextInput";
import Button from "@/ui/Button";
import QuestionWithOptions from "@/ui/QuestionWithOptions";
import VideoUploader from "@/ui/VideoUploader";
import InputGroup from "@/ui/InputGroup";
import UploadWithProgress from "@/ui/UploadFileWithProgress";


type Props = {
  courseTitle: string;
  setCourseTitle: Dispatch<SetStateAction<string>>;
  tagLine: string;
  setTagLine: Dispatch<SetStateAction<string>>;
  requirements: string[];
  setRequirements: Dispatch<SetStateAction<string[]>>;
  courseDescription: string;
  setCourseDescription: Dispatch<SetStateAction<string>>;
  coursePrice: string;
  setCoursePrice: Dispatch<SetStateAction<string>>;
  courseDomain: string;
  setCourseDomain: Dispatch<SetStateAction<string>>;
  thumbnail: string | null;
  setThumbnail: Dispatch<SetStateAction<string | null>>;
  introductionVideo: string | null;
  setIntroductionVideo: Dispatch<SetStateAction<string | null>>;
  benefits: string[];
  setBenefits: Dispatch<SetStateAction<string[]>>;
  onSubmit: () => void;
  setIntroductionVideoDuration:Dispatch<SetStateAction<number | null>>;
  introductionVideoDuration:number|null;
};

export default function CourseForm({
  courseTitle,
  setCourseTitle,
  tagLine,
  setTagLine,
  requirements,
  setRequirements,
  courseDescription,
  setCourseDescription,
  coursePrice,
  setCoursePrice,
  courseDomain,
  setCourseDomain,
  thumbnail,
  setThumbnail,
  introductionVideo,
  setIntroductionVideo,
  setIntroductionVideoDuration,
  introductionVideoDuration,
  benefits,
  setBenefits,
  onSubmit,
}: Props) {
  const uploadThumbnail = (publicUrl:string) => {
    setThumbnail(publicUrl)
  };

  const uploadIntroductoryVideo = (publicUrl:string,duration:number) => {
    setIntroductionVideo(publicUrl)
    if(duration===0){
    return 
    }
    setIntroductionVideoDuration(duration)
  };


  return (
    <div className="flex-1 flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-4">Upload New Course</h1>

      <TextInput label="Course Title" state={[courseTitle, setCourseTitle]} placeholder="Enter course title" required />
      <TextInput label="Tag Line" state={[tagLine, setTagLine]} placeholder="Enter tag line" required />
        <InputGroup
          title="Requirements"
          count={4}
          onChange={setRequirements}
         
        />

      <QuestionWithOptions
        question="What is the domain of the course?"
        options={[
          { label: "Information Technology", value: "Information Technology" },
          { label: "Marketing", value: "Marketing" },
          { label: "Language", value: "Language" },
          { label: "Business", value: "Business" },
          { label: "Management", value: "Management" },
          { label: "Other", value: "Other" },
        ]}
        selectedValue={courseDomain}    
        name="domain"
        onChange={(val: string) => setCourseDomain(val)}
      />

      <TextInput
        label="Course Description (300 characters)"
        state={[courseDescription, setCourseDescription]}
        placeholder="Enter course description"
        textarea
        required
      />

      <TextInput label="Course Price" state={[coursePrice, setCoursePrice]} type="number" placeholder="Enter course price" required />

      <div className="grid grid-cols-1 gap-4">
        <p className="font-semibold">Add 6 Benefits of this Course</p>
        <InputGroup
          title="Benefits"
          count={6}
          onChange={setBenefits}
         
        />
       
      </div>
      <label>Upload Thumbnail</label>

      <UploadWithProgress thumbnail={true} onUploaded={uploadThumbnail}/>

      <label>Upload Introduction Video</label>

      <UploadWithProgress video={true} onUploaded={uploadIntroductoryVideo}/>

    

      <Button onClick={onSubmit} type="submit" className="w-full">Next</Button>
    </div>
  );
}
