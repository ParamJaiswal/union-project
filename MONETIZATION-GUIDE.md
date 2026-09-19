# Monetization & Free Deployment Guide

How to turn these four products into income — with zero hosting cost. All
advice is grounded in what is actually built and live right now. No made-up
income claims: figures are realistic ranges for consistent effort in India,
not promises.

## The big picture: two income layers

**Layer 1 — Direct sales (passive):** the Prompt Library packs sell as
downloadable products on Gumroad/Instamojo. Build once, sell repeatedly.

**Layer 2 — Services using the free tools as proof (active, faster money):**
the greeting generator, catalogue builder, and landing templates are free
tools that double as *demos of your skill*. You sell the done-for-you version
to people who found the free tool but don't want to DIY. This is usually the
faster first rupee because you're selling to local businesses with money.

---

## Step 1 — Set up payments (pick ONE to start)

### Option A: Instamojo (easiest for India)
1. Sign up at instamojo.com with your email + mobile.
2. Complete KYC: PAN, bank account (payouts go straight to your bank).
3. Create a "Digital Product" listing: upload the pack `.md` file as the
   deliverable, set price (₹299 / ₹349 / ₹299 / bundle ₹499).
4. Instamojo auto-generates a payment page link per product.
5. Fees: roughly 5% + payment-gateway charges (verify current rates on their
   pricing page). Payouts land in your bank in a few days.

### Option B: Gumroad (better if you also want international buyers)
1. Sign up at gumroad.com, set up payouts (check which payout methods are
   currently offered for India before committing).
2. Create 4 products, upload each `.md` file from
   `products/prompt-library/packs/`, add the price + a cover image
   (make one in your own Festival Greeting Generator — dogfooding).
3. Fees are higher than Instamojo (~10% + processing) but the checkout and
   delivery experience is polished.

### Option C: Razorpay Payment Pages (most professional for India)
1. Razorpay account + KYC (same documents).
2. Create Payment Pages for each pack; Razorpay emails the file after payment
   or you deliver via WhatsApp.
3. Fees around 2–3% — cheapest at volume, slightly more setup.

**Start with Instamojo today; add Gumroad later for global reach.**

### Step 1b — Wire the buy buttons (5 minutes)
Once you have the 4 product URLs, edit
`products/prompt-library/index.html` — find the four `<a>` tags with class
`buy-btn` and replace `href="#"` with your real links:

- `data-pack="freelancer"` → your freelancer pack checkout URL
- `data-pack="business"` → business pack URL
- `data-pack="creator"` → creator pack URL
- `data-pack="bundle"` → bundle URL

Also update the final CTA button (`Get the Bundle`) to the bundle URL.
Commit and push — the storefront goes live with real checkout in the same
GitHub Pages rebuild (1–2 minutes).

---

## Step 2 — Free deployment (already done, here's how it works)

The whole repo **is** the website: root `index.html` links all four products.
One deployment covers everything. GitHub Pages is already live and free.

### Already live: GitHub Pages (zero cost, forever)
- Repo → Settings → Pages → deploy from `master` / root (already configured).
- Every `git push` auto-rebuilds in 1–2 minutes.
- URL: `https://paramjaiswal.github.io/union-project/`
- Free upgrade path: add a custom domain later (domain costs ~₹500–₹900/year
  — the only optional expense; hosting stays free).

### Option: Cloudflare Pages (free, faster global CDN)
1. Sign up at pages.cloudflare.com → "Connect to Git" → pick this repo.
2. Build settings: framework preset **None**, build command **empty**,
   output directory **/** (root).
3. Deploy. You get `union-project.pages.dev` free, plus free SSL.
4. Bonus: Cloudflare analytics are free and privacy-friendly.

### Option: Netlify Drop (fastest, no account needed to preview)
1. Zip the repo folder (or drag the folder) onto app.netlify.com/drop.
2. Live in seconds on a free `*.netlify.app` URL.
3. For auto-deploy on push, connect the repo instead (still free).

### Option: Vercel (free hobby tier)
1. vercel.com → "Import Git Repository" → select the repo.
2. No framework detected → it serves the static root automatically.
3. Deploy. Free `*.vercel.app` URL.

**Recommendation:** keep GitHub Pages as primary (already working). Add
Cloudflare Pages as a mirror — one repo, two free CDNs, zero downtime risk.

### Custom domain from name.com (free hosting stays free)

The site currently lives at `https://paramjaiswal.github.io/union-project/`.
A custom domain serves it at `https://yourdomain.com/` (root — the
`/union-project/` prefix disappears; all internal links are relative, so
everything keeps working).

**Part 1 — DNS records at name.com (do this first):**
1. Log in → My Domains → your domain → **DNS Records / Manage**.
2. **Delete the default parking A record** name.com creates on `@` — it will
   block GitHub otherwise.
3. Add **4 A records** for the apex domain (Type `A`, Host `@`, TTL default):

   | Host | Type | Value |
   |------|------|-------|
   | @ | A | 185.199.108.153 |
   | @ | A | 185.199.109.153 |
   | @ | A | 185.199.110.153 |
   | @ | A | 185.199.111.153 |

4. Add a **CNAME** for www (Type `CNAME`, Host `www`,
   Value `paramjaiswal.github.io`).
5. Save. DNS propagation: usually minutes, can take up to 48h.

**Part 2 — GitHub side:**
1. Repo → **Settings → Pages** → Custom domain → enter `yourdomain.com` →
   Save. (This creates a `CNAME` file in the repo — commit it.)
2. Wait for the DNS check to pass, then tick **Enforce HTTPS**. GitHub issues
   a free Let's Encrypt certificate automatically (can take up to 24h).
3. `paramjaiswal.github.io/union-project` then 301-redirects to your domain.

**Part 3 — Update absolute URLs (send the domain to your agent):**
Once live, these files reference the old github.io URL and should be updated
to the new domain: `sitemap.xml`, `robots.txt`, the `og:url` meta tags on all
5 pages, and README/BUILD-STATUS links.

DNS record values are the official GitHub Pages IPs — always cross-check
against GitHub's docs if anything changes.



---

## Step 3 — Get the first 10 customers (the actual work)

### Today (2 hours)
1. Set up Instamojo + create the 4 prompt pack listings (1 hour).
2. Send me the URLs → I wire the buy buttons and push (5 minutes).
3. Make 20-post content bank using the Small Business pack prompts (30 min).

### Week 1 — Services to local businesses (fastest money)
1. Walk into / WhatsApp 20 local businesses (salons, clinics, boutiques,
   coaching centers, cafés). Pitch ONE thing per business:
   - no catalogue → "PDF catalogue in 24h, ₹499"
   - no website → "one-page site with WhatsApp button, ₹1,999"
2. Use your own tools live on your phone during the pitch — showing the
   catalogue builder build their catalogue in 2 minutes closes deals.
3. Close 3–5 = ₹2,000–₹8,000 in week one.

### Week 2–4 — Audience for the prompt packs
1. Post 1 reel/short daily: screen-record the tools doing something useful
   (greeting card in 30s, catalogue from photos, landing page in 60s).
2. End every post with the free tool link in bio → they use the tool →
   storefront link is one tap away.
3. Join 5 WhatsApp/Telegram groups where freelancers/small sellers hang out;
   share genuinely useful tips (from your own packs) 5× more often than links.
4. Festival timing: push the greeting generator 2 weeks before each festival —
   it is your organic growth engine.

### Ongoing
- Every landing page client = a testimonial + a case study post.
- Every festival = new greeting templates + a push to your growing audience.
- One new prompt pack every 4–6 weeks; bundle buyers get it free (as promised).

---

## Product-by-product earning model

### 1. Festival Greeting Generator (free tool)
- **Lead magnet:** put the link in your Instagram bio / WhatsApp Business
  profile / status. "Make free Diwali greetings" spreads fast before every
  festival. Each festival = a traffic spike.
- **Service:** custom bulk greetings for shops, clinics, and coaching centers —
  their logo + offer on a branded card, delivered as a set for the year.
  Charge ₹499–₹1,999 per business per festival season, or ₹999–₹2,999/year
  for all festivals.
- **Later (needs traffic):** AdSense or a "remove watermark" paid tier.

### 2. Catalogue PDF Builder (free tool)
- **Service (strongest):** local shops need catalogues for WhatsApp. Offer:
  "Send me your product photos and prices on WhatsApp, get a PDF catalogue
  in 24 hours — ₹499–₹1,499 depending on product count." The free tool does
  the work; you charge for curation, photos cleanup, and delivery.
- **Repeat revenue:** catalogue updates every season — charge ₹199–₹499 per
  update. Shops update stock constantly.
- **Templates niche:** jewellery, furniture, wholesale clothing catalogues
  sell well as templates on Gumroad (₹199 each).

### 3. Landing Page Templates (free pack)
- **Service:** "one-page website for your business — ₹1,999–₹4,999 including
  your content, free hosting setup, and a WhatsApp click-to-chat button."
  Local businesses pay this readily; your templates make delivery same-day.
- **Recurring:** hosting + edits retainer ₹199–₹499/month (optional).
- **Product:** sell the 3-template pack itself on Gumroad (₹199–₹499).

### 4. Prompt Library Storefront (paid product)
- **Direct sales:** 4 packs + bundle (₹299 / ₹349 / ₹299 / ₹499).
- **Audience fit:** freelancers and small-business owners who already use
  ChatGPT but get weak results.
- **Repeat revenue:** new pack every 4–6 weeks; bundle buyers get updates
  free (already promised on the page — keep that promise).

### Realistic expectations (honest math)
- First sale timeline: 1–4 weeks of consistent outreach — not passive.
- Catalogue/landing services at ₹999 avg: 10 clients = ₹10,000. Very
  achievable locally; 40+ shops exist in any single market area.
- Prompt packs at ₹399 avg: needs an audience or 30–50 targeted contacts per
  sale early on. Grows with your content posting.
- Do NOT expect passive income in month 1. The services layer pays first;
  the products compound later.

---

## Stay out of trouble (non-negotiables)

- **No spam:** never send unsolicited bulk WhatsApp messages. It gets your
  number banned and kills your reputation. Warm outreach = people who
  publicly follow your content or businesses you've genuinely engaged with.
- **No fake reviews or fabricated results:** the tools and templates are
  real; demo them honestly. Never invent client counts or income screenshots.
- **Honor the 7-day refund** shown on the prompt storefront — it's promised
  copy on a live page.
- **Taxes:** money from digital sales and services is taxable income. Track
  every payment; register for GST only if/when you cross the applicable
  threshold. Confirm specifics with a CA — this guide is not tax advice.
- **Client files are private:** catalogue products and client data you build
  with the tools belong to the client; never reuse or showcase them without
  written permission.

---

## First ₹1,000 checklist

- [ ] Instamojo account + KYC done
- [ ] 4 prompt pack listings created, `.md` files attached
- [ ] Buy button URLs sent to be wired into the storefront (5-min fix)
- [ ] List of 20 local businesses with WhatsApp numbers written down
- [ ] One demo rehearsed: catalogue built live in under 2 minutes
- [ ] Pitches sent: 20 (expect 3–5 responses — that is normal)
- [ ] First delivery done, payment received, testimonial requested
- [ ] Reinvest: 1 reel per week showing the tool that closed the deal

Everything on this list costs ₹0 except the products' optional custom domain
(~₹500–₹900/year). Hosting, SSL, and CDN are free forever on GitHub Pages /
Cloudflare Pages / Netlify / Vercel.
