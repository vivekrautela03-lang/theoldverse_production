"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthPortal from "@/components/AuthPortal";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            router.push(redirect);
            return;
          }
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };

    checkUser();
  }, [router, redirect]);

  const handleLoginSuccess = (userData: { name: string; email: string; isCreator: boolean }) => {
    // Write user state to localStorage for frontend UI convenience
    localStorage.setItem("oldverse_user", JSON.stringify(userData));
    window.dispatchEvent(new Event("oldverse_store_update"));
    router.push(redirect);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-[#F5A623] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#A5A5A5] text-xs font-grotesk tracking-widest uppercase">Securing Gates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#07090e]">
      <AuthPortal onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-[#F5A623] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#A5A5A5] text-xs font-grotesk tracking-widest uppercase font-bebas">Securing Gates...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
