import { Context } from "hono";
import { dashboardData } from "../../queries/admin/dashboard.queries";



export const adminDashboard =async  (c:Context)=>{
try {
    const getData = await dashboardData()
    if(!getData){
        return c.json({message:'failed to fetch dashboard data'},500)

    }
    return c.json(getData,200)
} catch (error) {
    return c.json({message:'internal server error try again'},401)
}
}