import * as T from "three";
import { repeatedBoxes } from "./MicroscopeBatch.js";
import { addOpticalBaseDetails } from "./OpticalBaseDetails.js";

function cylinders(parent, radius, height, color, positions, name) {
  const batch = new T.InstancedMesh(
    new T.CylinderGeometry(radius, radius, height, 16),
    new T.MeshStandardMaterial({
      color,
      roughness: 0.5,
      metalness: color === "#242d30" ? 0 : 0.7,
    }),
    positions.length,
  );
  const transform = new T.Object3D();
  positions.forEach((position, i) => {
    transform.position.set(...position);
    transform.updateMatrix();
    batch.setMatrixAt(i, transform.matrix);
  });
  batch.name = name;
  batch.castShadow = batch.receiveShadow = true;
  parent.add(batch);
  return batch;
}

export function addOpticalBaseHardware(root) {
  addOpticalBaseDetails(root);
  const corners = [-3.35, 4.45].flatMap((x) =>
    [-0.91, 0.91].map((z) => [x, -1.33, z]),
  );
  cylinders(root, 0.19, 0.24, "#242d30", corners, "optical-rubber-feet");
  repeatedBoxes(
    root,
    [0.16, 0.14, 0.85],
    "#46565d",
    0.015,
    [-3.66, 4.76].map((x) => ({ position: [x, -0.86, 0] })),
    "optical-rail-end-stops",
    1,
  );
  const bolts = [-3.66, 4.76].flatMap((x) =>
    [-0.3, 0.3].map((z) => [x, -0.781, z]),
  );
  cylinders(root, 0.049, 0.018, "#c0c8c9", bolts, "optical-rail-fasteners");
  repeatedBoxes(
    root,
    [0.058, 0.002, 0.008],
    "#29353a",
    0,
    bolts.map(([x, y, z]) => ({ position: [x, y + 0.01, z] })),
    "optical-fastener-slots",
  );
}

export function addOpticalKnurl(parent) {
  // All 20 axial grip ribs move with their own carrier in one draw call.
  return repeatedBoxes(
    parent,
    [0.018, 0.014, 0.12],
    "#36434a",
    0,
    Array.from({ length: 20 }, (_, i) => {
      const a = (i * Math.PI) / 10;
      return {
        position: [0.071 * Math.cos(a), -0.68 + 0.071 * Math.sin(a), 0.48],
        rotation: [0, 0, a],
      };
    }),
    "optical-lock-grip",
  );
}
