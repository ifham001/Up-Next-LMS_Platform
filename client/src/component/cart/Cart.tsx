// Cart.tsx
"use client"
import React,{useEffect, useState} from "react";
import { Trash2, ShoppingBag } from 'lucide-react'
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
import Link from "next/link";






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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="mb-8 animate-fadeInUp">
          <span className="eyebrow mb-4">Your bag</span>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display text-3xl sm:text-4xl">
              Your <span className="text-accent">cart</span>
            </h1>
            {cartItems!.length > 0 && (
              <span className="chip tnum">
                {cartItems!.length} {cartItems!.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>

        {cartItems!.length>0 ? (
          <div className="card divide-y divide-border overflow-hidden animate-fadeInUp">
            {cartItems!.map((item,index) => (
              <div
                key={index}
                className="group flex items-center gap-5 p-4 sm:p-5 transition-colors hover:bg-surface-muted"
              >
                <div className="w-28 h-20 sm:w-32 sm:h-20 rounded-md overflow-hidden flex-shrink-0 border border-border bg-surface-muted">
                  <Image
                    className="w-full h-full object-cover"
                    src={item.url}
                    alt={item.title}
                    width={500}
                    height={500}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-text-primary truncate">{item.title}</h2>
                  <p className="text-sm text-text-muted truncate">By {item.tagline}</p>
                  <p className="tnum mt-2 text-lg font-semibold text-text-primary">₹{item.price}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-secondary hover:text-error hover:bg-error-soft"
                  onClick={()=>{removeItemHandler(item.id)}}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ):(
          <div className="card flex flex-col items-center justify-center gap-4 p-16 text-center animate-fadeInUp">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted border border-border text-text-muted">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-medium text-text-primary">Your cart is empty</p>
              <p className="text-sm text-text-secondary mt-1">Browse the catalog to add a course.</p>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm">Browse courses</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Summary — flat card panel */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="card p-6 animate-fadeInUp delay-1">
          <h2 className="text-base font-semibold text-text-primary mb-5">Order summary</h2>
          <div className="flex justify-between text-sm text-text-secondary mb-3">
            <span>Subtotal</span>
            <span className="tnum text-text-primary">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary mb-5">
            <span>Discount</span>
            <span className="tnum text-success">-₹0.00</span>
          </div>
          <hr className="divider" />
          <div className="flex items-baseline justify-between pt-5">
            <span className="text-sm font-medium text-text-secondary">Total</span>
            <span className="font-display tnum text-2xl font-semibold text-text-primary">₹{subtotal.toFixed(2)}</span>
          </div>
          <Button
            fullWidth
            size="lg"
            className="mt-6"
            disabled={cartItems!.length === 0}
            onClick={checkoutHandler}
          >
            Proceed to checkout
          </Button>
          <p className="text-text-muted text-xs text-center mt-4">Secure, encrypted checkout</p>
        </div>
      </div>
    </div>
    </ClientOnly>
  );
}
