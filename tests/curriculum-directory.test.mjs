import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { it, expect } from "vitest";
import { allExperiments, workbenches } from "../src/courseCatalog.mjs";
const html = readFileSync(
  new URL("../public/curriculum.html", import.meta.url),
  "utf8",
);
it("indexes every unique curriculum heading and reflects the live catalog", () => {
  const dom = new JSDOM(html),
    d = dom.window.document;
  const headings = [...d.querySelectorAll("h2[id]")],
    links = [...d.querySelectorAll('[aria-label="课程目录"] a')];
  expect(new Set(headings.map((h) => h.id)).size).toBe(headings.length);
  expect(links).toHaveLength(headings.length);
  headings.forEach((h, i) => {
    expect(links[i].getAttribute("href")).toBe("#" + h.id);
    expect(links[i].textContent.trim()).toBe(h.textContent.trim());
  });
  expect(d.body.textContent).toContain(
    `当前共 ${workbenches.length} 个主题工作台、${allExperiments.length} 个学习单元`,
  );
  dom.window.close();
});
it("search filters only directory entries, reports no matches, and clear restores all links", () => {
  const dom = new JSDOM(html, {
      url: "http://localhost",
      runScripts: "dangerously",
    }),
    d = dom.window.document,
    input = d.querySelector("#course-search-input"),
    items = [...d.querySelectorAll('[aria-label="课程目录"] li')];
  const search = (value) => {
    input.value = value;
    input.dispatchEvent(new dom.window.Event("input"));
  };
  search("投影");
  expect(items.filter((x) => !x.hidden).length).toBeGreaterThan(0);
  expect(
    items.filter((x) => !x.hidden).every((x) => x.textContent.includes("投影")),
  ).toBe(true);
  expect(d.querySelector("#course-molecule-projection").hidden).toBe(false);
  search("不存在的课程xyz");
  expect(items.every((x) => x.hidden)).toBe(true);
  expect(d.querySelector('[role="status"]').textContent).toContain("没有匹配");
  d.querySelector("#course-search-clear").click();
  expect(input.value).toBe("");
  expect(items.every((x) => !x.hidden)).toBe(true);
  expect(d.activeElement).toBe(input);
  dom.window.close();
});
