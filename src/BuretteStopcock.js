import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function createBuretteStopcock(root) {
  const polymer = new T.MeshStandardMaterial({
    color: "#e1e4d6",
    roughness: 0.48,
  });
  const blue = new T.MeshStandardMaterial({
    color: "#466f7a",
    roughness: 0.42,
  });
  const add = (parent, geometry, material, position, name) => {
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.name = name;
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const body = add(
    root,
    new T.CylinderGeometry(0.087, 0.073, 0.21, 32),
    polymer,
    [0, 2.5, 0],
    "burette-stopcock-plug",
  );
  body.rotation.x = Math.PI / 2;
  const collar = add(
    root,
    new T.TorusGeometry(0.066, 0.008, 8, 32),
    polymer,
    [0, 2.5, 0.113],
    "burette-stopcock-collar",
  );
  collar.userData.action = "titration-valve";
  const retainingNut = add(
    root,
    new T.CylinderGeometry(0.065, 0.065, 0.035, 6),
    blue,
    [0, 2.5, -0.124],
    "burette-stopcock-retainer",
  );
  retainingNut.rotation.x = Math.PI / 2;
  const valve = new T.Group();
  valve.name = "burette-stopcock";
  valve.userData.action = "titration-valve";
  valve.position.set(0, 2.5, 0.13);
  root.add(valve);
  add(
    valve,
    new RoundedBoxGeometry(0.092, 0.32, 0.039, 2, 0.017),
    blue,
    [0, 0, 0],
    "burette-stopcock-grip",
  );
  const hub = add(
    valve,
    new T.CylinderGeometry(0.048, 0.048, 0.018, 24),
    blue,
    [0, 0, 0.018],
    "burette-stopcock-hub",
  );
  hub.rotation.x = Math.PI / 2;
  add(
    valve,
    new RoundedBoxGeometry(0.012, 0.082, 0.004, 1, 0.002),
    polymer,
    [0, 0.096, 0.021],
    "burette-stopcock-direction",
  );
  return valve;
}
