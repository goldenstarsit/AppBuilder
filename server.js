import http from "node:http";
import { renderDashboard } from "./index.js";

const port = 3000;

const server = http.createServer((req, res) => {
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
