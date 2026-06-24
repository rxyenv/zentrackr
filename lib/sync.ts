import { SQLiteDatabase } from "expo-sqlite";

import { supabase } from "./supabase";

type SyncResult = {
  pushed: number;
  pulled: number;
};

type Mapping = {
  localTable: string;
  remoteTable: string;
  columns: string[];
};

const mappings: Mapping[] = [
  {
    localTable: "sessions",
    remoteTable: "sessions",
    columns: ["id", "user_id", "date", "split_name", "notes", "updated_at", "deleted_at"],
  },
  {
    localTable: "nutrition",
    remoteTable: "nutrition_entries",
    columns: [
      "id",
      "user_id",
      "date",
      "meal_name",
      "calories",
      "protein_g",
      "carbs_g",
      "fats_g",
      "notes",
      "updated_at",
      "deleted_at",
    ],
  },
  {
    localTable: "bodyweight",
    remoteTable: "bodyweight_entries",
    columns: ["id", "user_id", "date", "weight_kg", "updated_at", "deleted_at"],
  },
  {
    localTable: "sleep",
    remoteTable: "sleep_entries",
    columns: ["id", "user_id", "date", "hours", "quality", "updated_at", "deleted_at"],
  },
  {
    localTable: "steps",
    remoteTable: "step_entries",
    columns: ["id", "user_id", "date", "total_steps", "updated_at", "deleted_at"],
  },
  {
    localTable: "templates",
    remoteTable: "templates",
    columns: ["id", "user_id", "name", "split_name", "exercises", "updated_at", "deleted_at"],
  },
];

export async function syncAll(db: SQLiteDatabase, userId: string): Promise<SyncResult> {
  if (!supabase) {
    return { pushed: 0, pulled: 0 };
  }

  let pushed = 0;
  let pulled = 0;

  for (const mapping of mappings) {
    const dirtyRows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT ${mapping.columns.join(", ")}, sync_status FROM ${mapping.localTable} WHERE user_id = ? AND sync_status != 'synced'`,
      [userId]
    );

    if (dirtyRows.length > 0) {
      const payload = dirtyRows.map(({ sync_status, ...row }) => row);
      const { error } = await supabase.from(mapping.remoteTable).upsert(payload);

      if (error) {
        throw error;
      }

      const ids = dirtyRows.map((row) => row.id);
      for (const id of ids) {
        await db.runAsync(
          `UPDATE ${mapping.localTable} SET sync_status = 'synced' WHERE id = ?`,
          [String(id)]
        );
      }

      pushed += dirtyRows.length;
    }

    const { data, error } = await supabase
      .from(mapping.remoteTable)
      .select(mapping.columns.join(", "))
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(250);

    if (error) {
      throw error;
    }

    for (const row of ((data ?? []) as unknown as Array<Record<string, string | number | null>>)) {
      const placeholders = mapping.columns.map(() => "?").join(", ");
      const updates = mapping.columns.map((column) => `${column} = excluded.${column}`).join(", ");
      await db.runAsync(
        `INSERT INTO ${mapping.localTable} (${mapping.columns.join(", ")}, sync_status)
         VALUES (${placeholders}, 'synced')
         ON CONFLICT(id) DO UPDATE SET ${updates}, sync_status = 'synced'`,
        mapping.columns.map((column) => row[column] ?? null)
      );
      pulled += 1;
    }
  }

  return { pushed, pulled };
}
