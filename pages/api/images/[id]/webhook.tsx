import { NextApiRequest, NextApiResponse } from "next";
import { getData, redis } from "@/lib/upstash";
import sendMail from "emails";
import Notification from "emails/Notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, token } = req.query as { id: string; token: string };
  if (token !== process.env.REPLICATE_WEBHOOK_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { output, status } = req.body;
  let response;
  if (status === "succeeded") {
    const { email } = (await getData(id)) || {};
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
  } else if (status === "failed") {
    const { email } = (await getData(id)) || {};
    if (email) {
      sendMail({
        subject: "Extrapolate: Failed to process your image",
        to: email,
        component: <Notification url="https://extrapolate.app/" failed />,
      });
    }
    response = await redis.set(id as string, {
      failed: true,
    });
  } else {
    response = null;
  }

  res.status(200).json(response);
}
