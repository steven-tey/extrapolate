import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/upstash";
import { mutate } from "swr";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as { id: string };
  const { output, status } = req.body;
  let response;
  if (status === "succeeded") {
    response = await redis.set(id as string, {
      output,
    });
    mutate(`/api/images/${id}`);
  } else {
    response = null;
  }

  res.status(200).json(response);
}
