/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Github } from "@/components/shared/icons";
import useScroll from "@/lib/hooks/use-scroll";

export default function Nav() {
  const scrolled = useScroll(50);

  return (
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
            width="191"
            height="191"
            className="mr-2 size-[30px] rounded-sm"
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
  );
}
