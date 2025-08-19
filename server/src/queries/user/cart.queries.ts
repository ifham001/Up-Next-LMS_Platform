import { eq ,and } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { course } from "../../schema/admin/course";
import { cartItems } from "../../schema/user/cart";
import { userCourses } from "../../schema/user/userCourses";


export const addToCart = async (userId: string, courseId: string) => {
  try {
    const alreadyBoughtCourse = await dbDrizzle.select()
    .from(userCourses)
    .where(
      and(
        eq(userCourses.userId,userId),
        eq(userCourses.courseId,courseId)
      )
    )
    if (alreadyBoughtCourse.length > 0) {
      return {
        success: true,
        message: "You already own this course",
      
      };
    }
    // First check if course already exists in user's cart
    const existing = await dbDrizzle
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.courseId, courseId)
        )
      );

    if (existing.length > 0) {
      return {
        success: true,
        message: "Course cannot be added to cart more than once",
      
      };
    }


    const cart = await dbDrizzle
      .insert(cartItems)
      .values({ courseId, userId })
      .returning();

    return {
      success: true,
      message: "Course added to cart successfully",
      data: cart[0],
     
    };
  } catch (error) {
    return { success: false, message: "Failed to add course to cart",};
  }
};



export const showCartItems = async (userId: string) => {
  try {
    const getCartItems = await dbDrizzle
      .select({
        id: cartItems.id,
        courseId: course.id,
        title: course.title,
        price: course.price,
        tagline: course.tagline,
        addedAt: cartItems.addedAt,
        url: course.thumbnail
      })
      .from(cartItems)
      .innerJoin(course, eq(cartItems.courseId, course.id))
      .where(eq(cartItems.userId, userId));

    return { success: true, message: "Cart items fetched", data: getCartItems };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch cart items" };
  }
};


export const deleteCartItem = async (cartItemId: string) => {
  try {
    const deleted = await dbDrizzle
      .delete(cartItems)
      .where(eq(cartItems.id, cartItemId))
      .returning();

      console.log(deleted)
    if (deleted.length === 0) {
      return { success: false, message: "Cart item not found" };
    }

    return { success: true, message: "Cart item deleted", data: deleted[0] };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete cart item" };
  }
};
