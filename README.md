# Handoff: ZenTrackr — Programming Language Learning Tracker (MVP: Rust)

## Overview
ZenTrackr is a web app for tracking programming-language learning progress. The MVP supports one language (Rust) with a topic roadmap/checklist, study session logging, streaks, goals, and a stats dashboard. Built for a single user now; architected to become a multi-user SaaS product later (accounts, multiple languages per user).

## About the Design Files
The files in this bundle (`prototype.html`, `styles.css`) are **design references built as an HTML prototype** — they show intended look, layout, copy, and client-side interaction, but are NOT production code to copy directly. Your task is to **recreate this design in a real app** using:
- **Frontend**: your framework of choice (React/Next.js recommended — the prototype's structure maps cleanly to components) styled with the included `styles.css` design tokens (or reimplemented equivalently — see Design Tokens below).
- **Backend**: **Supabase** (free tier) for auth and Postgres database, per the schema below.

`prototype.html` is a single self-contained file — open it directly in a browser to see/interact with the whole app (all 6 screens, tab-switchable via the left sidebar). View source for exact markup/inline styles per element.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy in the prototype are final. Recreate pixel-for-pixel using the design tokens below. Layout uses a strict flush-left, ruled/grid aesthetic (Modernist system) — no rounded corners, no drop shadows, 2px dividers between sections.

## Design system: "Modernist"
- Flat, architectural, ink-on-paper. Zero border-radius anywhere. Strong 2px rules (`--color-divider`) separate sections — never soften into hairlines.
- Font: **Archivo** for both headings and body (`--font-heading` / `--font-body` in styles.css).
- Color: light neutral ground `--color-bg` (#f3f2f2), ink text `--color-text` (#201e1d), single accent red `--color-accent` (#ec3013) used **sparingly** — primary buttons, checkboxes, and small active-state indicators only. Everything else (progress bars, charts, streak heatmap, nav active fill) uses the **neutral ramp** (`--color-neutral-200` through `--color-neutral-800`) — the product intentionally reads as neutral/desaturated, not red-heavy.
- Full token sheet is in `styles.css` — use `var(--color-*)`, `var(--font-*)`, `var(--space-*)` rather than hardcoding values.
- Button/tag/table/field styling: see `.btn` (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-icon`, `.btn-block`), `.tag` (`.tag-neutral`, `.tag-outline`), `.field`/`.input`, `.table` classes in `styles.css`.
- Labels are flush-left always, including inside wide buttons — never centered.

## Screens / Views

### 1. Dashboard (default view)
- **Purpose**: At-a-glance overview — overall progress, streak, hours logged, days to goal, "up next" topic, current goal, recent sessions.
- **Layout**: Header row (title + "Continue learning" primary button) → 4-column stat strip (equal-width cells, 2px ruled border, dividers between cells) → 2-column row (1.3fr "Up next" card | 1fr "Goal" card, divided) → recent sessions table (last 5, link to full History).
- **Stat cells**: label (12px uppercase, neutral-700) + big number (32px, heading font, 700 weight). Metrics: Overall progress (%), Current streak (days), Hours logged (h, 1 decimal), Days to goal (integer).
- **Up next card**: `tag-neutral` "Up next" pill, topic name (20px bold), parent module name (13px neutral), thin progress bar (8px, neutral-800 fill on neutral-200 track) for that module, "Open roadmap" secondary button → navigates to Rust screen.
- **Goal card**: `tag-outline` "Goal" pill, goal note (18px bold), target date.

### 2. Rust (roadmap / checklist) — `isRust`
- **Purpose**: View and check off the Rust curriculum.
- **Layout**: Header (title + "N of M topics complete — X%" subtitle + "Edit roadmap" button) → full-width 8px overall progress bar → list of modules, each in a section separated by a 2px top rule.
- **Module row**: module name (18px bold) + "done/total" count, right-aligned.
- **Topic row**: checkbox (native, accent-colored) → topic name (strikethrough + neutral-700 color when done) → "Resource ↗" link (opens resourceUrl in new tab), flex row with 14px gaps.
- **9 modules** (curriculum, in order): Fundamentals; Ownership & Borrowing; Structs & Enums; Collections & Error Handling; Generics & Traits; Testing & Cargo; Smart Pointers & Concurrency; Async Rust; Advanced Topics. See `prototype.html`'s `getModulesConfig()` for the exact topic list per module (this is the seed/template data — see Data Model).

### 3. Edit roadmap — `isEdit`
- **Purpose**: Add/remove/rename modules and topics; edit each topic's resource URL. This is how the curriculum stays "template as a starting point, fully editable."
- **Layout**: Header (title + "+ Add module" primary button) → per-module block (2px top rule): editable module-name text input + "Remove module" ghost button, then each topic as a row of [checkbox, topic-name input, resource-URL input, "✕" remove icon button], then "+ Add topic" ghost button per module.

### 4. Stats & analytics — `isStats`
- **Purpose**: Visual summary of study activity.
- **Layout**: 3 stacked bordered panels:
  1. **Minutes studied, last 7 days** — bar chart, one column per day (bar height proportional to minutes, minutes number above bar, weekday abbreviation below), neutral-800 bars.
  2. **Completion by module** — one row per module: name + percentage, thin progress bar below.
  3. **Last 14 days** — streak heatmap: 14 same-size squares (24×24px, 8px gap), neutral-800 = studied that day, neutral-200 = not.

### 5. Session history — `isHistory`
- **Purpose**: Log new study sessions; view full session history.
- **Layout**: Header (title + "+ Log session" primary button, toggles a form) → optional inline form (bordered panel: date picker + duration-minutes number field side by side, module select dropdown, notes text input, Save/Cancel buttons) → full sessions table (Date, Topic, Duration, Notes), newest first.

### 6. Settings — `isSettings`
- **Purpose**: Profile info, plan/upgrade teaser (SaaS-to-come), notification preferences, danger zone.
- **Layout**: Max-width 560px column, sections separated by 2px top rules: Profile (name, email inputs) → Plan ("Free — Rust only" + "Upgrade soon" outline tag, teasing future multi-language SaaS tiers) → Notifications (2 checkboxes: streak reminders, weekly summary) → Danger zone ("Reset roadmap progress" button, confirms before clearing all topic-done flags).

## Navigation
Left sidebar, 240px fixed width, 2px right border. Brand wordmark "ZenTrackr" (styled as Z + small-caps "EN", T + small-caps "RACKR") + tagline "Programming progress" at top, divided. Nav items (Dashboard, Rust, Edit Roadmap, Stats, History, Settings) stacked vertically, flush-left text buttons; active item gets a neutral-200 fill + 2px accent-colored left border + bold weight. Bottom of sidebar: disabled "+ Add language" button with a "Soon" outline tag — placeholder for future multi-language support.

## Interactions & Behavior
- **Tab navigation**: clicking a sidebar item swaps the visible screen; no page reload, no URL routing in the prototype (add real routes in production, e.g. `/dashboard`, `/rust`, `/roadmap/edit`, `/stats`, `/history`, `/settings`).
- **Toggle topic done**: clicking a checkbox (Rust screen or Edit screen) flips its `done` boolean immediately; progress percentages/bars recompute live.
- **Edit roadmap**: text inputs are controlled (typing updates state on every keystroke); "Remove module"/"✕" remove immediately (no confirm — consider adding one in production); "+ Add module"/"+ Add topic" append a new blank entry to edit in place.
- **Log a session**: "+ Log session" toggles a form; Save validates date + duration are present, appends a new session, closes the form. Cancel discards without saving.
- **Reset roadmap progress**: browser `confirm()` gate, then sets every topic's `done` to false (does not touch session history).
- **Streak calculation**: count consecutive days ending today that have at least one logged session (breaks on first gap day).
- **"Up next" topic**: first topic (in module order, then topic order) with `done === false`.
- **No loading/error states in the prototype** — client-side mock data only. Production needs loading skeletons and error toasts for all Supabase calls (see below).

## State Management (prototype, client-only)
- `tab`: active screen id.
- `modules`: array of `{ id, name, topics: [{ id, name, done, resourceUrl }] }`.
- `sessions`: array of `{ id, date, module, duration (minutes), notes }`.
- `goalDate`, `goalNote`: single active goal (MVP supports one goal; consider multiple goals per language later).
- `showLogForm`, `logForm`: session-log form UI state.
- `profile`: `{ name, email, notifStreak, notifWeekly }`.
All derived values (progress %, streak, chart data, heatmap, next topic, sorted/recent sessions) are computed from the above on every render — don't persist them; recompute from source data server-side or client-side after fetch.

## Data model — Supabase (Postgres)

```sql
-- Auth: use Supabase Auth (auth.users) — no custom users table needed for MVP.

create table public.languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,                 -- e.g. 'Rust'
  goal_date date,
  goal_note text,
  created_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  language_id uuid not null references public.languages(id) on delete cascade,
  name text not null,
  position int not null default 0,    -- manual ordering
  created_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  name text not null,
  done boolean not null default false,
  resource_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  module_name text not null,          -- denormalized label shown in history; fine to also add module_id FK
  session_date date not null,
  duration_minutes int not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  notif_streak boolean not null default true,
  notif_weekly boolean not null default false
);
```

- Enable Row Level Security on every table; policies restrict all reads/writes to `auth.uid() = user_id` (join through `language_id`/`module_id` for `modules`/`topics`).
- Seed each new user's Rust language with the module/topic template from `prototype.html`'s `getModulesConfig()` (9 modules, ~39 topics) on first sign-up (a Postgres function/trigger or a one-time client-side seed call both work).
- Auth: Supabase email/password (or magic link) is enough for MVP; wire up sign-in/sign-up screens (not in this prototype — add a simple auth gate before the sidebar shell).
- All mutations (toggle topic, edit roadmap, log session, update settings, reset progress) should call Supabase directly from the client (or through server actions/API routes) and re-fetch/optimistically update — replace the prototype's local `setState` calls with real writes.

## Design Tokens
Full set in `styles.css`. Headline tokens used by this design:
- `--color-bg: #f3f2f2`, `--color-text: #201e1d`, `--color-accent: #ec3013`
- `--color-neutral-200`, `--color-neutral-700`, `--color-neutral-800` (heaviest use — progress bars, charts, heatmap, secondary text)
- `--color-divider` (2px rule color)
- `--font-heading`, `--font-body`: Archivo
- Radius: 0 everywhere (no `border-radius` used anywhere in this design)

## Assets
No images/icons used — the design is typographic/ruled, no illustrations or icon library needed for MVP (checkbox uses native `<input type="checkbox">` styled via `accent-color`).

## Files
- `prototype.html` — the interactive HTML prototype, all 6 screens, open directly in a browser.
- `styles.css` — the Modernist design-system stylesheet the prototype's classes (`.btn`, `.tag`, `.table`, `.field`, `.input`) reference; use it as the canonical token source when restyling in your framework.
