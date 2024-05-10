import { billing } from "@/app/actions/billing";
import { Receipt } from "lucide-react";
import { LoadingDots } from "@/components/shared/icons";
import { useTransition } from "react";

export function BillingButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      className={`${
        isPending && "cursor-not-allowed bg-gray-100"
      } relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100`}
      onClick={() => {
        startTransition(async () => {
          await billing();
        });
      }}
    >
      <Receipt className="h-4 w-4" />
      {isPending ? (
        <LoadingDots color="#808080" />
      ) : (
        <>
          <p className="text-sm">Billing</p>
        </>
      )}
    </button>
  );
}
