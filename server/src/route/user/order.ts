import { Hono } from "hono";
import { orderConfirm } from "../../controller/user/order.controller";
import { authMiddleware } from '../../util/authMiddleware'

 const userOrder = new Hono()

userOrder.post('/order-confirmation',authMiddleware,orderConfirm)







 export default userOrder