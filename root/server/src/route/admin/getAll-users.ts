import { Hono } from "hono";
import { getAllUserDetail } from "../../controller/admin/users.contoller";
import { authMiddleware } from "../../util/authMiddleware";




const getAllUsers = new Hono()

getAllUsers.get('/all-users',authMiddleware,getAllUserDetail)





export default getAllUsers;