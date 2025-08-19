import { Context } from "hono";
import { createUser, userLogin } from "../../queries/user/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const createUserSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email().min(10).max(50),  
    password: z.string().min(8).max(50),
    auth_type: z.enum(['google', 'email']).default('email'),
});
const loginUserSchema = z.object({
    email: z.string().email().min(10).max(50),  
    password: z.string().min(8).max(50),
});

export const createUserController = async (c: Context) => {
    const userData = await c.req.json();
    const { name, email, password, auth_type } = createUserSchema.parse(userData);
    const user = await createUser({ name, email, password, auth_type });
    return c.json({ message: "User created successfully", user:user, success:true });
};
export const userLoggedIn = async (c: Context) => {
    const userData = await c.req.json();
    const { email, password } = loginUserSchema.parse(userData);
     const user = await userLogin(email, password);
     if(!user?.id){
        return c.json({ message: "Invalid password" }, 401);
     }else{
        const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '1h' });
        return c.json({ message: "User login successfully", user:user, token: token ,success:true});
     }

};
