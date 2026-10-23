import { DatabaseSync } from "node:sqlite";
import { randomUUID, createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  workbenches,
  allExperiments,
  groupFor,
} from "../src/communityCatalog.mjs";

export const statuses = ["待评估", "已计划", "进行中", "已完成", "暂不采纳"];
export function openStore(
  path = process.env.COMMUNITY_DB || resolve("data/community.sqlite"),
) {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS likes (topic TEXT, visitor TEXT, PRIMARY KEY(topic, visitor));
    CREATE TABLE IF NOT EXISTS entries (id TEXT PRIMARY KEY, visitor TEXT, ip TEXT, kind TEXT, topic TEXT, title TEXT, requirements TEXT, effect TEXT, author TEXT, status TEXT DEFAULT '待评估', response TEXT DEFAULT '', created TEXT, updated TEXT);
  `);
  return db;
}
const fail = (status, message) => Object.assign(new Error(message), { status });
export function communityMiddleware(db) {
  return async (req, res, next) => {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith("/api/community")) return next();
    const send = (code, data) => {
      res.writeHead(code, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(JSON.stringify(data));
    };
    try {
      const cookie = /(?:^|; )zhijing_visitor=([a-f0-9-]{36})(?:;|$)/.exec(
        req.headers.cookie || "",
      )?.[1];
      let visitor =
        cookie &&
        db.prepare("SELECT id FROM sessions WHERE id=?").get(cookie)?.id;
      if (!visitor) {
        if (req.method !== "GET") throw fail(401, "请刷新页面后重试。");
        visitor = randomUUID();
        db.prepare("INSERT INTO sessions VALUES (?)").run(visitor);
        res.setHeader(
          "Set-Cookie",
          `zhijing_visitor=${visitor}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${req.socket.encrypted ? "; Secure" : ""}`,
        );
      }
      if (req.method === "GET" && url.pathname === "/api/community") {
        const likes = Object.fromEntries(
          workbenches.map((t) => [t.id, { count: 0, liked: false }]),
        );
        for (const row of db
          .prepare(
            "SELECT topic, count(*) count, max(visitor=?) liked FROM likes GROUP BY topic",
          )
          .all(visitor))
          likes[row.topic] = { count: row.count, liked: !!row.liked };
        const page = Math.max(
          1,
          Math.min(
            100000,
            Math.floor(Number(url.searchParams.get("page"))) || 1,
          ),
        );
        const kind = ["suggestion", "wish"].includes(
          url.searchParams.get("kind"),
        )
          ? url.searchParams.get("kind")
          : "";
        const topic = url.searchParams.get("topic") || "";
        const where = "WHERE (? = '' OR kind=?) AND (? = '' OR topic=?)";
        const args = [kind, kind, topic, topic];
        const total = db
          .prepare(`SELECT count(*) total FROM entries ${where}`)
          .get(...args).total;
        const entries = db
          .prepare(
            `SELECT id,kind,topic,title,requirements,effect,author,status,response,created,updated FROM entries ${where} ORDER BY created DESC,id DESC LIMIT 20 OFFSET ?`,
          )
          .all(...args, (page - 1) * 20);
        return send(200, { likes, entries, total, page });
      }
      if (req.method !== "POST") throw fail(404, "接口不存在。");
      if (
        !req.headers.origin ||
        new URL(req.headers.origin).host !== req.headers.host ||
        req.headers["sec-fetch-site"] === "cross-site"
      )
        throw fail(403, "请从本站页面提交。");
      if (!req.headers["content-type"]?.startsWith("application/json"))
        throw fail(415, "需要 JSON 请求。");
      let raw = "";
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 24000)
          throw fail(413, "内容过长，请缩短后重试。");
      }
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        throw fail(400, "请求格式有误。");
      }
      if (!body || typeof body !== "object") throw fail(400, "请求格式有误。");
      if (url.pathname === "/api/community/like") {
        const topic = groupFor(body.topic)?.id || body.topic;
        if (
          !workbenches.some((t) => t.id === topic) ||
          typeof body.liked !== "boolean"
        )
          throw fail(400, "主题或点赞状态无效。");
        if (body.liked)
          db.prepare("INSERT OR IGNORE INTO likes VALUES (?,?)").run(
            topic,
            visitor,
          );
        else
          db.prepare("DELETE FROM likes WHERE topic=? AND visitor=?").run(
            topic,
            visitor,
          );
        return send(200, {
          topic,
          count: db
            .prepare("SELECT count(*) n FROM likes WHERE topic=?")
            .get(topic).n,
          liked: body.liked,
        });
      }
      if (url.pathname !== "/api/community/entries")
        throw fail(404, "接口不存在。");
      const fields = {
        title: 100,
        requirements: 3000,
        effect: 2000,
        author: 40,
      };
      for (const [field, max] of Object.entries(fields)) {
        if (
          typeof body[field] !== "string" ||
          body[field].trim().length > max ||
          (field !== "author" && !body[field].trim())
        )
          throw fail(400, "请完整填写主题、要求和期望效果，并遵守字数限制。");
        body[field] = body[field].trim();
      }
      if (
        !["wish", "suggestion"].includes(body.kind) ||
        (body.kind === "suggestion" &&
          !allExperiments.some((t) => t.id === body.topic))
      )
        throw fail(400, "请选择有效的建议主题。");
      if (typeof body.id !== "string" || !/^[a-f0-9-]{36}$/.test(body.id))
        throw fail(400, "提交编号无效，请刷新重试。");
      const prior = db.prepare("SELECT * FROM entries WHERE id=?").get(body.id);
      if (prior) {
        if (prior.visitor !== visitor) throw fail(409, "提交编号冲突。");
        if (
          ["kind", "title", "requirements", "effect"].some(
            (key) => prior[key] !== body[key],
          ) ||
          prior.topic !== (body.kind === "wish" ? "" : body.topic) ||
          prior.author !== (body.author || "匿名老师")
        )
          throw fail(409, "该编号已保存过不同内容。请刷新记录核对后重新填写。");
        return send(200, { id: body.id });
      }
      const ip = createHash("sha256")
        .update(req.socket.remoteAddress || "")
        .digest("hex");
      if (
        db
          .prepare(
            "SELECT count(*) n FROM entries WHERE (visitor=? OR ip=?) AND created > ?",
          )
          .get(visitor, ip, new Date(Date.now() - 3600000).toISOString()).n >=
        30
      )
        throw fail(429, "提交较频繁，请一小时后重试。");
      const now = new Date().toISOString();
      db.prepare(
        "INSERT INTO entries (id,visitor,ip,kind,topic,title,requirements,effect,author,created,updated) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      ).run(
        body.id,
        visitor,
        ip,
        body.kind,
        body.kind === "wish" ? "" : body.topic,
        body.title,
        body.requirements,
        body.effect,
        body.author || "匿名老师",
        now,
        now,
      );
      send(201, { id: body.id });
    } catch (error) {
      if (!error.status) console.error("Community storage error:", error);
      send(error.status || 500, {
        error: error.status
          ? error.message
          : "保存服务暂时不可用，请保留内容后重试。",
      });
    }
  };
}
export function communityPlugin() {
  let db;
  const install = (server) => {
    db ||= openStore();
    server.middlewares.use(communityMiddleware(db));
    server.httpServer?.once("close", () => {
      db?.close();
      db = null;
    });
  };
  return {
    name: "zhijing-community",
    configureServer: install,
    configurePreviewServer: install,
  };
}
