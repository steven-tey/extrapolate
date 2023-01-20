import { NextApiRequest, NextApiResponse } from "next";
import { getKey, redis } from "@/lib/upstash";
import { mutate } from "swr";
import sendMail from "emails";
import Notification from "emails/Notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as { id: string };
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
