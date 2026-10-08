import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  createTableData,
  appendTableRow,
  readTable,
  exportDataTable
} from "../tables/dataTable.js";

test("generic data table supports definition, rows and export", () => {
  fs.rmSync("data/tables", { recursive: true, force: true });

  const definition = {
    name: "products",
    columns: [
      "id",
      "name",
      "active"
    ]
  };

  const table = createTableData(definition);

  assert.equal(table.name, "products");
  assert.deepEqual(table.columns, [
    "id",
    "name",
    "active"
  ]);

  appendTableRow(definition, {
    id: 1,
    name: "Test Product",
    active: true
  });

  assert.deepEqual(readTable(definition), [
    {
      id: 1,
      name: "Test Product",
      active: true
    }
  ]);

  const result = exportDataTable(definition);

  assert.equal(result.file, "products.json");
  assert.equal(result.rows, 1);

  fs.rmSync("data/tables", { recursive: true, force: true });
});
