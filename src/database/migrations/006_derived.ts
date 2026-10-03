import type { DatabaseAdapter } from "../databaseAdapter";

export const derivedMigration = {
  version: 6,
  name: "derived",
  up(db: DatabaseAdapter): void {
    db.exec(`
      INSERT OR IGNORE INTO category (name, description)
      VALUES (
        'derived',
        'User-created compositions combining tags, attributes, contents, and other derived entities.'
      );
    `);
  },
};
