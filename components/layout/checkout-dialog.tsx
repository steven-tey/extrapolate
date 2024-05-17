"use client";

import { createClient } from "@/lib/supabase/client";
import useSWRImmutable from "swr/immutable";
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
import { Product } from "@/lib/types";
import { useTransition } from "react";
import { checkout } from "@/app/actions/checkout";
import { LoadingDots } from "@/components/shared/icons";

type CheckoutDialogStore = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useCheckoutDialog = create<CheckoutDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set(() => ({ open: open })),
}));

export function CheckoutDialog() {
  const supabase = createClient();

  const { data: products } = useSWRImmutable("get_products", async () => {
    const { data: products, error } = await supabase.rpc("get_products");

    return products;
  });

  const [open, setOpen] = useCheckoutDialog((s) => [s.open, s.setOpen]);
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
              Buy Credits
            </DialogTitle>
            <DialogDescription>10 Credits = 1 Image</DialogDescription>
          </DialogHeader>

          <Separator />

          {/* Buttons */}
          <div className="flex flex-col space-y-4 bg-gray-50 px-16 py-8">
            {products
              ?.sort((a: any, b: any) => a.price - b.price)
              .map((product) => (
                <CheckoutButton key={product.id} product={product} />
              ))}
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
            Buy Credits
          </DrawerTitle>
          <DrawerDescription>10 Credits = 1 Image</DrawerDescription>
        </DrawerHeader>

        <Separator />

        {/* Buttons */}
        <div className="bg-muted flex flex-col space-y-4 px-4 py-8">
          {products
            ?.sort((a: any, b: any) => a.price - b.price)
            .map((product) => (
              <CheckoutButton key={product.id} product={product} />
            ))}
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

function CheckoutButton({ product }: { product: Product | null }) {
  const [isPending, startTransition] = useTransition();

  const checkoutWithProps = checkout.bind(null, {
    price_id: product?.price_id!,
    credits: product?.credits!,
  });

  return (
    <Button
      variant="outline"
      className="w-full focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      onClick={() => {
        startTransition(async () => {
          await checkoutWithProps();
        });
      }}
      disabled={isPending}
    >
      {isPending ? (
        <LoadingDots color="#808080" />
      ) : (
        <>
          <p>{`${product?.credits} credits - $${product?.price}`}</p>
        </>
      )}
    </Button>
  );
}
