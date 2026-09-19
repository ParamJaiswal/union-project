# Union Project — AI-Buildable Side-Income Digital Products

A suite of free/low-cost, deployable digital products built with client-side
HTML/CSS/JS — no backend, no recurring costs. All four products are live on
GitHub Pages.

## Products

| # | Product | Description | Status |
|---|---------|-------------|--------|
| 1 | [Festival Greeting Generator](https://paramjaiswal.github.io/union-project/products/festival-greeting/) | Canvas greeting cards, Hindi/English text, logo upload, PNG export | ✅ Live |
| 2 | [Catalogue PDF Builder](https://paramjaiswal.github.io/union-project/products/catalogue-builder/) | Product catalogues from CSV/JSON with images, prices, PDF export | ✅ Live |
| 3 | [Landing Page Template Pack](https://paramjaiswal.github.io/union-project/products/landing-pages/) | 3 single-file templates: SaaS, local business, event | ✅ Live |
| 4 | [Prompt Library Storefront](https://paramjaiswal.github.io/union-project/products/prompt-library/) | Storefront selling 4 AI prompt packs (160 prompts) via Gumroad/Instamojo | ✅ Live |

## Architecture

- **Frontend:** Vanilla HTML/CSS/JS + Canvas API (no frameworks, no build step)
- **Fonts:** Google Fonts CDN (Roboto + Hind for Devanagari)
- **Deployment:** GitHub Pages (live), Cloudflare Pages/Netlify also work — every product is a static folder
- **Storage/Sales:** Gumroad / Instamojo for the paid prompt packs; free tools hosted as-is

## Repo layout

```
├── index.html                    # product suite landing page
├── 404.html                      # branded 404 (GitHub Pages)
├── robots.txt / sitemap.xml      # SEO basics
├── LICENSE                       # MIT (site code; prompt packs excluded)
├── BUILD-STATUS.md               # build-state tracker for the continue-build skill
├── .cline/skills/                # agent skills (continue-build, auto-switch-model)
└── products/
    ├── festival-greeting/
    ├── catalogue-builder/
    ├── landing-pages/            # + templates/{saas,local-business,event}
    └── prompt-library/           # storefront; paid packs in packs/ (not published)
```

## Making money with this repo

See **[MONETIZATION-GUIDE.md](MONETIZATION-GUIDE.md)** — per-product earning
models, payment setup (Instamojo/Gumroad/Razorpay), free deployment options,
a first-customers playbook, and a first-₹1,000 checklist.

## Development

Each product is a standalone folder under `products/`. Open `index.html`
directly or serve the folder — no dev server or build step required.

## License

MIT for all site code and free tools — see [LICENSE](LICENSE).
The prompt pack content files are paid products and are **not** part of the
public repo; they are distributed through the checkout platform.