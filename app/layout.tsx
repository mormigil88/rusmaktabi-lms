import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
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
    default: "Rus Maktabi — O'zbek bolalari uchun rus tili",
    template: "%s | Rus Maktabi",
  },
  description: "Bolangizni 4 haftada Rossiya maktabiga tayyorlaymiz. Bepul diagnostika — 20 daqiqa Zoom. 97% maktabga qabul kafolati.",
  keywords: ["rus tili", "maktab", "o'zbek bolalar", "Rossiya maktabi", "rus tili kursi"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://rusmaktabi.com"),
  openGraph: {
    title: "Rus Maktabi — Bolangizni Rossiya maktabiga 4 haftada tayyorlaymiz",
    description: "Bepul diagnostika — 20 daqiqa Zoom. 97% maktabga qabul kafolati. 200+ muvaffaqiyatli o'quvchi.",
    locale: "uz_UZ",
    type: "website",
    siteName: "Rus Maktabi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const YM_ID = 109950575;

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
        {children}

        {/* Yandex.Metrica */}
        <Script id="ym-init" strategy="afterInteractive">{`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
          ym(${YM_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
        `}</Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://mc.yandex.ru/watch/${YM_ID}`} style={{position:'absolute',left:'-9999px'}} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}
