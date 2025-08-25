"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token && pathname !== "/signin" && pathname !== "/signup") {
        router.replace("/signin");
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
} 