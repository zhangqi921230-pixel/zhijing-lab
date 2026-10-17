import * as THREE from "three";
import { box, panel } from "./CircuitBench.js";
import { drawTemperatureDisplay } from "./TemperatureDisplay.js";

export const PROBE_TIP = [-0.45, -0.2, -0.35];

export function addTemperatureProbe(root) {
  const group = new THREE.Group();
  group.name = "solution-temperature-probe";
  root.add(group);
  const metal = new THREE.MeshStandardMaterial({
    color: "#aab9ba",
    metalness: 0.8,
    roughness: 0.28,
  });
  function rod(a, b, r, material, name) {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b),
      delta = end.clone().sub(start);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, delta.length(), 20),
      material,
    );
    mesh.position.copy(start.add(end).multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      delta.normalize(),
    );
    mesh.name = name;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }
  box(group, [0.95, 0.12, 0.7], "#293f47", [-1.65, -0.745, -0.85], 0.05);
  rod(
    [-1.65, -0.685, -0.85],
    [-1.65, 2.55, -0.85],
    0.035,
    metal,
    "temperature-stand",
  );
  rod(
    [-1.65, 2.3, -0.85],
    [-0.53, 2.3, -0.3833],
    0.028,
    metal,
    "temperature-clamp-arm",
  );
  rod(
    PROBE_TIP,
    [-0.45, 2.13, -0.35],
    0.025,
    metal,
    "temperature-sensing-stem",
  );
  const rubber = new THREE.MeshStandardMaterial({
    color: "#304c56",
    roughness: 0.76,
  });
  const clampMaterial = new THREE.MeshStandardMaterial({
    color: "#8d9c9d",
    metalness: 0.65,
    roughness: 0.38,
  });
  function collar(name, x, y, z, inner, outer, height) {
    const profile = [
      [inner, -height / 2],
      [outer - 0.008, -height / 2],
      [outer, -height / 2 + 0.008],
      [outer, height / 2 - 0.008],
      [outer - 0.008, height / 2],
      [inner, height / 2],
      [inner, -height / 2],
    ];
    const mesh = new THREE.Mesh(
      new THREE.LatheGeometry(
        profile.map(([r, h]) => new THREE.Vector2(r, h)),
        24,
      ),
      clampMaterial,
    );
    mesh.position.set(x, y, z);
    mesh.name = name;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }
  for (const [name, x, z, inner, outer, height] of [
    ["stand", -1.65, -0.85, 0.037, 0.082, 0.19],
    ["probe", -0.45, -0.35, 0.058, 0.09, 0.13],
  ]) {
    collar(`temperature-${name}-collar`, x, 2.3, z, inner, outer, height);
    rod(
      [x, 2.3, z + inner],
      [x, 2.3, z + outer + 0.07],
      0.013,
      metal,
      `temperature-${name}-locking-screw`,
    );
    const knob = rod(
      [x, 2.3, z + outer + 0.035],
      [x, 2.3, z + outer + 0.085],
      0.045,
      rubber,
      `temperature-${name}-thumbwheel`,
    );
    const grips = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.041, 6),
      rubber,
      12,
    );
    grips.name = `${knob.name}-grips`;
    const transform = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      transform.setPosition(
        x + 0.045 * Math.cos(a),
        2.3 + 0.045 * Math.sin(a),
        z + outer + 0.0595,
      );
      grips.setMatrixAt(i, transform);
    }
    grips.computeBoundingSphere();
    group.add(grips);
  }
  rod(
    [-0.45, 2.08, -0.35],
    [-0.45, 2.46, -0.35],
    0.057,
    rubber,
    "temperature-probe-handle",
  );
  box(group, [1.02, 0.66, 0.24], "#314d57", [-1.65, 1.37, -0.7], 0.065);
  box(group, [0.9, 0.53, 0.025], "#d5dcce", [-1.65, 1.37, -0.569], 0.022);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(
        [
          [-0.45, 2.46, -0.35],
          [-0.65, 2.62, -0.36],
          [-1.27, 2.02, -0.45],
          [-1.65, 1.7, -0.7],
        ].map((p) => new THREE.Vector3(...p)),
      ),
      32,
      0.024,
      8,
      false,
    ),
    rubber,
  );
  cable.name = "temperature-probe-cable";
  group.add(cable);
  // Cable glands cover the junctions without changing the sensing stem.
  rod(
    [-0.45, 2.43, -0.35],
    [-0.48, 2.49, -0.352],
    0.036,
    rubber,
    "temperature-handle-strain-relief",
  );
  rod(
    [-1.65, 1.68, -0.7],
    [-1.62, 1.75, -0.68],
    0.038,
    rubber,
    "temperature-meter-strain-relief",
  );
  const display = panel(
    group,
    [-1.65, 1.37, -0.55],
    0.8,
    0.43,
    (ctx, p) => drawTemperatureDisplay(ctx, p.temp),
    [384, 192],
  );
  if (display.object) display.object.name = "solution-temperature-display";
  let last;
  return (p) => {
    const reading = p.temp.toFixed(1);
    if (reading === last) return;
    last = reading;
    display.update(p);
  };
}
