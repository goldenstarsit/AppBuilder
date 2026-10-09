import test from "node:test";
import assert from "node:assert/strict";
import { filterItemsByCategory } from "../core/itemService.js";

test("items are filtered by categoryId", () => {
  const items = [
    { id: 1, categoryId: 1, name: "div" },
    { id: 2, categoryId: 2, name: "id" },
    { id: 3, categoryId: 1, name: "span" }
  ];

  assert.deepEqual(
    filterItemsByCategory(items, 1).map((item) => item.name),
    ["div", "span"]
  );
});

test("a category with no items returns an empty list", () => {
  assert.deepEqual(
    filterItemsByCategory([{ id: 1, categoryId: 1, name: "div" }], 6),
    []
  );
});
