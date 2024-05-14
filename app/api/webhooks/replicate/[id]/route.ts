import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/")[4];
  const { output, status } = await req.json();

  const supabase = createAdminClient();

  // Prediction successful --> update db --> user receives output via supabase realtime
  if (status === "succeeded") {
    const { error } = await supabase
      .from("data")
      .update({ output: output })
      .eq("id", id);
    if (error)
      new Response(`Error updating output: ${error.message}`, { status: 400 });
  }

  // Prediction failed --> update db --> user receives failed via supabase realtime --> user gets credits returned
  else if (status === "failed" || status === "cancelled") {
    // update db
    const { error } = await supabase
      .from("data")
      .update({ failed: true })
      .eq("id", id);
    if (error)
      new Response(`Error updating failed: ${error.message}`, { status: 400 });

    // get user_id for that prediction
    const { data, error: user_id_error } = await supabase
      .from("data")
      .select("user_id")
      .eq("id", id)
      .single();
    if (user_id_error || !data.user_id)
      new Response(`Error getting user_id: ${user_id_error?.message}`, {
        status: 400,
      });

    // if user_id exists, add 10 credits since prediction failed
    if (data?.user_id) {
      const { error } = await supabase.rpc("update_credits", {
        user_id: data.user_id,
        credit_amount: 10,
      });
      if (error)
        new Response(`Error returning credits: ${error.message}`, {
          status: 400,
        });
    }
  }

  return new Response("OK", { status: 200 });
}
