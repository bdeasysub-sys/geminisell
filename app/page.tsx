import Script from "next/script";
import { getCheckoutUrl } from "@/lib/env";

export default function HomePage() {
  const checkoutUrl = getCheckoutUrl();

  return (
    <>
      <header className="site-header">
        <nav className="container nav" aria-label="Primary navigation">
          <a href="#top" className="logo" aria-label="EasySub home">
            <span className="logo-mark">E</span>
            <span>EasySub</span>
          </a>
          <div className="nav-links" aria-label="Page sections">
            <a href="#features">Features</a>
            <a href="#why">Why EasySub</a>
            <a href="#how">How It Works</a>
            <a href="#faq">FAQ</a>
          </div>
          <a className="btn btn-primary nav-cta js-order" href={checkoutUrl}>
            Order Now
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content reveal">
              <div className="badge">Trusted Digital Subscription Provider</div>
              <h1>
                <span className="gradient-text">Google Gemini Pro</span> - 18 Months Access
              </h1>
              <p className="hero-copy">
                Get Gemini Advanced, 5TB Google One Storage, AI in Gmail, Docs &amp; Sheets.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary js-order" href={checkoutUrl}>
                  Order Now
                </a>
                <span className="delivery-note">
                  <span>&#9679;</span> Secure ZiniPay checkout enabled
                </span>
              </div>
            </div>

            <div className="hero-visual reveal" aria-label="Gemini Pro subscription visual">
              <div className="hero-image-shell">
                <picture>
                  <source srcSet="/assets/easysub-gemini-hero.png" type="image/webp" />
                  <img
                    src="/assets/easysub-gemini-hero.png"
                    width="1200"
                    height="658"
                    alt="Premium digital AI subscription dashboard visual"
                    fetchPriority="high"
                  />
                </picture>
              </div>
              <aside className="price-card" aria-label="Gemini Pro pricing card">
                <div className="price-row">
                  <div>
                    <p className="price-label">18 Months Access</p>
                    <p className="price">
                      790 <small>tk</small>
                    </p>
                  </div>
                  <span className="save-pill">Limited stock</span>
                </div>
                <a className="btn btn-primary js-order" href={checkoutUrl}>
                  Order Now
                </a>
              </aside>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Product Features</p>
              <h2>Everything included for premium AI productivity.</h2>
              <p className="section-text">
                A complete Gemini Pro access bundle made for creators, students, professionals
                and teams who want smarter Google Workspace tools.
              </p>
            </div>
            <div className="feature-grid">
              {[
                "Gemini Advanced Access",
                "5TB Google One Storage",
                "AI in Gmail",
                "AI in Google Docs",
                "AI in Google Sheets",
                "Priority Access to New AI Features",
                "Multi-Device Access",
                "Fast Account Delivery"
              ].map((feature) => (
                <article className="feature-card reveal" key={feature}>
                  <span className="check-icon">&#10003;</span>
                  {feature}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="why">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Why Choose EasySub</p>
              <h2>Built for smooth, secure digital delivery.</h2>
            </div>
            <div className="why-grid">
              <article className="why-card reveal">
                <div className="card-icon">&#8595;</div>
                <h3>Instant Delivery</h3>
                <p>Receive your subscription details quickly after the order is confirmed.</p>
              </article>
              <article className="why-card reveal">
                <div className="card-icon">*</div>
                <h3>Trusted Seller</h3>
                <p>EasySub focuses on reliable access and clear customer communication.</p>
              </article>
              <article className="why-card reveal">
                <div className="card-icon">$</div>
                <h3>Secure Payment</h3>
                <p>Pay through ZiniPay and receive access only after verification succeeds.</p>
              </article>
              <article className="why-card reveal">
                <div className="card-icon">?</div>
                <h3>Customer Support</h3>
                <p>Support is included for order help and subscription delivery questions.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">How It Works</p>
              <h2>From order to AI access in four simple steps.</h2>
            </div>
            <div className="steps">
              <article className="step-card reveal" data-step="01">
                <div className="step-number">1</div>
                <h3>Click Order Now</h3>
                <p>Start your checkout for the Gemini Pro 18 months plan.</p>
              </article>
              <article className="step-card reveal" data-step="02">
                <div className="step-number">2</div>
                <h3>Pay with ZiniPay</h3>
                <p>Enter customer details and complete hosted payment securely.</p>
              </article>
              <article className="step-card reveal" data-step="03">
                <div className="step-number">3</div>
                <h3>Verify Payment</h3>
                <p>The app verifies your invoice before assigning inventory.</p>
              </article>
              <article className="step-card reveal" data-step="04">
                <div className="step-number">4</div>
                <h3>Start Using Gemini Pro</h3>
                <p>Sign in and begin using Gemini Advanced and Google AI tools.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">FAQ</p>
              <h2>Quick answers before you order.</h2>
            </div>
            <div className="faq-grid">
              <article className="faq-item reveal">
                <h3>How long is the subscription valid?</h3>
                <p>18 Months.</p>
              </article>
              <article className="faq-item reveal">
                <h3>How will I receive my account?</h3>
                <p>On the payment success page after your ZiniPay invoice is verified.</p>
              </article>
              <article className="faq-item reveal">
                <h3>Which payment methods are accepted?</h3>
                <p>Available methods are shown on the hosted ZiniPay payment page.</p>
              </article>
              <article className="faq-item reveal">
                <h3>Is support available?</h3>
                <p>Yes, customer support is included.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="final-cta-title">
          <div className="container">
            <div className="final-cta reveal">
              <p className="eyebrow">Ready for premium AI access?</p>
              <h2 id="final-cta-title">Start Using Gemini Pro Today</h2>
              <p className="section-text final-cta-copy">
                Secure your 18 months access and get delivery after order confirmation.
              </p>
              <div className="final-actions">
                <a className="btn btn-primary js-order" href={checkoutUrl}>
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a href="#top" className="logo" aria-label="EasySub home">
              <span className="logo-mark">E</span>
              <span>EasySub</span>
            </a>
            <p>&copy; 2026 EasySub. All Rights Reserved.</p>
          </div>
          <div className="footer-links">
            <a href="#privacy" aria-label="Privacy Policy">
              Privacy Policy
            </a>
            <a href="#terms" aria-label="Terms and Conditions">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </footer>

      <Script
        id="landing-interactions"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            const revealItems = document.querySelectorAll(".reveal");

            if ("IntersectionObserver" in window) {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                  }
                });
              }, { threshold: 0.16 });

              revealItems.forEach((item) => observer.observe(item));
            } else {
              revealItems.forEach((item) => item.classList.add("is-visible"));
            }
          `
        }}
      />
    </>
  );
}
