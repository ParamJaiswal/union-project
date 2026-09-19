# Prompt Library Storefront

A static storefront for selling curated AI prompt packs, plus the packs
themselves in `packs/`.

## Structure

```
prompt-library/
├── index.html                  # storefront (packs, free samples, FAQ, CTA)
├── README.md
── packs/
    ├── README.md               # pack inventory + pre-sale checklist
    ├── freelancer-client-winning.md    # 60 prompts
    ├── small-business-marketing.md     # 43 prompts
    ├── content-creator.md              # 37 prompts
    └── bonus-idea-validation.md        # 20 prompts (bundle bonus)
```

## Features

- 4 pack cards with prices, inclusions, and buy buttons
- 3 real, copyable sample prompts (clipboard API with `execCommand` fallback)
- FAQ and money-back guarantee copy
- Honest fallback: buy buttons with no URL show a "seller link not set" toast
- Fully client-side, no backend, no tracking

## Before selling

Follow `packs/README.md` — create the products on Gumroad/Instamojo, then
replace each `href="#"` on the `.buy-btn` elements with the real product URL.

## Deploy

Static site — works on GitHub Pages, Cloudflare Pages, Netlify, or Vercel.

## License

Site code: MIT. The prompt packs are paid products, not MIT-licensed content.