import { getKey, redis } from "@/lib/upstash";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
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
    const { output } = (await getKey(id)) || {};
    if (!output) {
      await redis.set(id, {
        email,
      });
    }
    return new Response(JSON.stringify({ output }));
  } else {
    return new Response(null, {
      status: 404,
    });
  }
}
