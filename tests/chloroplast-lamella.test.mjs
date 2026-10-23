import { it, expect } from "vitest";
import * as T from "three";
import {
  createLamellaGeometry,
  lamellaPoint,
} from "../src/ChloroplastLamella.js";

it("膜带在对应类囊体层内连接，闭合且面朝外", () => {
  const a = [-0.21, 0],
    b = [-0.105, 0.1];
  for (const level of [-0.027, -0.009]) {
    expect(lamellaPoint(a, b, level, 0)).toEqual([a[0], level, a[1]]);
    const end = lamellaPoint(a, b, level, 1);
    expect(end[0]).toBeCloseTo(b[0]);
    expect(end[1]).toBeCloseTo(level);
    expect(end[2]).toBeCloseTo(b[1]);
    const geometry = createLamellaGeometry(a, b, level, 1);
    const pos = geometry.attributes.position,
      index = geometry.index;
    const edges = new Map();
    let volume = 0;
    const u = new T.Vector3(),
      v = new T.Vector3(),
      w = new T.Vector3();
    for (let i = 0; i < index.count; i += 3) {
      const tri = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
      u.fromBufferAttribute(pos, tri[0]);
      v.fromBufferAttribute(pos, tri[1]);
      w.fromBufferAttribute(pos, tri[2]);
      volume += u.dot(v.cross(w)) / 6;
      for (let j = 0; j < 3; j++) {
        const x = tri[j],
          y = tri[(j + 1) % 3],
          key = [Math.min(x, y), Math.max(x, y)].join(",");
        edges.set(key, (edges.get(key) || 0) + 1);
      }
    }
    expect([...edges.values()].every((count) => count === 2)).toBe(true);
    expect(volume).toBeGreaterThan(0);
    for (let i = 0; i < pos.count; i++) {
      expect(Math.abs(pos.getY(i) - level)).toBeLessThan(0.0056);
    }
    expect([...geometry.attributes.normal.array].every(Number.isFinite)).toBe(
      true,
    );
  }
});
