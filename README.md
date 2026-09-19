# Union Project — AI-Buildable Side-Income Digital Products

A suite of free/low-cost, deployable digital products built with client-side
HTML/CSS/JS — no backend, no recurring costs.

## Products

| # | Product | Description | Status |
|---|---------|-------------|--------|
| 1 | Festival Greeting Generator | Canvas-based greeting card maker with Hindi/English text, logo upload, image export | 🚧 Building |
| 2 | Catalogue PDF Builder | Generate product catalogues from a CSV/JSON data file | ⏳ Pending |
| 3 | Landing Page Template Pack | Responsive, production-ready landing page templates | ⏳ Pending |
| 4 | Prompt Library Storefront | Curated prompt packs sold via Gumroad/Instamojo | ⏳ Pending |

## Architecture

- **Frontend:** Vanilla HTML/CSS/JS + Canvas API (no frameworks)
- **Fonts:** Hindi fonts self-hosted via CDN (Devanagari support)
- **Deployment:** Cloudflare Pages (primary), GitHub Pages (backup)
- **Storage/Sales:** Gumroad / Instamojo for paid products; static hosting for free tools

## Development

Each product is a standalone folder under `products/`. Open `index.html` directly
to run locally — no dev server required.

## License

MIT — feel free to fork, modify, and deploy your own versions.