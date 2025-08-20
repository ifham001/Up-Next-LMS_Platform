import { Hono } from 'hono'
import {addToCartHandler,deleteItemHandler,showCartItemsHandler} from '../../controller/user/cart.controller'
import { authMiddleware } from '../../util/authMiddleware'

const cart = new Hono()

cart.post('/add-to-cart',authMiddleware,addToCartHandler)
cart.get('/get-cart-item/:userId',authMiddleware,showCartItemsHandler)
cart.delete('/delete-cart-item/:cartItemId',authMiddleware,deleteItemHandler)


export default cart