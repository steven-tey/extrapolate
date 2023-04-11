import { getData } from "@/lib/upstash";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") as string;
  const data = await getData(id);
  if (data) {
    return NextResponse.json(data);
  } else {
    return new Response(null, {
      status: 404,
    });
  }
}
