# CMA Point — multi-page site + real backend

## Pages
- `index.html` — home, links to each level
- `cma-foundation.html`, `cma-inter.html`, `cma-final.html` — one page per level, each pulls its own courses live from the backend
- `faculty.html` — all faculty, pulled live
- `pricing.html` — plan tiers
- `admin.html` — **add and remove courses/faculty here** — this is your management panel

## Shared files (don't duplicate — every page reuses these)
- `styles.css` — design system
- `partials.js` — injects the header, footer, login modal, and cart drawer into every page automatically
- `site.js` — cart, login modal, mobile menu, Razorpay checkout logic
- `api.js` — talks to the backend (`API_BASE` constant — change this once deployed)

## Backend (`server.js`)
A real, running Express server with a SQLite database (`cmapoint.db`, created automatically on first run). This is what the admin panel talks to.

**Run it:**
```
npm install
cp .env.example .env      # then fill in your Razorpay keys and set your own ADMIN_KEY
node server.js
```
The API runs at `http://localhost:4000`. Leave this running while you browse the site locally — the pages fetch live data from it.

**Endpoints:**
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/courses?level=Foundation` | list courses, optionally filtered |
| POST | `/api/courses` | add a course *(needs `x-admin-key` header)* |
| PUT | `/api/courses/:id` | edit a course *(admin)* |
| DELETE | `/api/courses/:id` | remove a course *(admin)* |
| GET | `/api/faculty` | list faculty |
| POST / DELETE | `/api/faculty` | add/remove faculty *(admin)* |
| POST | `/api/payment/create-order` | Razorpay order creation |
| POST | `/api/payment/verify` | Razorpay signature check |
| POST | `/api/auth/send-otp` / `verify-otp` | mobile OTP login |

## How to add or remove a course
1. Run the backend (`node server.js`).
2. Open `admin.html` in your browser.
3. Enter your admin key (from `.env`, default `changeme123` — **change this**).
4. Fill the "Add a course" form, or click **Delete** next to any row in the table.
5. Refresh `cma-foundation.html` / `cma-inter.html` / `cma-final.html` — the change is already live, no code editing needed.

Same pattern for faculty, one section below on the same admin page.

## How to add a brand-new page (e.g. a blog, or a single course detail page)
1. Copy `cma-foundation.html` as a starting point — it already has the header/footer/modal wiring.
2. Change the `<title>`, `<meta description>`, and `<link rel="canonical">` for that page.
3. Add the new file's URL to `sitemap.xml`.
4. Add a link to it from `partials.js` (`HEADER_HTML` nav) if it should appear in the main menu.

## Going live
1. **Backend:** deploy `server.js` to Render or Railway (free tiers work). SQLite is a single file, which is fine for one server — if you outgrow it, swap `better-sqlite3` for `pg` (Postgres) using the same query shapes.
2. **Frontend:** deploy the HTML/CSS/JS files to Vercel or Netlify, connected to a GitHub repo for auto-deploy.
3. Update `API_BASE` in `api.js` to your deployed backend's URL.
4. Update `RAZORPAY_KEY_ID` in `site.js` to your real public key, and put the real secret key only in the backend's `.env`.
5. Set a strong, unique `ADMIN_KEY` in the backend's `.env` before this is public.
6. Point your domain (cmapoint.in) at the frontend deployment, submit `sitemap.xml` to Google Search Console.

## What I can help with next
- Wiring this to Claude Code so the backend actually deploys and stays running (I can't keep a server alive from this chat)
- Individual course detail pages (one per subject, with its own syllabus/SEO content)
- Proper login sessions (JWT) so students see "my courses" after logging in, not just OTP verification
