# Invoice & Quotation Generator

Free, client-side invoice/quotation/estimate maker with GST support, logo
upload, and one-click PDF export. Built for Indian freelancers and small
businesses.

## Features

- Invoice / Quotation / Estimate document modes
- Business + client details, optional logo (uploaded images stay on your device)
- Line items with quantity × rate, running totals
- GST at 5/12/18/28% and fixed-amount discounts
- Notes / payment terms section
- A4 PDF export (html2pdf.js), no watermark
- 100% client-side — no account, no server

## Usage

1. Open `index.html` in any modern browser
2. Fill in business and client details
3. Add line items (description, qty, rate)
4. Set GST % and any discount
5. Preview updates live on the right
6. Click **Download PDF**

## Technology

- Vanilla HTML/CSS/JS
- html2pdf.js (CDN) for PDF export
- FileReader → data URL for the logo

## License

MIT
