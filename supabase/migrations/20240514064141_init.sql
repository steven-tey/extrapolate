/*
 TABLES
 */

create table
    public.users (
        id uuid not null default auth.uid (),
        credits numeric not null default '0'::numeric,
        name text not null,
        email text not null,
        image text null,
        stripe_id text null,
        constraint users_pkey primary key (id),
        constraint users_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;
CREATE POLICY "Enable select for users based on user_id" ON "public"."users" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "id"));
alter table public.users enable row level security;

create table
    public.data (
        id text not null,
        output text null,
        failed boolean null,
        created_at timestamp with time zone null default now(),
        user_id uuid null default auth.uid (),
        constraint data_pkey primary key (id),
        constraint data_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete set null
) tablespace pg_default;
alter publication supabase_realtime add table public.data;
create policy "Enable ALL for users based on user_id" on public.data to "authenticated" using ((( select "auth"."uid"() as "uid") = "user_id")) with check ((( select "auth"."uid"() as "uid") = "user_id"));
create policy "Enable read access for all users" on public.data for select using (true);
alter table public.data enable row level security;

create table
    public.products (
        id text not null,
        active boolean null,
        attributes jsonb null,
        created numeric null,
        default_price text null,
        description text null,
        images jsonb null,
        livemode boolean null,
        marketing_features jsonb null,
        metadata jsonb null,
        name text null,
        package_dimensions jsonb null,
        shippable boolean null,
        statement_descriptor text null,
        tax_code text null,
        type text null,
        unit_label text null,
        updated numeric null,
        url text null,
        object text null,
        constraint products_pkey primary key (id)
) tablespace pg_default;
alter table public.products enable row level security;

create table
    public.prices (
        id text not null,
        active boolean null,
        billing_scheme text null,
        created numeric null,
        currency text null,
        custom_unit_amount jsonb null,
        livemode boolean null,
        lookup_key text null,
        metadata jsonb null,
        nickname text null,
        product text null,
        recurring jsonb null,
        tax_behavior text null,
        tiers_mode text null,
        transform_quantity jsonb null,
        type text null,
        unit_amount numeric null,
        unit_amount_decimal text null,
        object text null,
        constraint prices_pkey primary key (id)
) tablespace pg_default;
alter table public.prices enable row level security;


/*
 Functions
 */

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
AS $$begin
    insert into public.users (id, email, name, image)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    return new;
end;$$;

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


/*
 Triggers
 */
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();