import { Hono } from "hono"
import { adminSignUp ,adminLoggedIn } from "../../controller/admin/admin.controller";


const adminAuth = new Hono()


adminAuth.post("/create-user", adminSignUp);
adminAuth.post("/login", adminLoggedIn);

export default adminAuth