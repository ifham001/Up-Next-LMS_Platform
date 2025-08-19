import { Context } from "hono";
import { getAllUsersWithCourses } from "../../queries/admin/user.queries";

export const getAllUserDetail =async (c:Context)=>{
    try {
        const detail = await getAllUsersWithCourses()
        if(detail.success){
            return c.json(detail,200)
        }
        return c.json({message:' error something went wrong'},500)

    } catch (error) {
        return c.json({message:'internal error something went wrong'},401)
    }
}