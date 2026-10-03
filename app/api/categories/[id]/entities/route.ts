import { NextResponse } from "next/server";
import { createDatabase } from "../../../../../src/database/databaseFactory";
import { runMigrations } from "../../../../../src/database/migrations";

export const runtime = "nodejs";

type CategoryRow = {
  id: number;
  name: string;
};

type EntityRow = {
  id: number;
  name: string;
  description: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = createDatabase();

  try {
    runMigrations(db);

    const { id } = await params;
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { error: "Invalid category id." },
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

    let entities: EntityRow[] = [];

    if (category.name === "tags") {
      entities = db.all<EntityRow>(
        `SELECT id, name, description
         FROM tags
         WHERE category_id = ?
         ORDER BY name ASC`,
        category.id,
      );
    } else if (category.name === "attributes") {
      entities = db.all<EntityRow>(
        `SELECT id, name, description
         FROM attributes
         WHERE category_id = ?
         ORDER BY name ASC`,
        category.id,
      );
    }

    return NextResponse.json(
      entities.map((entity) => ({
        id: String(entity.id),
        name: entity.name,
        description: entity.description,
      })),
    );
  } finally {
    db.close();
  }
}
