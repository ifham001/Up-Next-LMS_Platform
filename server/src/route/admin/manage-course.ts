import { Hono } from "hono";
import {updatedCoursePrice,makeCourseArchived , courseLifeTimeDetails} from '../../controller/admin/course.controller'
import { authMiddleware } from "../../util/authMiddleware";
const managecourse  = new Hono()


managecourse.post('/update-course-price/:courseId',authMiddleware,updatedCoursePrice)
managecourse.get('/archieve-course/:courseId',authMiddleware,makeCourseArchived)
managecourse.get('/course-life-time-details',authMiddleware,courseLifeTimeDetails)








export default managecourse