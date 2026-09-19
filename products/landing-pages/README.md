# Landing Page Template Pack

3 production-ready, single-file landing page templates. No frameworks, no build
step — copy one file, customize, deploy on any static host.

## Templates

| Template | Path | Best for | Sections |
|---|---|---|---|
| **SaaS / App** | `templates/saas/` | Apps, software products | Hero, features grid, 3-tier pricing, FAQ, CTA |
| **Local Business** | `templates/local-business/` | Clinics, shops, services | Services + prices, about, hours, contact, tel: CTA |
| **Event** | `templates/event/` | Conferences, meetups, launches | Live countdown, speakers, schedule, ticket tiers, venue |

## Usage

1. Open a template and copy the single `index.html` (all CSS is inline).
2. Find & replace the business name, copy, prices, and contact details.
3. Change the color scheme via `:root` CSS variables (`--primary`, etc.).
4. Deploy free on Netlify Drop, Cloudflare Pages, Vercel, or GitHub Pages.

## Customization notes

- The event template countdown target is set in the inline `<script>`:
  `new Date('2027-12-14T09:00:00+05:30')` — replace with your event date
  (keep it in the future, and update the hero date badge to match).
- All templates are responsive (mobile-first breakpoints at 640–760px).
- Emoji icons are used instead of image assets — swap for real images if needed.

## License

MIT — commercial use allowed, no attribution required.
