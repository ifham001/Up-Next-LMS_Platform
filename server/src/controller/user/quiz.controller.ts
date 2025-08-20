import { Context } from "hono";
import { getQuizBySection } from "../../queries/user/quiz.queries";

export const quizController =async(c:Context)=> {
  // Get quiz by section ID
  
    try {
      // Get sectionId from route params
      const  quizId  = c.req.param("quizId"); 
      
      if (!quizId) {
        return c.json({ success: false, message: "quizId is required" }, 400);
      }

      const quizData = await getQuizBySection(quizId);

      if (!quizData.success) {
        return c.json({ success: false, message: quizData.message }, 404);
      }

      return c.json({ success: true, data: quizData.data }, 200);
    } catch (error) {
      console.error("Quiz controller error:", error);
      return c.json({ success: false, message: "Internal server error" }, 500);
    }

};
