import { Context } from "hono";

import { z } from "zod";


import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createAdmin ,adminLogin } from "../../queries/admin/auth.queries";

dotenv.config();


const createUserSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email().min(10).max(50),  
    password: z.string().min(8).max(50),
   
});
const loginUserSchema = z.object({
    email: z.string().email().min(10).max(50),  
    password: z.string().min(8).max(50),
});

export const adminSignUp = async (c: Context) => {
    const userData = await c.req.json();
    const { name, email, password,} = createUserSchema.parse(userData);
    const user = await createAdmin({ name, email, password });
    return c.json({ message: "User created successfully", admin:user });
};
export const adminLoggedIn = async (c: Context) => {
    const userData = await c.req.json();
    const { email, password } = loginUserSchema.parse(userData);
     const user = await adminLogin(email, password);
     if(!user?.id){
        return c.json({ message: "Invalid password",success:true }, 401);
     }else{
        const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '1h' });
        return c.json({ message: "User login successfully", token: token , success:true });
     }

};
