# LiftOS v2: restyle + bodyweight log (spec, 2026-09-10)

Design targets: `target-train.png`, `target-weight.png` (ChatGPT, 09-10). Andrew's rulings 09-10:
glow like target-weight, History tab dropped (two tabs: Train, Weight), chart range switch
30d / 90d / All (default 30d), recent-entries list under the log box for edit/delete, tags in v1.
Weight is logged from the phone; the AndrewOS LIFTOS tile only renders it.

## Batch 1: Supabase migration (Andrew runs it in the SQL Editor, BEFORE any code ships)

New file `knowledge/Fitness/tracker/migrations/2026-09-10-body-weights.sql`, and append the same
table to `schema.sql`:

```sql
create table if not exists body_weights (
  id text primary key,            -- client-made: "bw-" + crypto.randomUUID()
  weight_lb numeric(5,1) not null check (weight_lb between 80 and 400),
  logged_at timestamptz not null, -- instant of the weigh-in, from the phone clock
  tz text not null,               -- IANA zone at entry, e.g. "America/Chicago"
  local_date date not null,       -- the calendar day on the phone, NOT the UTC day
  fasted boolean,                 -- null = not tagged. never default to false
  training text check (training in ('before','after')),  -- null = not tagged
  deleted boolean not null default false,  -- soft delete; the queue only upserts
  ts timestamptz not null default now()    -- last edit
);
alter table body_weights enable row level security;
create policy "authenticated all" on body_weights
  for all to authenticated using (true) with check (true);
```

## Batch 2: weight feature in the PWA (Codex, logic first, current skin)

- Weight tab. Big number input (inputmode decimal), date+time line auto-filled from the phone
  clock, two optional toggle pairs (Fasted/Fed, Before/After training). Tapping the selected
  chip again clears it back to null. **Nothing preselected.**
- Save: `enqueue("body_weights", row)`, same offline queue and identity-checked delete as sets.
  Keep a local mirror (`lift.weights` in localStorage) so the chart and list render offline.
- Recent list: last 5 entries under Save. Tap = load into the form, Save overwrites the same
  `id`. Delete = upsert with `deleted: true`; every reader filters deleted rows.
- On boot, pull existing rows once (GET `body_weights?deleted=eq.false`) and merge into the
  mirror, so a reinstall or second device still sees history.
- Chart: every entry as a dim dot, 7-day average as the coral line. Range switch 30d / 90d / All.
- Headline: 7-day average + change vs the 7-day average one week earlier.

### Data rules (each one fails as a plausible wrong number, not an error)

- **Local day, never UTC.** `local_date` comes from the phone's local calendar. A 10 pm Central
  weigh-in written with `toISOString().slice(0,10)` lands on tomorrow. (The existing
  `pickDefault()` has exactly this bug: after 7 pm Central it picks tomorrow's session. Fix it
  in the same batch.)
- **7-day average = mean of entries whose `local_date` falls in the last 7 calendar days**,
  not the last 7 entries. Five weigh-ins in one day must not become "a week".
- **Too little data shows no number.** Fewer than 3 entries in the window → show "need 3
  weigh-ins this week", not an average of one. Same for the "vs last week" line: no entries in
  the earlier window → omit the line, never compare to zero.
- Tags untouched = null in the row. A reader treating null as "fed" or "not fasted" is wrong.

## Batch 3: restyle to the targets (Claude, main thread)

- Both screens to the target look, glow as in target-weight. Done set = filled coral box.
- **Keep the "Why these loads" week note**, open by default (it is the only place the weekly
  close job's reasoning is read before lifting). Keep week picker, sync status, per-exercise
  notes (the "…" button opens the note) and the session note.
- Days row shows only days that have a session, plus today.
- Fonts self-hosted in the repo and cached by `sw.js` (offline app; a Google Fonts link fails
  at the gym with no signal and falls back silently).
- App icon: full-size LiftOS icon from ChatGPT → `icon-192.png`, `icon-512.png`, plus a 180px
  apple-touch-icon. The AndrewOS copy is only 96px, too small.
- Bump `sw.js` CACHE and `BUILD`; verify on the phone after deploy.

## Batch 4: AndrewOS LIFTOS tile (Codex)

- `pull_lifts.py` also fetches `body_weights` into `~/.config/lift/weights.jsonl` (filter
  deleted), stamping `generated_at`.
- `_liftos()` returns the weights; the LIFTOS tile draws dots + 7-day line with the same data
  rules as the phone. Done condition of the STATUS thread: tile renders at least 7 entries.

## Codex seats

Batches 2 and 4: Codex in a new named herdr pane, model terra, effort low, handed this spec.
Plus one Codex review pass of the full diff before the phone deploy. Claude reviews, tests on the
real deployed PWA, and commits.
