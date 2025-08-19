import { Hono } from "hono";
import { getUserCourses ,getCourseContent,getItemContent} from "../../controller/user/learning.controller";
import { authMiddleware } from '../../util/authMiddleware'
const userLearning = new Hono()


userLearning.get('/user-courses/:userId',authMiddleware,getUserCourses)
userLearning.post('/course-content',authMiddleware,getCourseContent)
userLearning.get('/course-content/:itemId',authMiddleware,getItemContent)





export default userLearning