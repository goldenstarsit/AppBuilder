import {
  appendTableRow,
  createTableData,
  exportDataTable,
  readTable
} from "./dataTable.js";

export const environmentDetailsTable = {
  name: "environment_details",
  columns: [
    "id",
    "environment",
    "type",
    "description",
    "decoder"
  ]
};

const ENVIRONMENT_DETAILS = [
  {
    id: 1,
    environment: "web",
    type: "web",
    description: "Web application",
    decoder: "frontend/web/decoder.js"
  },
  {
    id: 2,
    environment: "electron",
    type: "desktop",
    description: "Desktop application",
    decoder: "frontend/electron/decoder.js"
  },
  {
    id: 3,
    environment: "expo",
    type: "mobile",
    description: "Mobile application",
    decoder: "frontend/expo/decoder.js"
  },
  {
    id: 4,
    environment: "babylon",
    type: "games",
    description: "Game application",
    decoder: "frontend/babylon/decoder.js"
  },
  {
    id: 5,
    environment: "nextjs",
    type: "web",
    description: "Next.js web application",
    decoder: "frontend/nextjs/decoder.js"
  }
];

export function getEnvironmentDetails() {
  createTableData(environmentDetailsTable);

  let rows = readTable(environmentDetailsTable);

  if (rows.length === 0) {
    for (const row of ENVIRONMENT_DETAILS) {
      appendTableRow(environmentDetailsTable, row);
    }

    exportDataTable(environmentDetailsTable);
    rows = readTable(environmentDetailsTable);
  }

  return rows;
}
