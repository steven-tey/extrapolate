## Features

- [Supabase](https://supabase.com) for Database, Auth, Storage, and Realtime 
  - [Database](https://supabase.com/database) - Replaces Upstash KV to store image data.
  - [Auth](https://supabase.com/auth) - Handle user accounts and link to stripe alongside database.
  - [Storage](https://supabase.com/storage) - Replaces Cloudflare R2 to store original images.
  - [Realtime](https://supabase.com/realtime) - Replaces polling to get output by listening to postgres changes.
  - More - RLS, Database Functions, etc


- [Stripe](https://stripe.com) for Billing
  - [Checkout](https://stripe.com/docs/payments/checkout) to buy credits for image generation.
  - [Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal) to manage billing and view invoices.
  - [Webhooks](https://docs.stripe.com/webhooks) to automatically sync product offerings with database.


- Next.js [App Router](https://nextjs.org/docs/app) 
  - Server Actions - Image uploads & creating Stripe sessions
  - Route Handlers - Supabase Auth, Vercel Cron Jobs, and Webhooks for Replicate, Stripe, and Supabase
  - Metadata - File-based & Config-based
  - Dynamic Routes - SSR 🚀
  - Vercel Cron Jobs - Remove all data and images older than 1 day 


## Setup / Migration Guide

### Pre-requisites
  - Vercel [Account](https://vercel.com/login) & [CLI](https://vercel.com/docs/cli)
  - Supabase [Account](https://supabase.com/dashboard/sign-in?) & [CLI](https://supabase.com/docs/guides/cli/getting-started?queryGroups=platform&platform=npx)
  - Stripe [Account](https://dashboard.stripe.com/login) & [CLI](https://docs.stripe.com/stripe-cli)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fajayvignesh01%2Fextrapolate-new&env=REPLICATE_API_TOKEN,STRIPE_SECRET_KEY,CRON_SECRET&envDescription=API%20Keys%20needed%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fajayvignesh01%2Fextrapolate-new%2Fblob%2Fmain%2F.env.example&project-name=extrapolate-new&repository-name=extrapolate-new&demo-title=Extrapolate%20New%20Demo&demo-url=https%3A%2F%2Fextrapolate-new.vercel.app&demo-image=https%3A%2F%2Fextrapolate-new.vercel.app%2Fopengraph-image&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fajayvignesh01%2Fextrapolate-new%2Ftree%2Fmain)

### Steps
  - Use the Deploy with Vercel button above. This will:
    1. Create a new git repository for the project.
    2. Set up the necessary Supabase environment variables and run the [SQL migrations](https://github.com/ajayvignesh01/extrapolate-new/tree/main/supabase/migrations) to set up the Database schema on a new project.
       - If for some reason the migrations weren't automatically run by the integration, or you are manually setting up Supabase, you can manually run them in the [SQL Editor](https://app.supabase.com/project/_/sql).
       - The integration should have also handled adding the site url and approved redirect urls for auth. But in case it didn't, you manually do so [here](https://app.supabase.com/project/_/auth/url-configuration).
    3. Set up some environment variables.
    
  - There are two more things we need to manually set up on Supabase
    1. We need to create a [Database Webhook](https://supabase.com/dashboard/project/_/database/hooks)
       - This will trigger the creation of a customer on stripe when a user creates an account.
       - Call the webhook "customer", have it trigger from insert and delete on public.users and send an HTTP POST request to `https://[YOUR_DOMAIN_HERE]/api/webhooks/supabase/customer`
    2. The final thing we have to do on Supabase is to enable Google OAuth.
       - You can follow the instructions from the official documentation [here](https://supabase.com/dashboard/project/_/database/hooks).

  - Now, we can configure Stripe
    1. Edit the webhook url in the stripe [webhook.json](https://github.com/ajayvignesh01/extrapolate-new/blob/main/stripe/webhook.json) file to match your domain.
    2. Run `pnpm fixtures:webhook`. This will set up a webhook to sync products/prices between Stripe & Supabase.

  - Back on Vercel
    1. Add the `STRIPE_WEBHOOK_SECRET` environment variable. You can find this in your [Stripe Webhooks Dashboard](https://dashboard.stripe.com/test/webhooks) under `Signing secret` for the specific webhook.
    2. Then add `TUNNEL_URL` env variable and make it an empty string. You will edit this in your `.env.local` when developing locally as needed.
    3. If you haven't already added your `REPLICATE_API_TOKEN` env variable, you can do that now as well.
    4. Now redeploy your app on Vercel, and wait for the deployment to complete before moving onto the next step.

  - Lastly, 
    1. Run `pnpm fixtures:products`. This will generate the default products/prices on your Stripe account.
    2. You can verify this worked by checking your [Stripe Dashboard](https://dashboard.stripe.com/test/products?active=true) & the products/prices table on [Supabase](https://supabase.com/dashboard/project/_/editor)
    3. You should be all set to go now!

### Additional

  - You can use the Stripe CLI to test webhooks locally. More info [here](https://docs.stripe.com/webhooks#test-webhook).
  - You can pull env variables from Vercel using `pnpm dlx vercel env pull`



