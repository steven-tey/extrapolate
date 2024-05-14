import { LoadingDots } from "@/components/shared/icons";
import { Product } from "@/lib/types";
import { checkout } from "@/app/actions/checkout";
import { useTransition } from "react";

export function CheckoutButton({ product }: { product: Product | null }) {
  const [isPending, startTransition] = useTransition();

  const checkoutWithProps = checkout.bind(null, {
    price_id: product?.price_id!,
    credits: product?.credits!,
  });

  return (
    <button
      disabled={isPending}
      className={`${
        isPending
          ? "cursor-not-allowed border-gray-200 bg-gray-100"
          : "border border-gray-200 bg-white text-black hover:bg-gray-50"
      } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
      onClick={() => {
        startTransition(async () => {
          await checkoutWithProps();
        });
      }}
    >
      {isPending ? (
        <LoadingDots color="#808080" />
      ) : (
        <>
          <p>{`${product?.credits} credits - $${product?.price}`}</p>
        </>
      )}
    </button>
  );
}
