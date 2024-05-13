import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StripePrice } from "@/lib/types";
import type { PostgrestError } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.text();
  let event: Stripe.Event;

  const supabase = createAdminClient();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // verify webhook
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_PRICES;
  const signature = req.headers.get("stripe-signature");
  try {
    if (!webhookSecret || !signature) {
      console.log("Webhook secret not found.");
      return new Response("Webhook secret not found.", { status: 400 });
    }
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.log(`Webhook Error: ${error}`);
    return new Response(`Webhook Error: ${error}`, { status: 400 });
  }

  const price = event.data.object as StripePrice;

  let error: PostgrestError | null;

  // Handle the event
  switch (event.type) {
    case "price.created":
      const { error: insert_error } = await supabase
        .from("prices")
        .insert(price);
      error = insert_error;
      break;
    case "price.updated":
      const { error: update_error } = await supabase
        .from("prices")
        .update(price)
        .eq("id", price.id);
      error = update_error;
      break;
    case "price.deleted":
      const { error: delete_error } = await supabase
        .from("prices")
        .delete()
        .eq("id", price.id);
      error = delete_error;
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      error = null;
  }

  if (error) {
    console.log(`Database Sync Error: ${error.message}`);
    return new Response(`Database Sync Error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response("OK", { status: 200 });
}
