import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/upstash";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  const { output, status } = await req.json();
  let response;
  if (status === "succeeded") {
    response = await redis.set(id as string, {
      output,
    });
  } else if (status === "failed") {
    response = await redis.set(id as string, {
      failed: true,
    });
  } else {
    response = null;
  }

  return NextResponse.json(response);
}
