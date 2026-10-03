import type { DatabaseAdapter } from "../databaseAdapter";
import { initialMigration } from "./001_initial";
import { categoriesMigration } from "./002_categories";
import { tagsMigration } from "./003_tags";
import { attributesMigration } from "./004_attributes";
import { tagStructureMigration } from "./005_tag_structure";
import { MigrationRunner } from "./migrationRunner";

const migrations = [initialMigration, categoriesMigration, tagsMigration, attributesMigration, tagStructureMigration];

export function runMigrations(db: DatabaseAdapter): void {
  new MigrationRunner(db, migrations).run();
}
