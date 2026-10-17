import * as THREE from "three";

// All ten connectors share geometry and draw calls. The named anchor remains
// the electrical node used by the leads; cosmetic parts never move that node.
export function addCircuitTerminals(root, terminals) {
  const entries = Object.entries(terminals);
  const rubber = new THREE.MeshStandardMaterial({ roughness: 0.65 });
  const brass = new THREE.MeshStandardMaterial({
    color: "#b6a579",
    metalness: 0.75,
    roughness: 0.3,
  });
  const profile = [
    [0.035, -0.075],
    [0.09, -0.075],
    [0.09, -0.055],
  ];
  for (let i = 0; i < 5; i++) {
    const y = -0.05 + i * 0.016;
    profile.push([0.082, y], [0.088, y + 0.005], [0.082, y + 0.011]);
  }
  profile.push([0.07, 0.04], [0.035, 0.04], [0.035, -0.075]);
  const parts = [
    [
      "insulators",
      new THREE.LatheGeometry(
        profile.map(([r, y]) => new THREE.Vector2(r, y)),
        20,
      ),
      rubber,
      0,
    ],
    [
      "mounting-nuts",
      new THREE.CylinderGeometry(0.104, 0.104, 0.025, 6),
      brass,
      -0.075,
    ],
    [
      "contact-collars",
      new THREE.TorusGeometry(0.039, 0.008, 6, 20).rotateX(Math.PI / 2),
      brass,
      0.04,
    ],
  ];
  const transform = new THREE.Object3D();
  for (const [name, geometry, material, offset] of parts) {
    const batch = new THREE.InstancedMesh(geometry, material, entries.length);
    batch.name = `circuit-terminal-${name}`;
    batch.castShadow = batch.receiveShadow = true;
    entries.forEach(([key, position], i) => {
      transform.position.set(position[0], position[1], position[2] + offset);
      transform.rotation.set(Math.PI / 2, 0, 0);
      transform.updateMatrix();
      batch.setMatrixAt(i, transform.matrix);
      if (name === "insulators") {
        // A resistor has no polarity; use neutral sockets on both ends.
        batch.setColorAt(
          i,
          new THREE.Color(
            key.startsWith("R") || key.startsWith("switch")
              ? "#6c6251"
              : key.endsWith("+")
                ? "#b74736"
                : "#263438",
          ),
        );
      }
    });
    root.add(batch);
  }
  entries.forEach(([name, position]) => {
    const anchor = new THREE.Group();
    anchor.name = name;
    anchor.position.set(...position);
    root.add(anchor);
  });
}
