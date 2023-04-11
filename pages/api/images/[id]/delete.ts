import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/upstash";
import { verifySignature } from "@upstash/qstash/nextjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as {
    id: string;
  };
  await Promise.allSettled([
    fetch(`${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER}/${id}`, {
      method: "DELETE",
      headers: {
        "X-CF-Secret": process.env.CLOUDFLARE_WORKER_SECRET as string,
      },
    }),
    redis.set(id, {
      expired: true,
    }),
  ]);
  res.status(200).end();
}

export default verifySignature(handler);
