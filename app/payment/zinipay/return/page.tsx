import Link from "next/link";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api-errors";
import { finalizeZiniPayInvoice } from "@/lib/zinipay-order";
import { ZINIPAY_INVOICE_COOKIE } from "@/lib/zinipay";

type PaymentReturnPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaymentReturnPage({ searchParams }: PaymentReturnPageProps) {
  const params = await searchParams;
  const invoiceId =
    readParam(params.invoice_id) ??
    readParam(params.invoiceId) ??
    readParam(params.invoice) ??
    (await cookies()).get(ZINIPAY_INVOICE_COOKIE)?.value;

  if (!invoiceId) {
    return <PaymentError message="Missing payment invoice ID." />;
  }

  try {
    const result = await finalizeZiniPayInvoice(invoiceId);

    return (
      <main className="checkout-page">
        <div className="container">
          <header className="checkout-topbar">
            <Link href="/" className="logo" aria-label="EasySub home">
              <span className="logo-mark">E</span>
              <span>EasySub</span>
            </Link>
            <Link className="checkout-back" href="/">
              Back
            </Link>
          </header>

          <section className="checkout-shell">
            <div className="checkout-copy">
              <p className="eyebrow">Payment Verified</p>
              <h1>Your Gemini Pro access is ready.</h1>
              <p>
                Your ZiniPay payment was verified successfully. Keep this page open until you
                save your subscription link.
              </p>
            </div>

            <div className="checkout-form">
              <div className="checkout-result" role="status">
                <p className="checkout-result-title">{result.message}</p>
                <a href={result.order.assignedLink} target="_blank" rel="noreferrer">
                  {result.order.assignedLink}
                </a>
                <p>
                  Order #{result.order.id} - {result.order.paymentId}
                </p>
                <p>
                  Email {result.email.sent ? "sent" : "skipped"}
                  {result.email.reason ? `: ${result.email.reason}` : "."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <PaymentError
        message={
          error instanceof ApiError || error instanceof Error
            ? error.message
            : "Unable to verify payment."
        }
      />
    );
  }
}

function PaymentError({ message }: { message: string }) {
  return (
    <main className="checkout-page">
      <div className="container">
        <header className="checkout-topbar">
          <Link href="/" className="logo" aria-label="EasySub home">
            <span className="logo-mark">E</span>
            <span>EasySub</span>
          </Link>
          <Link className="checkout-back" href="/demo-checkout">
            Checkout
          </Link>
        </header>

        <section className="checkout-shell">
          <div className="checkout-copy">
            <p className="eyebrow">Payment Verification</p>
            <h1>We could not complete this payment yet.</h1>
            <p>Use the checkout page again or contact support with your invoice ID.</p>
          </div>

          <div className="checkout-form">
            <p className="checkout-alert checkout-alert-error" role="alert">
              {message}
            </p>
            <Link className="btn btn-primary checkout-submit" href="/demo-checkout">
              Return to Checkout
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
