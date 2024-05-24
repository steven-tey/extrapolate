import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserData } from "@/lib/types";

export const runtime = "edge";

type SupabaseWebhook = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: { [key: string]: any } | null;
  schema: string;
  old_record: { [key: string]: any } | null;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SupabaseWebhook;

  const supabase = createAdminClient();
  const stripe = new Stripe(
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? process.env.STRIPE_SECRET_KEY!
      : process.env.STRIPE_SECRET_KEY_TEST!,
  );

  const record = body.record as UserData;
  const old_record = body.old_record as UserData;

  switch (body.type) {
    case "INSERT":
      // create stripe customer
      const customer = await stripe.customers.create({
        name: record.name,
        email: record.email,
        metadata: {
          user_id: record.id,
        },
      });

      // add stripe_id to user on supabase
      await supabase
        .from("users")
        .update({ stripe_id: customer.id })
        .eq("id", record.id);

      // TODO: send welcome email?

      break;

    case "DELETE":
      // delete stripe customer
      await stripe.customers.del(old_record?.stripe_id!);

      // TODO: send bye email?

      break;
  }

  return new Response("OK", { status: 200 });
}
