import Script from "next/script";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "EasySub | Google Gemini Pro - 18 Months Access",
  description:
    "Order Google Gemini Pro 18 Months Access from EasySub with Gemini Advanced, 5TB Google One storage, AI in Gmail, Docs and Sheets, and fast delivery.",
  keywords: [
    "EasySub",
    "Google Gemini Pro",
    "Gemini Advanced",
    "5TB Google One",
    "digital subscription",
  ],
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
    title: "EasySub - Google Gemini Pro - 18 Months Access",
    description:
      "Get Gemini Advanced, 5TB Google One Storage, AI in Gmail, Docs and Sheets. Instant delivery after payment.",
    type: "website",
    images: ["/assets/easysub-gemini-hero.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
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

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);
              t.async=1;
              t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xfjv1njfnw");
          `}
        </Script>
<Script id="meta-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;
    n.push=n;
    n.loaded=!0;
    n.version='2.0';
    n.queue=[];
    t=b.createElement(e);
    t.async=!0;
    t.src=v;
    s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '1351610486295544');
    fbq('track', 'PageView');
  `}
</Script>

<noscript>
  <img
    height="1"
    width="1"
    style={{ display: "none" }}
    src="https://www.facebook.com/tr?id=1351610486295544&ev=PageView&noscript=1"
    alt=""
  />
</noscript>
      </body>
    </html>
  );
}
