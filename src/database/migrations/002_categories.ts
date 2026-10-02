import type { DatabaseAdapter } from "../databaseAdapter";

export const categoriesMigration = {
  version: 2,
  name: "categories",
  up(db: DatabaseAdapter): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL
      );

      INSERT OR IGNORE INTO category (name, description)
      VALUES ('tags', 'Reusable tag definitions and tag instances for application structure.');
    `);
  },
};
