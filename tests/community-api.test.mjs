import { describe, it, expect } from "vitest";
import { createServer } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { openStore, communityMiddleware } from "../server/community.mjs";

describe("shared community persistence", () => {
  it("isolates visitors, deduplicates likes and retries, validates writes and persists across reopen", async () => {
    const dir = mkdtempSync(join(tmpdir(), "zhijing-community-"));
    const path = join(dir, "test.sqlite");
    let db = openStore(path);
    const server = createServer(communityMiddleware(db));
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const first = await fetch(origin + "/api/community");
    const cookie = first.headers.get("set-cookie").split(";")[0];
    const second = await fetch(origin + "/api/community");
    const other = second.headers.get("set-cookie").split(";")[0];
    const post = (route, body, who = cookie, from = origin) =>
      fetch(origin + "/api/community/" + route, {
        method: "POST",
        headers: {
          cookie: who,
          origin: from,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    try {
      expect((await first.json()).total).toBe(0);
      expect(
        (await post("like", { topic: "contour", liked: true })).status,
      ).toBe(200);
      await post("like", { topic: "contour", liked: true });
      expect(
        (
          await (
            await fetch(origin + "/api/community", {
              headers: { cookie: other },
            })
          ).json()
        ).likes.contour,
      ).toEqual({ count: 1, liked: false });
      await post("like", { topic: "contour", liked: true }, other);
      expect(
        (await (await post("like", { topic: "contour", liked: false })).json())
          .count,
      ).toBe(1);
      expect((await post("like", { topic: "bogus", liked: true })).status).toBe(
        400,
      );
      expect(
        (
          await post(
            "like",
            { topic: "contour", liked: true },
            cookie,
            "https://elsewhere.test",
          )
        ).status,
      ).toBe(403);
      const entry = {
        id: randomUUID(),
        kind: "suggestion",
        topic: "contour",
        title: "增加对照",
        requirements: "同时观察两条剖面",
        effect: "课堂比较坡度",
        author: "",
      };
      expect((await post("entries", { ...entry, title: "" })).status).toBe(400);
      expect((await post("entries", entry)).status).toBe(201);
      expect((await post("entries", entry)).status).toBe(200);
      expect((await post("entries", entry, other)).status).toBe(409);
      const wish = {
        ...entry,
        id: randomUUID(),
        kind: "wish",
        topic: "",
        title: "新主题",
      };
      await Promise.all([post("entries", wish), post("entries", wish)]);
      const data = await (
        await fetch(origin + "/api/community?kind=wish", {
          headers: { cookie },
        })
      ).json();
      expect(data.total).toBe(1);
      expect(data.entries[0].status).toBe("待评估");
      expect(data.entries[0]).not.toHaveProperty("visitor");
      expect(data.entries[0]).not.toHaveProperty("ip");
      const scoped = await (
        await fetch(origin + "/api/community?topic=contour", {
          headers: { cookie },
        })
      ).json();
      expect(scoped.total).toBe(1);
      await new Promise((r) => server.close(r));
      db.close();
      db = openStore(path);
      expect(db.prepare("SELECT count(*) n FROM entries").get().n).toBe(2);
      expect(db.prepare("SELECT count(*) n FROM likes").get().n).toBe(1);
    } finally {
      server.close();
      db.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
