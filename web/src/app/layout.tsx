import type { Metadata } from "next";
import Script from "next/script";
import { UnifrakturMaguntia, Cormorant_Garamond, Noto_Serif_SC, Inter } from "next/font/google";
import "./globals.css";

const unifraktur = UnifrakturMaguntia({
  variable: "--font-unifraktur",
  weight: "400",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoserifsc = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "司辰塔罗 | Tarot of the Hours",
  description: "基于《密教模拟器》世界观的塔罗占卜",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${unifraktur.variable} ${cormorant.variable} ${notoserifsc.variable} ${inter.variable} antialiased bg-void text-primary-text font-serif`}
      >
        {children}
        <Script 
          src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
