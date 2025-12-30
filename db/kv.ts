import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

const getDB = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("wallet_app.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS kv_storage (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
  return db;
};

export const setItem = async (key: string, value: string) => {
  try {
    const database = await getDB();
    await database.runAsync(
      "INSERT OR REPLACE INTO kv_storage (key, value) VALUES (?, ?)",
      key,
      value
    );
  } catch (error) {
    console.error("SQLite setItem error:", error);
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync<{ value: string }>(
      "SELECT value FROM kv_storage WHERE key = ?",
      key
    );
    return result?.value ?? null;
  } catch (error) {
    console.error("SQLite getItem error:", error);
    return null;
  }
};
