import * as T from "three";
import { box, panel } from "./CircuitBench.js";
import { createInstrumentFinishTexture } from "./MicroscopeMaterials.js";

export function addRCInstrumentDetails(root, sourceBody, plates) {
  const powder = createInstrumentFinishTexture(false);
  const brushed = createInstrumentFinishTexture(true);
  const resources = new T.Group();
  resources.name = "rc-instrument-finish";
  resources.userData.ownedTexture = powder;
  const brushedResource = new T.Group();
  brushedResource.userData.ownedTexture = brushed;
  resources.add(brushedResource);
  root.add(resources);
  sourceBody.material.roughnessMap = powder;
  sourceBody.material.roughness = 0.64;
  sourceBody.material.metalness = 0.18;
  plates.forEach((plate) => {
    plate.material.metalness = 0.65;
    plate.material.roughness = 0.42;
    plate.material.roughnessMap = brushed;
  });
  const face = box(
    root,
    [1.25, 1.32, 0.025],
    "#d6dbd2",
    [-2, 0.05, 0.515],
    0.018,
  );
  face.name = "rc-source-faceplate";
  face.material.roughnessMap = powder;
  box(root, [1.19, 0.33, 0.025], "#142e32", [-2, 0.28, 0.54], 0.012);
  const metal = new T.MeshStandardMaterial({
    color: "#9caaa6",
    metalness: 0.8,
    roughness: 0.33,
    roughnessMap: brushed,
  });
  const rubber = new T.MeshStandardMaterial({
    color: "#283b3d",
    roughness: 0.84,
  });
  // Shallow shaded vents suggest the housing recess; this is not an airflow model.
  const vents = new T.InstancedMesh(
    new T.BoxGeometry(0.006, 0.029, 0.57),
    new T.MeshStandardMaterial({ color: "#142b2d", roughness: 0.95 }),
    24,
  );
  vents.name = "rc-source-vent-recesses";
  const lips = new T.InstancedMesh(
    new T.BoxGeometry(0.015, 0.006, 0.57),
    sourceBody.material,
    24,
  );
  lips.name = "rc-source-vent-lips";
  const ventMatrix = new T.Matrix4();
  for (let side = 0; side < 2; side++) {
    for (let row = 0; row < 12; row++) {
      const x = -2 + (side ? 0.704 : -0.704),
        y = -0.3 + row * 0.065;
      ventMatrix.makeTranslation(x, y, 0);
      vents.setMatrixAt(side * 12 + row, ventMatrix);
      ventMatrix.makeTranslation(x, y - 0.016, 0);
      lips.setMatrixAt(side * 12 + row, ventMatrix);
    }
  }
  vents.computeBoundingSphere();
  lips.computeBoundingSphere();
  root.add(vents, lips);
  const knob = new T.Group();
  knob.name = "rc-voltage-knob";
  knob.userData = {
    action: "parameter",
    key: "u",
    delta: 0.5,
    min: 1,
    max: 12,
  };
  knob.position.set(-2.45, -0.35, 0.58);
  root.add(knob);
  const drum = new T.Mesh(
    new T.CylinderGeometry(0.115, 0.115, 0.14, 48),
    rubber,
  );
  drum.rotation.x = Math.PI / 2;
  knob.add(drum);
  const cap = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.015, 40), metal);
  cap.rotation.x = Math.PI / 2;
  cap.position.z = 0.08;
  knob.add(cap);
  const grooves = new T.InstancedMesh(
    new T.BoxGeometry(0.012, 0.03, 0.12),
    rubber,
    32,
  );
  grooves.name = "rc-knob-grips";
  const transform = new T.Object3D();
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    transform.position.set(0.114 * Math.cos(a), 0.114 * Math.sin(a), 0);
    transform.rotation.z = a;
    transform.updateMatrix();
    grooves.setMatrixAt(i, transform.matrix);
  }
  knob.add(grooves);
  const pointer = box(
    knob,
    [0.013, 0.055, 0.006],
    "#edf1de",
    [0, 0.059, 0.091],
    0.002,
  );
  pointer.name = "rc-knob-pointer";
  const screws = new T.InstancedMesh(
    new T.CylinderGeometry(0.027, 0.027, 0.012, 16),
    metal,
    4,
  );
  const slots = new T.InstancedMesh(
    new T.BoxGeometry(0.026, 0.005, 0.004),
    rubber,
    4,
  );
  let i = 0;
  for (const x of [-2.55, -1.45])
    for (const y of [-0.58, 0.66]) {
      transform.position.set(x, y, 0.537);
      transform.rotation.set(Math.PI / 2, 0, 0);
      transform.updateMatrix();
      screws.setMatrixAt(i, transform.matrix);
      transform.position.z = 0.545;
      transform.rotation.set(0, 0, 0.5);
      transform.updateMatrix();
      slots.setMatrixAt(i++, transform.matrix);
    }
  screws.name = "rc-panel-fasteners";
  root.add(screws, slots);
  for (const [x, y, color] of [
    [-2, 0, "#ae4a39"],
    [-1.65, -0.2, "#293837"],
  ]) {
    const ring = new T.Mesh(
      new T.TorusGeometry(0.082, 0.014, 8, 24),
      new T.MeshStandardMaterial({ color, roughness: 0.62 }),
    );
    ring.position.set(x, y, 0.57);
    ring.name = "rc-source-socket-collar";
    root.add(ring);
  }
  for (const x of [-2.52, -1.48])
    for (const z of [-0.32, 0.32])
      box(root, [0.18, 0.225, 0.18], "#283b3d", [x, -0.8125, z], 0.025).name =
        "rc-source-foot";
  const title = panel(
    root,
    [-2, 0.64, 0.543],
    0.96,
    0.13,
    (ctx) => {
      ctx.fillStyle = "#d6dbd2";
      ctx.fillRect(0, 0, 768, 128);
      ctx.fillStyle = "#304c45";
      ctx.font = 'bold 65px "Microsoft YaHei",sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("直流稳压电源", 384, 88);
    },
    [768, 128],
  );
  title.update({});
  for (const [text, position, width] of [
    ["电压调节", [-2.45, -0.52, 0.54], 0.31],
    ["+", [-2, -0.13, 0.54], 0.1],
    ["−", [-1.65, -0.34, 0.54], 0.1],
  ]) {
    const marking = panel(
      root,
      position,
      width,
      text === "电压调节" ? 0.055 : 0.08,
      (ctx) => {
        ctx.fillStyle = "#d6dbd2";
        ctx.fillRect(0, 0, 512, 128);
        ctx.fillStyle = "#34554a";
        ctx.font = 'bold 90px "Microsoft YaHei",sans-serif';
        ctx.textAlign = "center";
        ctx.fillText(text, 256, 98);
      },
      [512, 128],
    );
    marking.update({});
  }
  return (voltage) => {
    knob.rotation.z = -((voltage - 1) / 11 - 0.5) * Math.PI * 1.4;
  };
}
