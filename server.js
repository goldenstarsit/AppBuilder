import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listTables, getTable } from "./core/tableService.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(JSON.stringify(data));
}

function sendFile(res, filename, contentType) {
  try {
    const content = fs.readFileSync(path.join(ROOT, filename));
    res.writeHead(200, {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache"
    });
    res.end(content);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Unable to load dashboard file.");
  }
}

function validMethod(req, res, method = "GET") {
  if (req.method === method) return true;
  res.setHeader("Allow", method);
  sendJson(res, 405, { error: "Method not allowed" });
  return false;
}

const server = http.createServer((req, res) => {
  let url;

  try {
    url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  } catch {
    sendJson(res, 400, { error: "Invalid request URL" });
    return;
  }

  if (url.pathname === "/api/tables") {
    if (!validMethod(req, res)) return;

    try {
      sendJson(res, 200, listTables());
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Unable to list tables" });
    }
    return;
  }

  const tableMatch = url.pathname.match(/^\/api\/tables\/([^/]+)$/);
  if (tableMatch) {
    if (!validMethod(req, res)) return;

    let tableName;
    try {
      tableName = decodeURIComponent(tableMatch[1]);
    } catch {
      sendJson(res, 400, { error: "Invalid table name" });
      return;
    }

    try {
      const allowed = listTables().some(table => table.name === tableName);
      if (!allowed) {
        sendJson(res, 404, { error: "Table not found" });
        return;
      }
      sendJson(res, 200, getTable(tableName));
    } catch (error) {
      sendJson(res, 400, { error: error.message || "Unable to read table" });
    }
    return;
  }

  if (url.pathname === "/" || url.pathname === "/dashboard" || url.pathname === "/index.html") {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end();
      return;
    }
    if (req.method === "HEAD") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end();
      return;
    }
    sendFile(res, "index.html", "text/html; charset=utf-8");
    return;
  }

  if (url.pathname === "/index.css") {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end();
      return;
    }
    if (req.method === "HEAD") {
      res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
      res.end();
      return;
    }
    sendFile(res, "index.css", "text/css; charset=utf-8");
    return;
  }

  if (url.pathname === "/index.js") {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end();
      return;
    }
    if (req.method === "HEAD") {
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
      res.end();
      return;
    }
    sendFile(res, "index.js", "text/javascript; charset=utf-8");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`AppBuilder dashboard running on http://localhost:${PORT}`);
});
