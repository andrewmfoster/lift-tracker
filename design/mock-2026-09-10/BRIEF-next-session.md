# Handoff: LiftOS weight log + restyle (from the 09-10/11 session)

Talk to Andrew in plain, direct language, short answers.

## State (all in apps/lift-tracker, UNCOMMITTED, nothing pushed)

- Supabase `body_weights` table: migration run by Andrew 09-10, verified by a read-only GET (200, all 9 columns).
- `index.html`: weight log (Codex batch 2 + four fixes by Claude: local-time datetime field, chart x by time,
  pull skips rows still queued, Train header order) + full restyle to `target-train.png` / `target-weight.png`
  (glow, Orbitron wordmark, Chakra Petch, bottom tab bar Train/Weight). "Why these loads" week note REMOVED
  on Andrew's ruling 09-11 ("shouldn't have it at all").
- `sw.js` CACHE lift-v7 (fonts + apple-touch-icon cached), `BUILD` "liftos-restyle", `manifest.json` renamed LiftOS.
- New icons: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (from `icon-source.png`, drawn frame removed).
- `fonts/*.woff2` self-hosted.
- Verified in Chrome via playwright with stand-in data and Supabase blocked: layout order, local form time,
  edit keeps 21:30, 48/48 set fields fit their placeholders (measured). NOT verified: Save/Delete round-trip
  to Supabase, iPhone rendering. Preview: `restyle-preview.png` (still shows the removed week note).
- Spec: `SPEC.md`. Codex brief/result: `CODEX-BRIEF-batch2.md`, `RESULT-batch2.md`.

## Next

1. Ask Andrew for his yes on the restyle. On yes: `git status` first, stage by explicit file (NOT `design/`,
   the repo is public; ask before committing mocks), commit, push (push = live deploy to his phone).
2. He closes + reopens the PWA once. Verify on the phone: build stamp reads liftos-restyle / lift-v7, log one
   real weigh-in, confirm it lands in Supabase with a read-only GET.
3. Orphan check: `gen_program.py` still writes `weeks[w].note` into program.json and the PWA no longer reads it.
   Grep AndrewOS and the lift-close-week skill for other readers before proposing to drop it. Propose, don't delete.
4. Batch 4 per SPEC.md: `pull_lifts.py` pulls body_weights to `~/.config/lift/weights.jsonl`, `_liftos()` +
   LIFTOS tile render dots + 7-day line (thread done: tile renders at least seven entries). Codex, model
   gpt-5.6-terra, effort low, new herdr pane, if Andrew still wants Codex on it.
