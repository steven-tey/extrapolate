"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { getDomain } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function checkout({
  price_id,
  credits,
}: {
  price_id: string;
  credits: number;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const stripe = new Stripe(
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? process.env.STRIPE_SECRET_KEY!
      : process.env.STRIPE_SECRET_KEY_TEST!,
  );

  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .single();
  if (error) {
    return { message: "Unable to get user data", status: 400 };
  }

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    customer:
      process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? userData.stripe_id!
        : userData.stripe_id_dev!,
    client_reference_id: userData?.id,
    // TODO: modal to show result
    success_url: getDomain(`/?success=true&credits=${credits}`),
    cancel_url: getDomain(`/?success=false&credits=${credits}`),
    line_items: [
      {
        price: price_id,
        quantity: 1,
      },
    ],
    metadata: {
      credits: credits,
    },
    invoice_creation: {
      enabled: true,
    },
    mode: "payment",
  });

  redirect(stripeCheckoutSession.url!);
}
