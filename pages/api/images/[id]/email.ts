import { getData, redis } from "@/lib/upstash";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") as string;
  const { email } = await req.json();
  if (!email) {
    return new Response(null, {
      status: 400,
    });
  }
  if (req.method === "POST") {
    const data = (await getData(id)) || {};
    if (data && !data.output) {
      await redis.set(id, {
        ...data,
        email,
      });
    }
    return new Response(JSON.stringify(data));
  } else {
    return new Response(null, {
      status: 404,
    });
  }
}
