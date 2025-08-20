import { Hono } from "hono"
import { fetchAllCourse ,getCourseById} from "../../controller/user/course.controller"


const userCourses = new Hono()



userCourses.get('/get-all-courses',fetchAllCourse)
userCourses.get('/get-course/:courseId',getCourseById)





export default userCourses