import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  getAll,
  getById,
  insert,
  update,
  remove,
  getData,
  TABLE_MAX_SIZE
} from "../core/tableStorage.js";

const tablesDir = path.resolve("tables");

test("environmentDetails table can be read", () => {
  const rows = getAll("environmentDetails");

  assert.equal(rows.length, 5);
  assert.equal(rows[0].environment, "web");
});

test("environmentDetails row can be found by id", () => {
  const row = getById("environmentDetails", 1);

  assert.equal(row.environment, "web");
});

test("insert, update and delete work", () => {
  const row = {
    id: 999999,
    environment: "test",
    type: "test",
    description: "Temporary test row",
    decoder: "test/decoder.js"
  };

  insert("environmentDetails", row);

  assert.equal(getById("environmentDetails", row.id).environment, "test");

  update("environmentDetails", row.id, {
    description: "Updated test row"
  });

  assert.equal(
    getById("environmentDetails", row.id).description,
    "Updated test row"
  );

  assert.equal(remove("environmentDetails", row.id), true);
  assert.equal(getById("environmentDetails", row.id), null);
});

test("central data file contains environmentDetails", () => {
  const data = getData();

  assert.ok(Array.isArray(data.environmentDetails));
  assert.equal(data.environmentDetails.length, 5);
});

test("indexed files are within 100 KB", () => {
  const files = fs
    .readdirSync(tablesDir)
    .filter((file) => /^environmentDetails\d+\.json$/.test(file));

  assert.ok(files.length > 0);

  for (const file of files) {
    const size = fs.statSync(path.join(tablesDir, file)).size;
    assert.ok(size <= TABLE_MAX_SIZE);
  }
});
