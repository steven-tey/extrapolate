"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { getDomain } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function checkout({
  id,
  credits,
}: {
  id: string;
  credits: number;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .single();
  if (error) {
    return { message: "Unable to get user data", status: 400 };
  }

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    customer: userData.stripe_id!,
    client_reference_id: userData?.id,
    success_url: getDomain(),
    cancel_url: getDomain(),
    line_items: [
      {
        price: id,
        quantity: 1,
      },
    ],
    metadata: {
      credits: credits,
    },
    mode: "payment",
  });

  redirect(stripeCheckoutSession.url!);
}
