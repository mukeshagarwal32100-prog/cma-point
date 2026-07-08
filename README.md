# CMA Point — starter build

## What's here
- `index.html` — homepage: hero, course grid, faculty grid, test series, pricing, login modal, cart drawer
- `styles.css` — RankEdge design system (teal #0b617e, Bricolage Grotesque, Inter, JetBrains Mono)
- `script.js` — renders course/faculty/pricing data, cart logic, login modal, Razorpay checkout call
- `server.js` — reference Node/Express backend: Razorpay order creation + signature verification + OTP login
- `robots.txt`, `sitemap.xml` — baseline SEO crawling files

## Why it's fast
- Plain HTML/CSS/JS — no framework bundle to download and parse
- Fonts loaded with `display=swap` and `preconnect` so text isn't blocked
- No render-blocking scripts (Razorpay + script.js both load `defer`)
- Structured data (Course schema) generated from real data, not left empty

## What's real vs. placeholder
**Real:** the frontend, layout, all copy, the exact Razorpay checkout call flow (create-order → open checkout → verify signature) — this is the correct, secure pattern.
**Placeholder:** `RAZORPAY_KEY_ID` in script.js, and `server.js` isn't running anywhere — it's a template. Course/faculty data is hardcoded in script.js instead of coming from a database.

## To make this live
1. **Get Razorpay keys** — sign up at razorpay.com, get a test key first, live key after KYC.
2. **Stand up the backend** — take `server.js`, add a real database (Postgres via Supabase/Neon is the easiest free option), deploy it (Render or Railway both have free tiers).
3. **Swap the placeholder key** in `script.js` (`RAZORPAY_KEY_ID`) for your real one.
4. **Host the frontend** — Vercel or Netlify, free tier, connect to a GitHub repo for auto-deploy on every push.
5. **Point your domain** (cmapoint.in) at the Vercel/Netlify deployment.
6. **Submit to Google Search Console** — verify domain, submit `sitemap.xml`.

## Next steps I can help with
- Individual level pages (Foundation/Inter/Final) with their own SEO metadata, matching your CMA Inter hero work
- Wiring this to Claude Code so the backend + database actually run and deploy, not just sit as reference files
- A real admin panel to add/edit courses and faculty instead of hardcoded data
