import { getData } from "@/lib/upstash";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") as string;
  const data = await getData(id);
  if (data) {
    return new Response(JSON.stringify(data));
  } else {
    return new Response(null, {
      status: 404,
    });
  }
}
