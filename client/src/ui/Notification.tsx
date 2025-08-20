"use client"
import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "@/store/slices/common/notification-slice";
import { RootState } from "@/store/Store";

export default function Notification() {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state: RootState) => state.notification);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hideNotification());
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, dispatch]);

  return (
    <div
      className={clsx(
        "fixed right-2 top-12 sm:top-6 sm:right-6 z-60 max-w-[90%] sm:max-w-sm w-full transition-all duration-300",
        message ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div
        className={clsx(
          "flex items-start gap-2 p-2 sm:p-4 rounded-xl shadow-lg text-white text-xs sm:text-sm",
          type === "success" ? "bg-gray-700" : "bg-red-500"
        )}
      >
        <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
        <div className="flex-1">{message}</div>
      </div>
    </div>
  );
}