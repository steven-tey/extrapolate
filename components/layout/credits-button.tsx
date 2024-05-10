import { useFormStatus } from "react-dom";
import { LoadingDots } from "@/components/shared/icons";
import { Product } from "@/lib/types";
import { checkout } from "@/app/actions/checkout";

export function CreditsButton({ product }: { product: Product | null }) {
  const { pending } = useFormStatus();

  const checkoutWithProps = checkout.bind(null, {
    id: product?.id!,
    credits: product?.credits!,
  });

  return (
    <button
      formAction={checkoutWithProps}
      disabled={pending}
      className={`${
        pending
          ? "cursor-not-allowed border-gray-200 bg-gray-100"
          : "border border-gray-200 bg-white text-black hover:bg-gray-50"
      } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
    >
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <>
          <p>{`${product?.credits} - $${product?.price}`}</p>
        </>
      )}
    </button>
  );
}
