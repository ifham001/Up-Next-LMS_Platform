import { Context } from "hono";
import { makePurchase } from "../../queries/user/checkout.queries";
import z from "zod";





export const purchaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userId: z.string().uuid("Invalid userId"),
  address: z.string().min(5, "Address too short"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.number().min(1, "zip code required"),
  pricePaid: z.number().nonnegative("pricePaid must be >= 0"),
  payment_mode: z.enum(["Card", "UPI"]),
  purchased_courses: z.array(z.string().min(1, "At least one course must be purchased")),
});

export const makePurchaseHandler = async (c: Context) => {
  try {
    const body = await c.req.json();

    const data = await purchaseSchema.parse(body);

    const result = await makePurchase(data);
    
    if (!result.success) {
      return c.json({ message: "Failed to purchase course", success: false }, 401);
    }
 

    return c.json({
      orderId:result.orderId,
      success: true,
      message: "Course purchased successfully",
   
    });
  } catch (error) {

    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};
