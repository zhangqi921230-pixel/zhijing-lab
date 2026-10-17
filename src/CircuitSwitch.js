import * as THREE from "three";

// The blade pivots above the input binding post and seats between two output jaws.
export function addCircuitSwitch(root, box, cylinder) {
  const mount = box(root, [1.5, 0.17, 0.7], "#264449", [-0.23, -0.5, -1.3]);
  mount.name = "circuit-switch-base";
  for (const x of [-0.75, 0.3]) {
    cylinder(root, [x, -0.4, -1.3], [x, 0.06, -1.3], 0.075, "#b49b56");
    box(root, [0.22, 0.06, 0.27], "#b49b56", [x, 0.04, -1.3], 0.01);
    for (const side of [-1, 1]) {
      const jaw = box(
        root,
        [0.19, 0.18, 0.035],
        "#d1a457",
        [x, 0.12, -1.3 + side * 0.0975],
        0.008,
      );
      jaw.name =
        x > 0 ? "circuit-switch-output-jaw" : "circuit-switch-pivot-bracket";
    }
  }
  const hinge = new THREE.Group();
  hinge.name = "circuit-switch-hinge";
  hinge.position.set(-0.75, 0.12, -1.3);
  root.add(hinge);
  const blade = box(hinge, [1.1, 0.07, 0.16], "#d1a457", [0.53, 0, 0], 0.015);
  blade.name = "circuit-switch-blade";
  blade.userData.action = "switch";
  const grip = box(hinge, [0.32, 0.16, 0.27], "#253c3d", [0.65, 0.1, 0]);
  grip.name = "circuit-switch-grip";
  grip.userData.action = "switch";
  cylinder(root, [-0.75, 0.12, -1.45], [-0.75, 0.12, -1.15], 0.035, "#a9b6ae");
  for (const z of [-1.454, -1.146]) {
    cylinder(
      root,
      [-0.75, 0.12, z - 0.009],
      [-0.75, 0.12, z + 0.009],
      0.056,
      "#82968b",
    );
  }
  return hinge;
}
