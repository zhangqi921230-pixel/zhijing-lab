// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { CommunityProvider, CommunityBoard } from "../src/Community.jsx";
it("preserves a rejected submission and retries with the same id, then clears only after confirmed save", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  sessionStorage.clear();
  const draft = {
    id: crypto.randomUUID(),
    kind: "wish",
    topic: "",
    title: "新主题",
    requirements: "可操作的教学要求",
    effect: "看得见的现象",
    author: "",
  };
  sessionStorage.setItem("community-draft:", JSON.stringify(draft));
  let reject = true;
  const submissions = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url, options) => {
      if (options.method === "POST") {
        submissions.push(JSON.parse(options.body));
        return {
          ok: !reject,
          json: async () =>
            reject ? { error: "暂时不可用" } : { id: draft.id },
        };
      }
      return {
        ok: true,
        json: async () => ({ likes: {}, entries: [], total: 0, page: 1 }),
      };
    }),
  );
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => {
      root.render(
        <CommunityProvider>
          <CommunityBoard open={() => {}} />
        </CommunityProvider>,
      );
    });
    await act(async () =>
      host
        .querySelector("form")
        .dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        ),
    );
    expect(host.querySelector('[name="title"]').value).toBe("新主题");
    expect(host.textContent).toContain("提交尚未确认");
    reject = false;
    await act(async () =>
      host
        .querySelector("form")
        .dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        ),
    );
    expect(submissions.map((x) => x.id)).toEqual([draft.id, draft.id]);
    expect(host.querySelector('[name="title"]').value).toBe("");
    expect(host.textContent).toContain("已保存，记录编号");
  } finally {
    await act(() => root.unmount());
    host.remove();
    vi.unstubAllGlobals();
    sessionStorage.clear();
  }
});
