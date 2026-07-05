import { PaymentIntentStatus } from "@prisma/client";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FacebookPurchase } from "@/components/analytics/FacebookPurchase";
import { CopyLinkButton } from "@/components/payment/CopyLinkButton";
import { readPaymentSuccessSession } from "@/lib/payment-success-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: {
    index: false,
    follow: false
  }
};

export default async function PaymentSuccessPage() {
  const session = await readPaymentSuccessSession();

  if (!session) {
    redirect("/checkout");
  }

  const [order, paymentIntent] = await Promise.all([
    prisma.order.findUnique({
      where: { id: session.orderId },
      select: {
        id: true,
        email: true,
        phone: true,
        paymentId: true,
        assignedLink: true
      }
    }),
    prisma.paymentIntent.findUnique({
      where: { invoiceId: session.invoiceId },
      select: {
        email: true,
        phone: true,
        status: true
      }
    })
  ]);

  if (
    !order ||
    !paymentIntent ||
    paymentIntent.status !== PaymentIntentStatus.completed ||
    paymentIntent.email !== order.email ||
    paymentIntent.phone !== order.phone
  ) {
    redirect("/checkout");
  }

  return (
    <main className="checkout-page">
      <FacebookPurchase orderId={order.id} paymentId={order.paymentId} />
      <div className="container">
        <header className="checkout-topbar">
          <Link href="/" className="logo" aria-label="BD Subscription HuB home">
            <span className="logo-mark">B</span>
            <span>BD Subscription HuB</span>
          </Link>
          <Link className="checkout-back" href="/">
            Back
          </Link>
        </header>

        <section className="checkout-shell">
          <div className="checkout-copy">
            <p className="eyebrow">Payment Verified</p>
            <h1>✅ Payment Successful</h1>
            <p>
              Thank you for your purchase. Your Gemini Pro subscription link is ready below.
            </p>
            <dl className="checkout-facts">
              <div>
                <dt>Order ID</dt>
                <dd>#{order.id}</dd>
              </div>
              <div>
                <dt>Payment ID</dt>
                <dd>{order.paymentId}</dd>
              </div>
            </dl>
          </div>

          <div className="checkout-form">
            <div className="checkout-result" role="status">
              <p className="checkout-result-title">Payment Successful</p>
              <p>Subscription has also been sent to your email.</p>
              <div className="checkout-link-card">
                <span>Assigned Subscription Link</span>
                <a href={order.assignedLink} target="_blank" rel="noopener noreferrer">
                  {order.assignedLink}
                </a>
                <div className="checkout-link-actions">
                  <a
                    className="btn btn-primary checkout-open-button"
                    href={order.assignedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Subscription
                  </a>
                  <CopyLinkButton value={order.assignedLink} />
                </div>
              </div>
              <p>
                Order #{order.id} - {order.paymentId}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
