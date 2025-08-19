"use client";
import Button from "@/ui/Button";
import TextInput from "@/ui/TextInput";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { deleteItemApi, showCartItemApi } from "@/api/user/cart/cart";
import { deleteItemToCart, setCart ,Items } from "@/store/slices/user/addToCart-slice";
import Loading from "@/ui/Loading";
import ClientOnly from "@/util/CilentOnly";
import { useRouter } from "next/navigation";
import { showNotification } from "@/store/slices/common/notification-slice";

interface Props{
  purchasedItems : (pricePaid:number,coursesIds:string[],userId:string)=>void
}

export default function MiniCart({purchasedItems}:Props) {
  const [coupon, setCoupon] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const userId = useSelector((state: RootState) => state.userAuth.userId);
  const cartItems = useSelector((state: RootState) => state.addToCart.items);


  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  useEffect(() => {
    const getItems = async () => {
      const items = await showCartItemApi(userId, dispatch, setIsLoading);

      if (items.length > 0) {
        dispatch(setCart(items));
         const allCoursesIds = items.map((item:Items)=>{return item.courseId})
         const subTotal = items.reduce((acc:number, item:Items) => acc + item.price, 0);
      
       return purchasedItems(subTotal,allCoursesIds,userId)
      }
      purchasedItems(0,[],'')
      
    };
    getItems();
  }, [userId, dispatch]);

  

  const removeItemHandler = async (cartItemId: string) => {
    const itemDeleted = await deleteItemApi(cartItemId, dispatch, setIsLoading);
    if (itemDeleted) {
      dispatch(deleteItemToCart({ id: cartItemId }));
    }
  };



  if (isLoading) return <Loading />;

  return (
    <ClientOnly>
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 w-full">
        <h2 className="text-lg font-bold text-gray-700">Order Summary</h2>

        {cartItems.length > 0 ? (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-gray-700 font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">By {item.tagline}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-gray-700 font-semibold">₹{item.price}</p>
                  <button
                    className="text-xs text-red-500 mt-1"
                    onClick={() => removeItemHandler(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Your cart is empty</p>
        )}

        <div className="flex items-center gap-2">
          <TextInput
            label="Enter code"
            placeholder="Enter code"
            state={[coupon, setCoupon]}
            value={coupon}
          />
          <Button className="mt-5">Apply</Button>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-₹0.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Taxes</span>
            <span>₹0.00</span>
          </div>
        </div>

        <div className="flex justify-between text-lg font-bold text-gray-700 border-t pt-4">
          <span>Total</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

  
      </div>
    </ClientOnly>
  );
}
