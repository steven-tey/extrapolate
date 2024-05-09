"use client";

import { useState } from "react";
import { CircleDollarSign, CreditCard, LogOut } from "lucide-react";
import Popover from "@/components/shared/popover";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/types";

export default function UserDropdown({ user }: { user: User | null }) {
  const supabase = createClient();

  const name = user?.name;
  const email = user?.email;
  const image = user?.image;
  const [openPopover, setOpenPopover] = useState(false);

  if (!email) return null;

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-56">
            <div className="p-2">
              {name && (
                <p className="truncate text-sm font-medium text-gray-900">
                  {name}
                </p>
              )}
              <p className="truncate text-sm text-gray-500">{email}</p>
            </div>
            <button
              className="relative flex w-full cursor-not-allowed items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              disabled
            >
              <CircleDollarSign className="h-4 w-4" />
              <p className="text-sm">{user?.credits} Credits</p>
            </button>
            <button
              className="relative flex w-full cursor-not-allowed items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              disabled
            >
              <CreditCard className="h-4 w-4" />
              <p className="text-sm">Buy Credits</p>
            </button>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={async () => {
                supabase.auth.signOut().then(() => {
                  window.location.reload();
                });
              }}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">Logout</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <Image
            alt={email}
            src={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
            width={40}
            height={40}
          />
        </button>
      </Popover>
    </div>
  );
}
