"use client";

import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
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

        <motion.div
          className="mx-auto mt-10 flex h-[350px] w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white sm:h-[600px] sm:w-[600px]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <p className="text-muted-foreground text-sm">
            Photo not found, please upload a new one.
          </p>
          <Link href="/">
            <Button className="hover:bg-primary-foreground hover:text-primary border-primary group mt-6 space-x-2 rounded-full border transition-colors">
              <Upload className="h-5 w-5 text-white group-hover:text-black" />
              <p>Upload another photo</p>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
