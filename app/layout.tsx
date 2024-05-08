import "@/styles/globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Provider as RWBProvider } from "react-wrap-balancer";
import { Analytics } from "@vercel/analytics/react";
import { Metadata, Viewport } from "next";

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
    <html lang="en" className={`${clash.variable} ${inter.variable}`}>
      <body>
        <RWBProvider>{children}</RWBProvider>
        <Analytics />
      </body>
    </html>
  );
}
