import fs from "node:fs";
import path from "node:path";

const DATA_DIRECTORY = path.resolve("data/tables");
const MAX_FILE_SIZE = 100 * 1024;

function tableDirectory(name) {
  return path.join(DATA_DIRECTORY, name);
}

function centralFile(name) {
  return path.join(tableDirectory(name), `${name}.json`);
}

function indexedFile(name, number) {
  return path.join(tableDirectory(name), `${name}_${number}.json`);
}

function ensureDirectory(name) {
  fs.mkdirSync(tableDirectory(name), { recursive: true });
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function getIndexedFiles(name) {
  ensureDirectory(name);

  return fs
    .readdirSync(tableDirectory(name))
    .filter((file) => new RegExp(`^${name}_[0-9]+\\.json$`).test(file))
    .sort((a, b) => {
      const aNumber = Number(a.match(/_(\d+)\.json$/)[1]);
      const bNumber = Number(b.match(/_(\d+)\.json$/)[1]);
      return aNumber - bNumber;
    });
}

export function createDataTable(name) {
  if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error("Invalid table name");
  }

  ensureDirectory(name);

  if (!fs.existsSync(centralFile(name))) {
    writeJson(centralFile(name), []);
  }

  if (!fs.existsSync(indexedFile(name, 1))) {
    writeJson(indexedFile(name, 1), []);
  }

  return {
    name,
    centralFile: `${name}.json`,
    indexedFiles: getIndexedFiles(name)
  };
}

export function appendData(name, row) {
  createDataTable(name);

  const files = getIndexedFiles(name);
  const currentFile = files[files.length - 1];
  const currentPath = path.join(tableDirectory(name), currentFile);

  const rows = readJson(currentPath);
  const candidate = JSON.stringify([...rows, row], null, 2) + "\n";

  if (Buffer.byteLength(candidate, "utf8") > MAX_FILE_SIZE) {
    const nextNumber = files.length + 1;
    const nextFile = `${name}_${nextNumber}.json`;
    const nextData = JSON.stringify([row], null, 2) + "\n";

    if (Buffer.byteLength(nextData, "utf8") > MAX_FILE_SIZE) {
      throw new Error("Single row exceeds 100 KB");
    }

    fs.writeFileSync(
      path.join(tableDirectory(name), nextFile),
      nextData
    );

    return {
      table: name,
      file: nextFile,
      segment: nextNumber
    };
  }

  fs.writeFileSync(currentPath, candidate);

  return {
    table: name,
    file: currentFile,
    segment: files.length
  };
}

export function exportTable(name) {
  createDataTable(name);

  const rows = getIndexedFiles(name).flatMap((file) =>
    readJson(path.join(tableDirectory(name), file))
  );

  writeJson(centralFile(name), rows);

  return {
    name,
    file: `${name}.json`,
    rows: rows.length
  };
}

export function readDataTable(name) {
  createDataTable(name);
  return readJson(centralFile(name));
}

export function getDataTableFiles(name) {
  createDataTable(name);

  return {
    central: `${name}.json`,
    indexed: getIndexedFiles(name)
  };
}

export function getDataTableSizeLimit() {
  return MAX_FILE_SIZE;
}
