import { eq, gte, sql } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { userCourses } from "../../schema";
import { course } from "../../schema/admin/course";
import {user} from "../../schema/auth"
import {checkout}  from "../../schema/user/checkout"



export const dashboardData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // midnight start of today
  
      // get all courses
      const getCourses = await dbDrizzle.select().from(course);
  
      // get all users
      const getUsers = await dbDrizzle.select().from(user);
  
      // lifetime purchased (revenue)
      const lifetimePurchased = await dbDrizzle
        .select({ totalRevenue: sql<number>`SUM(${checkout.pricePaid})` })
        .from(checkout);
  
      // today’s purchased revenue
      const todayPurchased = await dbDrizzle
        .select({ todayRevenue: sql<number>`SUM(${checkout.pricePaid})` })
        .from(checkout)
        .where(gte(checkout.purchasedAt, today));
  
      // today’s new users
      const todayNewUsers = await dbDrizzle
        .select({ newUsers: sql<number>`COUNT(*)` })
        .from(user)
        .where(gte(user.createdAt, today));
  
      return {
        success:true,
      
        totalCourses: getCourses.length,
        totalUsers: getUsers.length,
        lifetimeRevenue: lifetimePurchased[0]?.totalRevenue ?? 0,
        todayRevenue: todayPurchased[0]?.todayRevenue ?? 0,
        todayNewUsers: todayNewUsers[0]?.newUsers ?? 0,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  };
  