import { Hono } from "hono";
import { createUserController, userLoggedIn } from "../../controller/user/user-auth";

const authRoutes = new Hono();

authRoutes.post("/create-user", createUserController);
authRoutes.post("/login", userLoggedIn);

export default authRoutes;      