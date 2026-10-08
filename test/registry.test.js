import assert from "node:assert/strict";
import test from "node:test";
import {
  createTable,
  registerTable,
  getTable,
  getTables,
  removeTable
} from "../tables/index.js";

test("register and retrieve a table", () => {
  const table = createTable("components", ["id", "type"]);

  registerTable(table);

  assert.equal(getTable("components"), table);
  assert.equal(getTables().length, 1);

  removeTable("components");

  assert.equal(getTable("components"), undefined);
  assert.equal(getTables().length, 0);
});
