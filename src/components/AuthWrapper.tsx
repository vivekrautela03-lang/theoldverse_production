"use client";

import React, { useState, useEffect } from "react";
import AuthPortal from "./AuthPortal";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const checkLogin = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("oldverse_user");
      setIsLoggedIn(!!user);
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
    return <AuthPortal onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return <>{children}</>;
}
