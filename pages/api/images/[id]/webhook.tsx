import { NextApiRequest, NextApiResponse } from "next";
import { getKey, redis } from "@/lib/upstash";
import { mutate } from "swr";
import sendMail from "emails";
import Notification from "emails/Notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, token } = req.query as { id: string; token: string };
  if (token !== process.env.WEBHOOK_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { output, status } = req.body;
  let response;
  if (status === "succeeded") {
    const { email } = (await getKey(id)) || {};
    if (email) {
      sendMail({
        subject: "Your Extrapolate results are ready!",
        to: email,
        component: <Notification url={`https://extrapolate.app/p/${id}`} />,
      });
    }
    response = await redis.set(id as string, {
      output,
    });
    mutate(`/api/images/${id}`);
  } else {
    response = null;
  }

  res.status(200).json(response);
}
