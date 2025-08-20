import { dbDrizzle } from "../../config/pg.db";
import { eq } from "drizzle-orm";
import {user} from '../../schema/auth'
import bcrypt from "bcryptjs";

export interface User {
    name: string;
    email: string;
    password: string;
    auth_type: 'google' | 'email';
}

export const createUser = async (userData: User) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
      const userCreated = await dbDrizzle
        .insert(user)
        .values({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          auth_type: userData.auth_type,
        })
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
          auth_type: user.auth_type,
        });
  
      return userCreated[0];
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error("Email already exists");
      }
      throw error;
    }
  };
  export const userLogin = async (email: string, password: string) => {
    try{
        const getUser = await dbDrizzle.select().from(user).where(eq(user.email, email));
     
        if(!getUser[0].id){
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, getUser[0].password ?? '');
        if(!isPasswordValid){
            return ;
        }
        return getUser[0];
    }catch(error: any){
        throw new Error(error.message);
    }
  }; 
  
  
