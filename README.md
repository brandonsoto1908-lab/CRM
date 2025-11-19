# CRMRIC - Vercel deployment notes

This Next.js project is prepared to deploy on Vercel. Follow these steps:

1. Create a new project in Vercel and link this repository.
2. In your Vercel project settings > Environment Variables, add the following variables:
   - NEXT_PUBLIC_SUPABASE_URL = <your supabase url>
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = <your supabase anon key>
   - SUPABASE_URL = <your supabase url>
   - SUPABASE_SERVICE_ROLE_KEY = <your supabase service role key> (keep secret)

3. Deploy (Vercel will run `npm run build`).

Notes and changes applied:
- Added `lib/supabaseServerClient.js` that uses `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- Updated `lib/supabaseClient.js` to use NEXT_PUBLIC env vars for client-side usage.
- API routes under `pages/api/*` now import the server client to avoid bundling secrets.
- Added `.env.example` and `vercel.json` to map environment variables in Vercel.

Local testing:
- Copy `.env.example` to `.env.local` and fill values for local development.
- Run `npm install` then `npm run dev`.

If build fails, check server-side imports that may accidentally import client-only modules (like components with 'use client').


Quiero ver si este es el que ocupo 