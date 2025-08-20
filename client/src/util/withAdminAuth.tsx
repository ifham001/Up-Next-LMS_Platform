"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React from "react";
import Loading from "@/ui/Loading";

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ProtectedComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const token = Cookies.get("admin-token");

      if (!token) {
        router.replace("/admin"); // redirect if not logged in
      } else {
        setAuthorized(true);
      }
    }, [router]);

    if (!authorized) {
      return (
        <div>
          <Loading />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.displayName = `withAdminAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedComponent as React.FC<P>;
}
