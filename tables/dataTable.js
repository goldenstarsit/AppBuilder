import {
  appendData,
  createDataTable as createStorageTable,
  exportTable,
  getDataTableFiles,
  readDataTable
} from "./storage.js";

export function createTableData(definition) {
  if (!definition?.name) {
    throw new Error("Table name is required");
  }

  if (!Array.isArray(definition.columns)) {
    throw new Error("Table columns are required");
  }

  createStorageTable(definition.name);

  return {
    name: definition.name,
    columns: definition.columns,
    files: getDataTableFiles(definition.name)
  };
}

export function appendTableRow(definition, row) {
  createTableData(definition);
  return appendData(definition.name, row);
}

export function readTable(definition) {
  createTableData(definition);
  exportTable(definition.name);
  return readDataTable(definition.name);
}

export function exportDataTable(definition) {
  createTableData(definition);
  return exportTable(definition.name);
}
