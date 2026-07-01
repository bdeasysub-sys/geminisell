import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BD Subscription HuB",
  openGraph: {
    title: "BD Subscription HuB"
  }
};

export default function CheckoutLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
