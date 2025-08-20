// queries/users.ts
import { dbDrizzle } from "../../config/pg.db";
import { user, userCourses, course } from "../../schema";
import { eq } from "drizzle-orm";

export async function getAllUsersWithCourses() {
  // 1. Get all users
  const users = await dbDrizzle.select().from(user);

  // 2. For each user, fetch their courses
  const userDetails = await Promise.all(
    users.map(async (u) => {
      const purchasedCourses = await dbDrizzle
        .select({
          id: course.id,
          title: course.title,
          price: course.price,
        })
        .from(userCourses)
        .leftJoin(course, eq(userCourses.courseId, course.id))
        .where(eq(userCourses.userId, u.id));

      const lifetimeSpend = purchasedCourses.reduce(
        (sum, c) => sum + (c.price ?? 0),
        0
      );

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        coursesPurchased: purchasedCourses.length,
        lifetimeSpend,
        courses: purchasedCourses.map((c) => c.title),
      };
    })
  );

  return {success:true,userDetails:userDetails};
}
