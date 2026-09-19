# Prompt Library — Packs

Deliverable prompt packs for the storefront at `products/prompt-library/`.
Each file is copy-paste ready Markdown. Counts below are verified — keep the
storefront numbers in sync if you add prompts.

| Pack | File | Prompts | Price |
|---|---|---|---|
| Freelancer Client-Winning | `freelancer-client-winning.md` | 60 | ₹299 |
| Small Business Marketing | `small-business-marketing.md` | 43 | ₹349 |
| Content Creator | `content-creator.md` | 37 | ₹299 |
| **Bonus: Idea & Validation** | `bonus-idea-validation.md` | 20 | free with bundle |
| **Complete Bundle** | all four | **160** | ₹499 |

## Verify counts

```powershell
python -c "import re,glob; [print(p, len(re.findall(r'^\d+\. \*\*', open(p,encoding='utf-8').read(), re.M))) for p in glob.glob('products/prompt-library/packs/*.md')]"
```

## Before selling

1. Create the products on Gumroad / Instamojo (one per pack + a bundle).
2. Replace the `href="#"` on each `.buy-btn` in
   `products/prompt-library/index.html` with your real product URL.
   Each button carries `data-pack="freelancer|business|creator|bundle"`.
3. Attach the matching `.md` file as the deliverable for each product.
4. Keep prices consistent between the storefront and the checkout pages.

The buy buttons currently show a toast explaining the seller link is not set —
that is intentional so the page never links to a dead checkout.
