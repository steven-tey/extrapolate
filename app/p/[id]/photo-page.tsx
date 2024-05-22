"use client";

import { DataProps } from "@/lib/types";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import PhotoBooth from "@/components/home/photo-booth";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function PhotoPage({
  id,
  data: fallbackData,
}: {
  id: string;
  data: DataProps;
}) {
  const [data, setData] = useState<DataProps>(fallbackData);

  const supabase = createClient();
  const realtime = supabase.channel(id);

  if (!fallbackData?.output && !fallbackData?.failed) {
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

  return (
    <div className="flex flex-col items-center justify-center">
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
        <PhotoBooth
          id={id}
          input={data.input}
          output={data.output}
          failed={data.failed}
          className="h-[350px] sm:h-[600px] sm:w-[600px]"
        />
      </motion.div>
    </div>
  );
}
