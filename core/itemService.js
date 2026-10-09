import { getAll } from "./tableStorage.js";

export function filterItemsByCategory(items, categoryId) {
  return items.filter((item) => item.categoryId === categoryId);
}

export function getItemsByCategory(categoryId) {
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    throw new Error("categoryId must be a positive integer.");
  }

  return filterItemsByCategory(getAll("items"), categoryId);
}
