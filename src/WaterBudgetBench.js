import * as T from "three";
import { addStructureLabels } from "./ChloroplastLabels.js";
import { surfaceTexture } from "./SceneCraft.js";
import { watershedCrownGeometry } from "./WatershedVegetation.js";
import { addWatershedBanks } from "./WatershedBanks.js";

export const riverX = (z) => 0.3 * Math.sin(z * 1.8);
export const riverY = (z) => 0.16 + 0.085 * (2 - z);
export function watershedGridX(column, z) {
  const centre = riverX(z),
    offset = column - 36;
  const side = Math.sign(offset),
    distance = Math.abs(offset);
  if (distance <= 1) return centre + offset * 0.085;
  const extent = 3 - side * centre;
  return centre + side * (0.13 + ((extent - 0.13) * (distance - 2)) / 34);
}
export function watershedHeight(x, z) {
  const d = Math.abs(x - riverX(z));
  const bank = 1 - Math.exp(-Math.max(0, d - 0.09) * 3);
  return (
    riverY(z) -
    0.025 +
    bank *
      (0.4 +
        0.64 * (d / 3) ** 1.5 +
        0.18 * (1 + Math.sin(x * 2.2 + z) * Math.cos(z * 2.1)))
  );
}
export function watershedGeometry() {
  const geo = new T.PlaneGeometry(6, 4, 72, 48);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position,
    colors = [];
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i),
      x = watershedGridX(i % 73, z),
      y = watershedHeight(x, z);
    pos.setX(i, x);
    pos.setY(i, y);
    const c = new T.Color().setHSL(
      0.23 + 0.025 * Math.sin(x * 21 + z * 19),
      0.26,
      0.25 + y * 0.17 + 0.025 * Math.sin(x * 47) * Math.cos(z * 39),
    );
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}
function skirtGeometry() {
  const vertices = [],
    indices = [],
    colors = [];
  const perimeter = [];
  for (let i = 0; i <= 72; i++) perimeter.push([watershedGridX(i, -2), -2]);
  for (let i = 1; i <= 48; i++) perimeter.push([3, -2 + i / 12]);
  for (let i = 1; i <= 72; i++) perimeter.push([watershedGridX(72 - i, 2), 2]);
  for (let i = 1; i <= 48; i++) perimeter.push([-3, 2 - i / 12]);
  perimeter.forEach(([x, z], i) => {
    const top = watershedHeight(x, z);
    for (let row = 0; row <= 20; row++) {
      const fraction = row / 20,
        y = -0.35 + (top + 0.35) * fraction;
      vertices.push(x, y, z);
      const band = 0.035 * Math.sin(y * 46 + 0.3 * Math.sin(x * 2 + z));
      const colour = new T.Color().setHSL(
        0.105,
        0.24,
        fraction > 0.92
          ? 0.19
          : 0.32 + band + 0.012 * Math.sin(i * 7 + row * 13),
      );
      colors.push(colour.r, colour.g, colour.b);
      if (i && row) {
        const n = i * 21 + row;
        indices.push(n - 22, n - 21, n - 1, n - 21, n, n - 1);
      }
    }
  });
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
export function buildWaterBench(root, p) {
  const mat = (color) => new T.MeshStandardMaterial({ color, roughness: 0.88 });
  const mesh = (name, geometry, material) => {
    const obj = new T.Mesh(geometry, material);
    obj.name = name;
    root.add(obj);
    return obj;
  };
  const ground = mesh(
    "watershed-terrain",
    watershedGeometry(),
    new T.MeshStandardMaterial({
      color: "#769359",
      vertexColors: true,
      roughness: 1,
      bumpMap: surfaceTexture("rock"),
      bumpScale: 0.025,
    }),
  );
  ground.receiveShadow = true;
  mesh(
    "watershed-soil",
    skirtGeometry(),
    new T.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      side: T.DoubleSide,
    }),
  );
  mesh(
    "watershed-aquifer",
    new T.BoxGeometry(6, 0.32, 4),
    mat("#6c9691"),
  ).position.y = -0.51;
  mesh(
    "watershed-bedrock",
    new T.BoxGeometry(6, 0.18, 4),
    mat("#4d595d"),
  ).position.y = -0.76;
  const positions = [],
    indices = [];
  for (let i = 0; i <= 120; i++) {
    const z = -2 + i / 30;
    positions.push(
      riverX(z) - 0.115,
      riverY(z),
      z,
      riverX(z) + 0.115,
      riverY(z),
      z,
    );
    if (i) {
      const n = i * 2;
      indices.push(n - 2, n, n - 1, n - 1, n, n + 1);
    }
  }
  const riverGeo = new T.BufferGeometry();
  riverGeo.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  riverGeo.setIndex(indices);
  riverGeo.computeVertexNormals();
  mesh(
    "watershed-river",
    riverGeo,
    new T.MeshStandardMaterial({
      color: "#429fac",
      roughness: 0.25,
      metalness: 0.2,
      side: T.DoubleSide,
    }),
  );
  addWatershedBanks(root, riverX, watershedHeight);
  const forest = new T.Group();
  forest.name = "watershed-forest";
  root.add(forest);
  const sites = [];
  for (let i = 0; i < 380; i++) {
    const x = -2.85 + 5.7 * ((i * 0.61803398875) % 1),
      z = -1.88 + 3.76 * ((i * 0.41421356237) % 1);
    if (Math.abs(x - riverX(z)) < 0.28) continue;
    sites.push([
      x,
      watershedHeight(x, z),
      z,
      0.45 + 0.5 * ((i * 0.754877) % 1),
    ]);
  }
  const trunks = new T.InstancedMesh(
    new T.CylinderGeometry(0.016, 0.026, 0.22, 5),
    mat("#6d5840"),
    sites.length,
  );
  const crowns = new T.InstancedMesh(
    watershedCrownGeometry(),
    mat("#36583a"),
    sites.length,
  );
  const dummy = new T.Object3D();
  sites.forEach(([x, y, z, s], i) => {
    dummy.position.set(x, y + 0.11 * s, z);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    trunks.setMatrixAt(i, dummy.matrix);
    dummy.position.y = y + 0.27 * s;
    dummy.rotation.y = i * 2.399963;
    dummy.scale.set(s, s * (1.1 + (i % 4) * 0.1), s);
    dummy.updateMatrix();
    crowns.setMatrixAt(i, dummy.matrix);
    crowns.setColorAt(
      i,
      new T.Color().setHSL(0.23 + (i % 7) * 0.008, 0.3, 0.23 + (i % 5) * 0.023),
    );
    dummy.rotation.y = 0;
  });
  forest.add(trunks, crowns);
  root.userData.setQuality = (quality) => {
    const detailed = quality === "detail";
    trunks.castShadow = crowns.castShadow = detailed;
    ground.receiveShadow = detailed;
  };
  root.userData.setQuality("fluent");
  const pathways = new T.Group();
  pathways.name = "watershed-pathways";
  root.add(pathways);
  const arrows = {};
  const arrow = (key, from, to, color) => {
    const a = new T.Vector3(...from),
      d = new T.Vector3(...to).sub(a),
      length = d.length();
    const object = new T.ArrowHelper(
      d.normalize(),
      a,
      length,
      color,
      0.13,
      0.085,
    );
    pathways.add(object);
    (arrows[key] ??= []).push(object);
  };
  for (const x of [-1.9, 0, 1.9]) {
    const y = watershedHeight(x, -0.6);
    arrow("rain", [x, 2.65, -0.6], [x, y + 0.06, -0.6], "#83cbe1");
  }
  for (const x of [-1.35, 1.35]) {
    const y = watershedHeight(x, 1.15);
    arrow("infil", [x, y + 0.08, 1.15], [x, -0.5, 1.15], "#d9b95e");
    const y2 = watershedHeight(x, -1.5);
    arrow("evap", [x, y2 + 0.15, -1.5], [x, 2.55, -1.5], "#e3d6b0");
  }
  for (const z of [-1.4, -0.35, 0.7])
    arrow(
      "runoff",
      [riverX(z), riverY(z) + 0.08, z],
      [riverX(z + 0.5), riverY(z + 0.5) + 0.08, z + 0.5],
      "#a8ebf2",
    );
  const labels = addStructureLabels(
    root,
    "watershed-labels",
    [
      ["降水 ↓", [0, 2.65, -0.6], [0, 2.95, -0.6]],
      ["蒸散 ↑", [1.35, 2.55, -1.5], [2.1, 2.7, -1.5]],
      ["下渗 · 地下补给", [1.35, -0.5, 1.15], [2, -0.6, 2.65]],
      ["河道 · 地表径流", [riverX(1.6), riverY(1.6), 1.6], [-0.7, 0.35, 2.7]],
    ],
    0.16,
  );
  root.userData.update = (q) => {
    forest.visible = q.vegetation !== 0;
    root.getObjectByName("watershed-bank-reeds").visible = q.vegetation !== 0;
    pathways.visible = q.pathways !== 0;
    labels.visible = q.pathways !== 0;
    const amounts = {
      rain: q.rain,
      infil: (q.rain * q.infil) / 100,
      evap: (q.rain * q.evap) / 100,
      runoff: (q.rain * (100 - q.infil - q.evap)) / 100,
    };
    for (const [key, list] of Object.entries(arrows))
      for (const a of list) {
        a.visible = amounts[key] > 0;
        a.line.material.transparent = true;
        a.line.material.opacity = 0.3 + 0.7 * Math.min(1, amounts[key] / 100);
        a.cone.scale.x = a.cone.scale.z =
          0.035 + 0.09 * Math.min(1, amounts[key] / 100);
      }
    root.userData.amounts = amounts;
  };
  root.userData.update(p);
}
