---
name: auto-switch-model
description: Detect when the current Cline model stalls, times out, or rate-limits, then hand the remaining work to a free/cheaper model and keep going. Use when responses are cut short, tool calls time out, sub-agents return empty, or the user says "switch to free model", "model is stuck", "auto switch", or "continue on a cheaper model".
---

# Auto-Switch Model — Stall Recovery & Free-Model Handoff

Keeps a long build moving when the active model degrades: stalls, truncated
output, timeouts, empty sub-agent results, or rate limits.

## Reality check (read first — do not overclaim)

An agent **cannot change the model of its own running session** from a tool
call. There are exactly three real ways to get work onto a different (free or
cheaper) model:

| # | Route | When to use | Changes running session? |
|---|---|---|---|
| A | `tasks` tool with `model_selection` (`provider_id` + `model_id`) | You need one bounded work unit done elsewhere | No — runs separately |
| B | `cline` CLI in a new process with `-m <model>` | You want the rest of the build done end-to-end on another model | No — new process |
| C | User switches the model in the Cline UI model picker | You need *this* conversation on another model | Yes, but user-performed |

Never claim to have switched your own model. Say which route you used.

## Step 1 — Detect the stall

Treat these as stall signals (all observed in practice):

- `run_commands` → "Command timed out after 30000ms"
- `editor` → "Editor input too large" or repeated "No replacement performed"
- A sub-agent/`spawn_agent` or `tasks` result returns **empty content**
- Response ends mid-sentence or mid-file with no tool call
- Repeated identical tool calls producing the same failure twice in a row
- Errors mentioning 429 (rate limit), 529 (overloaded), 503 (service down)

On the **first** signal: do not retry blindly. Identify which rung of the
ladder below applies and act.

## Step 2 — Recovery ladder (cheapest first)

### Rung 0 — Shrink the payload (no model change)
Most stalls are payload-size stalls, not model stalls.
- `editor`: keep `new_text` under ~5,000 chars; split into sequential chunks.
- Verify file state with `read_files` before re-editing; never re-run an edit
  that already succeeded (it corrupts the file).
- PowerShell: split long commands; write scripts to a file and run the file
  instead of inline `python -c` containing quotes or non-ASCII characters.
If this fixes it, stop here — no model switch needed.

### Rung 1 — Delegate the unit via the `tasks` tool (route A)
Best for one bounded piece of work (e.g. "generate this file"):

```
tasks(
  operation="create", kind="scheduled", mode="act",
  name="<unit name>",
  prompt="<fully self-contained prompt with absolute paths and exact output>",
  model_selection={ provider_id: "<id>", model_id: "<free or cheap model>" },
  run_at="<ISO 8601 with offset, a few minutes out>",
  max_iterations=1
)
```
Rules: scheduled tasks need a future `run_at`; the prompt must be
self-contained because it runs in a fresh unattended session. Only use
`tasks` when the user asked for scheduled/deferred work; for immediate
bounded work prefer `spawn_agent` with a focused task.

### Rung 2 — Hand the rest of the build to the `cline` CLI (route B)
This is the real "switch to a free model and keep going" mechanism. The CLI
supports model/provider selection plus bounded retries and timeouts:

```
cline -P <provider-id> -m <model-id> \
      --auto-approve true --retries 3 -t 1800 \
      --thinking medium \
      -c "D:\union project" \
      "<self-contained prompt>"
```

Key flags (verified from `cline --help`):
- `-P, --provider <id>` — provider id
- `-m, --model <model-id>` — model for this run
- `--retries <n>` — max consecutive mistakes before exiting (default 6)
- `-t, --timeout <seconds>` — hard timeout (default 0 = none)
- `--thinking <none|low|medium|high|xhigh>` — reasoning effort
- `-c, --cwd <path>` — working directory
- `-z, --zen` — run in the background hub
- `--id <session-id>` — resume an existing session
- `--config <dir>` / `--data-dir <dir>` — isolated state
- `-p, --plan` — plan mode (no edits)

On Windows the binary is invoked via:
`C:\Users\dell\AppData\Local\hermes\node\cline.ps1`
(`Get-Command cline` resolves to this). Set `CLINE_NO_UPDATE_CHECK=1` to
avoid update prompts in non-interactive runs.

Prefer **lower** `--thinking` and a bounded `-t` for free models — they
stall more readily on large contexts. Write the remaining work to
`HANDOFF.md` first so the new process needs only a pointer to it.

### Rung 3 — Ask the user to switch (route C)
If routes A/B are unavailable or the user wants continuity in this chat,
say plainly: *"Switch the model via the Cline model picker, then tell me to
continue."* Then resume from `BUILD-STATUS.md`. Do not pretend you did it.

## Step 3 — Model discovery (never hardcode guesses)

Do **not** invent free model IDs. Discover them from real sources:

1. `cline auth --help` shows the interactive model configuration path
   (`-p/--provider`, `-m/--modelid`).
2. `cline config` prints current configuration — **requires a real TTY**, so
   it fails under the agent shell; ask the user to run it if needed.
3. The Cline UI model picker lists every available model per provider,
   including free tiers.
4. Read (read-only) the provider config to see what is already configured:
   `C:\Users\dell\.cline\data\settings\providers.json`
   — keys of interest: `lastUsedProvider`, `providers.<id>.settings.model`,
   `providers.<id>.settings.provider`.

Providers observed in this environment (examples, **not** authoritative):
`cline`, `cline-pass`, `openai-compatible`.

If no free model can be confirmed, ask the user which model to use rather
than guessing a model ID.

## Step 4 — Write the handoff artifact

Before handing off, write `HANDOFF.md` in the repo root (replace it each
handoff; it is transient, not a deliverable):

```markdown
# Handoff — <ISO timestamp>
- reason: <stall signal, e.g. repeated 30s command timeouts>
- route: A | B | C
- active model if known: <provider>/<model>
- repo: D:\union project      branch: master
- state file: BUILD-STATUS.md (authoritative — read it first)
- done so far: <bullet list of verified-complete work>
- exact next step: <one concrete action with file path + insertion point>
- verification to run: <commands>
- do not touch: <anything already correct; e.g. festival-greeting is live>
```

Then launch the CLI run with a short prompt like:
*"Read D:\union project\HANDOFF.md and continue exactly from its next step.
Do not rebuild completed products."*

## Step 5 — Verify after the handoff

Independently confirm the other model's output — never trust it blind:
- `node --check <file>.js` for JS syntax
- confirm every `getElementById` target exists in the HTML
- serve locally and check HTTP 200 + content length
- `git log --oneline -3` to confirm the commit landed

Report which checks passed and which failed.

## Safety rules

- **Never** copy API keys, OAuth tokens, or `accessToken` values out of
  `providers.json` into the skill, logs, commits, or chat. This file contains
  live credentials — read only the keys you need (`lastUsedProvider`, `model`).
- Do **not** hand-edit `providers.json` while Cline is running; the app
  rewrites it and you can corrupt auth state. Use route A/B/C instead.
- Redact secrets in any output you surface.
- Do not claim a model switch happened unless you actually started a new
  `cline` process or the user confirmed the UI change.
- Keep `HANDOFF.md` out of commits (add it to `.gitignore`) so transient state
  is not published.

## Integration with continue-build

This skill handles *"the model is failing"*; `continue-build`
(`.cline/skills/continue-build/SKILL.md`) handles *"the build was
interrupted"*. Use them together:

1. Detect the stall here, pick a route.
2. Update `BUILD-STATUS.md` with the precise resume point.
3. Hand off (route A or B) or ask for a UI switch (route C).
4. On resume, follow `continue-build` — read `BUILD-STATUS.md` first and never
   redo finished work.

## Notes on skill discovery

Cline discovers skills at session start. A newly added skill (including this
one) may not be usable until a new session begins — mention that to the user
instead of assuming it is live.