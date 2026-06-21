import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Rus Maktabi — O'zbek bolalari uchun rus tili",
  description: "Bolangizni 4 haftada Rossiya maktabiga tayyorlaymiz. Bepul diagnostika.",
  openGraph: {
    title: "Rus Maktabi",
    description: "Bolangizni 4 haftada Rossiya maktabiga tayyorlaymiz.",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
