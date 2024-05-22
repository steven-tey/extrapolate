/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { UserDropdown } from "./user-dropdown";
import { createClient } from "@/lib/supabase/client";
import useSWRImmutable from "swr/immutable";
import { Button } from "@/components/ui/button";
import {
  SignInDialog,
  useSignInDialog,
} from "@/components/layout/sign-in-dialog";
import { Tables } from "@/lib/supabase/types_db";
import { create } from "zustand";

type UserDataStore = {
  userData: Tables<"users"> | null;
  setUserData: (userData: Tables<"users"> | null) => void;
};

export const useUserDataStore = create<UserDataStore>((set) => ({
  userData: null,
  setUserData: (userData) => set(() => ({ userData: userData })),
}));

export default function Navbar() {
  const setUserData = useUserDataStore((s) => s.setUserData);

  const supabase = createClient();

  const { data: userData, isLoading } = useSWRImmutable(
    "userData",
    async () => {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .single();

      setUserData(userData);

      return userData;
    },
  );

  const setShowSignInDialog = useSignInDialog((s) => s.setOpen);
  const scrolled = useScroll(50);

  return (
    <>
      <SignInDialog />
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
              !isLoading && (
                <Button
                  size="sm"
                  className="rounded-full border border-primary transition-all hover:bg-primary-foreground hover:text-primary"
                  onClick={() => setShowSignInDialog(true)}
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
