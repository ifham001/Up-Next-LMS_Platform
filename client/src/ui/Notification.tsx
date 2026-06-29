"use client"
import { useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
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
          "card relative flex items-start gap-3 p-4 text-text-primary text-xs sm:text-sm overflow-hidden shadow-md border-l-2",
          type === "success" ? "border-l-success" : "border-l-error"
        )}
      >
        <span
          className={clsx(
            "grid place-items-center size-8 shrink-0 rounded-full border border-border surface-muted",
            type === "success" ? "text-success" : "text-error"
          )}
        >
          {type === "success" ? (
            <CheckCircle2 strokeWidth={1.75} size={16} />
          ) : (
            <AlertCircle strokeWidth={1.75} size={16} />
          )}
        </span>
        <div className="flex-1 self-center text-text-secondary leading-relaxed">{message}</div>
      </div>
    </div>
  );
}