import { NextRequest, NextResponse } from "next/server";
import { DataProps } from "@/lib/types";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[3];

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // TODO: error handling
  const { data, error } = await supabase
    .from("data")
    .select("*")
    .eq("id", id)
    .returns<DataProps[]>()
    .single();
  return NextResponse.json(data);
}
