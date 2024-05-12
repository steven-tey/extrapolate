import "server-only";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { getDomain } from "@/lib/utils";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function billing() {
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

  const stripeBillingSession = await stripe.billingPortal.sessions.create({
    customer: userData.stripe_id!,
    return_url: getDomain(),
  });

  redirect(stripeBillingSession.url);
}
