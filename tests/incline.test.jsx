import { it, expect } from "vitest";
import * as T from "three";
import {
  buildInclineBench,
  inclinePose,
  INCLINE_BRACE_LENGTH,
} from "../src/InclineBench.js";
import { incline, normalizeInclineFriction } from "../src/advancedModels.mjs";
import { lessons } from "../src/lessons.mjs";
import { restoreSession } from "../src/session.mjs";

it("hides only the 3D force overlay without changing motion or replacing arrows", () => {
  const root = new T.Group();
  const p = { angle: 27, mass: 2, mu: 0.2, muStatic: 0.5, time: 0.5 };
  buildInclineBench(root, p);
  const gravity = root.getObjectByName("incline-gravity");
  const state = { ...root.userData.motion };
  root.userData.update({ ...p, forces: 0 });
  for (const name of ["gravity", "normal", "friction", "stop-force"]) {
    expect(root.getObjectByName(`incline-${name}`).visible).toBe(false);
  }
  expect(root.userData.motion).toEqual(state);
  root.userData.update({ ...p, forces: 1 });
  expect(root.getObjectByName("incline-gravity")).toBe(gravity);
  expect(gravity.visible).toBe(true);
  expect(root.getObjectByName("incline-stop-force").visible).toBe(false);
});

it("holds below the static threshold and accelerates using kinetic friction above it", () => {
  const p = { mass: 2, mu: 0.2, muStatic: 0.5 };
  const held = incline({ ...p, angle: 26 }, 1);
  expect(held.phase).toBe("static");
  expect(held.s).toBe(0);
  expect(held.friction).toBeCloseTo(held.parallel, 12);
  expect(held.friction).toBeLessThan(held.staticLimit);
  const sliding = incline({ ...p, angle: 27 }, 0.2);
  expect(sliding.phase).toBe("sliding");
  expect(sliding.friction).toBeCloseTo(p.mu * sliding.normal, 12);
  expect(sliding.a).toBeCloseTo(
    9.8 *
      (Math.sin((27 * Math.PI) / 180) - 0.2 * Math.cos((27 * Math.PI) / 180)),
    12,
  );
  const threshold = (Math.atan(p.muStatic) * 180) / Math.PI;
  expect(incline({ ...p, angle: threshold }, 1).phase).toBe("static");
  const stopped = incline({ ...p, angle: 27 }, 20);
  expect(stopped.friction).toBeLessThanOrEqual(stopped.staticLimit);
  expect(stopped.parallel - stopped.friction - stopped.stopForce).toBeCloseTo(
    0,
    12,
  );
  expect(stopped.friction * stopped.s).toBeGreaterThan(0);
});

it("couples coefficient limits and restores old same-coefficient experiments without changing their behavior", () => {
  expect(normalizeInclineFriction({ mu: 0.6, muStatic: 0.3 }, "mu")).toEqual({
    mu: 0.6,
    muStatic: 0.6,
  });
  expect(
    normalizeInclineFriction({ mu: 0.6, muStatic: 0.3 }, "muStatic"),
  ).toEqual({ mu: 0.3, muStatic: 0.3 });
  const lesson = lessons.find((l) => l.id === "incline");
  const p = { angle: 25, mass: 2, mu: 0.2 };
  const storage = {
    getItem: () =>
      JSON.stringify({
        version: 1,
        p,
        t: 0.5,
        records: [{ t: 0.5, parameters: p }],
      }),
  };
  const restored = restoreSession(lesson, storage);
  expect(restored.restored).toBe(true);
  expect(restored.p.muStatic).toBe(0.2);
  expect(restored.records[0].parameters.muStatic).toBe(0.2);
  expect(incline(restored.p, 0.5).s).toBe(incline(p, 0.5).s);
});
it("滑块底面贴合斜面，终点前缘恰好接触缓冲垫", () => {
  for (const angle of [5, 25, 50]) {
    const root = new T.Group();
    buildInclineBench(root, { angle, mass: 2, mu: 0, time: 0 });
    for (const time of [0, 0.2, 20]) {
      root.userData.update({ angle, mass: 2, mu: 0, time });
      root.updateMatrixWorld(true);
      const ramp = root.getObjectByName("incline-ramp"),
        block = root.getObjectByName("incline-block");
      const bottom = block.localToWorld(new T.Vector3(0, -0.3, 0));
      ramp.worldToLocal(bottom);
      const pointer = root.getObjectByName("incline-position-index");
      const tip = ramp.worldToLocal(
        pointer.localToWorld(new T.Vector3(0, 0, 0.66)),
      );
      expect(tip.x).toBeCloseTo(-2 + root.userData.motion.s, 10);
      expect(tip.y).toBeGreaterThan(0.084);
      expect(tip.y).toBeLessThan(0.12);
      expect(tip.z).toBeCloseTo(0.66, 10);
      expect(bottom.y).toBeCloseTo(0.075, 12);
      expect(bottom.x).toBeCloseTo(
        -2 + incline({ angle, mass: 2, mu: 0 }, time).s,
        12,
      );
      if (time === 20) expect(bottom.x + 0.175).toBeCloseTo(2.175, 12);
    }
  }
});
it("所有参数组合满足牛顿第二定律，停止后的耗散非负", () => {
  for (const mass of [0.5, 2, 5])
    for (const angle of [5, 25, 50])
      for (const mu of [0, 0.2, 0.8])
        for (const t of [0, 0.2, 1, 20]) {
          const q = incline({ mass, angle, mu }, t);
          expect(q.parallel - q.friction - q.stopForce).toBeCloseTo(
            mass * q.a,
            10,
          );
          const loss =
            q.parallel * q.s - q.friction * q.s - 0.5 * mass * q.v * q.v;
          expect(loss).toBeGreaterThanOrEqual(-1e-9);
          if (!q.arrived) expect(loss).toBeCloseTo(0, 10);
          expect(inclinePose(angle, q.s).blockY).toBeGreaterThan(-0.65);
        }
});

it("keeps the hinge fixed, support feet aligned and angle pointer parallel to the ramp", () => {
  const root = new T.Group();
  buildInclineBench(root, { angle: 25, mass: 2, mu: 0.2 });
  const ramp = root.getObjectByName("incline-ramp"),
    hinge = root.getObjectByName("incline-hinge");
  const supports = root.children.filter((o) => o.name === "incline-support");
  const feet = root.children.filter((o) => o.name === "incline-support-foot");
  const geometry = ramp.children[0].geometry;
  for (let angle = 5; angle <= 50; angle++) {
    root.userData.update({ angle, mass: 2, mu: 0.2, time: 0 });
    root.updateMatrixWorld(true);
    expect(hinge.position.toArray()).toEqual([2.35, -0.65, 0]);
    const end = ramp.localToWorld(new T.Vector3(2.35, 0, 0));
    expect(end.distanceTo(hinge.position)).toBeLessThan(1e-12);
    const pointer = root.getObjectByName("incline-angle-pointer");
    expect(pointer.rotation.z).toBeCloseTo(ramp.rotation.z, 12);
    supports.forEach((post, i) => {
      const top = post.localToWorld(
        new T.Vector3(0, INCLINE_BRACE_LENGTH / 2, 0),
      );
      const bottom = post.localToWorld(
        new T.Vector3(0, -INCLINE_BRACE_LENGTH / 2, 0),
      );
      expect(top.distanceTo(bottom)).toBeCloseTo(INCLINE_BRACE_LENGTH, 12);
      expect(bottom.x).toBeCloseTo(feet[i].position.x, 12);
      expect(bottom.y).toBeCloseTo(-0.78, 12);
      expect(bottom.x).toBeGreaterThan(0.2);
      expect(bottom.x).toBeLessThan(1.9);
      const contact = ramp.worldToLocal(top.clone());
      expect(contact.x).toBeCloseTo(-1.8, 10);
      expect(contact.y).toBeCloseTo(-0.155, 10);
      // Both ends sit below the board, and the rigid brace never stretches.
      expect(ramp.worldToLocal(bottom.clone()).y).toBeLessThan(-0.075);
      expect(post.scale.toArray()).toEqual([1, 1, 1]);
    });
    const gravity = root.getObjectByName("incline-gravity");
    const normal = root.getObjectByName("incline-normal");
    const normalDirection = new T.Vector3(0, 1, 0).applyQuaternion(
      normal.quaternion,
    );
    const tangentDirection = new T.Vector3(1, 0, 0).applyQuaternion(
      ramp.quaternion,
    );
    expect(normalDirection.dot(tangentDirection)).toBeCloseTo(0, 12);
    expect(
      new T.Vector3(0, 1, 0)
        .applyQuaternion(gravity.quaternion)
        .distanceTo(new T.Vector3(0, -1, 0)),
    ).toBeLessThan(1e-12);
    expect(ramp.children[0].geometry).toBe(geometry);
  }
  expect(root.getObjectByName("incline-ruler-ticks").count).toBe(41);
});
