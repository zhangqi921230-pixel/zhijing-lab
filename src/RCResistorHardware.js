import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Static ceramic power-resistor housing. Its visual dimensions do not set R.
export function createRCResistorHardware(root) {
  const group = new T.Group();
  group.name = "rc-resistor-assembly";
  root.add(group);
  const ceramic = new T.MeshStandardMaterial({
    color: "#e3dcc7",
    roughness: 0.57,
  });
  const metal = new T.MeshStandardMaterial({
    color: "#a0a99d",
    metalness: 0.75,
    roughness: 0.35,
  });
  const add = (geometry, material, position, name) => {
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.name = name;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  const profile = [new T.Vector2(0, -0.62), new T.Vector2(0.19, -0.62)];
  for (let i = 0; i <= 144; i++) {
    const t = i / 144;
    profile.push(
      new T.Vector2(
        0.195 + 0.015 * Math.cos(t * Math.PI * 36),
        -0.62 + 1.24 * t,
      ),
    );
  }
  profile.push(new T.Vector2(0, 0.62));
  add(
    new T.LatheGeometry(profile, 24),
    ceramic,
    [0.35, -0.45, -1],
    "rc-ceramic-ribs",
  ).rotation.z = Math.PI / 2;
  const capGeometry = new T.CylinderGeometry(0.215, 0.215, 0.08, 24);
  for (const x of [-0.31, 1.01])
    add(capGeometry, metal, [x, -0.45, -1], "rc-resistor-endcap").rotation.z =
      Math.PI / 2;
  const footGeometry = new RoundedBoxGeometry(0.12, 0.18, 0.58, 1, 0.018);
  for (const x of [-0.13, 0.83])
    add(footGeometry, metal, [x, -0.725, -1], "rc-resistor-foot");
  add(
    new RoundedBoxGeometry(0.76, 0.22, 0.04, 1, 0.012),
    ceramic,
    [0.35, -0.4, -0.77],
    "rc-resistor-label-mount",
  );
  const screws = new T.InstancedMesh(
    new T.CylinderGeometry(0.025, 0.025, 0.012, 6),
    metal,
    4,
  );
  const matrix = new T.Matrix4();
  let index = 0;
  for (const x of [-0.13, 0.83])
    for (const z of [-1.23, -0.77])
      screws.setMatrixAt(index++, matrix.makeTranslation(x, -0.63, z));
  screws.name = "rc-resistor-mounting-bolts";
  screws.castShadow = screws.receiveShadow = true;
  group.add(screws);
  return group;
}
