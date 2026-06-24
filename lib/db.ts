import { SQLiteDatabase } from "expo-sqlite";

export type DashboardSummary = {
  todayCalories: number;
  weeklySessions: number;
  avgSleepHours: number;
  latestWeightKg: number | null;
  todaySteps: number;
};

export type WorkoutSession = {
  id: string;
  user_id: string;
  date: string;
  split_name: string;
  notes: string | null;
  updated_at: string;
  deleted_at: string | null;
  sync_status: string;
};

export type NutritionEntry = {
  id: string;
  user_id: string;
  date: string;
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  notes: string | null;
  updated_at: string;
  deleted_at: string | null;
  sync_status: string;
};

export type BodyweightEntry = {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  updated_at: string;
  deleted_at: string | null;
  sync_status: string;
};

export type SleepEntry = {
  id: string;
  user_id: string;
  date: string;
  hours: number;
  quality: number;
  updated_at: string;
  deleted_at: string | null;
  sync_status: string;
};

export type StepEntry = {
  id: string;
  user_id: string;
  date: string;
  total_steps: number;
  updated_at: string;
  deleted_at: string | null;
  sync_status: string;
};

export type TemplateEntry = {
  id: string;
  user_id: string;
  name: string;
  split_name: string;
  exercises: string;
  updated_at: string;
  deleted_at: string | null;
  sync_status: string;
};

export type DaySnapshot = {
  sessions: WorkoutSession[];
  meals: NutritionEntry[];
  bodyweight: BodyweightEntry | null;
  sleep: SleepEntry | null;
  steps: StepEntry | null;
};

const migrations = [
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    split_name TEXT NOT NULL,
    notes TEXT,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS nutrition (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    meal_name TEXT NOT NULL,
    calories REAL NOT NULL DEFAULT 0,
    protein_g REAL NOT NULL DEFAULT 0,
    carbs_g REAL NOT NULL DEFAULT 0,
    fats_g REAL NOT NULL DEFAULT 0,
    notes TEXT,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS bodyweight (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    weight_kg REAL NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS sleep (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    hours REAL NOT NULL,
    quality INTEGER NOT NULL DEFAULT 3,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS steps (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    total_steps INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    split_name TEXT NOT NULL,
    exercises TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    notes TEXT,
    superset_group TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE TABLE IF NOT EXISTS sets (
    id TEXT PRIMARY KEY NOT NULL,
    exercise_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight_kg REAL NOT NULL DEFAULT 0,
    reps INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending'
  );`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON sessions(user_id, date DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_nutrition_user_date ON nutrition(user_id, date DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_bodyweight_user_date ON bodyweight(user_id, date DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_sleep_user_date ON sleep(user_id, date DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_steps_user_date ON steps(user_id, date DESC);`,
];

const now = () => new Date().toISOString();
export const today = () => new Date().toISOString().slice(0, 10);
export const guestUserId = "local-guest";

export const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export async function runMigrations(db: SQLiteDatabase) {
  for (const statement of migrations) {
    await db.execAsync(statement);
  }
}

export async function ensureUserSeed(db: SQLiteDatabase, userId: string) {
  const existing = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM sessions WHERE user_id = ?",
    [userId]
  );

  if ((existing?.count ?? 0) > 0) {
    return;
  }

  const isoNow = now();

  await db.runAsync(
    "INSERT INTO sessions (id, user_id, date, split_name, notes, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, today(), "Upper / Lower", "First restored workout", isoNow]
  );
  await db.runAsync(
    "INSERT INTO nutrition (id, user_id, date, meal_name, calories, protein_g, carbs_g, fats_g, notes, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, today(), "Chicken rice bowl", 620, 45, 62, 18, "Seeded sample", isoNow]
  );
  await db.runAsync(
    "INSERT INTO bodyweight (id, user_id, date, weight_kg, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, today(), 78.4, isoNow]
  );
  await db.runAsync(
    "INSERT INTO sleep (id, user_id, date, hours, quality, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, today(), 7.5, 4, isoNow]
  );
  await db.runAsync(
    "INSERT INTO steps (id, user_id, date, total_steps, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, today(), 8420, isoNow]
  );
  await db.runAsync(
    "INSERT INTO templates (id, user_id, name, split_name, exercises, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, NULL, 'pending')",
    [
      makeId(),
      userId,
      "Popular Split Program",
      "Push / Pull / Legs",
      JSON.stringify(["Bench Press", "Shoulder Press", "Lateral Raise"]),
      isoNow,
    ]
  );
}

export async function getSummary(db: SQLiteDatabase, userId: string) {
  const [calories, sessions, sleep, bodyweight, steps] = await Promise.all([
    db.getFirstAsync<{ total: number }>(
      "SELECT COALESCE(SUM(calories), 0) as total FROM nutrition WHERE user_id = ? AND date = ? AND deleted_at IS NULL",
      [userId, today()]
    ),
    db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sessions WHERE user_id = ? AND date >= date('now', '-6 day') AND deleted_at IS NULL",
      [userId]
    ),
    db.getFirstAsync<{ avg: number }>(
      "SELECT COALESCE(AVG(hours), 0) as avg FROM sleep WHERE user_id = ? AND date >= date('now', '-6 day') AND deleted_at IS NULL",
      [userId]
    ),
    db.getFirstAsync<{ weight_kg: number }>(
      "SELECT weight_kg FROM bodyweight WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC LIMIT 1",
      [userId]
    ),
    db.getFirstAsync<{ total_steps: number }>(
      "SELECT total_steps FROM steps WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 1",
      [userId, today()]
    ),
  ]);

  return {
    todayCalories: Math.round(calories?.total ?? 0),
    weeklySessions: sessions?.count ?? 0,
    avgSleepHours: Number((sleep?.avg ?? 0).toFixed(1)),
    latestWeightKg: bodyweight?.weight_kg ?? null,
    todaySteps: steps?.total_steps ?? 0,
  } satisfies DashboardSummary;
}

export async function getSessions(db: SQLiteDatabase, userId: string) {
  return db.getAllAsync<WorkoutSession>(
    "SELECT * FROM sessions WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC",
    [userId]
  );
}

export async function addWorkoutSession(
  db: SQLiteDatabase,
  userId: string,
  payload: { split_name: string; date: string; notes?: string }
) {
  await db.runAsync(
    "INSERT INTO sessions (id, user_id, date, split_name, notes, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, payload.date, payload.split_name, payload.notes ?? null, now()]
  );
}

export async function getNutrition(db: SQLiteDatabase, userId: string, date?: string) {
  if (date) {
    return db.getAllAsync<NutritionEntry>(
      "SELECT * FROM nutrition WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY updated_at DESC",
      [userId, date]
    );
  }

  return db.getAllAsync<NutritionEntry>(
    "SELECT * FROM nutrition WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC",
    [userId]
  );
}

export async function addNutritionEntry(
  db: SQLiteDatabase,
  userId: string,
  payload: {
    date: string;
    meal_name: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fats_g: number;
    notes?: string;
  }
) {
  await db.runAsync(
    "INSERT INTO nutrition (id, user_id, date, meal_name, calories, protein_g, carbs_g, fats_g, notes, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'pending')",
    [
      makeId(),
      userId,
      payload.date,
      payload.meal_name,
      payload.calories,
      payload.protein_g,
      payload.carbs_g,
      payload.fats_g,
      payload.notes ?? null,
      now(),
    ]
  );
}

export async function getLatestBodyweight(db: SQLiteDatabase, userId: string) {
  return db.getFirstAsync<BodyweightEntry>(
    "SELECT * FROM bodyweight WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC LIMIT 1",
    [userId]
  );
}

export async function upsertBodyweight(
  db: SQLiteDatabase,
  userId: string,
  payload: { date: string; weight_kg: number }
) {
  await db.runAsync(
    "INSERT INTO bodyweight (id, user_id, date, weight_kg, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, payload.date, payload.weight_kg, now()]
  );
}

export async function getLatestSleep(db: SQLiteDatabase, userId: string) {
  return db.getFirstAsync<SleepEntry>(
    "SELECT * FROM sleep WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC LIMIT 1",
    [userId]
  );
}

export async function upsertSleep(
  db: SQLiteDatabase,
  userId: string,
  payload: { date: string; hours: number; quality: number }
) {
  await db.runAsync(
    "INSERT INTO sleep (id, user_id, date, hours, quality, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, payload.date, payload.hours, payload.quality, now()]
  );
}

export async function getLatestSteps(db: SQLiteDatabase, userId: string) {
  return db.getFirstAsync<StepEntry>(
    "SELECT * FROM steps WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC LIMIT 1",
    [userId]
  );
}

export async function upsertSteps(
  db: SQLiteDatabase,
  userId: string,
  payload: { date: string; total_steps: number }
) {
  const existing = await db.getFirstAsync<{ id: string }>(
    "SELECT id FROM steps WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 1",
    [userId, payload.date]
  );

  if (existing?.id) {
    await db.runAsync(
      "UPDATE steps SET total_steps = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?",
      [payload.total_steps, now(), existing.id]
    );
    return;
  }

  await db.runAsync(
    "INSERT INTO steps (id, user_id, date, total_steps, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, payload.date, payload.total_steps, now()]
  );
}

export async function getTemplates(db: SQLiteDatabase, userId: string) {
  return db.getAllAsync<TemplateEntry>(
    "SELECT * FROM templates WHERE user_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC",
    [userId]
  );
}

export async function addTemplate(
  db: SQLiteDatabase,
  userId: string,
  payload: { name: string; split_name: string; exercises: string[] }
) {
  await db.runAsync(
    "INSERT INTO templates (id, user_id, name, split_name, exercises, updated_at, deleted_at, sync_status) VALUES (?, ?, ?, ?, ?, ?, NULL, 'pending')",
    [makeId(), userId, payload.name, payload.split_name, JSON.stringify(payload.exercises), now()]
  );
}

export async function getDaySnapshot(db: SQLiteDatabase, userId: string, date: string) {
  const [sessions, meals, bodyweight, sleep, steps] = await Promise.all([
    db.getAllAsync<WorkoutSession>(
      "SELECT * FROM sessions WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY updated_at DESC",
      [userId, date]
    ),
    db.getAllAsync<NutritionEntry>(
      "SELECT * FROM nutrition WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY updated_at DESC",
      [userId, date]
    ),
    db.getFirstAsync<BodyweightEntry>(
      "SELECT * FROM bodyweight WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 1",
      [userId, date]
    ),
    db.getFirstAsync<SleepEntry>(
      "SELECT * FROM sleep WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 1",
      [userId, date]
    ),
    db.getFirstAsync<StepEntry>(
      "SELECT * FROM steps WHERE user_id = ? AND date = ? AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 1",
      [userId, date]
    ),
  ]);

  return { sessions, meals, bodyweight, sleep, steps } satisfies DaySnapshot;
}

export async function getRecentBodyweight(db: SQLiteDatabase, userId: string) {
  return db.getAllAsync<BodyweightEntry>(
    "SELECT * FROM bodyweight WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC LIMIT 14",
    [userId]
  );
}

export async function getRecentSleep(db: SQLiteDatabase, userId: string) {
  return db.getAllAsync<SleepEntry>(
    "SELECT * FROM sleep WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC LIMIT 14",
    [userId]
  );
}

export async function getRecentSteps(db: SQLiteDatabase, userId: string) {
  return db.getAllAsync<StepEntry>(
    "SELECT * FROM steps WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC, updated_at DESC LIMIT 14",
    [userId]
  );
}

export async function getPendingCounts(db: SQLiteDatabase, userId: string) {
  const rows = await Promise.all(
    ["sessions", "nutrition", "bodyweight", "sleep", "steps", "templates"].map((table) =>
      db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${table} WHERE user_id = ? AND sync_status != 'synced' AND deleted_at IS NULL`,
        [userId]
      )
    )
  );

  return rows.reduce((sum, row) => sum + (row?.count ?? 0), 0);
}
