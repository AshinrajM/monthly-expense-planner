"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated =
      localStorage.getItem("isAuthenticated");

    if (isAuthenticated === "true") {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <p className="text-sm text-slate-500">
        Loading...
      </p>
    </div>
  );
}