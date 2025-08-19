import { dbDrizzle } from "../../config/pg.db";
import { eq } from "drizzle-orm";
import {admin} from '../../schema/auth'
import bcrypt from "bcryptjs";

export interface Admin {
    name: string;
    email: string;
    password: string;

}

export const createAdmin = async (adminData: Admin) => {
    try {
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const adminCreated = await dbDrizzle
        .insert(admin)
        .values({
          name: adminData.name,
          email: adminData.email,
          password: hashedPassword,
         
        })
        .returning({
          id: admin.id,
          name: admin.name,
          email: admin.email,
          
        });
  
      return adminCreated[0];
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error("Email already exists");
      }
      throw error;
    }
  };
  export const adminLogin = async (email: string, password: string) => {
    try{
        const getAdmin = await dbDrizzle.select().from(admin).where(eq(admin.email, email));
     
        if(!getAdmin[0].id){
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, getAdmin[0].password ?? '');
        if(!isPasswordValid){
            return ;
        }
        return getAdmin[0];
    }catch(error: any){
        throw new Error(error.message);
    }
  }; 
  
  
