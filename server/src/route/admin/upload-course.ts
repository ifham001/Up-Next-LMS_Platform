import { Hono } from "hono";
// import { getSectionItemList,todeleteSection,getDraftedCourse,addNewCourse , addNewCourseSection , addNewVideo , addNewQuiz , addNewResource, getDraftedCourseSection, sectionFinalized, courseFinalized } from "../../controller/admin/upload-course";
import { addNewCourse , getDraftCourses , finalizeCourse, toDeleteCourse } from "../../controller/admin/course.controller";
import {addNewSection , getDraftSections , getSectionItemList ,onDeleteSection , sectionFinalized  } from "../../controller/admin/section.controller";
import { addNewVideo ,getSignedUrlToUploadVideo } from "../../controller/admin/video.controller";
import { uploadResources } from "../../controller/admin/resource.controller";
import { addNewQuiz } from "../../controller/admin/quiz.controller";
import { authMiddleware } from "../../util/authMiddleware";





const uploadCourse = new Hono();

uploadCourse.post("/add-course",authMiddleware,addNewCourse)
uploadCourse.post("/add-section",authMiddleware,addNewSection)
uploadCourse.post("/upload-video/:sectionId",authMiddleware,addNewVideo)
uploadCourse.post("/create-quiz/:sectionId",authMiddleware,addNewQuiz)
uploadCourse.post("/add-resource/:sectionId",authMiddleware,uploadResources)
uploadCourse.get("/draft-course",authMiddleware,getDraftCourses)
uploadCourse.get("/draft-section/:courseId",authMiddleware,getDraftSections)
uploadCourse.delete("/delete-section/:sectionId",authMiddleware,onDeleteSection)
uploadCourse.get("/get-section-item/:sectionId",authMiddleware,getSectionItemList)
uploadCourse.get("/section-finalized/:sectionId",authMiddleware,sectionFinalized)
uploadCourse.get("/course-finalized/:courseId",authMiddleware,finalizeCourse)
uploadCourse.delete("/delete-course/:courseId",authMiddleware,toDeleteCourse)
uploadCourse.get('/signed-url-from-gcs',getSignedUrlToUploadVideo)

export default uploadCourse;