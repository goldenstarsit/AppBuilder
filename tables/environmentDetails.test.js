import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getEnvironmentDetails } from "./environmentDetails.js";

test("environment details table contains all frontend environments", () => {
  fs.rmSync("data/tables", { recursive: true, force: true });

  const rows = getEnvironmentDetails();

  assert.equal(rows.length, 5);
  assert.deepEqual(
    rows.map((row) => row.environment),
    ["web", "electron", "expo", "babylon", "nextjs"]
  );

  assert.equal(rows[0].decoder, "frontend/web/decoder.js");
  assert.equal(rows[1].decoder, "frontend/electron/decoder.js");
  assert.equal(rows[2].decoder, "frontend/expo/decoder.js");
  assert.equal(rows[3].decoder, "frontend/babylon/decoder.js");
  assert.equal(rows[4].decoder, "frontend/nextjs/decoder.js");

  fs.rmSync("data/tables", { recursive: true, force: true });
});
