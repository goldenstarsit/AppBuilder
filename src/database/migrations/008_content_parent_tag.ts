import type { DatabaseAdapter } from "../databaseAdapter";

export const contentParentTagMigration = {
  version: 8,
  name: "content_parent_tag",
  up(db: DatabaseAdapter): void {
    db.exec(`
      ALTER TABLE content
        ADD COLUMN parent_tag_id INTEGER
        REFERENCES tag(id)
        ON DELETE CASCADE;

      ALTER TABLE content
        ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

      ALTER TABLE content
        ADD COLUMN child_tag_id INTEGER
        REFERENCES tag(id)
        ON DELETE CASCADE;

      CREATE INDEX IF NOT EXISTS idx_content_parent_tag
        ON content(parent_tag_id);

      CREATE INDEX IF NOT EXISTS idx_content_child_tag
        ON content(child_tag_id);

      CREATE INDEX IF NOT EXISTS idx_content_parent_order
        ON content(parent_tag_id, sort_order);
    `);
  },
};
