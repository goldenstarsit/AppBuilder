import http from "node:http";
import { renderDashboard } from "./index.js";

const port = 3000;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/items") {
    if (req.method !== "GET") {
      res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const categoryId = Number(url.searchParams.get("categoryId"));

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "A valid categoryId is required" }));
      return;
    }

    const { getItemsByCategory } = await import("./core/itemService.js");
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(getItemsByCategory(categoryId)));
    return;
  }

  if (req.url === "/" || req.url === "/dashboard") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });

    res.end(renderDashboard());
    return;
  }

  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("Not Found");
});

server.listen(port, "0.0.0.0", () => {
  console.log(`AppBuilder dashboard running on http://localhost:${port}`);
});
