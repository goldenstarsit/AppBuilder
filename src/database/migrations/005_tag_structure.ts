import type { DatabaseAdapter } from "../databaseAdapter";

export const tagStructureMigration = {
  version: 5,
  name: "tag_structure",
  up(db: DatabaseAdapter): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS tag (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag_definition_id INTEGER NOT NULL,
        parent_tag_id INTEGER,
        FOREIGN KEY (tag_definition_id)
          REFERENCES tags(id)
          ON DELETE RESTRICT,
        FOREIGN KEY (parent_tag_id)
          REFERENCES tag(id)
          ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS tag_attribute (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        value TEXT NOT NULL,
        FOREIGN KEY (tag_id)
          REFERENCES tag(id)
          ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS tag_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag_id INTEGER NOT NULL,
        sort_order INTEGER NOT NULL,
        content_type TEXT NOT NULL
          CHECK (content_type IN ('text', 'tag')),
        text_value TEXT,
        child_tag_id INTEGER,
        FOREIGN KEY (tag_id)
          REFERENCES tag(id)
          ON DELETE CASCADE,
        FOREIGN KEY (child_tag_id)
          REFERENCES tag(id)
          ON DELETE CASCADE,
        CHECK (
          (content_type = 'text'
            AND text_value IS NOT NULL
            AND child_tag_id IS NULL)
          OR
          (content_type = 'tag'
            AND text_value IS NULL
            AND child_tag_id IS NOT NULL)
        ),
        UNIQUE (tag_id, sort_order)
      );

      CREATE INDEX IF NOT EXISTS idx_tag_definition
        ON tag(tag_definition_id);

      CREATE INDEX IF NOT EXISTS idx_tag_parent
        ON tag(parent_tag_id);

      CREATE INDEX IF NOT EXISTS idx_tag_attribute_tag
        ON tag_attribute(tag_id);

      CREATE INDEX IF NOT EXISTS idx_tag_content_tag_order
        ON tag_content(tag_id, sort_order);

      CREATE INDEX IF NOT EXISTS idx_tag_content_child
        ON tag_content(child_tag_id);
    `);
  },
};
