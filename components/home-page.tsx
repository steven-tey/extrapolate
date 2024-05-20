"use client";

import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Balancer from "react-wrap-balancer";
import { Images, Upload } from "lucide-react";
import { nFormatter } from "@/lib/utils";
import PhotoBooth from "@/components/home/photo-booth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadDialog, useUploadDialog } from "@/components/home/upload-dialog";
import { FAQ } from "@/components/home/faq";

export default function HomePage({ count }: { count: number | null }) {
  const setShowUploadModal = useUploadDialog((s) => s.setOpen);
  return (
    <div className="flex flex-col items-center justify-center">
      <UploadDialog />
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
          <Balancer>See how well you age with AI</Balancer>
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer ratio={0.6}>
            Curious how you&apos;ll look in 10 years? 20 years? When you&apos;re
            90 years old? Upload a photo and find out!
          </Balancer>
        </motion.p>
        <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS} className="-mb-4">
          <div className="mt-6 flex flex-row justify-center space-x-4">
            <Button
              className="space-x-2 rounded-full border border-primary transition-colors hover:bg-primary-foreground hover:text-primary"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="h-5 w-5" />
              <p>Upload a Photo</p>
            </Button>

            <Link href={"/gallery"}>
              <Button className="space-x-2 rounded-full border border-primary transition-colors hover:bg-primary-foreground hover:text-primary">
                <Images className="h-5 w-5" />
                <p>My Gallery</p>
              </Button>
            </Link>
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">
            {count && count > 0
              ? `${nFormatter(370986 + count)} photos generated and counting!`
              : "Generate your photo now!"}
          </p>
        </motion.div>
        <PhotoBooth
          // input={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/data/input.jpg`}
          input="https://images.extrapolate.workers.dev/input.jpg"
          // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/ALjj/4mIh+P+/9Lv/wCn0+xeLxV9cWWUtL0AUz0tKQAAeVU0j4d/y2cTsDiuaawAAAAASUVORK5CYII="
          // output={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/data/output.gif`}
          output="https://images.extrapolate.workers.dev/output.gif"
          className="h-[350px] sm:h-[600px] sm:w-[600px]"
        />
      </motion.div>

      <FAQ />
    </div>
  );
}
