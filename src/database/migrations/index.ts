import type { DatabaseAdapter } from "../databaseAdapter";
import { initialMigration } from "./001_initial";
import { categoriesMigration } from "./002_categories";
import { MigrationRunner } from "./migrationRunner";

const migrations = [initialMigration, categoriesMigration];

export function runMigrations(db: DatabaseAdapter): void {
  new MigrationRunner(db, migrations).run();
}
