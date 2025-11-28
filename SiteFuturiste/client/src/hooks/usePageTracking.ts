import { useEffect } from "react";
import { useLocation } from "wouter";

export function usePageTracking() {
  const [location] = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: location }),
        });
      } catch (e) {
        // Silent fail for analytics
      }
    };

    trackPageView();
  }, [location]);
}
