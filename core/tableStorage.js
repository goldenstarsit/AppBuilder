import fs from "node:fs";
import path from "node:path";

const TABLES_DIR = path.resolve("tables");
const MAX_INDEX_FILE_SIZE = 100 * 1024;

function readJson(file, fallback) {
  return fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : fallback;
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function tableFile(name) {
  return path.join(TABLES_DIR, `${name}.json`);
}

function indexFile(name, index) {
  return path.join(TABLES_DIR, `${name}${index}.json`);
}

function validateTableName(name) {
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(name) ||
      ["data", "schema"].includes(name)) {
    throw new Error(`Invalid table name: ${name}`);
  }
}

export function getTableNames() {
  return fs.readdirSync(TABLES_DIR)
    .filter(file => /^[A-Za-z][A-Za-z0-9_-]*\.json$/.test(file))
    .map(file => file.slice(0, -5))
    .filter(name => !["data", "schema"].includes(name))
    .filter(name => !/\d+$/.test(name))
    .sort();
}

function getRows(name) {
  validateTableName(name);
  const pattern = new RegExp(`^${name}(\\d+)\\.json$`);

  return fs.readdirSync(TABLES_DIR)
    .filter(file => pattern.test(file))
    .sort((a, b) =>
      Number(a.match(/(\d+)\.json$/)[1]) -
      Number(b.match(/(\d+)\.json$/)[1])
    )
    .flatMap(file => {
      const rows = readJson(path.join(TABLES_DIR, file), []);
      if (!Array.isArray(rows)) {
        throw new Error(`Invalid indexed data file: ${file}`);
      }
      return rows;
    });
}

function writeIndexedFiles(name, rows) {
  for (const file of fs.readdirSync(TABLES_DIR)) {
    if (new RegExp(`^${name}\\d+\\.json$`).test(file)) {
      fs.unlinkSync(path.join(TABLES_DIR, file));
    }
  }

  let batch = [];
  let index = 1;

  for (const row of rows) {
    const candidate = [...batch, row];
    if (Buffer.byteLength(JSON.stringify(candidate, null, 2) + "\n") > MAX_INDEX_FILE_SIZE) {
      if (!batch.length) throw new Error("A single row exceeds the 100 KB limit.");
      writeJson(indexFile(name, index++), batch);
      batch = [row];
      if (Buffer.byteLength(JSON.stringify(batch, null, 2) + "\n") > MAX_INDEX_FILE_SIZE) {
        throw new Error("A single row exceeds the 100 KB limit.");
      }
    } else {
      batch = candidate;
    }
  }

  if (batch.length) writeJson(indexFile(name, index), batch);
}

function rebuildDataFile() {
  const data = {};
  for (const name of getTableNames()) data[name] = getRows(name);
  writeJson(path.join(TABLES_DIR, "data.json"), data);
}

function persistTable(name, rows) {
  writeIndexedFiles(name, rows);
  rebuildDataFile();
}

export function getSchemaDefinition(name) {
  validateTableName(name);
  const schema = readJson(tableFile(name), null);
  if (!schema || !Array.isArray(schema.columns)) {
    throw new Error(`Table schema not found or invalid: ${name}`);
  }
  return schema;
}

export function createTable(name, columns = []) {
  validateTableName(name);
  if (fs.existsSync(tableFile(name))) throw new Error(`Table already exists: ${name}`);
  writeJson(tableFile(name), { columns });
  rebuildDataFile();
  return getSchemaDefinition(name);
}

export function getAll(name) {
  getSchemaDefinition(name);
  return getRows(name);
}

export function getById(name, id) {
  return getAll(name).find(row => row.id === id) ?? null;
}

export function insert(name, row) {
  getSchemaDefinition(name);
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("A table row must be an object.");
  }

  const rows = getRows(name);
  const schema = getSchemaDefinition(name);

  if (schema.constraints?.name?.unique &&
      rows.some(item => item.name === row.name)) {
    throw new Error(`Duplicate name: ${row.name}`);
  }

  const next = { ...row, id: rows.length + 1 };
  rows.push(next);
  persistTable(name, rows);
  return next;
}

export function update(name, id, changes) {
  getSchemaDefinition(name);
  const rows = getRows(name);
  const index = rows.findIndex(row => row.id === id);
  if (index < 0) return null;

  if (changes.name !== undefined &&
      rows.some((row, i) => i !== index && row.name === changes.name)) {
    throw new Error(`Duplicate name: ${changes.name}`);
  }

  rows[index] = { ...rows[index], ...changes, id };
  persistTable(name, rows);
  return rows[index];
}

export function remove(name, id) {
  getSchemaDefinition(name);
  const rows = getRows(name);
  const index = rows.findIndex(row => row.id === id);
  if (index < 0) return false;

  rows.splice(index, 1);
  rows.forEach((row, i) => { row.id = i + 1; });
  persistTable(name, rows);
  return true;
}

export function getData() {
  return readJson(path.join(TABLES_DIR, "data.json"), {});
}

export function getTables() {
  return getTableNames().map(name => ({
    name,
    schema: getSchemaDefinition(name),
    rows: getRows(name)
  }));
}

export const TABLE_MAX_SIZE = MAX_INDEX_FILE_SIZE;
