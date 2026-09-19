---
name: continue-build
description: Resume an interrupted build in the Union Project workspace. Use when the previous response was cut off mid-build (model delay/timeout), when the user says "continue", "resume", or "keep going", or when a file ends abruptly. Reads BUILD-STATUS.md to find the exact resume point and never restarts finished work.
---

# Continue Build — Resume Protocol

Use this skill whenever the Union Project build was interrupted: model timeouts,
truncated tool calls, or an unfinished file. The goal is **zero rework** —
pick up exactly where the build stopped.

## Step 1 — Read the state tracker

Always read `D:\union project\BUILD-STATUS.md` first. It records, for the
current product:

- `product` — folder under `products/` being built
- `phase` — one of: `html`, `css`, `js`, `verify`, `commit`, `deploy`
- `last_completed` — exact file + section that finished cleanly
- `next_step` — the precise action to take next (with insertion point)
- `known_issues` — quirks from earlier edits (e.g., duplicate closing tags)

If the file is missing, reconstruct state by listing `D:\union project\products\`
and reading the newest product folder's files.

## Step 2 — Verify the interruption point

Before writing anything:

1. Read the file named in `next_step` around the recorded line range.
2. Confirm what the last clean edit left behind — check for:
   - Unclosed HTML tags (`<aside>`, `</main>`, `</html>` missing)
   - Truncated JS functions (function declared but body incomplete)
   - Duplicate `</div>` blocks from multi-part editor inserts
3. Validate JS with: `node --check <file.js>` (exit 0 = safe to extend).
4. Never re-run an edit that already succeeded — the editor tool reports
   diffs, and repeated inserts corrupt files.

## Step 3 — Resume from next_step exactly

- Use the `editor` tool with `insert_line` for appends; use `old_text` with
  at least 3 lines of unique surrounding context for mid-file edits.
- Keep each `editor` call under ~5,000 characters of `new_text`. Large files
  MUST be built in sequential chunks — the tool rejects oversized input.
- After each chunk, re-check syntax before continuing (JS: `node --check`).

## Step 4 — Finish the current phase, then update the tracker

When the phase in `BUILD-STATUS.md` completes:

1. Update `BUILD-STATUS.md` — set `last_completed` to what just finished and
   `next_step` to the following phase's first action.
2. Run the phase's verification (listed below) before advancing.

## Phase checklist (build order per product)

1. **html** — file parses; all `id`s referenced by the JS exist in the markup.
2. **css** — file ends with a complete rule (no dangling `{`).
3. **js** — `node --check` passes; every `getElementById` target exists in HTML.
4. **verify** — serve via `python -m http.server` in a background process,
   fetch all three files, confirm HTTP 200 and non-trivial content length,
   then kill the server.
5. **commit** — `git add -A; git commit -m "feat(<product>): <summary>"`.
6. **deploy** — `git push` (remote `origin` = github.com/ParamJaiswal/union-project);
   GitHub Pages serves the repo root, so the product goes live at
   `https://paramjaiswal.github.io/union-project/products/<product>/`.
   Verify with `Invoke-WebRequest` after ~30 s.

## Product build order

1. festival-greeting — **DONE & DEPLOYED** (do not rebuild)
2. catalogue-builder — check `BUILD-STATUS.md` for resume point
3. landing-pages — templates pack
4. prompt-library — storefront page

## Hard rules

- Windows PowerShell: never use `&&`; use `;` between commands.
- The `editor` tool fails silently on repeated `old_text` — always disambiguate
  with extra context lines.
- `run_commands` uses PowerShell 5.1: no `-TimeoutSeconds` on
  `Invoke-WebRequest`, no ternary `?:` operator.
- Long-running servers must be started with `Start-Process` and killed with
  `taskkill /f /im python.exe` in the same command block — a bare server
  command times out the tool call.
- Clean up temp credential files (`D:/union_project_token.txt`) at the end of
  a session; never commit them.
