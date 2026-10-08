import {
  appendData,
  createDataTable,
  exportTable,
  readDataTable
} from "./storage.js";

const TABLE_NAME = "environment_details";

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
  createDataTable(TABLE_NAME);

  let rows = readDataTable(TABLE_NAME);

  if (rows.length === 0) {
    for (const row of ENVIRONMENT_DETAILS) {
      appendData(TABLE_NAME, row);
    }

    exportTable(TABLE_NAME);
    rows = readDataTable(TABLE_NAME);
  }

  return rows;
}
