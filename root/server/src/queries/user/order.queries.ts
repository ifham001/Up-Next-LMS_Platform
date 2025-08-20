import { dbDrizzle } from "../../config/pg.db";
import { checkout } from "../../schema/user/checkout";
import { userCourses } from "../../schema/user/userCourses";
import { course } from "../../schema/admin/course";
import { cartItems } from "../../schema/user/cart";
import { eq, inArray } from "drizzle-orm";

export const orderConfirmation = async (userId: string, orderId: string) => {
  try {
    return await dbDrizzle.transaction(async (tx) => {
      // 1️⃣ Get checkout record
      const checkoutData = await tx
        .select()
        .from(checkout)
        .where(eq(checkout.id, orderId));

      if (checkoutData.length === 0) {
        return { message: "Order Id not found", success: false };
      }

      // 2️⃣ Get all cart items for user
      const userCartItems = await tx
        .select({ courseId: cartItems.courseId })
        .from(cartItems)
        .where(eq(cartItems.userId, userId));

      if (userCartItems.length === 0) {
        return { message: "No items in cart to purchase.", success: false };
      }

      // Extract course IDs
      const courseIds = userCartItems.map((item) => item.courseId);

      // 3️⃣ Fetch course details
      const courseDetails = await tx
        .select({
          title: course.title,
          price: course.price,
        })
        .from(course)
        .where(inArray(course.id, courseIds));

      // 4️⃣ Delete cart items after purchase
      await tx.delete(cartItems).where(eq(cartItems.userId, userId));

      // 5️⃣ Calculate total price
      const totalPrice = courseDetails.reduce((sum, c) => sum + Number(c.price), 0);

      // 6️⃣ Return order confirmation
      return {
        message: "Order confirmation details",
        success: true,
        order: {
         orderId:checkoutData[0].id,
          name: checkoutData[0].name,
          city:checkoutData[0].city,
          zip_code:checkoutData[0].zip_code,
          address: checkoutData[0].address,
          state:checkoutData[0].state,
          items: courseDetails,
          total: totalPrice,
          date:checkoutData[0].purchasedAt
        },
      };
    });
  } catch (error) {
    
    return { message: "Error processing order", success: false };
  }
};
