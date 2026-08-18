"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const pingAnalytics = async () => {
      try {
        await fetch("/api/analytics/ping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            title: document.title || pathname
          })
        });
      } catch {
        // Non-blocking telemetry
      }
    };

    pingAnalytics();
  }, [pathname]);

  return null;
}
