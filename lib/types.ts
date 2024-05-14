import type Stripe from "stripe";
import { Tables } from "@/lib/supabase/types_db";

export type DataProps = Tables<"data">;

export type UserData = Tables<"users">;

export interface Product {
  id: string;
  price_id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
}

export interface StripeProduct
  extends Omit<
    Stripe.Product,
    "default_price" | "marketing_features" | "package_dimensions" | "tax_code"
  > {
  default_price: string | null | undefined;
  marketing_features:
    | Array<{
        name: string;
      }>
    | null
    | undefined;
  package_dimensions:
    | {
        height: number;
        length: number;
        weight: number;
        width: number;
      }
    | null
    | undefined;
  tax_code: string | null | undefined;
}

export interface StripePrice
  extends Omit<
    Stripe.Price,
    "custom_unit_amount" | "product" | "recurring" | "transform_quantity"
  > {
  custom_unit_amount:
    | {
        maximum: number | null;
        minimum: number | null;
        preset: number | null;
      }
    | null
    | undefined;
  product: string | null | undefined;
  recurring:
    | {
        aggregate_usage: Stripe.Price.Recurring.AggregateUsage | null;
        interval: Stripe.Price.Recurring.Interval;
        interval_count: number;
        meter?: string | null;
        trial_period_days: number | null;
        usage_type: Stripe.Price.Recurring.UsageType;
      }
    | null
    | undefined;
  transform_quantity:
    | {
        divide_by: number;
        round: Stripe.Price.TransformQuantity.Round;
      }
    | null
    | undefined;
}
