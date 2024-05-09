"use client";

import { useFormStatus } from "react-dom";
import { LoadingDots } from "@/components/shared/icons";
import { useMemo } from "react";

export function UploadButton({ data }: { data: { image: string | null } }) {
  const { pending } = useFormStatus();

  const saveDisabled = useMemo(() => {
    return !data.image || pending;
  }, [data.image, pending]);

  return (
    <button
      disabled={saveDisabled}
      className={`${
        saveDisabled
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          : "border-black bg-black text-white hover:bg-white hover:text-black"
      } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
    >
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p className="text-sm">Confirm upload</p>
      )}
    </button>
  );
}
