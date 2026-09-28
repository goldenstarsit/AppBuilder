import type { DatabaseMigration } from "./migrationRunner";

export const initialMigration: DatabaseMigration = {
  version: 1,
  name: "initial",
  up(db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
  },
};
