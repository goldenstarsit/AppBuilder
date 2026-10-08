import {
  getSchemaDefinition,
  getTableNames,
  getAll,
  getById,
  insert,
  update,
  remove
} from "./tableStorage.js";

export function listTables() {
  return getTableNames().map((name) => ({
    name,
    schema: getSchemaDefinition(name)
  }));
}

export function getTable(tableName) {
  return {
    name: tableName,
    schema: getSchemaDefinition(tableName),
    rows: getAll(tableName)
  };
}

export function getTableRows(tableName) {
  return getAll(tableName);
}

export function getTableRow(tableName, id) {
  return getById(tableName, id);
}

export function createTableRow(tableName, row) {
  return insert(tableName, row);
}

export function updateTableRow(tableName, id, changes) {
  return update(tableName, id, changes);
}

export function deleteTableRow(tableName, id) {
  return remove(tableName, id);
}
