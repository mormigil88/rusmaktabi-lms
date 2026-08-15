import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Footer from "@/components/footer";
import CookieBanner from "@/components/cookie-banner";
import MetaPixel from "@/components/meta-pixel";
import YandexMetrica from "@/components/yandex-metrica";
import AnalyticsPageTracker from "@/components/analytics-page-tracker";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Bilimora — O'zbek bolalari uchun rus tili",
    template: `%s | ${SITE_NAME}`,
  },
  description: "Bilimora — bolani Rossiya maktabiga qabul qilish uchun hujjatlar, majburiy rus tili testi va o'qituvchi bilan tayyorgarlik.",
  keywords: ["rus tili", "maktab", "o'zbek bolalar", "Rossiya maktabi", "rus tili kursi"],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Bilimora — Rossiya maktabiga qabul uchun yordam",
    description: "Hujjatlar chek-listi, rus tili testi va materiallardan keyin o'qituvchi bilan bepul diagnostika.",
    locale: "uz_UZ",
    type: "website",
    siteName: SITE_NAME,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const YM_ID = 109950575;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${lexend.variable} ${sourceSans.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <CookieBanner />
        <AnalyticsPageTracker />

        {/* Yandex.Metrica — only loads when the user has granted "all" cookie consent
            (see components/yandex-metrica.tsx). Default state = no script loaded. */}
        <YandexMetrica counterId={YM_ID} />

        {/* Google Analytics 4 — only loads when NEXT_PUBLIC_GA_ID is set (skip in local dev) */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                wait_for_update: 500,
              });
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: false });
            `}</Script>
          </>
        )}

        {/* Meta Pixel — only loads when NEXT_PUBLIC_META_PIXEL_ID is set; events are gated
            by the cookie-banner "Hammasi" consent (see lib/analytics.ts). */}
        {META_PIXEL_ID && <MetaPixel pixelId={META_PIXEL_ID} />}
      </body>
    </html>
  );
}
