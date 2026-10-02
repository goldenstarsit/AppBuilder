import { NextResponse } from "next/server";
import { createDatabase } from "../../../src/database/databaseFactory";
import { runMigrations } from "../../../src/database/migrations";

export const runtime = "nodejs";

type CategoryRow = {
  id: number;
  name: string;
  description: string;
};

export async function GET() {
  const db = createDatabase();

  try {
    runMigrations(db);

    const categories = db.all<CategoryRow>(
      "SELECT id, name, description FROM category ORDER BY name ASC",
    );

    return NextResponse.json(
      categories.map((category) => ({
        id: String(category.id),
        name: category.name,
        description: category.description,
        count: 0,
        entities: [],
      })),
    );
  } finally {
    db.close();
  }
}
