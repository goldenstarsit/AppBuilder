import type { DatabaseAdapter } from "./databaseAdapter";
import { SQLiteAdapter } from "./sqlite/sqliteAdapter";

export type DatabaseProvider = "sqlite";

export interface DatabaseOptions {
  provider?: DatabaseProvider;
  path?: string;
}

export function createDatabase(
  options: DatabaseOptions = {},
): DatabaseAdapter {
  const provider = options.provider ?? "sqlite";

  switch (provider) {
    case "sqlite":
      return new SQLiteAdapter(
        options.path ?? "data/appbuilder.db",
      );

    default: {
      const unsupportedProvider: never = provider;
      throw new Error(
        `Unsupported database provider: ${unsupportedProvider}`,
      );
    }
  }
}
