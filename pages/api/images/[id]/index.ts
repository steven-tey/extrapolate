import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DataProps } from "@/lib/types";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[3];
  // TODO: error handling
  const { data, error } = await supabase
    .from("data")
    .select("*")
    .eq("id", id)
    .returns<DataProps[]>()
    .single();
  return NextResponse.json(data);
}
