import { Context } from "hono";
import z from "zod";
import { createQuiz } from "../../queries/admin/quiz.queries";




const createQuizSchema = z.object({

    title: z.string().min(1),
    description: z.string().min(1),
    questions: z.array(
      z.object({
        question: z.string(),
        options: z.array(
          z.object({
            option: z.string(),
            is_correct: z.boolean(),
          })
        ),
      })
    ),
  }).strip();


export const addNewQuiz = async (c: Context) => {
    const sectionId = c.req.param("sectionId");
  const body = await c.req.json();
    const { title, description, questions } = createQuizSchema.parse(body);
try {
    const quiz = await createQuiz({ title, description, section_id: sectionId, questions });
    if(quiz.id){
        return c.json({message:'Quiz add successfully',success:true})
    }
    return c.json({message:'Quiz add successfully',success:false})

} catch (error) {
    return c.json({message:'Quiz add successfully',success:false})
}

};