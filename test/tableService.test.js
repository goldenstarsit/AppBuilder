import test from "node:test";
import assert from "node:assert/strict";
import {
  listTables,
  getTable,
  getTableRows,
  getTableRow
} from "../core/tableService.js";

test("table service lists the registered platform table", () => {
  const tables = listTables();
  assert.deepEqual(tables.map(table => table.name), ["platform"]);
  assert.deepEqual(tables[0].schema.columns, ["id", "name", "description"]);
});

test("table service returns the complete platform table", () => {
  const table = getTable("platform");
  assert.equal(table.name, "platform");
  assert.equal(table.rows.length, 5);
  assert.deepEqual(table.schema.columns, ["id", "name", "description"]);
});

test("table service returns platform rows", () => {
  const rows = getTableRows("platform");
  assert.equal(rows.length, 5);
  assert.equal(rows[0].id, 1);
});

test("table service returns a platform row by id", () => {
  const row = getTableRow("platform", 1);
  assert.equal(row.name, "Web");
  assert.equal(row.description, "Web applications");
});
