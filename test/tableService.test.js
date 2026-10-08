import test from "node:test";
import assert from "node:assert/strict";

import {
  listTables,
  getTable,
  getTableRows,
  getTableRow
} from "../core/tableService.js";

test("table service lists registered tables", () => {
  const tables = listTables();

  assert.equal(tables.length, 1);
  assert.equal(tables[0].name, "environmentDetails");
  assert.deepEqual(tables[0].schema.columns, [
    "id",
    "environment",
    "type",
    "description",
    "decoder"
  ]);
});

test("table service returns complete table", () => {
  const table = getTable("environmentDetails");

  assert.equal(table.name, "environmentDetails");
  assert.equal(table.rows.length, 5);
  assert.equal(table.schema.columns.length, 5);
});

test("table service returns table rows", () => {
  const rows = getTableRows("environmentDetails");

  assert.equal(rows.length, 5);
  assert.equal(rows[0].id, 1);
});

test("table service returns row by id", () => {
  const row = getTableRow("environmentDetails", 1);

  assert.equal(row.environment, "web");
  assert.equal(row.type, "web");
});
