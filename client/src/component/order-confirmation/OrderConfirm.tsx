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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16">
          <div className="card p-8 sm:p-10 max-w-md w-full animate-fadeInUp">
            <div className="skeleton h-10 w-10 rounded-full mb-7"></div>

            <h1 className="display text-2xl mb-3">Confirming your order</h1>
            <p className="text-text-secondary leading-relaxed mb-7 max-w-[65ch]">
              We&apos;re preparing your courses and generating your invoice.
            </p>

            <div className="space-y-3">
              <div className="skeleton h-4 rounded w-3/4"></div>
              <div className="skeleton h-4 rounded w-1/2"></div>
              <div className="skeleton h-4 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      );
    }


  return (
    <ClientOnly>
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 lg:py-20">
      <div className="card p-8 sm:p-10 max-w-lg w-full animate-fadeInUp">
        {/* Calm success check — no glow */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft border border-border mb-6">
          <CheckCircle className="w-6 h-6 text-success" strokeWidth={1.75} />
        </div>

        <span className="eyebrow mb-4">Order confirmed</span>
        <h1 className="display text-3xl sm:text-4xl mb-3">
          You&apos;re <span className="text-accent">enrolled</span>
        </h1>

        <p className="text-text-secondary leading-relaxed max-w-[65ch] mb-8">
          Your order is complete. Your courses are now available in your dashboard.
        </p>

        {/* Receipt — flat inset card */}
        <div className="rounded-md border border-border bg-surface-muted p-5 mb-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Receipt</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Order ID</span>
              <span className="chip tnum">#{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Purchase date</span>
              <span className="font-medium text-text-primary tnum">
                {item?.date
                  ? formatDate(item.date)
                  : formatDate(new Date().toISOString())}
              </span>
            </div>
            <hr className="divider my-1" />
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-medium text-text-primary">Total</span>
              <span className="font-display tnum text-xl font-semibold text-text-primary">
                ₹{item?.total ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <Link href="/user/learning" className="flex-1">
            <Button fullWidth>Go to your courses</Button>
          </Link>
          <Link href="/explore" className="flex-1">
            <Button fullWidth variant="outline">Browse more courses</Button>
          </Link>
        </div>

        {/* Download Invoice */}
        <Button
          variant="ghost"
          fullWidth
          onClick={handleDownloadInvoice}
        >
          <FileDown className="w-4 h-4" strokeWidth={1.75} />
          Download invoice
        </Button>
      </div>

      {/* Footer Note */}
      <p className="text-text-muted text-sm mt-6">
        A confirmation email has been sent to your registered email address.
      </p>
    </div>
    </ClientOnly>
  );
}
