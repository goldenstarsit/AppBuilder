import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  appendData,
  createDataTable,
  exportTable,
  getDataTableFiles,
  getDataTableSizeLimit,
  readDataTable
} from "./storage.js";

test("table starts with central and first indexed file", () => {
  fs.rmSync("data/tables", { recursive: true, force: true });

  createDataTable("test");

  assert.deepEqual(getDataTableFiles("test"), {
    central: "test.json",
    indexed: ["test_1.json"]
  });
});

test("indexed files split at 100 KB and export to central file", () => {
  fs.rmSync("data/tables", { recursive: true, force: true });

  createDataTable("test");

  const largeValue = "x".repeat(70000);

  appendData("test", {
    id: 1,
    value: largeValue
  });

  appendData("test", {
    id: 2,
    value: largeValue
  });

  assert.deepEqual(getDataTableFiles("test").indexed, [
    "test_1.json",
    "test_2.json"
  ]);

  assert.equal(getDataTableSizeLimit(), 102400);

  const result = exportTable("test");

  assert.equal(result.file, "test.json");
  assert.equal(result.rows, 2);
  assert.equal(readDataTable("test").length, 2);

  fs.rmSync("data/tables", { recursive: true, force: true });
});
