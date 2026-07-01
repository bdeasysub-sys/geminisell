"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

type CheckoutState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "redirecting"; payload: ZiniPayCreateResponse }
  | { status: "error"; message: string };

type ZiniPayCreateResponse = {
  ok: true;
  message: string;
  invoiceId: string;
  paymentUrl: string;
};

export default function CheckoutPage() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<CheckoutState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/zinipay/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customerName, email, phone })
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error?.message ?? "Unable to create payment invoice.");
      }

      setState({ status: "redirecting", payload });
      window.location.href = payload.paymentUrl;
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to create payment invoice."
      });
    }
  }

  return (
    <main className="checkout-page">
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
            <p className="eyebrow">Secure ZiniPay Checkout</p>
            <h1>Order Gemini Pro access with verified payment.</h1>
            <p>
              Submit your customer details, pay through bKash, and receive the next available
              subscription link after payment verification.
            </p>
            <dl className="checkout-facts">
              <div>
                <dt>Price</dt>
                <dd>590 tk</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>After verification Auto Delivery </dd>
              </div>
            </dl>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <h2>Customer details</h2>
              <span>18 months access</span>
            </div>

            <label className="form-field">
              <span>Name</span>
              <input
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="form-field">
              <span>Phone number</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                required
              />
            </label>

            <button
              className="btn btn-primary checkout-submit"
              type="submit"
              disabled={state.status === "loading" || state.status === "redirecting"}
            >
              {state.status === "loading" || state.status === "redirecting"
                ? "Creating payment..."
                : "Pay with bKash"}
            </button>

            {state.status === "error" ? (
              <p className="checkout-alert checkout-alert-error" role="alert">
                {state.message}
              </p>
            ) : null}

            {state.status === "redirecting" ? (
              <div className="checkout-result" role="status">
                <p className="checkout-result-title">Redirecting to ZiniPay...</p>
                <a href={state.payload.paymentUrl}>Continue to payment</a>
                <p>Invoice {state.payload.invoiceId}</p>
              </div>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
