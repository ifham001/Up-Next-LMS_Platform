"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React from "react";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ProtectedComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const token = Cookies.get("token");

      if (!token) {
        router.replace("/"); // avoids back navigation issue
      } else {
        setAuthorized(true);
      }
    }, [router]);

    if (!authorized) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedComponent;
}
