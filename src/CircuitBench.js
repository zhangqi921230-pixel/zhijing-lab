import * as THREE from "three";
import { addCircuitSwitch } from "./CircuitSwitch.js";
import { addCircuitHardware } from "./CircuitHardware.js";
import { laboratorySurface } from "./LaboratorySurface.js";
import { addCableSleeves } from "./CableSleeves.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { addCircuitTerminals } from "./CircuitTerminals.js";
import { addCircuitMeter } from "./CircuitMeter.js";
import { finishCircuitInstruments } from "./CircuitMaterials.js";
import {
  addSupplyControl,
  addCircuitPolarityLabels,
} from "./CircuitControls.js";

// Named endpoints are shared by the visible leads and topology tests.
export const terminals = {
  "source+": [-3.25, -0.3, -0.05],
  "source-": [-2.55, -0.3, -0.05],
  "switch-in": [-0.75, -0.2, -1.2],
  "switch-out": [0.3, -0.2, -1.2],
  "A+": [2.15, -0.3, -0.05],
  "A-": [1.45, -0.3, -0.05],
  "R+": [1.1, -0.4, 1.7],
  "R-": [-0.25, -0.4, 1.7],
  "V+": [-1.35, -0.3, 2.15],
  "V-": [-2.05, -0.3, 2.15],
};
export const leads = [
  [
    "source+",
    "switch-in",
    "#bb4032",
    [
      [-3.5, -0.58, 0.45],
      [-0.75, -0.58, 0.45],
    ],
  ],
  [
    "switch-out",
    "A+",
    "#bb4032",
    [
      [0.5, -0.58, 0.4],
      [2.6, -0.58, 0.4],
    ],
  ],
  [
    "A-",
    "R+",
    "#bc4937",
    [
      [1.4, -0.57, 0.6],
      [1.1, -0.57, 1.25],
    ],
  ],
  [
    "R-",
    "source-",
    "#303b3f",
    [
      [-0.45, -0.57, 0.95],
      [-2.2, -0.57, 0.7],
    ],
  ],
  [
    "V+",
    "R+",
    "#bc4937",
    [
      [-1.15, -0.55, 2.7],
      [1.5, -0.55, 2.7],
      [1.5, -0.55, 1.7],
    ],
  ],
  [
    "V-",
    "R-",
    "#303b3f",
    [
      [-2.35, -0.57, 2.8],
      [-0.55, -0.57, 2.8],
    ],
  ],
];
const material = (color, extras = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.12,
    ...extras,
  });
function mesh(parent, geometry, mat, pos) {
  const obj = new THREE.Mesh(geometry, mat);
  obj.position.set(...pos);
  obj.castShadow = obj.receiveShadow = true;
  parent.add(obj);
  return obj;
}
export function box(parent, size, color, pos, radius = 0.06) {
  return mesh(
    parent,
    new RoundedBoxGeometry(...size, 3, radius),
    material(color),
    pos,
  );
}
function cylinder(parent, a, b, r, color) {
  const start = new THREE.Vector3(...a),
    end = new THREE.Vector3(...b),
    d = end.clone().sub(start);
  const obj = mesh(
    parent,
    new THREE.CylinderGeometry(r, r, d.length(), 16),
    material(color, { metalness: 0.65 }),
    start.add(end).multiplyScalar(0.5).toArray(),
  );
  obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return obj;
}
export function panel(
  parent,
  pos,
  width,
  height,
  draw,
  textureSize = [768, 384],
) {
  if (typeof document === "undefined") return { update() {}, object: null };
  const canvas = document.createElement("canvas");
  [canvas.width, canvas.height] = textureSize;
  const ctx = canvas.getContext("2d"),
    texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const obj = mesh(
    parent,
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture }),
    pos,
  );
  obj.userData.ownedTexture = texture;
  obj.userData.dynamicDisplay = true;
  return {
    object: obj,
    update(p) {
      draw(ctx, p);
      texture.needsUpdate = true;
    },
  };
}
export function circuitMeterFace(
  ctx,
  title,
  value,
  unit,
  range,
  digital = true,
) {
  ctx.fillStyle = "#e5e7de";
  ctx.fillRect(0, 0, 768, 384);
  ctx.fillStyle = "#243f42";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText(title, 32, 46);
  if (range) {
    ctx.strokeStyle = "#344a46";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 30; i++) {
      ctx.lineWidth = i % 5 === 0 ? 4 : 2;
      const a = Math.PI + (i / 30) * Math.PI,
        r = i % 5 ? 185 : 170;
      ctx.beginPath();
      ctx.moveTo(384 + Math.cos(a) * r, 255 + Math.sin(a) * r);
      ctx.lineTo(384 + Math.cos(a) * 200, 255 + Math.sin(a) * 200);
      ctx.stroke();
      if (i % 5 === 0) {
        ctx.font = "600 24px sans-serif";
        ctx.fillText(
          ((i / 30) * range).toFixed(1),
          384 + Math.cos(a) * 145,
          255 + Math.sin(a) * 145,
        );
      }
    }
    ctx.font = "bold 58px sans-serif";
    ctx.fillText(unit, 96, 157);
    ctx.font = "20px sans-serif";
    ctx.fillText(`0–${range} ${unit}`, 96, 204);
    ctx.fillText("直流", 96, 236);
    ctx.font = "18px sans-serif";
    ctx.fillText(`每小格 ${(range / 30).toFixed(1)} ${unit}`, 384, 373);
    ctx.textBaseline = "alphabetic";
  }
  ctx.fillStyle = "#162b2d";
  ctx.fillRect(208, range ? 288 : 110, 350, range ? 65 : 142);
  ctx.fillStyle = "#b9eacb";
  ctx.font = `${range ? 46 : 90}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(
    range && !digital
      ? "— — —"
      : value.toFixed(unit === "A" ? 3 : 2) + " " + unit,
    384,
    range ? 337 : 211,
  );
  ctx.textAlign = "left";
  if (!range) {
    ctx.fillStyle = "#63756b";
    ctx.font = "24px sans-serif";
    ctx.fillText("直流稳压电源  /  0–12 V", 180, 305);
  }
}
export function buildCircuitBench(root, p) {
  const updateSupplyControl = addSupplyControl(root);
  addCircuitPolarityLabels(root, terminals);
  box(root, [8.4, 0.22, 5.2], "#dedace", [0, -0.82, 0.7]);
  const worktop = box(
    root,
    [8.45, 0.07, 5.25],
    "#ffffff",
    [0, -0.68, 0.7],
    0.025,
  );
  const worktopTexture = laboratorySurface("worktop");
  worktop.material.map = worktopTexture;
  worktop.material.roughness = 0.88;
  worktop.userData.ownedTexture = worktopTexture;
  for (const [x, z] of [
    [-3, -1.2],
    [3, -1.2],
    [-3, 2.5],
    [3, 2.5],
  ])
    box(root, [0.25, 0.65, 0.25], "#293a3e", [x, -1.15, z]);
  const screens = [];
  const meters = [];
  const instruments = [];
  for (const [x, z, title, unit, range, y] of [
    [-2.9, -0.8, "直流电源", "V", 0, 0.5],
    [1.8, -0.8, "电流表 · 串联", "A", 3, 0.15],
    [-1.7, 1.4, "电压表 · 并联", "V", 15, 0.15],
  ]) {
    const height = range ? 1.45 : 2.15;
    instruments.push({ x, y, z, height, range });
    box(root, [1.65, height, 1.25], "#324a4f", [x, y, z]);
    for (const dx of [-0.55, 0.55])
      for (const dz of [-0.42, 0.42])
        box(root, [0.18, 0.07, 0.18], "#263633", [x + dx, -0.61, z + dz], 0.02);
    box(root, [1.52, height - 0.13, 0.08], "#dfdfd2", [x, y, z + 0.65]);
    const display = panel(
      root,
      [x, y + (range ? 0.17 : 0.4), z + 0.699],
      1.37,
      0.74,
      (ctx, q) =>
        circuitMeterFace(
          ctx,
          title,
          unit === "A"
            ? q.closed
              ? q.u / q.r
              : 0
            : range
              ? q.closed
                ? q.u
                : 0
              : q.u,
          unit,
          range,
          q.digital !== 0,
        ),
    );
    screens.push(display);
    if (range) {
      const meter = addCircuitMeter(
        root,
        [x, y + 0.17, z + 0.699],
        range,
        unit,
      );
      meters.push({ meter, unit });
    }
    for (let i = 0; i < 7; i++)
      box(
        root,
        [0.035, 0.035, 0.65],
        "#152c31",
        [x + 0.4 + i * 0.06, y + height / 2 + 0.015, z],
        0.008,
      );
  }
  addCircuitHardware(root, instruments);
  const hinge = addCircuitSwitch(root, box, cylinder);
  box(root, [1.75, 0.14, 0.7], "#28494b", [0.43, -0.56, 1.7]);
  cylinder(root, [-0.15, -0.32, 1.7], [1, -0.32, 1.7], 0.19, "#f0e8cf");
  cylinder(root, terminals["R-"], [-0.15, -0.32, 1.7], 0.045, "#baa16d");
  cylinder(root, terminals["R+"], [1, -0.32, 1.7], 0.045, "#baa16d");
  const coil = [];
  for (let i = 0; i <= 540; i++) {
    const a = (i / 540) * Math.PI * 2 * 18;
    coil.push(
      new THREE.Vector3(
        -0.12 + (i / 540) * 1.08,
        -0.32 + Math.cos(a) * 0.197,
        1.7 + Math.sin(a) * 0.197,
      ),
    );
  }
  mesh(
    root,
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(coil),
      540,
      0.012,
      5,
      false,
    ),
    material("#aa7963", { metalness: 0.7 }),
    [0, 0, 0],
  );
  const label = panel(root, [0.43, -0.43, 2.065], 1.1, 0.16, (ctx, q) => {
    ctx.fillStyle = "#ebeadf";
    ctx.fillRect(0, 0, 768, 384);
    ctx.fillStyle = "#263f40";
    ctx.font = "bold 110px sans-serif";
    ctx.fillText(`R = ${q.r} Ω`, 60, 245);
  });
  screens.push(label);
  addCircuitTerminals(root, terminals);
  const circuitWires = [];
  for (const [a, b, color, via] of leads) {
    const points = [terminals[a], ...via, terminals[b]].map(
      (v) => new THREE.Vector3(...v),
    );
    const curve = new THREE.CatmullRomCurve3(points);
    const getPoint = curve.getPoint.bind(curve);
    curve.getPoint = (t, target) => {
      const point = getPoint(t, target);
      point.y = Math.max(-0.59, point.y);
      return point;
    };
    const wire = mesh(
      root,
      new THREE.TubeGeometry(curve, 80, 0.032, 8, false),
      material(color, { roughness: 0.55 }),
      [0, 0, 0],
    );
    wire.name = `lead:${a}:${b}`;
    wire.userData.branch = a.startsWith("V") ? 2 : 1;
    wire.userData.originalColor = wire.material.color.clone();
    circuitWires.push(wire);
  }
  addCableSleeves(root, circuitWires);
  finishCircuitInstruments(root);
  let previous;
  let previousTrace;
  root.userData.update = (q) => {
    const trace = q.trace ?? 0;
    if (trace !== previousTrace) {
      previousTrace = trace;
      circuitWires.forEach((wire) => {
        const selected = trace === wire.userData.branch;
        wire.material.color.copy(wire.userData.originalColor);
        if (trace) wire.material.color.set(selected ? "#e8a632" : "#8a9993");
        wire.material.emissive.set(selected ? "#583000" : "#000000");
        wire.material.emissiveIntensity = selected ? 0.25 : 0;
      });
    }
    if (
      previous?.u === q.u &&
      previous.r === q.r &&
      previous.digital === q.digital &&
      previous.closed === q.closed
    )
      return;
    previous = { u: q.u, r: q.r, closed: q.closed, digital: q.digital };
    updateSupplyControl(q.u);
    hinge.rotation.z = q.closed ? 0 : Math.PI / 4;
    screens.forEach((s) => s.update(q));
    meters.forEach(({ meter, unit }) =>
      meter.set(q.closed ? (unit === "A" ? q.u / q.r : q.u) : 0),
    );
  };
  root.userData.animate = (now, reducedMotion) => {
    let moving = false;
    for (const { meter } of meters)
      moving = meter.animate(now, reducedMotion) || moving;
    return moving;
  };
  root.userData.update(p);
}
