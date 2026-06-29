import { Hono } from "hono"
import {
  fetchAllCourse,
  getCourseById,
  searchAllCourses,
  searchCoursesSchema,
} from "../../controller/user/course.controller"
import { validateQuery } from "../../util/validate"

const userCourses = new Hono()

userCourses.get('/get-all-courses', fetchAllCourse)
userCourses.get('/search-courses', validateQuery(searchCoursesSchema), searchAllCourses)
userCourses.get('/get-course/:courseId', getCourseById)

export default userCourses
