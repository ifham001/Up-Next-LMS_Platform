"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import CourseForm from "./CourseForm";
import Loading from "@/ui/Loading";
import { createCourseApi } from "@/api/admin/upload-course/ManageCourse";
import { showNotification } from "@/store/slices/common/notification-slice";


export default function AddNewCourse() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [courseTitle, setCourseTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [requirements, setRequirements] = useState<string[]>(Array(6).fill(""));
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDomain, setCourseDomain] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>("");
  const [benefits, setBenefits] = useState<string[]>(Array(6).fill(""));
  const [introductoryVideo, setIntroductoryVideo] =useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const [introductionVideoDuration , setIntroductionVideoDuration]= useState<number | null>(null);

  const handleSubmit = async () => {
    const course = {
      title: courseTitle,
      description: courseDescription,
      price: Number(coursePrice),
      thumbnail,
      domain: courseDomain,
      tagline,
      requirements,
      benefits,
      introductoryVideo,
      duration:introductionVideoDuration!
    };
    if(!introductoryVideo && !thumbnail) {
      dispatch(showNotification({
        message: 'Please upload an introduction video or thumbnail ',
        type: 'error'
      }));
      return;
    }
    if(courseTitle.trim() === "" || courseDescription.trim() === "" || coursePrice.trim() === "" || courseDomain.trim() === "" || tagline.trim() === "" || requirements.some(requirement => requirement.trim() === "") || benefits.some(benefit => benefit.trim() === "")) {
      dispatch(showNotification({
        message: 'Please fill all the fields',
        type: 'error'
      }));
      return;
    }
 

    const courseId = await createCourseApi(course, dispatch, setIsLoading);
    if (courseId) {
      return router.push(`/admin/add-new-course/${courseId}`);
    } 
    
  }

  
  if (isLoading) return <Loading />;

  return (
   
      <CourseForm
      setIntroductionVideoDuration={setIntroductionVideoDuration}
        introductionVideoDuration={introductionVideoDuration}
        courseTitle={courseTitle}
        setCourseTitle={setCourseTitle}
        tagLine={tagline}
        setTagLine={setTagline}
        requirements={requirements}
        setRequirements={setRequirements}
        courseDescription={courseDescription}
        setCourseDescription={setCourseDescription}
        coursePrice={coursePrice}
        setCoursePrice={setCoursePrice}
        courseDomain={courseDomain}
        setCourseDomain={setCourseDomain}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        benefits={benefits}
        setBenefits={setBenefits}
        introductionVideo={introductoryVideo}
        setIntroductionVideo={setIntroductoryVideo}
        onSubmit={handleSubmit}
      />
    
  
  );
}
