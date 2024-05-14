
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_products"() RETURNS TABLE("id" "text", "price_id" "text", "name" "text", "description" "text", "price" numeric, "credits" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY 
  SELECT
    products.id,
    prices.id,
    products.name,
    products.description,
    ROUND((prices.unit_amount / 100.0), 2),
    (products.metadata ->> 'credits')::NUMERIC
  FROM
    products
    JOIN prices ON products.id = prices.product
  WHERE products.active = true;
END;
$$;

ALTER FUNCTION "public"."get_products"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.users (id, email, name, image)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_credits"("user_id" "uuid", "credit_amount" numeric) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$

DECLARE current_credits numeric;

BEGIN
SELECT credits INTO current_credits FROM public.users WHERE id = user_id;

IF current_credits IS NOT NULL 
THEN UPDATE public.users SET credits = current_credits + credit_amount WHERE id = user_id;
ELSE RAISE EXCEPTION 'User not found or permission denied';
END IF;

RETURN current_credits + credit_amount;

END;
$$;

ALTER FUNCTION "public"."update_credits"("user_id" "uuid", "credit_amount" numeric) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."data" (
    "id" "text" NOT NULL,
    "output" "text",
    "failed" boolean,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" DEFAULT "auth"."uid"()
);

ALTER TABLE "public"."data" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."prices" (
    "id" "text" NOT NULL,
    "active" boolean,
    "billing_scheme" "text",
    "created" numeric,
    "currency" "text",
    "custom_unit_amount" "jsonb",
    "livemode" boolean,
    "lookup_key" "text",
    "metadata" "jsonb",
    "nickname" "text",
    "product" "text",
    "recurring" "jsonb",
    "tax_behavior" "text",
    "tiers_mode" "text",
    "transform_quantity" "jsonb",
    "type" "text",
    "unit_amount" numeric,
    "unit_amount_decimal" "text",
    "object" "text"
);

ALTER TABLE "public"."prices" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "text" NOT NULL,
    "active" boolean,
    "attributes" "jsonb",
    "created" numeric,
    "default_price" "text",
    "description" "text",
    "images" "jsonb",
    "livemode" boolean,
    "marketing_features" "jsonb",
    "metadata" "jsonb",
    "name" "text",
    "package_dimensions" "jsonb",
    "shippable" boolean,
    "statement_descriptor" "text",
    "tax_code" "text",
    "type" "text",
    "unit_label" "text",
    "updated" numeric,
    "url" "text",
    "object" "text"
);

ALTER TABLE "public"."products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "credits" numeric DEFAULT '0'::numeric NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "image" "text",
    "stripe_id" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."data"
    ADD CONSTRAINT "data_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "customer" AFTER INSERT OR DELETE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://extrapolate-new.vercel.app/api/webhooks/supabase/customer', 'POST', '{"Content-type":"application/json"}', '{}', '1000');

ALTER TABLE ONLY "public"."data"
    ADD CONSTRAINT "data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable ALL for users based on user_id" ON "public"."data" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable read access for all users" ON "public"."data" FOR SELECT USING (true);

CREATE POLICY "Enable select for users based on user_id" ON "public"."users" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

ALTER TABLE "public"."data" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_products"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_products"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_products"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_credits"("user_id" "uuid", "credit_amount" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."update_credits"("user_id" "uuid", "credit_amount" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_credits"("user_id" "uuid", "credit_amount" numeric) TO "service_role";

GRANT ALL ON TABLE "public"."data" TO "anon";
GRANT ALL ON TABLE "public"."data" TO "authenticated";
GRANT ALL ON TABLE "public"."data" TO "service_role";

GRANT ALL ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
