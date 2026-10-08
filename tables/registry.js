const tables = new Map();

export function registerTable(table) {
  if (!table?.name) {
    throw new Error("Table name is required");
  }

  if (tables.has(table.name)) {
    throw new Error(`Table already registered: ${table.name}`);
  }

  tables.set(table.name, table);

  return table;
}

export function getTable(name) {
  return tables.get(name);
}

export function getTables() {
  return [...tables.values()];
}

export function removeTable(name) {
  return tables.delete(name);
}
