import { createTable } from "./table.js";

export const componentTable = createTable(
  "components",
  [
    "id",
    "type",
    "attributes",
    "style",
    "content",
    "children"
  ],
  []
);
