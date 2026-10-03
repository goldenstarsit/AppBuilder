import type { DatabaseAdapter } from "../databaseAdapter";

export const contentMigration = {
  version: 7,
  name: "content",
  up(db: DatabaseAdapter): void {
    db.exec(`
      INSERT OR IGNORE INTO category (name, description)
      VALUES (
        'content',
        'User-created content composed from text or nested tags with attributes and contents.'
      );

      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        content_type TEXT NOT NULL
          CHECK (content_type IN ('text', 'tag')),
        text_value TEXT,
        root_tag_id INTEGER,
        FOREIGN KEY (category_id)
          REFERENCES category(id)
          ON DELETE RESTRICT,
        FOREIGN KEY (root_tag_id)
          REFERENCES tag(id)
          ON DELETE CASCADE,
        CHECK (
          (content_type = 'text'
            AND text_value IS NOT NULL
            AND root_tag_id IS NULL)
          OR
          (content_type = 'tag'
            AND text_value IS NULL
            AND root_tag_id IS NOT NULL)
        ),
        UNIQUE (category_id, name)
      );

      CREATE INDEX IF NOT EXISTS idx_content_category
        ON content(category_id);

      CREATE INDEX IF NOT EXISTS idx_content_root_tag
        ON content(root_tag_id);
    `);
  },
};
