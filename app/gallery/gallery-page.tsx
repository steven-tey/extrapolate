"use client";

import Balancer from "react-wrap-balancer";
import PhotoBooth from "@/components/home/photo-booth";
import { useRouter } from "next/navigation";
import { DataProps } from "@/lib/types";

export function GalleryPage({ data }: { data: DataProps[] | null }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
        <Balancer>Gallery</Balancer>
      </div>
      <div className="grid w-full gap-4 px-4 sm:grid-cols-2">
        {data?.map((row) => (
          <div
            key={row.id}
            className="cursor-pointer transition-all hover:scale-[1.01]"
            onClick={() => router.push(`/p/${row.id}`)}
          >
            <PhotoBooth
              id={row.id}
              input={row.input}
              output={row.output}
              failed={row.failed}
              initialState={0}
              className="h-full"
            />
          </div>
        ))}
      </div>
      {data?.length === 0 && (
        <div className="mt-8 flex items-center justify-center">
          <p>Upload a photo to see your gallery!</p>
        </div>
      )}
    </div>
  );
}
