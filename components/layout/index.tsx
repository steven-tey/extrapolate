import { ReactNode } from "react";
import { BuyMeACoffee } from "../shared/icons";
import Nav from "@/components/layout/nav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed h-screen w-full bg-gradient-to-br from-emerald-100 via-blue-50 to-rose-100" />
      <Nav />
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
