import type { DatabaseAdapter } from "../databaseAdapter";
import { initialMigration } from "./001_initial";
import { MigrationRunner } from "./migrationRunner";

const migrations = [initialMigration];

export function runMigrations(db: DatabaseAdapter): void {
  new MigrationRunner(db, migrations).run();
}
