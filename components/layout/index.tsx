import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";

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
            <Image
              src="/logo.png"
              alt="Logo image of a chat bubble"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
            <p>Extrapolate</p>
          </Link>
          <a
            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            href="https://vercel.com/templates"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="h-4 w-4 group-hover:text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L20 20H4L12 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Deploy</p>
          </a>
        </div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        {children}
      </main>
      <div className="absolute w-full border-t border-gray-200 bg-white py-5 text-center">
        <p className="text-gray-500">
          Powered by{" "}
          <a
            className="font-semibold text-gray-600 transition-colors hover:text-black"
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel
          </a>{" "}
          and{" "}
          <a
            className="font-semibold text-gray-600 transition-colors hover:text-black"
            href="https://replicate.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Replicate
          </a>
          .
        </p>
      </div>
    </>
  );
}
