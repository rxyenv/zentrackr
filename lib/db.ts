import { SQLiteDatabase } from "expo-sqlite";

export type DashboardSummary = {
  todayCalories: number;
  weeklySessions: number;
  avgSleepHours: number;
  latestWeightKg: number | null;
};

export type WorkoutSession = {
  id: string;
  date: string;
  split_name: string;
  updated_at: string;
  sync_status: string;
};

export type NutritionEntry = {
  id: string;
  date: string;
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  notes: string | null;
};

const migrations = [
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    split_name TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    notes TEXT,
    superset_group TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS sets (
    id TEXT PRIMARY KEY NOT NULL,
    exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    weight_kg REAL NOT NULL DEFAULT 0,
    reps INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS nutrition (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    meal_name TEXT NOT NULL,
    calories REAL NOT NULL,
    protein_g REAL NOT NULL DEFAULT 0,
    carbs_g REAL NOT NULL DEFAULT 0,
    fats_g REAL NOT NULL DEFAULT 0,
    notes TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS bodyweight (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    weight_kg REAL NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS sleep (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    hours REAL NOT NULL,
    quality INTEGER NOT NULL DEFAULT 3
  );`,
  `CREATE TABLE IF NOT EXISTS steps (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    total_steps INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS step_logs (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    logged_at TEXT NOT NULL,
    step_delta INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    split_name TEXT NOT NULL,
    exercises TEXT NOT NULL
  );`,
];

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export async function runMigrations(db: SQLiteDatabase) {
  for (const statement of migrations) {
    await db.execAsync(statement);
  }

  const sessionCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM sessions"
  );

  if ((sessionCount?.count ?? 0) > 0) {
    return;
  }

  const sessionId = makeId();
  const exerciseId = makeId();
  const isoNow = now();

  await db.runAsync(
    "INSERT INTO sessions (id, date, split_name, updated_at, sync_status) VALUES (?, ?, ?, ?, 'pending')",
    [sessionId, today(), "Push / Pull / Legs", isoNow]
  );
  await db.runAsync(
    "INSERT INTO exercises (id, session_id, name, notes, superset_group, order_index, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')",
    [exerciseId, sessionId, "EZ Bar Curl", "Recovered starter entry", null, 0, isoNow]
  );
  await db.runAsync(
    "INSERT INTO sets (id, exercise_id, set_number, weight_kg, reps, updated_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
    [makeId(), exerciseId, 1, 25, 12, isoNow]
  );
  await db.runAsync(
    "INSERT INTO nutrition (id, date, meal_name, calories, protein_g, carbs_g, fats_g, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [makeId(), today(), "Chicken rice bowl", 620, 45, 62, 18, 'Enter food with weight, e.g. "200g chicken breast" or "1 banana"']
  );
  await db.runAsync(
    "INSERT INTO bodyweight (id, date, weight_kg) VALUES (?, ?, ?)",
    [makeId(), today(), 78.4]
  );
  await db.runAsync(
    "INSERT INTO sleep (id, date, hours, quality) VALUES (?, ?, ?, ?)",
    [makeId(), today(), 7.5, 4]
  );
  await db.runAsync(
    "INSERT INTO steps (id, date, total_steps) VALUES (?, ?, ?)",
    [makeId(), today(), 8420]
  );
  await db.runAsync(
    "INSERT INTO templates (id, name, split_name, exercises) VALUES (?, ?, ?, ?)",
    [makeId(), "Popular Split Program", "Push / Pull / Legs", JSON.stringify(["Bench Press", "Shoulder Press", "Lateral Raise"])]
  );
}

export async function getSessions(db: SQLiteDatabase) {
  return db.getAllAsync<WorkoutSession>(
    "SELECT * FROM sessions ORDER BY date DESC"
  );
}

export async function getNutrition(db: SQLiteDatabase, date = today()) {
  return db.getAllAsync<NutritionEntry>(
    "SELECT * FROM nutrition WHERE date = ? ORDER BY meal_name ASC",
    [date]
  );
}

export async function getSummary(db: SQLiteDatabase) {
  const [calories, sessions, sleep, bodyweight] = await Promise.all([
    db.getFirstAsync<{ total: number }>(
      "SELECT COALESCE(SUM(calories), 0) as total FROM nutrition WHERE date = ?",
      [today()]
    ),
    db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sessions WHERE date >= date('now', '-6 day')"
    ),
    db.getFirstAsync<{ avg: number }>(
      "SELECT COALESCE(AVG(hours), 0) as avg FROM sleep WHERE date >= date('now', '-6 day')"
    ),
    db.getFirstAsync<{ weight_kg: number }>(
      "SELECT weight_kg FROM bodyweight ORDER BY date DESC LIMIT 1"
    ),
  ]);

  const summary: DashboardSummary = {
    todayCalories: Math.round(calories?.total ?? 0),
    weeklySessions: sessions?.count ?? 0,
    avgSleepHours: Number((sleep?.avg ?? 0).toFixed(1)),
    latestWeightKg: bodyweight?.weight_kg ?? null,
  };

  return summary;
}

export async function addQuickSession(db: SQLiteDatabase, splitName: string) {
  await db.runAsync(
    "INSERT INTO sessions (id, date, split_name, updated_at, sync_status) VALUES (?, ?, ?, ?, 'pending')",
    [makeId(), today(), splitName, now()]
  );
}

export async function addNutritionEntry(
  db: SQLiteDatabase,
  payload: Pick<NutritionEntry, "meal_name" | "calories" | "protein_g" | "carbs_g" | "fats_g">,
) {
  await db.runAsync(
    "INSERT INTO nutrition (id, date, meal_name, calories, protein_g, carbs_g, fats_g, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      makeId(),
      today(),
      payload.meal_name,
      payload.calories,
      payload.protein_g,
      payload.carbs_g,
      payload.fats_g,
      null,
    ]
  );
}
