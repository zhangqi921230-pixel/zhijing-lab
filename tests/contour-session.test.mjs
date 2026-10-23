import { it, expect } from "vitest";
import {
  readContourSession,
  saveContourSession,
  freshContourSession,
} from "../src/contourSession.mjs";
function store() {
  let value = null;
  return { getItem: () => value, setItem: (key, v) => (value = v) };
}
it("restores chapter and controls while keeping animations and measurements stopped", () => {
  const s = store(),
    state = freshContourSession();
  state.chapter = 4;
  state.view = "basin";
  state.p.level = 350;
  state.p.trees = false;
  state.p.flow = true;
  state.p.probes = [{ x: 1, z: 2, h: 999 }];
  state.speed = 400;
  expect(saveContourSession(state, s)).toBe(true);
  const restored = readContourSession(s);
  expect(restored.chapter).toBe(4);
  expect(restored.view).toBe("basin");
  expect(restored.p.level).toBe(350);
  expect(restored.p.trees).toBe(false);
  expect(restored.p.flow).toBe(false);
  expect(restored.p.probes).toEqual([]);
  expect(restored.speed).toBe(400);
});
it("invalid storage cannot introduce out of range controls or unsupported modes", () => {
  const s = store();
  s.setItem(
    "",
    JSON.stringify({
      version: 1,
      chapter: 999,
      view: "unknown",
      p: {
        level: -100,
        interval: 0,
        quality: "unknown",
        section: 1e20,
        trees: "false",
      },
    }),
  );
  const result = readContourSession(s);
  expect(result.chapter).toBe(0);
  expect(result.p.level).toBe(600);
  expect(result.p.interval).toBe(100);
  expect(result.p.trees).toBe(true);
  s.setItem("", "not json");
  expect(readContourSession(s).restored).toBe(false);
  expect(
    saveContourSession(freshContourSession(), {
      setItem() {
        throw new Error("quota");
      },
    }),
  ).toBe(false);
});
