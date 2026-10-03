import { NextResponse } from "next/server";
import { createDatabase } from "../../../../../../../src/database/databaseFactory";
import { runMigrations } from "../../../../../../../src/database/migrations";

export const runtime = "nodejs";

type CategoryRow = {
  id: number;
  name: string;
};

type RecordRow = Record<string, unknown>;

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; entityId: string }>;
  },
) {
  const db = createDatabase();

  try {
    runMigrations(db);

    const { id, entityId } = await params;
    const categoryId = Number(id);
    const entityIdNumber = Number(entityId);

    if (
      !Number.isInteger(categoryId) ||
      categoryId <= 0 ||
      !Number.isInteger(entityIdNumber) ||
      entityIdNumber <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid category or entity id." },
        { status: 400 },
      );
    }

    const category = db.get<CategoryRow>(
      "SELECT id, name FROM category WHERE id = ?",
      categoryId,
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 },
      );
    }

    let records: RecordRow[] = [];

    if (category.name === "tags") {
      records = db.all<RecordRow>(
        `SELECT
           tag.id,
           tag.parent_tag_id,
           tag.tag_definition_id
         FROM tag
         WHERE tag.tag_definition_id = ?
         ORDER BY tag.id ASC`,
        entityIdNumber,
      );
    } else if (category.name === "attributes") {
      records = db.all<RecordRow>(
        `SELECT
           tag_attribute.id,
           tag_attribute.tag_id,
           tag_attribute.name,
           tag_attribute.value
         FROM tag_attribute
         WHERE tag_attribute.name = (
           SELECT name
           FROM attributes
           WHERE id = ? AND category_id = ?
         )
         ORDER BY tag_attribute.id ASC`,
        entityIdNumber,
        category.id,
      );
    }

    return NextResponse.json(records);
  } finally {
    db.close();
  }
}
