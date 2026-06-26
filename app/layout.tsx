import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "EasySub | Google Gemini Pro - 18 Months Access",
  description:
    "Order Google Gemini Pro 18 Months Access from EasySub with Gemini Advanced, 5TB Google One storage, AI in Gmail, Docs and Sheets, and fast delivery.",
  keywords: ["EasySub", "Google Gemini Pro", "Gemini Advanced", "5TB Google One", "digital subscription"],
  openGraph: {
    title: "EasySub - Google Gemini Pro - 18 Months Access",
    description:
      "Get Gemini Advanced, 5TB Google One Storage, AI in Gmail, Docs and Sheets. Instant delivery after payment.",
    type: "website",
    images: ["/assets/easysub-gemini-hero.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#0B0F19"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
