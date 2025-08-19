import z, { success } from "zod";
import { showCartItems ,addToCart,deleteCartItem } from "../../queries/user/cart.queries";
import { Context } from "hono";


const indexSchema = z.object({
    userId:z.string().nonempty(),
    courseId:z.string().nonempty()
})


export const addToCartHandler = async(c:Context)=>{
    try {
        const body = await c.req.json()
        const {userId,courseId} = indexSchema.parse(body)

        const cart = await addToCart (userId,courseId)
       if(cart.success){
          return c.json({message:cart.message,success:true},200)
        }
        

        return c.json({message:'failed to add course',success:false},400)


    } catch (error) {
        return c.json({message:'failed to add course',success:false},400)
    }
}

export const showCartItemsHandler = async (c: Context) => {
    const { userId } = c.req.param();
  
    try {
      const items = await showCartItems(userId);
      if(items.success){
        
        return c.json({message:'fetched item successfully',items:items.data,success:true})
      }
      return c.json({message:'failed to fetched item ',success:false})

    } catch (error) {
     
      return c.json({ success: false, message: "Internal server error" }, 500);
    }
  };
  
  // DELETE /cart/:cartItemId
  export const deleteItemHandler = async (c: Context) => {
    const { cartItemId } = c.req.param();
  
    try {
      const result = await deleteCartItem(cartItemId);
      if(result.success){
        return c.json({message:'Remove item succesffuly',success:true},200)
      }
      return c.json({message:"failed to delete item",success:false},200)
  
    } catch (error) {
    
      return c.json({ success: false, message: "Internal server error" }, 500);
    }
  };