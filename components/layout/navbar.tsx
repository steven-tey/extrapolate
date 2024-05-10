/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "@/components/layout/sign-in-modal";
import UserDropdown from "./user-dropwdown";
import { UserData } from "@/lib/types";

export default function Navbar({ userData }: { userData: UserData | null }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  return (
    <>
      <SignInModal />
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
          <div>
            {userData ? (
              <UserDropdown userData={userData} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
