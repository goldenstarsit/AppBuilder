import type { DatabaseAdapter } from "../databaseAdapter";

export interface DatabaseMigration {
  version: number;
  name: string;
  up(db: DatabaseAdapter): void;
}

export class MigrationRunner {
  constructor(
    private readonly db: DatabaseAdapter,
    private readonly migrations: DatabaseMigration[],
  ) {}

  run(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL
      )
    `);

    const applied = new Set(
      this.db
        .all<{ version: number }>(
          "SELECT version FROM schema_migrations ORDER BY version",
        )
        .map((migration) => migration.version),
    );

    const pending = [...this.migrations]
      .filter((migration) => !applied.has(migration.version))
      .sort((a, b) => a.version - b.version);

    for (const migration of pending) {
      this.db.transaction(() => {
        migration.up(this.db);

        this.db.run(
          `
            INSERT INTO schema_migrations (version, name, applied_at)
            VALUES (?, ?, ?)
          `,
          migration.version,
          migration.name,
          new Date().toISOString(),
        );
      });
    }
  }
}
