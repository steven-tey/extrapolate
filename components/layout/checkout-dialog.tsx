"use client";

import { createClient } from "@/lib/supabase/client";
import useSWRImmutable from "swr/immutable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useUserDataStore } from "@/components/layout/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import { BackgroundGradient } from "@/components/aceternity-ui/background-gradient";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
    // TODO: sort by price in rpc, lowest --> greatest
    const get_products =
      process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? "get_products"
        : "get_products_dev";
    const { data: products, error } = await supabase.rpc(get_products);

    return products;
  });

  const sortedProducts = products?.sort((a: any, b: any) => a.price - b.price);

  const [open, setOpen] = useCheckoutDialog((s) => [s.open, s.setOpen]);
  const userData = useUserDataStore((s) => s.userData);
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
            <DialogDescription className="text-center">
              10 Credits = 1 Image
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <Pricing products={sortedProducts} />

          <DialogFooter className="bg-muted pb-8 text-sm text-muted-foreground sm:justify-center">
            {`You currently have ${userData?.credits} credits and can generate ${Math.floor((userData?.credits || 0) / 10)} images`}
          </DialogFooter>
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
          <DrawerDescription className="text-center">
            10 Credits = 1 Image
          </DrawerDescription>
        </DrawerHeader>

        <Separator />

        <Pricing products={sortedProducts} />

        <DrawerFooter className="bg-muted">
          <p className="text-center text-sm text-muted-foreground">{`You currently have ${userData?.credits} credits and can generate ${Math.floor((userData?.credits || 0) / 10)} images`}</p>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Pricing({ products }: { products: Product[] | null | undefined }) {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4 bg-muted px-4 py-8">
      {products?.map((product, index) => {
        if (index === 1) {
          return (
            <BackgroundGradient
              key={index}
              containerClassName={cn(
                "rounded-lg bg-card text-card-foreground shadow-sm",
                "rounded-2xl w-full",
                "p-[2.5px]",
              )}
              className={cn(
                "flex flex-row justify-between rounded-[14px] bg-background p-3",
              )}
            >
              <div>
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="flex flex-row items-center">
                    {product.name}
                    <Badge className="ml-2 scale-75">POPULAR</Badge>
                  </CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="flex flex-row space-x-2">
                    <li className="flex flex-row items-center">
                      <CircleCheck className="mr-2 size-4" />
                      {`${product.credits} credits`}
                    </li>
                    <li className="flex flex-row items-center">
                      <CircleCheck className="mr-2 size-4" />
                      {`$${product.price}`}
                    </li>
                  </ul>
                </CardContent>
              </div>
              <CardFooter className="flex items-center justify-center p-0">
                <CheckoutButton product={product} />
              </CardFooter>
            </BackgroundGradient>
          );
        }

        return (
          <Card
            className="flex w-full flex-row justify-between rounded-2xl p-3"
            key={index}
          >
            <div>
              <CardHeader className="p-0 pb-3">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="flex flex-row space-x-2">
                  <li className="flex flex-row items-center">
                    <CircleCheck className="mr-2 size-4" />
                    {`${product.credits} credits`}
                  </li>
                  <li className="flex flex-row items-center">
                    <CircleCheck className="mr-2 size-4" />
                    {`$${product.price}`}
                  </li>
                </ul>
              </CardContent>
            </div>
            <CardFooter className="flex items-center justify-center p-0">
              <CheckoutButton product={product} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function CheckoutButton({ product }: { product: Product | null | undefined }) {
  const [isPending, startTransition] = useTransition();

  const checkoutWithProps = checkout.bind(null, {
    price_id: product?.price_id!,
    credits: product?.credits!,
  });

  return (
    <Button
      className="w-24 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
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
          <p>Purchase</p>
        </>
      )}
    </Button>
  );
}
