import { ratelimit, redis, setRandomKey } from "@/lib/upstash";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
  api: {
    bodyParser: {
      sizeLimit: "2200kb",
    },
  },
};

export default async function handler(req: NextRequest) {
  const { image, email } = await req.json();
  if (!image) {
    return new Response("Missing image", { status: 400 });
  }
  const { success } = await ratelimit.limit("upload");
  if (!success) {
    return new Response("Don't DDoS me pls 🥺", { status: 429 });
  }
  const { key } = await setRandomKey({
    email,
  });
  const domain =
    process.env.NODE_ENV === "development"
      ? "https://2aa7-2600-1700-b5e4-b50-f57d-e9fc-7d51-b85d.ngrok.io"
      : "https://extrapolate.app";

  const [r2, replicate, qstash] = await Promise.allSettled([
    fetch(`https://images.extrapolate.workers.dev/${key}`, {
      method: "PUT",
      headers: {
        "X-CF-Secret": process.env.CLOUDFLARE_WORKER_SECRET as string,
      },
      body: Uint8Array.from(atob(image.replace(/^data[^,]+,/, "")), (v) =>
        v.charCodeAt(0),
      ),
    }),
    fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
      body: JSON.stringify({
        version:
          "9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
        input: {
          image,
          target_age: "default",
        },
        webhook_completed: `${domain}/api/images/${key}/webhook?token=${process.env.REPLICATE_WEBHOOK_TOKEN}`,
      }),
    }).then((res) => res.json()),
    fetch(
      `https://qstash.upstash.io/v1/publish/${domain}/api/images/${key}/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.QSTASH_TOKEN,
          "Upstash-Delay": "1d",
        },
      },
    ),
  ]).then((results) =>
    results.map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return result.reason;
      }
    }),
  );

  const { id: replicateId } = replicate;

  // update replicateId in redis
  await redis.set(key, {
    replicateId,
    email,
  });

  return new Response(JSON.stringify({ key }));
}
