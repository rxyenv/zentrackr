# ZenTrackr

Recovered from `6.aab` and rebuilt as a clean Expo Router project.

## Recovered facts

- App name: `ZenTrackr`
- Slug: `zentrackr`
- Android package: `com.zentrackr.app`
- Deep link scheme: `zentrack-fit`
- Expo plugins present in the shipped bundle:
  - `expo-router`
  - `expo-sqlite`
  - `expo-secure-store`
  - `expo-notifications`
  - calorie widget integration

## Rebuilt first pass

- Expo Router route tree with onboarding, sign-in, sign-up, and tabs
- Tabs for home, workouts, nutrition, calendar, stats, and account
- Local SQLite schema for sessions, exercises, sets, nutrition, bodyweight, sleep, steps, step logs, and templates
- Supabase client stub via env vars
- Notification permission entry point

## Run

```bash
npm install
npm run start
```

## Environment

Create `.env` with:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Notes

This repo is a reconstruction, not a byte-for-byte recovery of the original source.
The widget package and original backend schema still need to be restored separately.
