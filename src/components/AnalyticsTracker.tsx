"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    // Check user cookie consent
    const rawConsent = typeof window !== "undefined" ? localStorage.getItem("oldverse_cookie_consent") : null;
    let hasAnalyticsConsent = false;
    if (rawConsent) {
      try {
        const parsed = JSON.parse(rawConsent);
        hasAnalyticsConsent = !!parsed.analytics;
      } catch {
        hasAnalyticsConsent = false;
      }
    }

    if (!hasAnalyticsConsent) return;

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
