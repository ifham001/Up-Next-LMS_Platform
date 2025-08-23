"use client";

import OrderConfirmationPage from "@/component/order-confirmation/OrderConfirm";
import { withAuth } from "@/util/withAuth";
import React from "react";

type params = { orderId: string };


async function page({ params }:{params:Promise<params>})  {
  const { orderId } = React.use(params); // ✅ unwrap the params Promise

  return <OrderConfirmationPage orderId={orderId} />;
};

export default withAuth(page);


