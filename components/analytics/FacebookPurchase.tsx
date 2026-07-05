"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

type FacebookPurchaseProps = {
  orderId: string | number;
  paymentId: string;
};

export function FacebookPurchase({ orderId, paymentId }: FacebookPurchaseProps) {
  useEffect(() => {
    trackPurchase({
      orderId: String(orderId),
      paymentId
    });
  }, [orderId, paymentId]);

  return null;
}
