# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:6cd5cc61 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->


## Build & Test

```bash
npm install          # install deps
npm run build        # production build → dist/
npm run dev          # watch mode
npm run typecheck    # tsc --noEmit, no build
```

Load unpacked extension: `chrome://extensions` → Developer mode → Load unpacked → `dist/`

Always run `npm run build && npm run typecheck` before closing a bead.

## Architecture Overview

Chrome MV3 extension targeting procyclingstats.com.

```
src/content/        # Content script — DOM manipulation, spoiler logic
src/background/     # Service worker — minimal, event handling
src/popup/          # Toolbar popup — status + controls
src/types/          # Shared TypeScript types
public/             # manifest.json, icons — copied verbatim to dist/
specs/              # OpenSpec documents — one file per feature
```

Stack: TypeScript + Vite. No UI framework. No external runtime dependencies unless explicitly specced.

## Workflow: OpenSpec + Beads

**Every nontrivial change goes through this flow — no exceptions:**

### 1. Write Spec
Before implementing any nontrivial feature or change, write a spec at `specs/NNN-short-name.md`. Specs are numbered sequentially. Spec must include:
- Goal (one paragraph)
- Exact functionality — what the user sees/experiences
- File changes — which files are created/modified and how
- Key decisions and tradeoffs
- Acceptance criteria (numbered, testable)
- Out of scope

Present spec to user for review. Do not implement until user approves.

### 2. Break Into Beads
After approval, decompose spec into `bd` issues. Each bead = one atomic, independently closeable unit of work. Use `bd create` with `--parent` to group under an epic if the spec is large.

```bash
bd create "Epic: <spec title>" --type epic
bd create "<task>" --parent <epic-id>
```

Claim beads with `bd update <id> --claim`, close with `bd close <id>`.

### 3. Implement
Implement bead by bead. Run quality gates after each bead. Commit when bead closes.

## Commits

Commit frequently — after every atomic change (roughly one commit per bead, sometimes more for large beads). Never batch unrelated changes into one commit. Commit message: conventional commits format, subject ≤50 chars.

```bash
git add <specific files>   # never git add -A
git commit -m "feat: add content script entry point"
```

Do not push unless user explicitly asks.

## Conventions

- TypeScript strict mode always on
- No `any` types — use `unknown` and narrow
- No npm packages added without user approval
- Content scripts: prefer `document_start` injection to prevent flash
- `chrome.storage.local` for all persistent state
- No `console.log` in production paths — remove before closing bead
- Icons: placeholder PNGs acceptable during development, will be replaced later
- Firefox support: out of scope (Chrome-only)
