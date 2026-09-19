# Build Status — Union Project

> State tracker for the `continue-build` skill. Update this file at the end of
> every completed phase so an interrupted session can resume with zero rework.

## Current product

- **product:** catalogue-builder (`D:\union project\products\catalogue-builder\`)
- **phase:** html
- **last_completed:** `index.html` lines 1–94 — head, header, editor tab with
  catalogue settings, add-product form, product list placeholder, and
  import/export buttons. File ends mid-`<aside>` at line 94 (`</div>` closing
  the editor tab content); about tab, preview section, footer, and closing
  tags are still missing.
- **next_step:** Append to `index.html` after line 94 (`      </div>` of the
  editor tab): the About tab (`<div class="tab-content" id="aboutTab">`),
  `</aside>`, the preview `<section class="preview-section">` (with
  `#downloadPdfBtn`, `#resetCatalogueBtn`, `#catalogueContent`,
  `#previewTitle`, `#previewSubtitle`, `#previewProductGrid`), `<footer>`,
  `<div id="toast"></div>`, `<script src="script.js"></script>`, `</body>`,
  `</html>`. Then create `style.css` (reuse festival-greeting design tokens)
  and `script.js` (product CRUD, CSV/JSON import-export, live preview,
  html2pdf.js export via the CDN script already in `<head>`).
- **known_issues:**
  - Multi-part `editor` inserts leave extra indentation/duplicate closers —
    inspect after each insert.
  - `editor` rejects `new_text` over ~6,000 chars; chunk large files.
  - PowerShell 5.1 quirks: no `&&`, no ternary, no `-TimeoutSeconds`.

## Completed products

| Product | Status | Live URL | Commit |
|---|---|---|---|
| festival-greeting | ✅ built, verified, deployed | https://paramjaiswal.github.io/union-project/products/festival-greeting/index.html | d47beaf |

## Environment notes

- git: repo at `D:\union project`, remote `origin` →
  `https://github.com/ParamJaiswal/union-project.git`, GitHub Pages builds
  from `master` / root.
- gh CLI: `C:\Users\dell\tools\gh\bin\gh.exe` (not on PATH); auth via
  `GH_TOKEN` env var (token extracted from Windows Credential Manager,
  scopes: repo, workflow, gist).
- Node v22.23.1, npm 10.9.8, Python 3.14.7 available.
- HTML head of catalogue-builder already loads html2pdf.js 0.10.1 from
  cdnjs with `defer`.
