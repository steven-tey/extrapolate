import { NextRequest } from "next/server";
import Replicate from "replicate";
import { nanoid } from "nanoid";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const replicate = new Replicate({
    // get your token from https://replicate.com/account
    auth: process.env.REPLICATE_API_TOKEN || "",
  });

  const supabaseAdmin = createAdminClient();

  // Get Image
  const formData = await req.formData();
  const image = formData.get("image") as File;
  if (!image) {
    return new Response("Missing image", { status: 400 });
  }

  // Rate limit
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
  });
  const { success } = await ratelimit.limit("upload");
  if (!success) {
    return new Response("Don't DDoS me pls 🥺", { status: 429 });
  }

  // Handle request
  // Generate key and insert id to supabase
  const { key } = await setRandomKey();

  const domain =
    process.env.NODE_ENV === "development"
      ? // run `pnpm tunnel` and set TUNNEL_URL
        process.env.TUNNEL_URL!
      : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  await Promise.allSettled([
    // Upload image to supabase storage
    supabaseAdmin.storage.from("data").upload(`/${key}`, image, {
      contentType: image.type,
      cacheControl: "3600",
      upsert: true,
    }),

    // Start replicate prediction
    replicate.predictions.create({
      version:
        "9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
      input: {
        image,
        target_age: "default",
      },
      webhook: `${domain}/api/images/${key}/webhook`,
      webhook_events_filter: ["completed"],
    }),
  ]).then((results) =>
    results.map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return result.reason;
      }
    }),
  );

  return new Response(JSON.stringify({ key }));
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