import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  getSchemaDefinition,
  getAll,
  getById,
  insert,
  update,
  remove,
  getData,
  TABLE_MAX_SIZE
} from "../core/tableStorage.js";

const tablesDir = path.resolve("tables");

test("platform schema and five records can be read", () => {
  assert.deepEqual(getSchemaDefinition("platform").columns, [
    "id", "name", "description"
  ]);
  const rows = getAll("platform");
  assert.equal(rows.length, 5);
  assert.deepEqual(rows.map(row => row.id), [1, 2, 3, 4, 5]);
  assert.equal(rows[0].name, "Web");
});

test("platform row can be found by id", () => {
  assert.equal(getById("platform", 1).name, "Web");
  assert.equal(getById("platform", 999), null);
});

test("insert, update and delete work without leaving test data", () => {
  const row = insert("platform", {
    name: "Storage Test Platform",
    description: "Temporary test record"
  });

  try {
    assert.equal(row.id, 6);
    assert.equal(getById("platform", 6).name, "Storage Test Platform");

    update("platform", 6, { description: "Updated test record" });
    assert.equal(getById("platform", 6).description, "Updated test record");

    assert.throws(
      () => insert("platform", { name: "Web", description: "Duplicate" }),
      /Duplicate name/
    );
  } finally {
    remove("platform", 6);
  }

  assert.equal(getAll("platform").length, 5);
  assert.deepEqual(getAll("platform").map(row => row.id), [1, 2, 3, 4, 5]);
});

test("central data file matches indexed platform records", () => {
  assert.deepEqual(getData().platform, getAll("platform"));
});

test("indexed platform files are within 100 KB", () => {
  const files = fs.readdirSync(tablesDir)
    .filter(file => /^platform\d+\.json$/.test(file));

  assert.ok(files.length > 0);
  for (const file of files) {
    assert.ok(fs.statSync(path.join(tablesDir, file)).size <= TABLE_MAX_SIZE);
  }
});
