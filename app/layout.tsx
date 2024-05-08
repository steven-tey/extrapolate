import "@/styles/globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import cx from "classnames";

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
    "Extrapolate is an app for you to see how well you age by transforming your face with Artificial Intelligence. 100% free and privacy friendly.",
  icons: "/favicon.ico",
  openGraph: {
    title: "Extrapolate - Transform your face with Artificial Intelligence",
    description:
      "Extrapolate is an app for you to see how well you age by transforming your face with Artificial Intelligence. 100% free and privacy friendly.",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vercel",
    creator: "@steventey",
    title: "Extrapolate - Transform your face with Artificial Intelligence",
    description:
      "Extrapolate is an app for you to see how well you age by transforming your face with Artificial Intelligence. 100% free and privacy friendly.",
    images: ["/api/og"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cx(clash.variable, inter.variable)}>
      <body>
        <div className="fixed h-screen w-full bg-gradient-to-br from-emerald-100 via-blue-50 to-rose-100" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
