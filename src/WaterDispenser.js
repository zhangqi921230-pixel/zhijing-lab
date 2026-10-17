import * as THREE from "three";
import { box, panel } from "./CircuitBench.js";
import { repeatedBoxes } from "./MicroscopeBatch.js";

export const WATER_OUTLET = [1.65, 2.2, 0];

export function addWaterDispenser(root) {
  const group = new THREE.Group();
  group.name = "dilution-water-dispenser";
  root.add(group);
  const metal = new THREE.MeshStandardMaterial({
    color: "#aab6b9",
    roughness: 0.28,
    metalness: 0.8,
  });
  const polymer = new THREE.MeshStandardMaterial({
    color: "#e9e8df",
    roughness: 0.5,
    metalness: 0,
  });
  const mesh = (geometry, material, position, name) => {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.name = name;
    object.castShadow = object.receiveShadow = true;
    group.add(object);
    return object;
  };
  const rod = (a, b, radius, material, name) => {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b),
      direction = end.clone().sub(start);
    const object = mesh(
      new THREE.CylinderGeometry(radius, radius, direction.length(), 16),
      material,
      start.add(end).multiplyScalar(0.5).toArray(),
      name,
    );
    object.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    return object;
  };
  box(group, [0.8, 0.12, 0.65], "#263f46", [2.9, -0.745, -1.45], 0.05);
  rod(
    [3.08, -0.685, -1.45],
    [3.08, 3.48, -1.45],
    0.035,
    metal,
    "dispenser-support",
  );
  for (const y of [2.38, 3.02]) {
    rod([3.08, y, -1.45], [2.8, y, -1], 0.028, metal, "dispenser-clamp-arm");
    const band = mesh(
      new THREE.TorusGeometry(0.36, 0.022, 6, 48),
      metal,
      [2.8, y, -1],
      "dispenser-clamp",
    );
    band.rotation.x = Math.PI / 2;
  }
  const profile = [
    [0, 0],
    [0.3, 0],
    [0.35, 0.06],
    [0.35, 0.96],
    [0.22, 1.1],
    [0.14, 1.13],
    [0.14, 1.2],
    [0, 1.2],
  ];
  mesh(
    new THREE.LatheGeometry(
      profile.map((v) => new THREE.Vector2(...v)),
      48,
    ),
    polymer,
    [2.8, 2.12, -1],
    "water-reservoir",
  );
  mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.1, 32),
    new THREE.MeshStandardMaterial({ color: "#597b83", roughness: 0.65 }),
    [2.8, 3.37, -1],
    "reservoir-cap",
  );
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#e6ece2";
    ctx.fillRect(0, 0, 512, 384);
    ctx.fillStyle = "#25545a";
    ctx.fillRect(0, 0, 512, 64);
    ctx.textAlign = "center";
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#e6ece2";
    ctx.fillText("WATER SUPPLY", 256, 43);
    ctx.fillStyle = "#25545a";
    ctx.font = 'bold 86px "Microsoft YaHei", sans-serif';
    ctx.fillText("纯水", 256, 184);
    ctx.font = "30px sans-serif";
    ctx.fillText("用于稀释 · 不含溶质", 256, 260);
    ctx.fillText("教学供水装置", 256, 322);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const label = mesh(
      new THREE.CylinderGeometry(0.353, 0.353, 0.45, 40, 1, true, -0.85, 1.7),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 }),
      [2.8, 2.72, -1],
      "water-reservoir-label",
    );
    label.userData.ownedTexture = texture;
  }
  repeatedBoxes(
    group,
    [0.015, 0.073, 0.018],
    "#597b83",
    0,
    Array.from({ length: 24 }, (_, i) => {
      const angle = (i * Math.PI) / 12;
      return {
        position: [
          2.8 + 0.173 * Math.sin(angle),
          3.37,
          -1 + 0.173 * Math.cos(angle),
        ],
        rotation: [0, angle, 0],
      };
    }),
    "reservoir-cap-grip",
  );
  const fitting = mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 0.1, 6),
    metal,
    [2.8, 2.24, -0.65],
    "reservoir-outlet-fitting",
  );
  fitting.rotation.x = Math.PI / 2;
  const pipe = new THREE.CatmullRomCurve3(
    [
      [2.8, 2.24, -0.65],
      [2.4, 2.24, -0.65],
      [1.8, 2.4, -0.55],
      [1.65, 2.35, 0],
      WATER_OUTLET,
    ].map((v) => new THREE.Vector3(...v)),
  );
  mesh(
    new THREE.TubeGeometry(pipe, 40, 0.027, 8, false),
    metal,
    [0, 0, 0],
    "water-delivery-tube",
  );
  mesh(
    new THREE.LatheGeometry(
      [
        [0.027, 0],
        [0.045, 0],
        [0.045, 0.035],
        [0.038, 0.075],
        [0.027, 0.075],
        [0.027, 0],
      ].map((p) => new THREE.Vector2(...p)),
      24,
    ),
    metal,
    WATER_OUTLET,
    "water-outlet-ferrule",
  );
  const valve = new THREE.Group();
  valve.name = "water-supply-valve";
  valve.userData.action = "water-supply";
  valve.position.set(2.38, 2.24, -0.65);
  group.add(valve);
  box(valve, [0.22, 0.12, 0.14], "#b3a07d", [0, 0, 0], 0.025);
  const handle = box(valve, [0.4, 0.06, 0.12], "#6e989b", [0, 0.11, 0], 0.015);
  handle.name = "water-supply-handle";
  const indicator = panel(
    group,
    [2.38, 2.02, -0.5],
    0.45,
    0.16,
    (ctx, adding) => {
      ctx.fillStyle = adding ? "#245c50" : "#35434a";
      ctx.fillRect(0, 0, 384, 128);
      ctx.fillStyle = "#f0eddd";
      ctx.textAlign = "center";
      ctx.font = 'bold 64px "Microsoft YaHei", sans-serif';
      ctx.fillText(adding ? "供水：开" : "供水：关", 192, 88);
    },
    [384, 128],
  );
  if (indicator.object) indicator.object.name = "water-valve-status";
  let previousAdding;
  const water = new THREE.MeshPhysicalMaterial({
    color: "#cde6e8",
    roughness: 0.05,
    transmission: 0.85,
    thickness: 0.035,
    ior: 1.333,
  });
  const stream = mesh(
    new THREE.CylinderGeometry(0.024, 0.018, 1, 12, 1, true),
    water,
    WATER_OUTLET,
    "dilution-water-stream",
  );
  stream.castShadow = false;
  stream.visible = false;
  return (adding, surfaceHeight) => {
    if (previousAdding !== !!adding) {
      previousAdding = !!adding;
      indicator.update(previousAdding);
    }
    const length = WATER_OUTLET[1] - surfaceHeight;
    stream.visible = !!adding && length > 0;
    stream.scale.y = Math.max(0.001, length);
    stream.position.set(
      WATER_OUTLET[0],
      surfaceHeight + length / 2,
      WATER_OUTLET[2],
    );
    handle.rotation.y = adding ? 0 : Math.PI / 2;
  };
}
