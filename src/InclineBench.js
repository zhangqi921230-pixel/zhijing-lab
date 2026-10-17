import * as T from "three";
import { box, panel } from "./CircuitBench.js";
import { incline } from "./advancedModels.mjs";
import { microscopeBenchMaterial } from "./MicroscopeMaterials.js";
import { addInclineProtractor } from "./InclineProtractor.js";
import { addInclineForceLabels } from "./InclineForceLabels.js";
import { addInclineWeights } from "./InclineWeights.js";
export const inclinePose = (angle, s = 0) => {
  const a = (angle * Math.PI) / 180;
  return {
    a,
    rampX: 2.35 * (1 - Math.cos(a)),
    y: -0.65 + 2.35 * Math.sin(a),
    x: 2.35 * (1 - Math.cos(a)) + (-2 + s) * Math.cos(a) + 0.375 * Math.sin(a),
    blockY:
      -0.65 + 2.35 * Math.sin(a) - (-2 + s) * Math.sin(a) + 0.375 * Math.cos(a),
  };
};
export const INCLINE_BRACE_LENGTH = 3.3;
export function inclineBracePose(angle) {
  const { a, y, rampX } = inclinePose(angle);
  const top = new T.Vector3(
    rampX - 1.8 * Math.cos(a) - 0.155 * Math.sin(a),
    y + 1.8 * Math.sin(a) - 0.155 * Math.cos(a),
    0,
  );
  const bottomY = -0.78;
  const footX =
    top.x + Math.sqrt(INCLINE_BRACE_LENGTH ** 2 - (top.y - bottomY) ** 2);
  return { top, bottom: new T.Vector3(footX, bottomY, 0) };
}
function rod(root, a, b, r, color) {
  const start = new T.Vector3(...a),
    end = new T.Vector3(...b),
    d = end.clone().sub(start);
  const m = new T.Mesh(
    new T.CylinderGeometry(r, r, d.length(), 20),
    new T.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.27 }),
  );
  m.position.copy(start.add(end).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
  m.castShadow = true;
  root.add(m);
  return m;
}
export function buildInclineBench(root, p) {
  box(root, [6.5, 0.22, 3.5], "#c8cfcb", [0, -1, 0]);
  for (const x of [-2.8, 2.8])
    for (const z of [-1.3, 1.3])
      box(root, [0.5, 0.14, 0.42], "#36413f", [x, -1.18, z]);
  const ramp = new T.Group();
  ramp.name = "incline-ramp";
  root.add(ramp);
  const deck = box(ramp, [4.7, 0.15, 1.65], "#cbb68b", [0, 0, 0]);
  deck.material.dispose();
  deck.material = microscopeBenchMaterial("light");
  for (const z of [-0.87, 0.87])
    box(ramp, [4.8, 0.18, 0.09], "#899a98", [0, -0.04, z]);
  const ticks = new T.InstancedMesh(
    new T.BoxGeometry(0.014, 0.008, 1),
    new T.MeshStandardMaterial({ color: "#394b48" }),
    41,
  );
  ticks.name = "incline-ruler-ticks";
  for (let i = 0; i <= 40; i++)
    ticks.setMatrixAt(
      i,
      new T.Matrix4()
        .makeScale(1, 1, i % 10 === 0 ? 0.23 : 0.1)
        .setPosition(-2 + i / 10, 0.079, 0.63),
    );
  ramp.add(ticks);
  const tape = panel(
    ramp,
    [0, 0.084, 0.75],
    4.5,
    0.23,
    (ctx) => {
      ctx.fillStyle = "#ede9d6";
      ctx.fillRect(0, 0, 1024, 64);
      ctx.fillStyle = "#304b43";
      ctx.font = "28px sans-serif";
      ctx.textAlign = "center";
      for (let i = 0; i <= 4; i++) ctx.fillText(`${i} m`, 57 + i * 227.5, 43);
    },
    [1024, 64],
  );
  if (tape.object) tape.object.rotation.x = -Math.PI / 2;
  tape.update({});
  box(ramp, [0.12, 0.66, 1.65], "#3d5f5e", [2.26, 0.28, 0]);
  box(ramp, [0.05, 0.48, 1.45], "#222f30", [2.2, 0.3, 0]);
  const block = new T.Group();
  block.name = "incline-block";
  root.add(block);
  const wood = box(block, [0.35, 0.48, 0.7], "#b77b42", [0, -0.06, 0]);
  wood.material.dispose();
  wood.material = microscopeBenchMaterial("light");
  // A physical index beside the block reads its centre position on the ruler.
  const indexArm = box(
    block,
    [0.075, 0.012, 0.22],
    "#a6b6b5",
    [0, -0.275, 0.44],
  );
  indexArm.name = "incline-index-arm";
  indexArm.material.metalness = 0.65;
  indexArm.material.roughness = 0.35;
  const pointerShape = new T.Shape();
  pointerShape.moveTo(-0.075, 0.52);
  pointerShape.lineTo(0.075, 0.52);
  pointerShape.lineTo(0, 0.66);
  pointerShape.closePath();
  const pointerGeometry = new T.ShapeGeometry(pointerShape);
  // Shape coordinates are (along-ramp, across-ramp); map into the deck plane.
  pointerGeometry.rotateX(Math.PI / 2);
  const pointer = new T.Mesh(
    pointerGeometry,
    new T.MeshStandardMaterial({
      color: "#b44a32",
      roughness: 0.6,
      side: T.DoubleSide,
    }),
  );
  pointer.name = "incline-position-index";
  pointer.position.y = -0.266;
  block.add(pointer);
  box(block, [0.35, 0.12, 0.7], "#5f747a", [0, 0.24, 0]);
  const updateWeights = addInclineWeights(block);
  for (const x of [-0.11, 0.11])
    for (const z of [-0.24, 0.24])
      rod(block, [x, 0.3, z], [x, 0.315, z], 0.023, "#bbc4c3");
  const massLabel = panel(
    block,
    [0, 0.02, 0.356],
    0.3,
    0.19,
    (ctx, q) => {
      ctx.fillStyle = "#e9e5d5";
      ctx.fillRect(0, 0, 256, 160);
      ctx.fillStyle = "#263e39";
      ctx.textAlign = "center";
      ctx.font = "bold 52px sans-serif";
      ctx.fillText(`${q.mass} kg`, 128, 98);
    },
    [256, 160],
  );
  const supports = [],
    supportFeet = [],
    bracePins = [],
    locks = [];
  for (const z of [-0.68, 0.68]) {
    box(ramp, [0.2, 0.11, 0.18], "#839895", [-1.8, -0.13, z]);
    const support = box(root, [0.11, INCLINE_BRACE_LENGTH, 0.12], "#899d9e", [
      0,
      0,
      z,
    ]);
    support.material.metalness = 0.72;
    support.material.roughness = 0.3;
    support.name = "incline-support";
    supports.push(support);
    const foot = box(root, [0.5, 0.1, 0.4], "#4c625e", [-1.8, -0.83, z]);
    foot.name = "incline-support-foot";
    supportFeet.push(foot);
    box(root, [1.7, 0.018, 0.1], "#4c5755", [1.05, -0.878, z]);
    const pins = [0, 1].map(() =>
      rod(root, [0, 0, -0.105], [0, 0, 0.105], 0.057, "#c0c8c4"),
    );
    bracePins.push(pins);
    const lock = new T.Group();
    rod(lock, [0, 0, 0], [0, 0, 0.18], 0.026, "#c0c8c4");
    const wheel = new T.Mesh(
      new T.CylinderGeometry(0.085, 0.085, 0.065, 12),
      new T.MeshStandardMaterial({ color: "#273a3c", roughness: 0.65 }),
    );
    wheel.rotation.x = Math.PI / 2;
    wheel.position.z = 0.2;
    lock.add(wheel);
    lock.name = "incline-rail-lock";
    root.add(lock);
    locks.push(lock);
  }
  const hinge = rod(root, [0, 0, -1.05], [0, 0, 1.05], 0.055, "#abb7b4");
  hinge.rotation.set(Math.PI / 2, 0, 0);
  hinge.name = "incline-hinge";
  const updateProtractor = addInclineProtractor(root);
  const hingeFeet = [-0.4, 0.4].map((z) =>
    box(root, [0.28, 0.2, 0.22], "#647c75", [0, -0.79, z]),
  );
  const anglePlate = panel(
    root,
    [-1.9, -0.66, 1.2],
    1.2,
    0.52,
    (ctx, q) => {
      ctx.fillStyle = "#e9e9da";
      ctx.fillRect(0, 0, 512, 224);
      ctx.fillStyle = "#284d42";
      ctx.font = "bold 72px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${q.angle}°`, 256, 100);
      ctx.font = "34px sans-serif";
      ctx.fillText("斜面倾角", 256, 176);
    },
    [512, 224],
  );
  const arrows = ["#c66c39", "#258d83", "#b18c28", "#8e6ab5"].map(
    (color, i) => {
      const a = new T.Group();
      a.name = [
        "incline-gravity",
        "incline-normal",
        "incline-friction",
        "incline-stop-force",
      ][i];
      const material = new T.MeshBasicMaterial({ color, depthTest: false });
      const shaft = new T.Mesh(
        new T.CylinderGeometry(0.014, 0.014, 0.8, 12),
        material,
      );
      shaft.position.y = 0.4;
      const head = new T.Mesh(new T.ConeGeometry(0.07, 0.2, 16), material);
      head.position.y = 0.9;
      shaft.renderOrder = head.renderOrder = 20;
      a.add(shaft, head);
      root.add(a);
      return a;
    },
  );
  const updateForceLabels = addInclineForceLabels(root);
  let labelKey = "";
  root.userData.update = (q) => {
    const model = incline(q, q.time ?? 0),
      pose = inclinePose(q.angle, model.s),
      { a } = pose;
    ramp.rotation.z = -a;
    ramp.position.x = pose.rampX;
    ramp.position.y = pose.y;
    block.rotation.z = -a;
    block.position.set(pose.x, pose.blockY, 0);
    updateWeights(q.mass);
    const brace = inclineBracePose(q.angle);
    supports.forEach((o, i) => {
      const z = supportFeet[i].position.z;
      const top = brace.top.clone().setZ(z),
        bottom = brace.bottom.clone().setZ(z);
      o.position.copy(top).add(bottom).multiplyScalar(0.5);
      o.quaternion.setFromUnitVectors(
        new T.Vector3(0, 1, 0),
        top.clone().sub(bottom).normalize(),
      );
      supportFeet[i].position.x = bottom.x;
      bracePins[i][0].position.copy(top);
      bracePins[i][1].position.copy(bottom);
      locks[i].position.set(bottom.x, -0.8, z + 0.12);
    });
    hinge.position.set(2.35, -0.65, 0);
    updateProtractor(a);
    hingeFeet.forEach((o) => {
      o.position.x = hinge.position.x;
    });
    const dirs = [
        [0, -1, 0],
        [Math.sin(a), Math.cos(a), 0],
        [-Math.cos(a), Math.sin(a), 0],
        [-Math.cos(a), Math.sin(a), 0],
      ],
      forces = [model.gravity, model.normal, model.friction, model.stopForce];
    arrows.forEach((o, i) => {
      o.position.copy(block.position);
      o.position.z = 0.49;
      o.quaternion.setFromUnitVectors(
        new T.Vector3(0, 1, 0),
        new T.Vector3(...dirs[i]),
      );
      o.scale.y = Math.max(0.001, forces[i] * 0.032);
      o.visible = q.forces !== 0 && forces[i] > 0.001;
    });
    updateForceLabels(arrows);
    const key = `${q.angle}/${q.mass}`;
    if (key !== labelKey) {
      massLabel.update(q);
      anglePlate.update(q);
      labelKey = key;
    }
    root.userData.motion = model;
    return true;
  };
  root.userData.update(p);
}
