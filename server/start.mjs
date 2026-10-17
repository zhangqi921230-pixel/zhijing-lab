import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { openStore, communityMiddleware } from "./community.mjs";
const root = resolve("dist");
if (!existsSync(resolve(root, "index.html")))
  throw new Error("请先运行 npm run build");
const db = openStore();
const api = communityMiddleware(db);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
const server = createServer((req, res) =>
  api(req, res, () => {
    try {
      if (!["GET", "HEAD"].includes(req.method)) {
        res.writeHead(405);
        return res.end();
      }
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const file = resolve(
        root,
        "." + (pathname === "/" ? "/index.html" : pathname),
      );
      if (
        !file.startsWith(root + sep) ||
        !existsSync(file) ||
        !statSync(file).isFile()
      ) {
        res.writeHead(404);
        return res.end("Not found");
      }
      const size = statSync(file).size;
      const headers = {
        "Content-Type": mime[extname(file)] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
        "Accept-Ranges": "bytes",
      };
      let start = 0,
        end = size - 1,
        code = 200;
      if (req.headers.range) {
        const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
        if (
          !match ||
          +match[1] >= size ||
          (match[2] && +match[2] < +match[1])
        ) {
          res.writeHead(416, { "Content-Range": `bytes */${size}` });
          return res.end();
        }
        start = +match[1];
        end = match[2] ? Math.min(+match[2], size - 1) : size - 1;
        code = 206;
        headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
      }
      res.writeHead(code, {
        ...headers,
        "Content-Length": Math.max(0, end - start + 1),
      });
      if (req.method === "HEAD" || !size) return res.end();
      const stream = createReadStream(file, { start, end });
      stream.on("error", () => res.destroy());
      res.on("close", () => stream.destroy());
      stream.pipe(res);
    } catch {
      res.writeHead(400);
      res.end("Bad request");
    }
  }),
);
const port = Number(process.env.PORT || 4173);
server.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(`知境课堂：http://127.0.0.1:${port} （共享数据已启用）`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
