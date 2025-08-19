import { Hono } from "hono";
import { makePurchaseHandler } from "../../controller/user/checkout.controller";
import { authMiddleware } from '../../util/authMiddleware'
const checkout = new Hono()


checkout.post('/purchase-items',authMiddleware,makePurchaseHandler)





export default checkout