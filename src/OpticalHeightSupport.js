import * as T from "three";
import { repeatedBoxes } from "./MicroscopeBatch.js";

export function addOpticalHeightSupport(source) {
  const material = new T.MeshStandardMaterial({
    color: "#344e56",
    roughness: 0.55,
    metalness: 0.35,
  });
  const sleeve = new T.Mesh(
    new T.CylinderGeometry(0.11, 0.11, 0.44, 24, 1, true),
    material,
  );
  sleeve.name = "optical-height-sleeve";
  sleeve.position.y = -0.4;
  sleeve.castShadow = sleeve.receiveShadow = true;
  source.add(sleeve);

  // Hollow collar clears the 0.065-radius inner post throughout its travel.
  const collar = new T.Mesh(
    new T.LatheGeometry(
      [
        [0.07, -0.04],
        [0.125, -0.04],
        [0.125, 0.04],
        [0.07, 0.04],
        [0.07, -0.04],
      ].map(([r, y]) => new T.Vector2(r, y)),
      24,
    ),
    new T.MeshStandardMaterial({
      color: "#9faeb1",
      roughness: 0.35,
      metalness: 0.8,
    }),
  );
  collar.name = "optical-height-collar";
  collar.position.y = -0.18;
  collar.castShadow = collar.receiveShadow = true;
  source.add(collar);
  const screw = new T.Mesh(
    new T.CylinderGeometry(0.025, 0.025, 0.12, 16),
    collar.material.clone(),
  );
  screw.rotation.x = Math.PI / 2;
  screw.position.set(0, -0.18, 0.16);
  source.add(screw);
  const grip = new T.Mesh(
    new T.CylinderGeometry(0.065, 0.065, 0.055, 20),
    new T.MeshStandardMaterial({ color: "#222d32", roughness: 0.75 }),
  );
  grip.name = "optical-height-grip";
  grip.rotation.x = Math.PI / 2;
  grip.position.set(0, -0.18, 0.24);
  source.add(grip);
  const ribs = repeatedBoxes(
    source,
    [0.012, 0.012, 0.058],
    "#36434a",
    0,
    Array.from({ length: 16 }, (_, i) => {
      const angle = (i * Math.PI) / 8;
      return {
        position: [
          0.065 * Math.cos(angle),
          -0.18 + 0.065 * Math.sin(angle),
          0.24,
        ],
        rotation: [0, 0, angle],
      };
    }),
    "optical-height-grip-ribs",
  );
  return (locked) => {
    const action = {
      action: "parameter",
      key: "heightLock",
      value: locked ? 0 : 1,
    };
    grip.userData = action;
    ribs.userData = action;
    grip.position.z = locked ? 0.225 : 0.24;
    ribs.position.z = locked ? -0.015 : 0;
  };
}
