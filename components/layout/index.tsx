/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ReactNode } from "react";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";
import { BuyMeACoffee, Github } from "../shared/icons";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const scrolled = useScroll(50);

  return (
    <>
      <Meta {...meta} />
      <div className="fixed h-screen w-full bg-gradient-to-br from-emerald-100 via-blue-50 to-rose-100" />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <img
              src="/logo.png"
              alt="Logo image of a chat bubble"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            />
            <p>Extrapolate</p>
          </Link>
          <div className="flex items-center space-x-4">
            <a
              href="https://vercel.com/templates/next.js/extrapolate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="1155"
                height="1000"
                viewBox="0 0 1155 1000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
              >
                <path d="M577.344 0L1154.69 1000H0L577.344 0Z" fill="black" />
              </svg>
            </a>
            <a
              href="https://github.com/steven-tey/extrapolate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
            </a>
          </div>
        </div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        {children}
      </main>
      <div className="absolute w-full py-5 text-center">
        <p className="text-gray-500">
          A project by{" "}
          <a
            className="font-semibold text-gray-600 underline-offset-4 transition-colors hover:underline"
            href="https://twitter.com/steventey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Steven Tey
          </a>
        </p>
        <a
          href="https://www.buymeacoffee.com/steventey"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-2 flex max-w-fit items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-6 py-2 transition-all duration-75 hover:scale-105"
        >
          <BuyMeACoffee className="h-6 w-6" />
          <p className="font-medium text-gray-600">Buy me a coffee</p>
        </a>
      </div>
    </>
  );
}
