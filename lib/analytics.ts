export const FACEBOOK_PIXEL_ID = "1351610486295544";
export const MICROSOFT_CLARITY_ID = "xfjv1njfnw";

export const PRODUCT_ANALYTICS = {
  value: 590,
  currency: "BDT",
  contentName: "Gemini AI Pro 18 Months",
  contentCategory: "Digital Subscription"
} as const;

export type FacebookEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase";

export type GoogleAnalyticsEventName =
  | "page_view"
  | "begin_checkout"
  | "add_payment_info"
  | "purchase";

type EventOptions = {
  eventID?: string;
};

type PurchaseInput = {
  orderId: string;
  paymentId: string;
};

type WindowWithAnalytics = Window & {
  fbq?: (
    command: "track",
    eventName: FacebookEventName,
    params?: Record<string, unknown>,
    options?: EventOptions
  ) => void;
  gtag?: (
    command: "config" | "event" | "js",
    targetIdOrEventName: string | Date,
    params?: Record<string, unknown>
  ) => void;
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const recentEvents = new Map<string, number>();
const fallbackPersistentEvents = new Set<string>();
const DUPLICATE_WINDOW_MS = 1500;

export function trackPageView() {
  const pagePath = getCurrentPath();

  trackOnceInMemory(`page_view:${pagePath}`, () => {
    trackFacebookEvent("PageView");
    trackGoogleEvent("page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath
    });
  });
}

export function trackViewContent() {
  trackOnceInMemory(`view_content:${getCurrentPath()}`, () => {
    trackFacebookEvent("ViewContent", productParams());
  });
}

export function trackAddToCart() {
  trackFacebookEvent("AddToCart", productParams());
}

export function trackInitiateCheckout() {
  trackOnceInMemory(`initiate_checkout:${getCurrentPath()}`, () => {
    trackFacebookEvent("InitiateCheckout", productParams());
    trackGoogleEvent("begin_checkout", checkoutParams());
  });
}

export function trackAddPaymentInfo() {
  trackFacebookEvent("AddPaymentInfo", productParams());
  trackGoogleEvent("add_payment_info", checkoutParams());
}

export function trackPurchase({ orderId, paymentId }: PurchaseInput) {
  const dedupeKey = `purchase:${paymentId}`;

  if (!markPersistentEvent(dedupeKey)) {
    return;
  }

  trackFacebookEvent(
    "Purchase",
    {
      ...productParams(),
      order_id: orderId,
      payment_id: paymentId
    },
    { eventID: paymentId }
  );

  trackGoogleEvent("purchase", {
    transaction_id: paymentId,
    order_id: orderId,
    payment_id: paymentId,
    value: PRODUCT_ANALYTICS.value,
    currency: PRODUCT_ANALYTICS.currency,
    items: [googleProductItem()]
  });
}

export function trackFacebookEvent(
  eventName: FacebookEventName,
  params?: Record<string, unknown>,
  options?: EventOptions
) {
  retryUntilAvailable((analyticsWindow) => {
    if (typeof analyticsWindow.fbq !== "function") {
      return false;
    }

    if (options) {
      analyticsWindow.fbq("track", eventName, params, options);
    } else if (params) {
      analyticsWindow.fbq("track", eventName, params);
    } else {
      analyticsWindow.fbq("track", eventName);
    }

    return true;
  });
}

export function trackGoogleEvent(
  eventName: GoogleAnalyticsEventName,
  params?: Record<string, unknown>
) {
  if (!GA_MEASUREMENT_ID) {
    return;
  }

  retryUntilAvailable((analyticsWindow) => {
    if (typeof analyticsWindow.gtag !== "function") {
      return false;
    }

    analyticsWindow.gtag("event", eventName, params);
    return true;
  });
}

function productParams() {
  return {
    value: PRODUCT_ANALYTICS.value,
    currency: PRODUCT_ANALYTICS.currency,
    content_name: PRODUCT_ANALYTICS.contentName,
    content_category: PRODUCT_ANALYTICS.contentCategory
  };
}

function checkoutParams() {
  return {
    value: PRODUCT_ANALYTICS.value,
    currency: PRODUCT_ANALYTICS.currency,
    items: [googleProductItem()]
  };
}

function googleProductItem() {
  return {
    item_name: PRODUCT_ANALYTICS.contentName,
    item_category: PRODUCT_ANALYTICS.contentCategory,
    price: PRODUCT_ANALYTICS.value,
    quantity: 1
  };
}

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}`;
}

function trackOnceInMemory(key: string, track: () => void) {
  const now = Date.now();
  const lastTrackedAt = recentEvents.get(key);

  if (lastTrackedAt && now - lastTrackedAt < DUPLICATE_WINDOW_MS) {
    return;
  }

  recentEvents.set(key, now);
  track();
}

function markPersistentEvent(key: string) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const storageKey = `easysub:${key}`;

    if (window.localStorage.getItem(storageKey)) {
      return false;
    }

    window.localStorage.setItem(storageKey, "1");
    return true;
  } catch {
    return trackFallbackPersistentEvent(key);
  }
}

function trackFallbackPersistentEvent(key: string) {
  if (fallbackPersistentEvents.has(key)) {
    return false;
  }

  fallbackPersistentEvents.add(key);
  return true;
}

function retryUntilAvailable(
  callback: (analyticsWindow: WindowWithAnalytics) => boolean,
  retries = 20
) {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as WindowWithAnalytics;

  if (callback(analyticsWindow) || retries <= 0) {
    return;
  }

  window.setTimeout(() => retryUntilAvailable(callback, retries - 1), 250);
}
