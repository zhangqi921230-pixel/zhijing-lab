// @vitest-environment jsdom
import { it, expect } from "vitest";
import { isCellReturnKey } from "../src/cellNavigation.mjs";

it("Esc 返回只响应普通观察操作，保留输入及原生选择的退出语义", () => {
  const event = { key: "Escape", target: document.createElement("button") };
  expect(isCellReturnKey(event)).toBe(true);
  for (const props of [
    { key: "Enter" },
    { defaultPrevented: true },
    { isComposing: true },
    { ctrlKey: true },
    { altKey: true },
    { metaKey: true },
  ])
    expect(isCellReturnKey({ ...event, ...props })).toBe(false);
  for (const tag of ["input", "textarea", "select"]) {
    expect(
      isCellReturnKey({ ...event, target: document.createElement(tag) }),
    ).toBe(false);
  }
  const editor = document.createElement("div");
  editor.setAttribute("contenteditable", "plaintext-only");
  const text = document.createElement("span");
  editor.append(text);
  expect(isCellReturnKey({ ...event, target: text })).toBe(false);
});
