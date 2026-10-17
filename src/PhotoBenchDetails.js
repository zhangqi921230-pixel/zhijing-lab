import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export function photoSoilSites() {
  return Array.from({ length: 150 }, (_, i) => {
    const angle = i * 2.399963,
      radius = 0.1 + 0.315 * Math.sqrt((i + 0.5) / 150);
    return {
      x: -0.65 + radius * Math.cos(angle),
      z: radius * Math.sin(angle),
      scale: 0.008 + 0.008 * ((i * 0.618034) % 1),
    };
  });
}
export function addPhotoBenchDetails(root) {
  const group = new T.Group();
  group.name = "photo-bench-details";
  root.add(group);
  const polymer = new T.MeshStandardMaterial({
    color: "#222c2c",
    roughness: 0.7,
  });
  const metal = new T.MeshStandardMaterial({
    color: "#9eaaa4",
    metalness: 0.75,
    roughness: 0.35,
  });
  const add = (name, geometry, material, position) => {
    const mesh = new T.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    group.add(mesh);
    return mesh;
  };
  const vents = [];
  for (let i = 0; i < 13; i++)
    for (const z of [-0.36, 0.06])
      vents.push(
        new T.BoxGeometry(0.018, 0.003, 0.19).translate(
          -1.35 + i * 0.105,
          2.752,
          z,
        ),
      );
  add("lamp-vent-slots", mergeGeometries(vents), polymer, [0, 0, 0]);
  vents.forEach((g) => g.dispose());
  add(
    "lamp-mast-collar",
    new T.CylinderGeometry(0.075, 0.075, 0.17, 20),
    metal,
    [-2, 2.75, -0.8],
  );
  const knob = add(
    "lamp-clamp-knob",
    new T.CylinderGeometry(0.062, 0.062, 0.05, 16),
    polymer,
    [-2, 2.75, -0.69],
  );
  knob.rotation.x = Math.PI / 2;
  const bolt = add(
    "lamp-clamp-thread",
    new T.CylinderGeometry(0.018, 0.018, 0.075, 12),
    metal,
    [-2, 2.75, -0.745],
  );
  bolt.rotation.x = Math.PI / 2;
  const cablePoints = [
    [-1.6, 2.69, -0.4],
    [-1.82, 2.62, -0.6],
    [-2.07, 2.35, -0.83],
    [-2.07, 1.55, -0.83],
    [-2.07, 0.55, -0.83],
    [-2.1, -0.45, -0.94],
    [-2.03, -0.57, -1.06],
  ];
  add(
    "lamp-power-cable",
    new T.TubeGeometry(
      new T.CatmullRomCurve3(cablePoints.map((p) => new T.Vector3(...p))),
      64,
      0.012,
      6,
      false,
    ),
    polymer,
    [0, 0, 0],
  );
  add(
    "lamp-base-inlet",
    new T.BoxGeometry(0.1, 0.04, 0.07),
    polymer,
    [-2.03, -0.565, -1.065],
  );
  const sites = photoSoilSites();
  const soil = new T.InstancedMesh(
    new T.IcosahedronGeometry(1, 0),
    new T.MeshStandardMaterial({ color: "#574636", roughness: 1 }),
    sites.length,
  );
  soil.name = "pot-soil-grains";
  const dummy = new T.Object3D();
  sites.forEach(({ x, z, scale }, i) => {
    dummy.position.set(x, scale * 0.18, z);
    dummy.scale.set(scale, scale * 0.55, scale * 0.8);
    dummy.rotation.set(i * 0.6, i * 2.4, i * 0.3);
    dummy.updateMatrix();
    soil.setMatrixAt(i, dummy.matrix);
    soil.setColorAt(
      i,
      new T.Color().setHSL(
        0.085 + (i % 3) * 0.012,
        0.2,
        0.19 + (i % 7) * 0.018,
      ),
    );
  });
  group.add(soil);
  return group;
}
