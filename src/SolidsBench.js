import * as T from "three";
import { box, panel } from "./CircuitBench.js";
import { solidsState } from "./advancedModels.mjs";
import { createSolidVolume } from "./SolidVolume.js";
const SCALE = 0.7,
  BASE = -0.65;
export const rulerTextureY = (cm) => 384 - ((cm + 0.1) / 4.2) * 384;
function add(root, geometry, material, name) {
  const m = new T.Mesh(geometry, material);
  m.name = name;
  m.castShadow = m.receiveShadow = true;
  root.add(m);
  return m;
}
const material = (color, extra = {}) =>
  new T.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.12,
    ...extra,
  });
function ring(root, name, color) {
  const m = add(
    root,
    new T.TorusGeometry(1, 0.016, 8, 96),
    material(color),
    name,
  );
  m.rotation.x = Math.PI / 2;
  return m;
}
export function buildSolidsBench(root, p) {
  box(root, [8, 0.12, 6], "#d9d5c2", [0, -0.91, 0]);
  const parts = [];
  for (let i = 0; i < 2; i++) {
    const x = i ? 1.9 : -1.9,
      color = i ? "#c8994f" : "#328477";
    const body = add(
      root,
      i ? new T.ConeGeometry(1, 1, 96) : new T.CylinderGeometry(1, 1, 1, 96),
      new T.MeshPhysicalMaterial({
        color,
        roughness: 0.16,
        metalness: 0,
        clearcoat: 1,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        side: T.DoubleSide,
      }),
      i ? "solid-cone" : "solid-cylinder",
    );
    const plinth = add(
      root,
      new T.CylinderGeometry(1, 1, 0.12, 96),
      material("#f5f0dc"),
      `solid-plinth-${i}`,
    );
    plinth.position.set(x, BASE - 0.09, 0);
    const bottom = ring(root, `solid-base-${i}`, color),
      top = i ? null : ring(root, "solid-top", color),
      cutRing = ring(root, `solid-cut-ring-${i}`, i ? "#bd8d34" : "#287e76");
    const section = add(
      root,
      new T.CircleGeometry(1, 96),
      material(i ? "#e6b64f" : "#47aaa0", {
        side: T.DoubleSide,
        transparent: true,
        opacity: 0.76,
        depthWrite: false,
      }),
      `solid-section-${i}`,
    );
    section.rotation.x = -Math.PI / 2;
    const generators = new T.LineSegments(
      new T.BufferGeometry().setAttribute(
        "position",
        new T.Float32BufferAttribute(new Float32Array(24), 3),
      ),
      new T.LineBasicMaterial({ color, transparent: true, opacity: 0.6 }),
    );
    generators.name = `solid-generators-${i}`;
    root.add(generators);
    const measurement = new T.LineSegments(
      new T.BufferGeometry().setAttribute(
        "position",
        new T.Float32BufferAttribute(new Float32Array(30), 3),
      ),
      new T.LineBasicMaterial({
        color: i ? "#755018" : "#174e49",
        depthTest: false,
      }),
    );
    measurement.name = `solid-measurement-${i}`;
    measurement.renderOrder = 3;
    root.add(measurement);
    const axis = new T.Line(
      new T.BufferGeometry().setAttribute(
        "position",
        new T.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3),
      ),
      new T.LineDashedMaterial({
        color,
        dashSize: 0.055,
        gapSize: 0.04,
        transparent: true,
        opacity: 0.7,
      }),
    );
    axis.name = `solid-axis-${i}`;
    axis.position.set(x, BASE, 0);
    root.add(axis);
    const direction = i ? 1 : -1;
    const cursorShape = new T.Shape();
    cursorShape.moveTo(-direction * 0.2, 0);
    cursorShape.lineTo(direction * 0.07, 0.055);
    cursorShape.lineTo(direction * 0.07, -0.055);
    cursorShape.closePath();
    const cursor = new T.Mesh(
      new T.ShapeGeometry(cursorShape),
      new T.MeshBasicMaterial({ color, side: T.DoubleSide, depthTest: false }),
    );
    cursor.name = `solid-ruler-cursor-${i}`;
    cursor.renderOrder = 4;
    root.add(cursor);
    const ruler = panel(
      root,
      [x, BASE + 1.4, -0.1],
      0.4,
      4.2 * SCALE,
      (ctx) => {
        ctx.setTransform(128 / 768, 0, 0, 1024 / 384, 0, 0);
        ctx.fillStyle = "#faf7e8";
        ctx.fillRect(0, 0, 768, 384);
        ctx.strokeStyle = "#5b6655";
        ctx.fillStyle = "#44573f";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        ctx.font = "18px sans-serif";
        for (let j = 0; j <= 40; j++) {
          const y = rulerTextureY(j / 10);
          ctx.lineWidth = j % 5 === 0 ? 3 : 1.5;
          ctx.beginPath();
          ctx.moveTo(40, y);
          ctx.lineTo(j % 10 === 0 ? 430 : j % 5 === 0 ? 260 : 170, y);
          ctx.stroke();
          if (j % 10 === 0) {
            ctx.save();
            ctx.translate(560, y + 6);
            ctx.scale(14.7, 1);
            ctx.fillText(String(j / 10), 0, 0);
            ctx.restore();
          }
        }
      },
      [128, 1024],
    );
    ruler.update({});
    const rulerMesh = ruler.object;
    const plaque = box(
      root,
      [2.75, 0.025, 0.82],
      "#f6f1df",
      [x, -0.835, 2.2],
      0.01,
    );
    plaque.name = `solid-readout-plinth-${i}`;
    const nameplate = panel(
      root,
      [x, -0.819, 2.2],
      2.7,
      0.78,
      (ctx, q) => {
        ctx.fillStyle = "#f6f1df";
        ctx.fillRect(0, 0, 768, 188);
        ctx.textAlign = "center";
        ctx.fillStyle = i ? "#80622e" : "#2c6558";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText(i ? "圆锥" : "圆柱", 384, 51);
        ctx.font = "bold 30px sans-serif";
        ctx.fillText(`r=${q.radius} cm · h=${q.height} cm`, 384, 101);
        ctx.fillText(
          `z=${q.z.toFixed(2)} cm · 截面半径 ${q.rho.toFixed(2)} cm`,
          384,
          153,
        );
      },
      [768, 188],
    );
    if (nameplate.object) {
      nameplate.object.material.toneMapped = false;
      nameplate.object.rotation.x = -Math.PI / 2;
    }
    parts.push({
      updateVolume: createSolidVolume(root, !!i),
      x,
      body,
      plinth,
      bottom,
      top,
      cutRing,
      section,
      generators,
      measurement,
      axis,
      cursor,
      rulerMesh,
      nameplate,
    });
  }
  let prior = "",
    priorReadout = "";
  root.userData.update = (q) => {
    const state = solidsState(q, q.time ?? 0),
      r = q.radius * SCALE,
      h = q.height * SCALE,
      key = `${q.radius}/${q.height}`;
    parts.forEach((o, i) => {
      o.body.visible = q.solidShell !== 0;
      for (const object of [o.measurement, o.axis, o.cursor, o.rulerMesh])
        if (object) object.visible = q.solidMeasures !== 0;
      o.updateVolume(state.fraction, r, h, o.x, BASE, q.accumulation === true);
      o.body.position.set(o.x, BASE + h / 2, 0);
      o.body.scale.set(r, h, r);
      o.plinth.scale.set(r + 0.13, 1, r + 0.13);
      o.bottom.position.set(o.x, BASE, 0);
      o.bottom.scale.setScalar(r);
      if (o.top) {
        o.top.position.set(o.x, BASE + h, 0);
        o.top.scale.setScalar(r);
      }
      const cutRadius = i ? state.sectionRadius * SCALE : r;
      o.section.scale.setScalar(cutRadius);
      o.section.position.set(o.x, BASE + state.z * SCALE, 0);
      o.section.visible = cutRadius > 1e-8 && !q.accumulation;
      o.cutRing.scale.setScalar(cutRadius);
      o.cutRing.position.copy(o.section.position);
      o.cutRing.visible = cutRadius > 1e-8;
      if (o.rulerMesh) o.rulerMesh.position.x = o.x + (i ? 1 : -1) * (r + 0.38);
      const y = BASE + state.z * SCALE,
        direction = i ? 1 : -1;
      const rulerX = o.x + direction * (r + 0.38);
      o.cursor.position.set(rulerX, y, -0.06);
      const measure = o.measurement.geometry.attributes.position;
      measure.setXYZ(0, o.x, y + 0.008, 0);
      measure.setXYZ(1, o.x + cutRadius, y + 0.008, 0);
      measure.setXYZ(2, o.x + direction * cutRadius, y, -0.1);
      measure.setXYZ(3, rulerX, y, -0.1);
      measure.setXYZ(4, rulerX - 0.15, y, -0.07);
      measure.setXYZ(5, rulerX + 0.15, y, -0.07);
      const tick = Math.min(0.045, cutRadius * 0.2);
      measure.setXYZ(6, o.x, y + 0.008, -tick);
      measure.setXYZ(7, o.x, y + 0.008, tick);
      measure.setXYZ(8, o.x + cutRadius, y + 0.008, -tick);
      measure.setXYZ(9, o.x + cutRadius, y + 0.008, tick);
      measure.needsUpdate = true;
      o.measurement.geometry.computeBoundingSphere();
      const vertices = o.generators.geometry.attributes.position;
      if (key !== prior) {
        const axisVertices = o.axis.geometry.attributes.position;
        axisVertices.setXYZ(1, 0, h, 0);
        axisVertices.needsUpdate = true;
        o.axis.computeLineDistances();
        o.axis.geometry.computeBoundingSphere();
        for (let j = 0; j < 4; j++) {
          const a = (j * Math.PI) / 2,
            dx = r * Math.cos(a),
            dz = r * Math.sin(a);
          vertices.setXYZ(j * 2, o.x + dx, BASE, dz);
          vertices.setXYZ(j * 2 + 1, o.x + (i ? 0 : dx), BASE + h, i ? 0 : dz);
        }
        vertices.needsUpdate = true;
        o.generators.geometry.computeBoundingSphere();
      }
      const readoutKey = `${key}/${state.z.toFixed(2)}/${state.sectionRadius.toFixed(2)}`;
      if (readoutKey !== priorReadout)
        o.nameplate.update({
          ...q,
          z: state.z,
          rho: i ? state.sectionRadius : q.radius,
        });
    });
    prior = key;
    priorReadout = `${key}/${state.z.toFixed(2)}/${state.sectionRadius.toFixed(2)}`;
    root.userData.sectionState = state;
    return true;
  };
  root.userData.update(p);
}
