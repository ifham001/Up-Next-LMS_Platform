import { Hono } from "hono";
import { adminDashboard } from "../../controller/admin/dashboard";
import { authMiddleware } from "../../util/authMiddleware";


const dashboard = new Hono()

dashboard.get('/dashboard',authMiddleware,adminDashboard)








export default dashboard