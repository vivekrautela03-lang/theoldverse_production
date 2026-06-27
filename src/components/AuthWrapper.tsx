/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const checkLogin = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsLoggedIn(true);
          return;
        }
      }
    } catch (err) {
      // ignore
    }
    
    // Fallback/Redirect if unauthorized
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("oldverse_user");
      window.dispatchEvent(new Event("oldverse_store_update"));
      router.push("/auth");
    }
  };

  useEffect(() => {
    setIsClient(true);
    checkLogin();
    
    // Listen for storage mutations to update login state immediately
    window.addEventListener("oldverse_store_update", checkLogin);
    return () => {
      window.removeEventListener("oldverse_store_update", checkLogin);
    };
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-[#F5A623] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#A5A5A5] text-sm font-grotesk tracking-widest uppercase">Opening Gates...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Gated by redirect in checkLogin
  }

  return <>{children}</>;
}
