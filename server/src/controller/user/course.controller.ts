import { Context } from "hono";
import { getAllCourse, getCoursesWithCourseId} from "../../queries/user/course.queries";
import { dbDrizzle } from "../../config/pg.db";


export const getCourseById =async (c:Context)=>{
    try {
        const {courseId} = await c.req.param()
        const course = await getCoursesWithCourseId(courseId)
        if(course.length>0){
            return c.json({message:"course fetch successfully",course:course,success:true})
        }
        return c.json({message:"failed to fetch course",success:false})
    } catch (error) {
        return c.json({message:"failed to fetch course",success:false})

    }
}
export const fetchAllCourse = async(c:Context)=>{
    try {
        
     
        const course = await getAllCourse();
        if(course){
            return c.json({ message: 'course deleted successfullt', success: true , course }, 200);
            
        }
        return c.json({ message:'first delete all section to delete course', success: false}, 200);
    } catch (error) {
        return c.json({ message:'Course cannot be deleted try again!', success: false}, 200);

    }
}


