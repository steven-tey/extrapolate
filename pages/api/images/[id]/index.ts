import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/upstash";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[3];
  const data = await getData(id);
  return NextResponse.json(data);
}
