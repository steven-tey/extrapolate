import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StripePrice, StripeProduct } from "@/lib/types";
import type { PostgrestError } from "@supabase/supabase-js";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.text();
  let event: Stripe.Event;

  const supabase = createAdminClient();
  const stripe = new Stripe(
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? process.env.STRIPE_SECRET_KEY!
      : process.env.STRIPE_SECRET_KEY_TEST!,
  );

  // verify webhook
  const webhookSecret =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? process.env.STRIPE_WEBHOOK_SECRET
      : process.env.STRIPE_WEBHOOK_SECRET_TEST;
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

  const product = event.data.object as StripeProduct;
  const price = event.data.object as StripePrice;
  const checkout = event.data.object as Stripe.Checkout.Session;

  let error: PostgrestError | null = null;

  // Handle the event
  switch (event.type) {
    // Product
    case "product.created":
      const { error: product_insert_error } = await supabase
        .from("products")
        .insert(product);
      error = product_insert_error;
      break;
    case "product.updated":
      const { error: product_update_error } = await supabase
        .from("products")
        .update(product)
        .eq("id", product.id);
      error = product_update_error;
      break;
    case "product.deleted":
      const { error: product_delete_error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);
      error = product_delete_error;
      break;

    // Price
    case "price.created":
      const { error: price_insert_error } = await supabase
        .from("prices")
        .insert(price);
      error = price_insert_error;
      break;
    case "price.updated":
      const { error: price_update_error } = await supabase
        .from("prices")
        .update(price)
        .eq("id", price.id);
      error = price_update_error;
      break;
    case "price.deleted":
      const { error: price_delete_error } = await supabase
        .from("prices")
        .delete()
        .eq("id", price.id);
      error = price_delete_error;
      break;

    // Checkout
    case "checkout.session.completed":
      if (
        checkout.status === "complete" &&
        checkout.payment_status === "paid"
      ) {
        const { error: checkout_error } = await supabase.rpc("update_credits", {
          user_id: checkout.client_reference_id!,
          credit_amount: Number(checkout.metadata?.credits),
        });
        error = checkout_error;
      }
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      error = null;
      break;
  }

  if (error) {
    console.log(`Database Sync Error: ${error.message}`);
    return new Response(`Database Sync Error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response("OK", { status: 200 });
}
