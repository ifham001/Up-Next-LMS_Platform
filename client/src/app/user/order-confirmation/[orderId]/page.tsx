"use client";

import OrderConfirmationPage from "@/component/order-confirmation/OrderConfirm";
import ClientOnly from "@/util/CilentOnly";
import { withAuth } from "@/util/withAuth";
import React from "react";

type params = { orderId: string };


async function page({ params }:{params:Promise<params>})  {
  const { orderId } = React.use(params); // ✅ unwrap the params Promise

  return (
<ClientOnly> <OrderConfirmationPage orderId={orderId} /></ClientOnly>

  )
  
  
 
};

export default withAuth(page);


