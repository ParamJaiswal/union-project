# Catalogue PDF Builder

Build professional product catalogues in your browser and export them as
print-ready PDFs — no signup, no backend, no watermarks.

## Features

- Add products with name, price (₹), SKU, description, and image
- Images via URL or file upload (embedded as data URLs, max 2 MB)
- Import/export catalogue data as CSV or JSON
- Live A4-style preview while you edit
- One-click PDF export (html2pdf.js, client-side)
- 100% client-side — data never leaves the browser

## Usage

1. Open `index.html` in a modern browser
2. Set the catalogue title/subtitle
3. Add products one by one (or import a CSV/JSON file)
4. Preview updates in real time on the right
5. Click **Download as PDF**

## CSV Format

```csv
name,price,sku,image,description
Handcrafted Lamp,499,SKU-001,https://example.com/lamp.jpg,Beautiful brass lamp
```

## JSON Format

```json
{
  "title": "My Catalogue",
  "subtitle": "2024 Collection",
  "products": [
    { "name": "Lamp", "price": 499, "sku": "SKU-001", "image": "", "description": "..." }
  ]
}
```

## Technology

- Vanilla HTML/CSS/JS (no frameworks)
- html2pdf.js (CDN) for PDF generation
- Local images via FileReader → data URL

## Deploy

Static site — works on GitHub Pages, Cloudflare Pages, Netlify, or Vercel.

## License

MIT
