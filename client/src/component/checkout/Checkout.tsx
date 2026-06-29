"use client";
import TextInput from "@/ui/TextInput";
import React, { useState } from "react";
import ShowCart from "./ShowCart";
import Button from "@/ui/Button";
import CardDetails from "./CardDetails";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/slices/common/notification-slice";
import Loading from "@/ui/Loading";
import { checkoutApi } from "@/api/user/checkout/checkout";
import { useRouter } from "next/navigation";
import { clearCart } from "@/store/slices/user/addToCart-slice";


export function Checkout() {
  const router = useRouter()
  // Payment details
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Billing details
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [pricePaid,setPricePaid] = useState<number>()
  const [coursesIds,setCoursesIds] = useState<string[]>([])
  const [userId,setUserId] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const handlePlaceOrder = async() => {
    // Validation
    const isEmpty = (val: string) => val.trim() === "";
    const fields = [
      cardNumber, expiryDate, cvv, cardName,
      name, address, city, state, zipCode, country
    ];
    if(coursesIds.length<0||!pricePaid||!userId){
      return dispatch(showNotification({message:'Please add item to make order',type:'error'}))
     }

    if (fields.some(isEmpty)) {
        dispatch(showNotification({message:"Please fill out all payment and billing fields before placing the order.",type:"error"}))
      return;
    }
    
    const orderData = {
      payment: { cardNumber, expiryDate, cvv, cardName },
      billing: { name, address, city, state, zip_code:Number(zipCode), country,pricePaid:Number(pricePaid),purchased_courses:coursesIds,payment_mode:"Card",userId },
    };
   const response =  await checkoutApi(orderData.billing,dispatch,setIsLoading)
   if(response.success){
    dispatch(clearCart())
    return router.push(`/user/order-confirmation/${response.orderId}`)
   }

  };
  const purchasedItems =(pricePaid:number,coursesIds:string[],userId:string)=>{
   
    setPricePaid(pricePaid)
    setCoursesIds(coursesIds)
    setUserId(userId)
  }
  if(isLoading){
    return <Loading/>
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div className="animate-fadeInUp">
          <span className="eyebrow mb-4">Secure checkout</span>
          <h1 className="display text-3xl sm:text-4xl">
            Almost <span className="text-accent">there</span>
          </h1>
          <p className="text-text-secondary leading-relaxed mt-3 max-w-[65ch]">
            Review your details and confirm. Your courses unlock as soon as the order is placed.
          </p>
        </div>

        <div className="card p-6 sm:p-8 space-y-8 animate-fadeInUp delay-1">

        <CardDetails
          cardNumber={[cardNumber, setCardNumber]}
          expiryDate={[expiryDate, setExpiryDate]}
          cvv={[cvv, setCvv]}
          cardName={[cardName, setCardName]}
          name={[name, setName]}
          address={[address, setAddress]}
          city={[city, setCity]}
          stateName={[state, setState]}
          zipCode={[zipCode, setZipCode]}
          country={[country, setCountry]}
        />

        <hr className="divider" />

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-text-primary">Billing address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Name" state={[name, setName]} value={name} placeholder="Full name" />
            <TextInput label="Address" state={[address, setAddress]} value={address} placeholder="Street address" />
            <TextInput label="City" state={[city, setCity]} value={city} placeholder="City" />
            <TextInput label="State" state={[state, setState]} value={state} placeholder="State" />
            <TextInput label="Zip code" state={[zipCode, setZipCode]} value={zipCode} placeholder="Zip code" />
            <TextInput label="Country" state={[country, setCountry]} value={country} placeholder="Country" />
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handlePlaceOrder}>
          Place order
        </Button>
        </div>
      </div>

      <ShowCart purchasedItems={purchasedItems} />
    </div>
  );
}
