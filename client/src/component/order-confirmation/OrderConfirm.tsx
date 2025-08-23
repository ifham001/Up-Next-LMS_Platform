"use client";

import Link from "next/link";
import { CheckCircle, FileDown } from "lucide-react";
import Button from "@/ui/Button";
import { downloadPdf } from "@/util/downloadPdf";
import { useEffect, useState } from "react";
import { orderConfirmationApi } from "@/api/user/order/order";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import Loading from "@/ui/Loading";
import ClientOnly from "@/util/CilentOnly";
import { clearCart } from "@/store/slices/user/addToCart-slice";

type Item = {
  total: number;
  pdf: string;
  date: string; // optional if your API sends purchase date
};

interface Props {
  orderId: string;
}

export default function OrderConfirmationPage({ orderId }: Props) {
  const { userId } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState<Item>({ total: 0, pdf: "", date: "" });


  const handleDownloadInvoice = () => {
    // if (item?.pdf) {
    //   downloadPdf(item.pdf);
    // }
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short", // Aug
      day: "numeric", // 11da
      year: "numeric", // 2025
    });
  }
  useEffect(() => {
    setIsLoading(true); 
    const fetchOrder = async () => {
      // Start loading
  
      const resData = await orderConfirmationApi(
        userId,
        orderId,
        dispatch,
        setIsLoading
      );
  
      if (resData?.success) {
        setIsLoading(false);
        setItem({
          total: resData.total,
          pdf: resData.pdf,
          date: resData.date
        });
      } else {
        console.warn("Order not found or API error");
      }
  
      // Stop loading
    };
  
    if (userId && orderId) {
      fetchOrder();
    }
    dispatch(clearCart())
  }, [userId, orderId, dispatch]);
  
  
  
    if (isLoading&&item.total===0) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
          {/* Loader Container */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fadeIn">
            
            {/* Animated Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
    
            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Confirming Your Order
            </h1>
    
            {/* Subtitle */}
            <p className="text-gray-600 mb-6">
              Please wait while we prepare your courses & generate your invoice.
            </p>
    
            {/* Animated Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="bg-blue-500 h-full w-1/3 animate-progress"></div>
            </div>
    
            {/* Skeleton Summary */}
            <div className="mt-6 space-y-3 text-left">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      );
    }
  

  return (
    <ClientOnly>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Confirmed 🎉
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your courses are now available in your
          dashboard.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">Order Summary</h2>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-medium">#{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Purchase Date</span>
              <span className="font-medium">
                {item?.date
                  ? formatDate(item.date)
                  : formatDate(new Date().toISOString())}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-medium text-green-600">
                ₹{item?.total ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Button>
            <Link href="/user/learning">Go to Your Courses</Link>
          </Button>
          <Button>
            <Link href="/explore">Browse More Courses</Link>
          </Button>
        </div>

        {/* Download Invoice */}
        <Button
          onClick={handleDownloadInvoice}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors"
        >
          <FileDown className="w-5 h-5" />
          Download Invoice
        </Button>
      </div>

      {/* Footer Note */}
      <p className="text-gray-400 text-sm mt-6">
        A confirmation email has been sent to your registered email address.
      </p>
    </div>
    </ClientOnly>
  );
}
