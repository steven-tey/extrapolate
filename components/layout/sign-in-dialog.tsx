"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { create } from "zustand";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Google, LoadingDots } from "@/components/shared/icons";
import { getURL } from "@/lib/utils";

type SignInDialogStore = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useSignInDialog = create<SignInDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set(() => ({ open: open })),
}));

export function SignInDialog() {
  const supabase = createClient();
  const [signInClicked, setSignInClicked] = useState(false);

  const [open, setOpen] = useSignInDialog((s) => [s.open, s.setOpen]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogContent className="gap-0 overflow-hidden p-0 md:rounded-2xl">
          <DialogHeader className="items-center justify-center space-y-3 px-16 py-8">
            <a href="https://precedent.dev">
              <Image
                src="/logo.png"
                alt="Logo"
                className="h-10 w-10 rounded-full"
                width={20}
                height={20}
              />
            </a>
            <DialogTitle className="font-display text-2xl font-bold leading-normal tracking-normal">
              Sign In
            </DialogTitle>
            <DialogDescription className="text-center">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {/* Sign In Button */}
          <div className="bg-muted flex flex-col space-y-4 px-16 py-8">
            <Button
              variant="outline"
              disabled={signInClicked}
              className={`w-full space-x-3 shadow-sm`}
              onClick={async () => {
                setSignInClicked(true);
                await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: getURL("/api/auth/callback"),
                  },
                });
              }}
            >
              {signInClicked ? (
                <LoadingDots color="#808080" />
              ) : (
                <>
                  <Google className="h-5 w-5" />
                  <p>Sign In with Google</p>
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="rounded-t-2xl">
        <DrawerHeader className="flex flex-col items-center justify-center space-y-3 px-4 py-8">
          <a href="https://precedent.dev">
            <Image
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
          </a>
          <DrawerTitle className="font-display text-2xl font-bold leading-normal tracking-normal">
            Sign In
          </DrawerTitle>
          <DrawerDescription className="text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </DrawerDescription>
        </DrawerHeader>

        <Separator />

        {/* Sign In Button */}
        <div className="bg-muted flex flex-col space-y-4 px-4 py-8">
          <Button
            variant="outline"
            disabled={signInClicked}
            className={`w-full space-x-3 shadow-sm`}
            onClick={async () => {
              setSignInClicked(true);
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: getURL("/api/auth/callback"),
                },
              });
            }}
          >
            {signInClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <Google className="h-5 w-5" />
                <p>Sign In with Google</p>
              </>
            )}
          </Button>
        </div>

        <DrawerFooter className="bg-muted">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
