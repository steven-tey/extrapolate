"use client";

import { DataProps } from "@/lib/types";
import { useUploadModal } from "@/components/home/upload-modal";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Upload } from "lucide-react";
import PhotoBooth from "@/components/home/photo-booth";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function PhotoPage({
  id,
  blurDataURL,
  data: fallbackData,
}: {
  id: string;
  blurDataURL: string;
  data: DataProps;
}) {
  const [data, setData] = useState<DataProps>(fallbackData);

  // replicate only keeps generated predictions for 1 hr
  const expired =
    new Date(fallbackData?.created_at!) < new Date(Date.now() - 3600000);

  const supabase = createClient();
  const realtime = supabase.channel(id);

  if (!fallbackData?.output && !expired && !fallbackData?.failed) {
    realtime
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "data",
          filter: `id=eq.${id}`,
        },
        async (payload) => {
          setData(payload.new as DataProps);
          await realtime.unsubscribe();
          await supabase.removeChannel(realtime);
        },
      )
      .subscribe();
  }

  const { UploadModal, setShowUploadModal } = useUploadModal();

  return (
    <>
      <Toaster />
      <UploadModal />
      <motion.div
        className="z-10 max-w-2xl px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Your Results
        </motion.h1>
        {expired ? (
          <motion.div
            className="mx-auto mt-10 flex h-[350px] w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white sm:h-[600px] sm:w-[600px]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <p className="text-sm text-gray-500">
              Your photos have been deleted. Please upload a new photo.
            </p>
            <button
              className="group mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="h-5 w-5 text-white group-hover:text-black" />
              <p>Upload another photo</p>
            </button>
          </motion.div>
        ) : (
          <PhotoBooth
            id={id}
            input={data.input}
            blurDataURL={blurDataURL}
            output={data.output}
            failed={data.failed}
            className="h-[350px] sm:h-[600px] sm:w-[600px]"
          />
        )}
      </motion.div>
    </>
  );
}
