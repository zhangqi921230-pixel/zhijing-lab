import * as THREE from "three";
import { box } from "./CircuitBench.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Enlarged field telemetry equipment, not a model of the buried seismic sensor.
export function addSeismicStationDetails(station) {
  const group = new THREE.Group();
  group.name = "seismic-telemetry-equipment";
  station.add(group);
  // Front access door: gasket, hinges and latch share three small batches.
  const batchBoxes = (name, color, pieces, metalness = 0) => {
    const geometries = pieces.map(([size, position]) =>
      new THREE.BoxGeometry(...size).translate(...position),
    );
    const object = new THREE.Mesh(
      mergeGeometries(geometries),
      new THREE.MeshStandardMaterial({ color, metalness, roughness: 0.65 }),
    );
    object.name = name;
    object.castShadow = object.receiveShadow = true;
    group.add(object);
    geometries.forEach((geometry) => geometry.dispose());
  };
  batchBoxes("seismic-door-gasket", "#3b4845", [
    [
      [0.0025, 0.284, 0.002],
      [-0.183, 0.26, -0.148],
    ],
    [
      [0.0025, 0.284, 0.002],
      [0.183, 0.26, -0.148],
    ],
    [
      [0.366, 0.0025, 0.002],
      [0, 0.118, -0.148],
    ],
    [
      [0.366, 0.0025, 0.002],
      [0, 0.402, -0.148],
    ],
  ]);
  batchBoxes(
    "seismic-door-hardware",
    "#869597",
    [
      [
        [0.028, 0.045, 0.024],
        [-0.2, 0.185, -0.14],
      ],
      [
        [0.028, 0.045, 0.024],
        [-0.2, 0.335, -0.14],
      ],
      [
        [0.025, 0.08, 0.012],
        [0.16, 0.26, -0.137],
      ],
      [
        [0.014, 0.055, 0.018],
        [0.16, 0.26, -0.12],
      ],
    ],
    0.75,
  );
  batchBoxes("seismic-door-latch-inset", "#283331", [
    [
      [0.011, 0.004, 0.002],
      [0.16, 0.244, -0.11],
    ],
  ]);
  const panel = new THREE.Group();
  panel.position.set(-0.62, 0.44, -0.55);
  panel.rotation.x = -0.5;
  panel.name = "seismic-solar-panel";
  group.add(panel);
  box(panel, [0.66, 0.42, 0.035], "#9ba8ad", [0, 0, 0], 0.012);
  box(panel, [0.61, 0.37, 0.008], "#102c48", [0, 0, 0.022], 0.003);
  const cells = [];
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 6; col++) {
      cells.push(
        new THREE.BoxGeometry(0.088, 0.104, 0.002).translate(
          (col - 2.5) * 0.098,
          (row - 1) * 0.116,
          0.027,
        ),
      );
    }
  const cellMesh = new THREE.Mesh(
    mergeGeometries(cells),
    new THREE.MeshStandardMaterial({
      color: "#23476b",
      metalness: 0.35,
      roughness: 0.3,
    }),
  );
  panel.add(cellMesh);
  cells.forEach((g) => g.dispose());
  const wires = [];
  for (let col = 0; col < 6; col++)
    for (const offset of [-0.024, 0.024]) {
      const x = (col - 2.5) * 0.098 + offset;
      wires.push(
        new THREE.Vector3(x, -0.168, 0.029),
        new THREE.Vector3(x, 0.168, 0.029),
      );
    }
  panel.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(wires),
      new THREE.LineBasicMaterial({ color: "#8ea4b1" }),
    ),
  );
  box(group, [0.44, 0.05, 0.32], "#a4a89b", [-0.62, 0.025, -0.58], 0.008);
  box(group, [0.045, 0.36, 0.045], "#869597", [-0.62, 0.23, -0.59], 0.005);
  // Two triangular braces physically join the tilted panel back to the mast.
  // Derive endpoints from the panel transform so changing its tilt cannot
  // leave the supports floating in space.
  const supports = [];
  panel.updateMatrix();
  const rod = (from, to, radius = 0.009) => {
    const direction = to.clone().sub(from);
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      direction.length(),
      8,
    );
    geometry.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize(),
      ),
    );
    geometry.translate(...from.clone().add(to).multiplyScalar(0.5).toArray());
    supports.push(geometry);
  };
  for (const x of [-0.21, 0.21]) {
    const lower = new THREE.Vector3(x, -0.15, -0.026).applyMatrix4(
      panel.matrix,
    );
    const upper = new THREE.Vector3(x, 0.15, -0.026).applyMatrix4(panel.matrix);
    const hub = new THREE.Vector3(-0.62, 0.27, -0.59);
    rod(lower, upper);
    rod(hub, lower);
    rod(hub, upper);
  }
  for (const x of [-0.76, -0.48]) {
    for (const z of [-0.67, -0.49]) {
      const bolt = new THREE.CylinderGeometry(0.018, 0.018, 0.012, 6);
      bolt.translate(x, 0.056, z);
      supports.push(bolt);
    }
  }
  const frame = new THREE.Mesh(
    mergeGeometries(supports),
    new THREE.MeshStandardMaterial({
      color: "#869597",
      metalness: 0.7,
      roughness: 0.45,
    }),
  );
  frame.name = "seismic-panel-bracing";
  group.add(frame);
  supports.forEach((geometry) => geometry.dispose());
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(
        [
          [-0.62, 0.42, -0.58],
          [-0.61, 0.2, -0.65],
          [-0.4, 0.08, -0.63],
          [-0.24, 0.13, -0.55],
          [-0.205, 0.25, -0.5],
        ].map((p) => new THREE.Vector3(...p)),
      ),
      32,
      0.009,
      6,
      false,
    ),
    new THREE.MeshStandardMaterial({ color: "#273131", roughness: 0.8 }),
  );
  cable.name = "station-power-cable";
  group.add(cable);
  // Cable gland where the lead enters the enclosure.
  const gland = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.024, 0.035, 12),
    new THREE.MeshStandardMaterial({ color: "#53696a", roughness: 0.6 }),
  );
  gland.rotation.z = Math.PI / 2;
  gland.position.set(-0.22, 0.25, -0.5);
  group.add(gland);
  return group;
}
