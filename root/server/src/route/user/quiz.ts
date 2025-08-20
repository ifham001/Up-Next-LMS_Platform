import { Hono } from "hono";
import { quizController } from "../../controller/user/quiz.controller";
import { authMiddleware } from '../../util/authMiddleware'

const quiz = new Hono()

quiz.get('/get-quiz/:quizId',authMiddleware,quizController)






export default quiz