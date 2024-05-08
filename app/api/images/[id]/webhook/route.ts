import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[3];

  const { output, status } = await req.json();

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  let response;
  if (status === "succeeded") {
    const { error } = await supabase
      .from("data")
      .update({ output: output })
      .eq("id", id);
    response = error ?? 'OK';
  } else if (status === "failed") {
    const { error } = await supabase
      .from("data")
      .update({ failed: true })
      .eq("id", id);
    response = error ?? 'OK';
  } else {
    response = null;
  }

  return NextResponse.json(response);
}
