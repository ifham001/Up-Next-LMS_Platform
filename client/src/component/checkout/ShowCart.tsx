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
      <div className="lg:sticky lg:top-24 w-full h-fit">
      <div className="card p-6 space-y-6 w-full h-fit animate-fadeInUp delay-2">
        <h2 className="text-base font-semibold text-text-primary">Order summary</h2>

        {cartItems.length > 0 ? (
          <ul className="divide-y divide-border border-y border-border -mx-6">
            {cartItems.map((item) => (
              <li key={item.id} className="group flex items-center gap-4 px-6 py-3 transition-colors hover:bg-surface-muted">
                <div className="w-14 h-14 rounded-md flex-shrink-0 overflow-hidden border border-border bg-surface-muted">
                  <Image
                    src={item.url}
                    alt={item.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-text-primary truncate">{item.title}</p>
                  <p className="text-xs text-text-muted truncate">By {item.tagline}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="tnum text-sm font-semibold text-text-primary">₹{item.price}</p>
                  <button
                    className="text-xs text-text-muted mt-1 transition-colors hover:text-error"
                    onClick={() => removeItemHandler(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary text-sm leading-relaxed">Your cart is empty.</p>
        )}

        <div className="flex items-end gap-2">
          <TextInput
            label="Promo code"
            placeholder="Enter code"
            state={[coupon, setCoupon]}
            value={coupon}
          />
          <Button variant="outline">Apply</Button>
        </div>

        <hr className="divider" />
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Subtotal</span>
            <span className="tnum text-text-primary">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Discount</span>
            <span className="tnum text-success">-₹0.00</span>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Taxes</span>
            <span className="tnum text-text-primary">₹0.00</span>
          </div>
        </div>

        <hr className="divider" />
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-text-secondary">Total</span>
          <span className="font-display tnum text-2xl font-semibold text-text-primary">₹{subtotal.toFixed(2)}</span>
        </div>


      </div>
      </div>
    </ClientOnly>
  );
}
