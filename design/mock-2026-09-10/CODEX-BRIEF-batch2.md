# Codex brief: LiftOS batch 2, bodyweight log (logic, current skin)

Read first: `SPEC.md` (this folder), sections "Batch 2" and "Data rules", and `../../CLAUDE.md`
(the repo's gotchas: offline queue identity-checked deletes, cache bump on ship).

## Scope

- Edit ONLY `apps/lift-tracker/index.html` and `apps/lift-tracker/sw.js`, plus append the
  `body_weights` table from `knowledge/Fitness/tracker/migrations/2026-09-10-body-weights.sql`
  to `knowledge/Fitness/tracker/schema.sql`.
- The Supabase table `body_weights` already exists (migration run and verified 09-10). Do not
  change its shape. Column list is in the migration file.
- Build the Weight tab exactly as SPEC "Batch 2" says, in the app's CURRENT colors and styles.
  A restyle comes later from a different seat. Add a simple two-tab bar (Train, Weight); keep
  every existing Train feature working unchanged, including the "Why these loads" note.
- Fix `pickDefault()` to use the phone's local date, not `toISOString()` (UTC).
- Chart: inline SVG, no libraries, no network fonts. The app must work offline.
- Bump `sw.js` CACHE and the `BUILD` stamp.

## Hard rules

- **Do not commit. Do not push.** Pushing to main deploys to Andrew's phone. Leave the work in
  the working tree.
- Do not write to Supabase to test. No POSTs from scripts or a headless browser; that is his
  real data. Reads are fine.
- Every data rule in SPEC "Data rules" must hold. For each one, say in RESULT.md where in the
  code it's enforced.
- No em dashes in any user-visible text.

## When done

Write `apps/lift-tracker/design/mock-2026-09-10/RESULT-batch2.md`: what changed (by function),
where each data rule lives, anything you could not do or were unsure of, and how you checked it.
Then stop.
