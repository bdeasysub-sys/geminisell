import type { Metadata, Viewport } from "next";
import { FacebookEvents } from "@/components/analytics/FacebookEvents";
import { FacebookPixel } from "@/components/analytics/FacebookPixel";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import "./globals.css";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
const siteName = "BD Subscription HUB";
const defaultTitle = `${siteName} | Gemini AI Pro 18 Months`;
const defaultDescription =
  "Order Gemini AI Pro 18 Months access from BD Subscription HUB with fast delivery, secure checkout, and verified digital subscription support.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteName,
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  keywords: [
    "BD Subscription HUB",
    "bdsubscriptionhub",
    "Google Gemini Pro",
    "Gemini AI Pro",
    "Gemini Advanced",
    "digital subscription Bangladesh",
    "AI subscription Bangladesh"
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      {
        url: "/favicon-bd-subscription-hub.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
    shortcut: "/favicon-bd-subscription-hub.png",
    apple: "/bd-subscription-hub-icon.png",
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    siteName,
    type: "website",
    locale: "en_BD",
    images: [
      {
        url: "/assets/easysub-gemini-hero.png",
        width: 1200,
        height: 630,
        alt: "Gemini AI Pro 18 Months subscription offer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/assets/easysub-gemini-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050816",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <FacebookPixel />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <FacebookEvents trackPageViews />
      </body>
    </html>
  );
}
