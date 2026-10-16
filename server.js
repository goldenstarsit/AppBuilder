import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);

const routes = {
  "/": ["dashboard/index.html", "text/html; charset=utf-8"],
  "/dashboard/": ["dashboard/index.html", "text/html; charset=utf-8"],
  "/dashboard/index.html": ["dashboard/index.html", "text/html; charset=utf-8"],
  "/dashboard/index.css": ["dashboard/index.css", "text/css; charset=utf-8"],
  "/dashboard/index.js": ["dashboard/index.js", "text/javascript; charset=utf-8"],
  "/data/index.js": ["data/index.js", "text/javascript; charset=utf-8"],
  "/render/index.js": ["render/index.js", "text/javascript; charset=utf-8"]
};

http.createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const route = routes[pathname];

  if (!route) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("404 Not Found");
  }

  try {
    const content = await readFile(path.join(root, route[0]));
    res.writeHead(200, {
      "Content-Type": route[1],
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(content);
    console.log(`${req.method} ${pathname} 200`);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 Server Error");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`AppBuilder running at http://127.0.0.1:${port}/`);
});
