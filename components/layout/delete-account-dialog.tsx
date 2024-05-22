"use client";

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
import { useEffect } from "react";
import { LoadingDots } from "@/components/shared/icons";
import { deleteAccount } from "@/app/actions/deleteAccount";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";

type DeleteDialogStore = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useDeleteAccountDialog = create<DeleteDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set(() => ({ open: open })),
}));

export function DeleteAccountDialog() {
  const [open, setOpen] = useDeleteAccountDialog((s) => [s.open, s.setOpen]);
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
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-center">
              This account will be deleted along with all your uploaded images
              and AI generated images/gifs.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {/* Buttons */}
          <div className="flex flex-col space-y-4 bg-muted px-16 py-8">
            <DeleteAccountForm />
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
            Delete Account
          </DrawerTitle>
          <DrawerDescription className="text-center">
            This account will be deleted along with all your uploaded images and
            AI generated images/gifs.
          </DrawerDescription>
        </DrawerHeader>

        <Separator />

        {/* Buttons */}
        <div className="flex flex-col space-y-4 bg-muted px-4 py-8">
          <DeleteAccountForm />
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

function DeleteAccountForm() {
  const [state, deleteAccountFormAction] = useFormState(deleteAccount, {
    message: "",
    status: 0,
  });

  useEffect(() => {
    if (state.message.includes("Successfully deleted account for")) {
      window.location.reload();
    }
  }, [state]);

  return (
    <form action={deleteAccountFormAction} className="flex flex-col space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="deleteConfirmation">
          To verify, type <b>delete my account</b> below:
        </Label>
        <Input
          type="text"
          id="deleteConfirmation"
          name="deleteConfirmation"
          required
          pattern="delete my account"
          className="w-full"
        />
        {state?.message && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </div>
      <DeleteAccountButton />
    </form>
  );
}

function DeleteAccountButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      className="w-full focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      disabled={pending}
    >
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <>
          <p>Delete Account</p>
        </>
      )}
    </Button>
  );
}
