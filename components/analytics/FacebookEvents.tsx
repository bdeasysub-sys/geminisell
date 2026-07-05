"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  trackAddToCart,
  trackInitiateCheckout,
  trackPageView,
  trackViewContent
} from "@/lib/analytics";

type FacebookEventsProps = {
  addToCartSelector?: string;
  trackCheckoutStart?: boolean;
  trackPageViews?: boolean;
  trackViewContentEvent?: boolean;
};

export function FacebookEvents({
  addToCartSelector,
  trackCheckoutStart = false,
  trackPageViews = false,
  trackViewContentEvent = false
}: FacebookEventsProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!trackPageViews) {
      return;
    }

    trackPageView();
  }, [pathname, trackPageViews]);

  useEffect(() => {
    if (trackViewContentEvent) {
      trackViewContent();
    }

    if (trackCheckoutStart) {
      trackInitiateCheckout();
    }
  }, [trackCheckoutStart, trackViewContentEvent]);

  useEffect(() => {
    if (!addToCartSelector) {
      return;
    }

    const selector = addToCartSelector;

    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest(selector)) {
        trackAddToCart();
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [addToCartSelector]);

  return null;
}
