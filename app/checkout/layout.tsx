import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for Gemini AI Pro 18 Months access.",
  alternates: {
    canonical: "/checkout"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckoutLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
