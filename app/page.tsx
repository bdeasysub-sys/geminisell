import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { FacebookEvents } from "@/components/analytics/FacebookEvents";
import { PRODUCT_ANALYTICS } from "@/lib/analytics";
import { getCheckoutUrl, getSiteUrl } from "@/lib/env";
import "./landing.css";

const pageTitle = "Gemini AI Pro (18 মাস)";
const pageDescription =
  "bdsubscriptionhub-এ Gemini AI Pro 18 মাসের প্রিমিয়াম এক্সেস কিনুন। দ্রুত ডেলিভারি, নিরাপদ একাউন্ট এবং ২৪/৭ সাপোর্ট।";
const productImage = "/assets/easysub-gemini-hero.png";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `BD Subscription HUB | ${pageTitle}`,
    description: pageDescription,
    url: "/",
    siteName: "BD Subscription HUB",
    type: "website",
    images: [
      {
        url: productImage,
        width: 1200,
        height: 630,
        alt: "Gemini AI Pro 18 Months subscription offer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `BD Subscription HUB | ${pageTitle}`,
    description: pageDescription,
    images: [productImage]
  }
};

export const viewport: Viewport = {
  themeColor: "#050816"
};

export default function HomePage() {
  const checkoutUrl = getCheckoutUrl();
  const siteUrl = getSiteUrl();
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT_ANALYTICS.contentName,
    category: PRODUCT_ANALYTICS.contentCategory,
    description: pageDescription,
    image: `${siteUrl}${productImage}`,
    brand: {
      "@type": "Brand",
      name: "Google Gemini"
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: PRODUCT_ANALYTICS.value,
      priceCurrency: PRODUCT_ANALYTICS.currency,
      seller: {
        "@type": "Organization",
        name: "BD Subscription HUB"
      },
      url: `${siteUrl}${checkoutUrl}`
    }
  };

  return (
    <div className="landing-page">
      <FacebookEvents
        addToCartSelector="[data-analytics-event='add-to-cart']"
        trackViewContentEvent
      />
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="#home" className="brand" aria-label="BD Subscription HUB হোম">
            <span className="brand-mark">B</span>
            <span>BD Subscription HUB</span>
          </a>
          <nav className="main-nav" aria-label="Primary Navigation">
            <a href="#home">Home</a>
            <a href="#features">সুবিধাসমূহ</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href={checkoutUrl} className="btn btn-small" data-analytics-event="add-to-cart">
            Order Now
          </a>
        </div>
      </header>

      <main id="home">
        <section className="hero section">
          <div className="container hero-grid">
            <div className="hero-copy fade-in">
              <p className="eyebrow">Premium AI Access • Limited Time Offer</p>
              <h1>Gemini AI Pro (18 মাস)</h1>
              <p className="hero-text">
                একবার কিনুন, ১৮ মাস নির্ভরতার সাথে ব্যবহার করুন। দ্রুত, নিরাপদ ও
                সর্বোচ্চ পারফরম্যান্সে আপনার ডিজিটাল কাজগুলো সম্পন্ন করুন।
              </p>
              <div className="hero-actions">
                <a href={checkoutUrl} className="btn" data-analytics-event="add-to-cart">
                  এখনই অর্ডার করুন
                </a>
                <a href="#features" className="btn btn-secondary">
                  বিস্তারিত দেখুন
                </a>
              </div>
              <ul className="hero-badges">
                <li>⚡ ১৮ মাস ভ্যালিড</li>
                <li>🔒 Secure Access</li>
                <li>📦 Instant Delivery</li>
              </ul>
            </div>

            <div className="hero-visual fade-in">
              <div className="orb orb-one"></div>
              <div className="orb orb-two"></div>
              <div className="video-card">
                <div className="video-label">How to activate Gemini AI Pro (18 মাস)</div>
                <div className="video-frame">
                  <iframe
                    src="https://www.youtube.com/embed/RxgbfKFveqM"
                    title="How to activate Gemini AI Pro"
                    frameBorder="0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>        </section>

        <section id="features" className="section">
          <div className="container">
            <div className="section-heading fade-in">
              <p className="eyebrow">সুবিধাসমূহ</p>
              <h2>একাধিক প্রিমিয়াম সুবিধা একসাথে</h2>
            </div>
            <div className="card-grid">
              <article className="glass-card fade-in">
                <h3>✔ Gemini AI Pro Access</h3>
                <p>প্রিমিয়াম AI টুলের সম্পূর্ণ এক্সেস পেয়ে যান সাশ্রয়ী মূল্যে।</p>
              </article>
              <article className="glass-card fade-in">
                <h3>✔ দ্রুত ডেলিভারি</h3>
                <p>অর্ডার করার কিছুক্ষণের মধ্যেই আপনার এক্সেস নিশ্চিত করা হয়।</p>
              </article>
              <article className="glass-card fade-in">
                <h3>✔ নিরাপদ একাউন্ট</h3>
                <p>সিকিউর লগইন ও বিশ্বস্ত প্রক্রিয়ার মাধ্যমে আপনার তথ্য সুরক্ষিত।</p>
              </article>
              <article className="glass-card fade-in">
                <h3>✔ ২৪/৭ সাপোর্ট</h3>
                <p>যেকোনো সমস্যার সমাধানে আমাদের টিম সবসময় প্রস্তুত।</p>
              </article>
              <article className="glass-card fade-in">
                <h3>✔ Trusted Service</h3>
                <p>সুনির্দিষ্ট প্রক্রিয়া, পরিষ্কার যোগাযোগ এবং নির্ভরযোগ্য সেবা।</p>
              </article>
              <article className="glass-card fade-in">
                <h3>✔ Instant Delivery</h3>
                <p>পেমেন্টের পর অটো ডেলিভারি।</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading fade-in">
              <p className="eyebrow">কেন bdsubscriptionhub?</p>
              <h2>আপনার জন্য কেন এটি সেরা পছন্দ</h2>
            </div>
            <div className="card-grid why-grid">
              <article className="glass-card fade-in">
                <h3>প্রিমিয়াম মান</h3>
                <p>নতুন প্রযুক্তি উপযোগী, উচ্চমানের ব্যবহারকারীর অভিজ্ঞতা।</p>
              </article>
              <article className="glass-card fade-in">
                <h3>সাশ্রয়ী মূল্য</h3>
                <p>১৮ মাসের এক্সেস একদম আরামদায়ক মূল্যে।</p>
              </article>
              <article className="glass-card fade-in">
                <h3>দ্রুত সহায়তা</h3>
                <p>প্রশ্ন থাকলে আমরা দিনে-রাতে সাহায্য করি।</p>
              </article>
              <article className="glass-card fade-in">
                <h3>শান্তি ও নির্ভরযোগ্যতা</h3>
                <p>সঠিক তথ্য, সঠিক সময় এবং নির্ভরযোগ্য সেবা নিশ্চিত করি।</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading fade-in">
              <p className="eyebrow">কিভাবে অর্ডার করবেন?</p>
              <h2>তিনটি সহজ ধাপে সম্পন্ন করুন</h2>
            </div>
            <div className="timeline">
              <article className="timeline-card fade-in">
                <span className="step">Step 1</span>
                <h3>অর্ডার করুন</h3>
                <p>নির্বাচিত প্যাকেজটি ক্লিক করে অর্ডার প্রক্রিয়া শুরু করুন।</p>
              </article>
              <article className="timeline-card fade-in">
                <span className="step">Step 2</span>
                <h3>পেমেন্ট সম্পন্ন করুন</h3>
                <p>নিরাপদ পেমেন্ট পদ্ধতিতে আপনার অর্ডার নিশ্চিত করুন।</p>
              </article>
              <article className="timeline-card fade-in">
                <span className="step">Step 3</span>
                <h3>ইমেইলে Gemini AI Pro পেয়ে যান</h3>
                <p>অর্ডার নিশ্চিত হলে আপনার ইমেইলে এক্সেস ডিটেইলস পেয়ে যান।</p>
              </article>
            </div>
          </div>
        </section>

        <section id="pricing" className="section">
          <div className="container">
            <div className="offer-card fade-in">
              <div className="offer-header">
                <span className="offer-label">BEST VALUE</span>
                <h2>Gemini AI Pro</h2>
                <p className="offer-copy">
                  ১৮ মাসের প্রিমিয়াম সাবস্ক্রিপশন, দ্রুত ডেলিভারি, নিরাপদ একাউন্ট ও ২৪/৭
                  সাপোর্ট সহ।
                </p>
              </div>
              <div className="price-ring">
                <div className="price-tag">৳ 590</div>
                <p>এককালীন পেমেন্ট</p>
              </div>
              <div className="offer-buttons">
                <a href={checkoutUrl} className="btn btn-primary" data-analytics-event="add-to-cart">
                  এখনই অর্ডার করুন
                </a>
              </div>
              <div className="offer-details">
                <p>✔ ১৮ মাস এক্সেস • ✔ ইনস্ট্যান্ট ডেলিভারি • ✔ নিরাপদ সাপোর্ট</p>
              </div>
              <div className="offer-list">
                <span>✔ Gemini AI Pro অ্যাক্সেস</span>
                <span>✔ নিরাপদ ও বিশ্বস্ত ডিল</span>
                <span>✔ ২৪/৭ সাপোর্ট</span>
                <span>✔ এক্সপ্রেস এক্টিভেশন</span>
                <span>✔ পেমেন্টের পর অটো ডেলিভারি</span>
                <span>✔ নিজেই নিজেই অ্যাক্টিভ করতে পারবেন</span>
                <span>✔ কোন ইমেইল বা পাসওয়ার্ড শেয়ার করতে হবে না</span>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="section">
          <div className="container">
            <div className="section-heading fade-in">
              <p className="eyebrow">FAQ</p>
              <h2>সাধারণ প্রশ্নাবলী</h2>
            </div>
            <div className="faq-list">
              <details className="faq-item fade-in" open>
                <summary>Gemini AI Pro কীভাবে ব্যবহার করব?</summary>
                <p>একবার অর্ডার করলে আপনার ইমেইলে এক্সেস ডিটেইলস পাঠানো হবে।</p>
              </details>
              <details className="faq-item fade-in">
                <summary>ডেলিভারি কত দ্রুত?</summary>
                <p>পেমেন্টের পর অটো ডেলিভারি।</p>
              </details>
              <details className="faq-item fade-in">
                <summary>আমি কি একাধিক ডিভাইসে ব্যবহার করতে পারি?</summary>
                <p>হ্যাঁ, আপনার একাউন্টের শর্ত অনুযায়ী একাধিক ডিভাইসে ব্যবহার করা যায়।</p>
              </details>
              <details className="faq-item fade-in">
                <summary>অর্ডার করলে কি রিফান্ড পাওয়া যাবে?</summary>
                <p>সাধারণত রিফান্ডের নীতি নির্ধারিত থাকবে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।</p>
              </details>
              <details className="faq-item fade-in">
                <summary>সাপোর্ট কিভাবে পাবো?</summary>
                <p>Facebook, WhatsApp বা Telegram-এর মাধ্যমে সহজেই যোগাযোগ করতে পারেন।</p>
              </details>
              <details className="faq-item fade-in">
                <summary>পেমেন্ট কীভাবে করব?</summary>
                <p>নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে অর্ডার নিশ্চিত করুন।</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-wrap">
          <div>
            <h3>bdsubscriptionhub</h3>
            <p>Premium Digital Access, Simplified.</p>
          </div>
          <div className="footer-links">
            <a href="https://www.facebook.com/bdsubshub">Facebook</a>
            <a href="https://wa.me/8801726710485">WhatsApp</a>
            <a href="https://t.me/bdsubscriptionhub">Telegram</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2026 bdsubscriptionhub. All rights reserved.</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c")
        }}
      />
      <Script src="/landing/script.js" strategy="afterInteractive" />
    </div>
  );
}
