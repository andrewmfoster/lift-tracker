# Result, batch 2

## Changed

- `localDate()` builds an ISO calendar date from the phone's local clock. `pickDefault()` now uses it instead of UTC serialization.
- `weightRow()`, `mergeWeights()`, `pullWeights()`, and the existing `enqueue()` add the offline-first `body_weights` flow. The local mirror is `lift.weights`.
- `renderWeight()` adds the Weight tab: decimal log field, phone-filled date/time, nullable Fasted/Fed and Before/After controls, save-overwrite, soft delete, recent five, 30d/90d/All chart, and headline.
- Boot calls `pullWeights()` once after the existing program load. The GET requests only non-deleted rows and merges them with the local mirror.
- `sw.js` cache is `lift-v6`; `BUILD` is `bodyweight-log`.
- `schema.sql` now includes the already-run `body_weights` table, matching `migrations/2026-09-10-body-weights.sql`.

## Data rules

- **Local day, never UTC:** `localDate()` is used by both `pickDefault()` and `weightRow().local_date`.
- **Seven calendar days, not seven rows:** `calendarWindow()` sets inclusive local-date bounds and `averageIn()` filters entries by those bounds.
- **Too little data:** `renderWeight()` requires three current-window rows before displaying the headline average. It displays `need 3 weigh-ins this week` otherwise. The comparison is rendered only when the prior calendar-week window has entries.
- **Untouched tags remain null:** `newWeightForm()` initializes both tags to `null`; chip handlers toggle a selected value back to `null`; `weightRow()` copies those values without defaults.
- **Deleted rows are not read:** `activeWeights()` filters all local display and calculation inputs, `pullWeights()` GETs `deleted=eq.false`, and Delete queues an upsert with `deleted: true`.

## Checks

- **measured:** extracted inline JavaScript passed `node --check`.
- **measured:** `git diff --check` passed for the lift-tracker repository changes.
- **asserted:** the feature follows the supplied batch-2 requirements by code inspection. I did not authenticate, call a write endpoint, or run a browser interaction, so Supabase round-trip behavior and phone rendering remain unverified.
