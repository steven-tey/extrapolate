import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.text();
  let event: Stripe.Event;

  const supabase = createAdminClient();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // verify webhook
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_CHECKOUT;
  const signature = req.headers.get("stripe-signature");
  try {
    if (!webhookSecret || !signature) {
      console.log("Webhook secret not found.");
      return new Response("Webhook secret not found.", { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.log(`Webhook Error: ${error}`);
    return new Response(`Webhook Error: ${error}`, { status: 400 });
  }

  const checkout = event.data.object as Stripe.Checkout.Session;
  const user_id = checkout.client_reference_id!;
  const stripe_id = checkout.customer as string;
  const creditsToAdd = Number(checkout.metadata?.credits);

  switch (event.type) {
    case "checkout.session.completed":
      if (
        checkout.status === "complete" &&
        checkout.payment_status === "paid"
      ) {
        const { data } = await supabase
          .from("users")
          .select("credits")
          .single();
        const newCredits = data?.credits! + creditsToAdd;

        const { error } = await supabase
          .from("users")
          .update({ credits: newCredits })
          .match({ id: user_id, stripe_id: stripe_id });

        if (error) {
          console.log(`Database Sync Error: ${error.message}`);
          return new Response(`Database Sync Error: ${error.message}`, {
            status: 400,
          });
        }
      }
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  return new Response("OK", { status: 200 });
}
