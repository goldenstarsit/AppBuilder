import type { DatabaseAdapter } from "../databaseAdapter";
import { initialMigration } from "./001_initial";
import { categoriesMigration } from "./002_categories";
import { tagsMigration } from "./003_tags";
import { attributesMigration } from "./004_attributes";
import { tagStructureMigration } from "./005_tag_structure";
import { derivedMigration } from "./006_derived";
import { contentMigration } from "./007_content";
import { MigrationRunner } from "./migrationRunner";

const migrations = [initialMigration, categoriesMigration, tagsMigration, attributesMigration, tagStructureMigration, derivedMigration, contentMigration];

export function runMigrations(db: DatabaseAdapter): void {
  new MigrationRunner(db, migrations).run();
}
