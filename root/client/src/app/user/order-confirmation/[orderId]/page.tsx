"use client";

import OrderConfirmationPage from "@/component/order-confirmation/OrderConfirm";
import { withAuth } from "@/util/withAuth";
import React from "react";

type Props = {
  params: Promise<{ orderId: string }>;
};

const Page: React.FC<Props> = ({ params }) => {
  const { orderId } = React.use(params); // ✅ unwrap the params Promise

  return <OrderConfirmationPage orderId={orderId} />;
};

export default withAuth(Page);
