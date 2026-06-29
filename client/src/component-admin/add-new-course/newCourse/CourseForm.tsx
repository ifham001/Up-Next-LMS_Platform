"use client";
import React, { Dispatch, SetStateAction } from "react";
import TextInput from "@/ui/TextInput";
import { ArrowRight } from "lucide-react";
import Button from "@/ui/Button";
import QuestionWithOptions from "@/ui/QuestionWithOptions";
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
    <div className="flex-1 animate-fadeInUp">
      <div className="mb-8">
        <span className="eyebrow mb-4">Create</span>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          New <span className="text-accent">course</span>
        </h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-text-secondary">
          Fill in the details below to create a new course.
        </p>
      </div>

      <div className="card flex flex-col gap-6 p-8">
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
          <p className="text-sm font-medium text-text-secondary">Add 6 benefits of this course</p>
          <InputGroup
            title="Benefits"
            count={6}
            onChange={setBenefits}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-muted p-4">
          <label className="text-sm font-medium text-text-secondary">Thumbnail</label>
          <UploadWithProgress thumbnail={true} onUploaded={uploadThumbnail}/>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-muted p-4">
          <label className="text-sm font-medium text-text-secondary">Introduction video</label>
          <UploadWithProgress video={true} onUploaded={uploadIntroductoryVideo}/>
        </div>

        <Button onClick={onSubmit} type="submit" fullWidth size="lg">
          Next <ArrowRight size={16} strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}
