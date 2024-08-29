import "@/styles/globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Metadata, Viewport } from "next";
import cx from "classnames";
import Navbar from "@/components/layout/navbar";
import Script from "next/script";
import { Analytics } from "@/components/analytics";
import { Toaster } from "sonner";
import { Analytics as DubAnalytics } from "@dub/analytics/react";

const clash = localFont({
  src: "../styles/ClashDisplay-Semibold.otf",
  variable: "--font-clash",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://extrapolate-new.vercel.app"),
  title: "Extrapolate - Transform your face with Artificial Intelligence",
  description:
    "Extrapolate is an app for you to see how well you age by transforming your face with Artificial Intelligence.",
  openGraph: {
    title: "Extrapolate - Transform your face with Artificial Intelligence",
    description:
      "Extrapolate is an app for you to see how well you age by transforming your face with Artificial Intelligence.",
    images: "https://ref.extrapolate.app/og",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vercel",
    creator: "@steventey",
    title: "Extrapolate - Transform your face with Artificial Intelligence",
    description:
      "Extrapolate is an app for you to see how well you age by transforming your face with Artificial Intelligence.",
    images: "https://ref.extrapolate.app/og",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const CRISP_SCRIPT = `window.$crisp=[];window.CRISP_WEBSITE_ID="90ba947c-995a-46b5-a829-437e81c72cfa";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cx(clash.variable, inter.variable)}>
      <Script
        id="script-crisp"
        dangerouslySetInnerHTML={{
          __html: CRISP_SCRIPT,
        }}
        strategy="lazyOnload"
      />
      <body>
        <div className="fixed -z-10 h-screen w-screen bg-gradient-to-br from-emerald-100 via-blue-50 to-rose-100" />
        <Navbar />
        <DubAnalytics />
        <main className="min-h-screen py-32 antialiased">{children}</main>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
