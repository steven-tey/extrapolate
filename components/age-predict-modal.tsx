"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { create } from "zustand";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { LoadingDots } from "@/components/shared/icons";
import { UploadCloud } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { uploadAgePredict } from "@/app/actions/uploadAgePredict";

type AgePredictDialogStore = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useAgePredictDialog = create<AgePredictDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set(() => ({ open: open })),
}));

export function AgePredictDialog() {
  const [open, setOpen] = useAgePredictDialog((s) => [s.open, s.setOpen]);
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
              Upload Photo
            </DialogTitle>
          </DialogHeader>

          <Separator />

          {/* Upload */}
          <UploadForm />
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
            Upload Photo
          </DrawerTitle>
        </DrawerHeader>

        <Separator />

        {/* Upload */}
        <UploadForm />

        <DrawerFooter className="bg-muted">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function UploadForm() {
  const [data, setData] = useState<{
    image: string | null;
  }>({
    image: null,
  });

  const [fileSizeTooBig, setFileSizeTooBig] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFileSizeTooBig(false);
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 10) {
          setFileSizeTooBig(true);
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData],
  );

  // Move to useActionState in future release of Next.js
  const [state, uploadFormAction] = useFormState(uploadAgePredict, {
    message: "",
    status: 0,
  });

  return (
    <form
      action={uploadFormAction}
      className="grid gap-6 bg-muted px-4 py-8 md:px-16"
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="block text-sm font-medium text-gray-700">Photo</p>
          {fileSizeTooBig && (
            <p className="text-sm text-red-500">File size too big (max 5MB)</p>
          )}
        </div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
              setFileSizeTooBig(false);
              const file = e.dataTransfer.files && e.dataTransfer.files[0];
              if (file) {
                if (file.size / 1024 / 1024 > 10) {
                  setFileSizeTooBig(true);
                } else {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-white opacity-100 hover:bg-gray-50"
            }`}
          >
            <UploadCloud
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
            />
            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Recommended: 1:1 square ratio, with a clear view of your face
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image}
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
        {state?.message && <p className="text-destructive">{state.message}</p>}
      </div>

      <UploadButton data={data} />
    </form>
  );
}

export function UploadButton({ data }: { data: { image: string | null } }) {
  const { pending } = useFormStatus();

  const saveDisabled = useMemo(() => {
    return !data.image || pending;
  }, [data.image, pending]);

  return (
    <Button variant="outline" disabled={saveDisabled} className="w-full">
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p className="text-sm">Confirm upload</p>
      )}
    </Button>
  );
}
