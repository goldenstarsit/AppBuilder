import fs from "node:fs";
import path from "node:path";

const TABLES_DIR = path.resolve("tables");
const MAX_INDEX_FILE_SIZE = 100 * 1024;

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

function tableFile(tableName) {
  return path.join(TABLES_DIR, `${tableName}.json`);
}

function indexFile(tableName, index) {
  return path.join(TABLES_DIR, `${tableName}${index}.json`);
}

function dataFile() {
  return path.join(TABLES_DIR, "data.json");
}

function schemaFile() {
  return path.join(TABLES_DIR, "schema.json");
}

function serializeRows(rows) {
  return `${JSON.stringify(rows, null, 2)}\n`;
}

function validateTableName(tableName) {
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  if (tableName === "data" || tableName === "schema") {
    throw new Error(`Reserved table name: ${tableName}`);
  }
}

function validateRow(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("A table row must be an object.");
  }
}

function getSchema() {
  return readJson(schemaFile(), {});
}

function getRows(tableName) {
  validateTableName(tableName);
  return readJson(tableFile(tableName), []);
}

export function getTableNames() {
  const schema = getSchema();
  return Object.keys(schema);
}

function writeIndexedFiles(tableName, rows) {
  const files = fs.readdirSync(TABLES_DIR);

  for (const file of files) {
    const match = file.match(
      new RegExp(`^${tableName}(\\d+)\\.json$`)
    );

    if (match) {
      fs.unlinkSync(path.join(TABLES_DIR, file));
    }
  }

  let currentRows = [];
  let index = 1;

  for (const row of rows) {
    const candidateRows = [...currentRows, row];
    const candidate = serializeRows(candidateRows);

    if (Buffer.byteLength(candidate, "utf8") > MAX_INDEX_FILE_SIZE) {
      if (currentRows.length === 0) {
        throw new Error(
          `A single row exceeds the 100 KB indexed-file limit.`
        );
      }

      writeJson(indexFile(tableName, index), currentRows);

      index += 1;
      currentRows = [row];

      if (
        Buffer.byteLength(serializeRows(currentRows), "utf8") >
        MAX_INDEX_FILE_SIZE
      ) {
        throw new Error(
          `A single row exceeds the 100 KB indexed-file limit.`
        );
      }
    } else {
      currentRows = candidateRows;
    }
  }

  if (currentRows.length > 0) {
    writeJson(indexFile(tableName, index), currentRows);
  }
}

function rebuildDataFile() {
  const data = {};

  for (const tableName of getTableNames()) {
    data[tableName] = getRows(tableName);
  }

  writeJson(dataFile(), data);
}

function persistTable(tableName, rows) {
  writeJson(tableFile(tableName), rows);
  writeIndexedFiles(tableName, rows);
  rebuildDataFile();
}

export function getSchemaDefinition(tableName) {
  validateTableName(tableName);

  const schema = getSchema();

  if (!schema[tableName]) {
    throw new Error(`Table does not exist in schema: ${tableName}`);
  }

  return schema[tableName];
}

export function createTable(tableName, columns = []) {
  validateTableName(tableName);

  const schema = getSchema();

  if (schema[tableName]) {
    throw new Error(`Table already exists: ${tableName}`);
  }

  schema[tableName] = {
    columns
  };

  writeJson(schemaFile(), schema);
  writeJson(tableFile(tableName), []);
  writeIndexedFiles(tableName, []);
  rebuildDataFile();

  return getSchemaDefinition(tableName);
}

export function getAll(tableName) {
  return [...getRows(tableName)];
}

export function getById(tableName, id) {
  return getRows(tableName).find((row) => row.id === id) ?? null;
}

export function insert(tableName, row) {
  validateRow(row);
  getSchemaDefinition(tableName);

  const rows = getRows(tableName);

  if (rows.some((item) => item.id === row.id)) {
    throw new Error(`Duplicate id: ${row.id}`);
  }

  rows.push(row);
  persistTable(tableName, rows);

  return row;
}

export function update(tableName, id, changes) {
  validateRow(changes);
  getSchemaDefinition(tableName);

  const rows = getRows(tableName);
  const index = rows.findIndex((row) => row.id === id);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...rows[index],
    ...changes,
    id
  };

  rows[index] = updated;
  persistTable(tableName, rows);

  return updated;
}

export function remove(tableName, id) {
  getSchemaDefinition(tableName);

  const rows = getRows(tableName);
  const index = rows.findIndex((row) => row.id === id);

  if (index === -1) {
    return false;
  }

  rows.splice(index, 1);
  persistTable(tableName, rows);

  return true;
}

export function getData() {
  return readJson(dataFile(), {});
}

export function getTables() {
  return getTableNames().map((name) => ({
    name,
    schema: getSchemaDefinition(name),
    rows: getRows(name)
  }));
}

export const TABLE_MAX_SIZE = MAX_INDEX_FILE_SIZE;
