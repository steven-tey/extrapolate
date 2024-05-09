"use server";

import Replicate from "replicate";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export async function upload(formData: FormData) {
  const replicate = new Replicate({
    // get your token from https://replicate.com/account
    auth: process.env.REPLICATE_API_TOKEN || "",
  });

  const supabaseAdmin = createAdminClient();

  const image = formData.get("image") as File;
  if (!image) {
    return { message: "Missing image", status: 400 };
  }

  // Rate limit
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
  });
  const { success } = await ratelimit.limit("upload");
  if (!success) {
    return { message: "Don't DDoS me pls 🥺", status: 429 };
  }

  // Handle request
  // Generate key and insert id to supabase
  const { key } = await setRandomKey();

  const domain =
    process.env.NODE_ENV === "development"
      ? // run `pnpm tunnel` and set TUNNEL_URL
        process.env.TUNNEL_URL!
      : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const { data, error } = await supabaseAdmin.storage
    .from("data")
    .upload(`/${key}`, image, {
      contentType: image.type,
      cacheControl: "3600",
      upsert: true,
    });
  if (error)
    return { message: "Unexpected error uploading image", status: 400 };

  try {
    const prediction = await replicate.predictions.create({
      version:
        "9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
      input: {
        image: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/data/${key}`,
        target_age: "default",
      },
      webhook: `${domain}/api/webhooks/replicate/${key}`,
      webhook_events_filter: ["completed"],
    });

    if (
      prediction.error ||
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      return { message: "Prediction error generating gif", status: 400 };
    }
  } catch (e) {
    return { message: "Unexpected error generating gif", status: 400 };
  }

  redirect(`/p/${key}`);
}

// Generates new key that doesn't already exist in db
async function setRandomKey(): Promise<{ key: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  /* recursively set link till successful */
  const key = nanoid();
  const { error } = await supabase.from("data").insert({ id: key });
  if (error) {
    // by the off chance that key already exists
    return setRandomKey();
  } else {
    return { key };
  }
}
