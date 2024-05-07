import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[3];

  const { output, status } = await req.json();
  let response;
  if (status === "succeeded") {
    const { error } = await supabase
      .from("data")
      .update({ output: output })
      .eq("id", id);
    response = error;
  } else if (status === "failed") {
    const { error } = await supabase
      .from("data")
      .update({ failed: true })
      .eq("id", id);
    response = error;
  } else {
    response = null;
  }

  return NextResponse.json(response);
}
