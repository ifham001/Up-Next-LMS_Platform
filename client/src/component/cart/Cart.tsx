// Cart.tsx
"use client"
import React,{useEffect, useState} from "react";
import {DeleteIcon} from 'lucide-react'
import Button from "@/ui/Button";
import { deleteItemApi, showCartItemApi } from "@/api/user/cart/cart";
import { useSelector , useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { showNotification } from "@/store/slices/common/notification-slice";
import Loading from "@/ui/Loading";
import Image from "next/image";
import { deleteItemToCart, setCart } from "@/store/slices/user/addToCart-slice";
import ClientOnly from "@/util/CilentOnly";
import { useRouter } from "next/navigation";






export default function Cart() {
  
  const userId = useSelector((state:RootState)=>state.userAuth.userId)
  const cartItems = useSelector((state:RootState)=>state.addToCart.items)
  const [isLoading,setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(()=>{
    const getItems = async()=>{
      const items = await showCartItemApi(userId,dispatch,setIsLoading)
      
      if(items.length>0){
        return dispatch(setCart(items))
      }
    }
    getItems()
    
  },[])

  
  const subtotal = cartItems!.reduce((acc, item) => acc + item.price, 0);

  
  const removeItemHandler = async (cartItemId:string)=>{
    
  const itemDeleted =  await deleteItemApi(cartItemId,dispatch,setIsLoading)
 
  if(itemDeleted){
 
    dispatch(deleteItemToCart({id:cartItemId}))
  }
   
  }
  if(isLoading){
    return <Loading/>
  }
  const checkoutHandler =()=>{

    if(userId && cartItems.length>0){
      return router.push(`/user/checkout`)
    }
  }

  return (
    <ClientOnly>
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Shopping Cart</h1>

        {cartItems!.length>0 ? cartItems!.map((item,index) => (
          <div
            key={index}
            className="flex items-center bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="w-28 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                className="w-28 h-20"
                src={item.url}
                alt="item"
               
                
                width={500}
                height={500}
                
              />
              {/* Thumbnail placeholder */}
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-gray-700 font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-500">By {item.tagline}</p>
              <p className="mt-2 text-gray-700 font-bold">₹ {item.price}</p>
            </div>
            <Button className="bg-red-900" onClick={()=>{removeItemHandler(item.id)}}>Remove</Button>
          </div>
        )):<h1>Your cart is empty</h1>}
      </div>

      {/* Summary */}
      <div className="bg-white  rounded-xl shadow-sm p-6 h-fit">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Summary</h2>
        <div className="flex justify-between text-gray-600 text-sm mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm mb-4">
          <span>Discount</span>
          <span>-₹0.00</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-700 border-t pt-4">
          <span>Total</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <Button className="mt-6 w-full py-3 font-semibold" onClick={checkoutHandler}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
    </ClientOnly>
  );
}
