# Build Status — Union Project

> State tracker for the `continue-build` skill. Update this file at the end of
> every completed phase so an interrupted session can resume with zero rework.

## Current product

- **product:** none — all 4 products are built
- **phase:** complete
- **last_completed:** landing-pages (gallery + 3 templates, all verified:
  balanced divs, no broken anchors/links, countdown JS passes `node --check`,
  4 pages serve HTTP 200) and prompt-library (storefront + 4 real prompt pack
  files totalling 160 prompts, all claims corrected to match actual counts,
  5 pages/files serve HTTP 200).
- **next_step (selling, optional):** create Gumroad/Instamojo products and
  replace the `href="#"` on each `.buy-btn` in
  `products/prompt-library/index.html` with real checkout URLs — checklist in
  `products/prompt-library/packs/README.md`. No code work remains.
- **known_issues:**
  - Skill discovery: `continue-build` and `auto-switch-model` load at session
    start; in a brand-new session mention them explicitly if needed.
  - `cline config` requires a TTY — cannot be run from the agent shell.

## Completed products

| Product | Status | Live URL |
|---|---|---|
| festival-greeting | ✅ live | https://paramjaiswal.github.io/union-project/products/festival-greeting/ |
| catalogue-builder | ✅ live | https://paramjaiswal.github.io/union-project/products/catalogue-builder/ |
| landing-pages | ✅ live | https://paramjaiswal.github.io/union-project/products/landing-pages/ |
| prompt-library | ✅ live (buy buttons need seller URLs) | https://paramjaiswal.github.io/union-project/products/prompt-library/ |

## Skills

| Skill | Purpose |
|---|---|
| `.cline/skills/continue-build` | Resume interrupted builds from BUILD-STATUS.md |
| `.cline/skills/auto-switch-model` | Stall detection + free-model handoff ladder (routes A/B/C) |

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
