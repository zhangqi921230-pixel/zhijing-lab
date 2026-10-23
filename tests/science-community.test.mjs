import { it, expect } from "vitest";
import { createServer } from "node:http";
import { openStore, communityMiddleware } from "../server/community.mjs";
it("stores namespaced science feedback without changing legacy experiment identities", async () => {
  const db = openStore(":memory:");
  const server = createServer(communityMiddleware(db));
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const first = await fetch(origin + "/api/community");
    const cookie = first.headers.get("set-cookie").split(";")[0];
    const post = (path, body) =>
      fetch(origin + "/api/community/" + path, {
        method: "POST",
        headers: { cookie, origin, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    expect(
      (await post("like", { topic: "science:sky-blue", liked: true })).status,
    ).toBe(200);
    expect(
      (await post("like", { topic: "science:missing", liked: true })).status,
    ).toBe(400);
    const entry = {
      id: crypto.randomUUID(),
      kind: "suggestion",
      topic: "science:rocket",
      title: "火箭标注测试",
      requirements: "给贮箱补充说明",
      effect: "说明更清楚",
      author: "测试",
    };
    expect((await post("entries", entry)).status).toBe(201);
    const data = await (
      await fetch(origin + "/api/community", { headers: { cookie } })
    ).json();
    expect(data.entries[0].topic).toBe("science:rocket");
    expect(data.likes["science:sky-blue"].count).toBe(1);
    expect(data.likes.contour.count).toBe(0);
  } finally {
    await new Promise((r) => server.close(r));
    db.close();
  }
});
