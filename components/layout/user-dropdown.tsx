import { UserData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Coins, CreditCard, LogOut, Receipt, Trash2 } from "lucide-react";
import { billing } from "@/app/actions/billing";
import { LoadingDots } from "@/components/shared/icons";
import {
  CheckoutDialog,
  useCheckoutDialog,
} from "@/components/layout/checkout-dialog";
import {
  DeleteAccountDialog,
  useDeleteAccountDialog,
} from "@/components/layout/delete-account-dialog";

export function UserDropdown({ userData }: { userData: UserData | null }) {
  const supabase = createClient();

  const name = userData?.name;
  const email = userData?.email;
  const image = userData?.image;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [stripeStatus, setStripeStatus] = useState<{
    success: boolean;
    credits: number;
  }>();

  const setShowDeleteAccountModal = useDeleteAccountDialog((s) => s.setOpen);

  useEffect(() => {
    // TODO: display stripe success or failure modal
    const stripeSuccess = searchParams.get("success") === "true";
    // Used to optimistically update credits
    const creditsToAdd = Number(searchParams.get("credits"));
    setStripeStatus({ success: stripeSuccess, credits: creditsToAdd });

    // Remove stripe search params
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("success");
    nextSearchParams.delete("credits");
    router.replace(`${pathname}?${nextSearchParams}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setShowCheckoutDialog = useCheckoutDialog((s) => s.setOpen);
  const [isPending, startTransition] = useTransition();

  if (!email) return null;

  return (
    <>
      <CheckoutDialog />
      <DeleteAccountDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-9 cursor-pointer">
            <AvatarImage
              alt={email}
              src={
                image || `https://avatars.dicebear.com/api/micah/${email}.svg`
              }
              width={40}
              height={40}
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <div className="p-2">
              {name && (
                <p className="truncate text-sm font-medium text-gray-900">
                  {name}
                </p>
              )}
              <p className="truncate text-sm text-gray-500">{email}</p>
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* Credits */}
          <DropdownMenuItem className="space-x-2" disabled>
            <Coins className="h-4 w-4" />
            <p className="text-sm">
              {stripeStatus?.success && stripeStatus?.credits
                ? userData?.credits + stripeStatus.credits
                : userData?.credits}{" "}
              Credits
            </p>
          </DropdownMenuItem>

          {/* Buy Credits */}
          <DropdownMenuItem
            className="space-x-2"
            onSelect={() => {
              setShowCheckoutDialog(true);
            }}
          >
            <CreditCard className="h-4 w-4" />
            <p className="text-sm">Buy Credits</p>
          </DropdownMenuItem>

          {/* Billing */}
          <DropdownMenuItem
            className="h-8 space-x-2"
            onSelect={(event) => {
              event.preventDefault();
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
          </DropdownMenuItem>

          {/* Logout */}
          <DropdownMenuItem
            className="space-x-2"
            onClick={async () => {
              supabase.auth.signOut().then(() => {
                window.location.reload();
              });
            }}
          >
            <LogOut className="h-4 w-4" />
            <p className="text-sm">Logout</p>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="space-x-2 focus:bg-destructive focus:text-destructive-foreground"
            onClick={() => setShowDeleteAccountModal(true)}
          >
            <Trash2 className="h-4 w-4" />
            <p className="text-sm">Delete Account</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
