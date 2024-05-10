## Features

- [Supabase](https://supabase.com) for Database, Auth, Storage, and Realtime 
  - [Database](https://supabase.com/database) - Replaces Upstash KV to store image data.
  - [Auth](https://supabase.com/auth) - Handle user accounts and link to stripe alongside database.
  - [Storage](https://supabase.com/storage) - Replaces Cloudflare R2 to store original images.
  - [Realtime](https://supabase.com/realtime) - Replaces polling to get output by listening to postgres changes.
  - More - RLS, Database Functions, etc


- [Stripe](https://stripe.com) for Billing
  - [Stripe Checkout](https://stripe.com/docs/payments/checkout) to buy credits for image generation.
  - [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal) to manage billing and view invoices.
  - [Stripe Webhooks](https://docs.stripe.com/webhooks) to automatically sync product offerings with database.


- Next.js [App Router](https://nextjs.org/docs/app) 
  - Server Actions - Image uploads & creating Stripe sessions
  - Route Handlers - Supabase Auth, Vercel Cron Jobs, and Webhooks for Replicate, Stripe, and Supabase
  - Metadata - File-based & Config-based
  - Dynamic Routes - SSR 🚀
  - Vercel Cron Jobs - Remove all data and images older than 1 day 


## Setup / Migration Guide

- TO BE CONTINUED



