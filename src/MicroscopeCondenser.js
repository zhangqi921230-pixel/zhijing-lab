import * as T from "three";
import { box } from "./CircuitBench.js";

export function condenserOpening(value = 70) {
  return (0.19 * Math.max(20, Math.min(100, value))) / 100;
}

// Simplified seven-sided iris: geometry demonstrates the clear aperture,
// not a manufactured blade linkage or a calibrated numerical aperture.
export function microscopeCondenser(stage) {
  const group = new T.Group();
  group.name = "microscope-condenser";
  group.position.set(-0.3, 0.04, 0.1);
  stage.add(group);
  // A side carrier attaches the housing to the underside of the stage,
  // leaving the central optical axis unobstructed.
  box(group, [0.35, 0.08, 0.18], "#344146", [-0.45, -0.06, 0], 0.012);
  box(group, [0.12, 0.34, 0.18], "#344146", [-0.58, 0.07, 0], 0.012);
  const housing = new T.Mesh(
    new T.LatheGeometry(
      [
        [0.33, -0.125],
        [0.33, -0.08],
        [0.25, 0.125],
        [0.205, 0.125],
        [0.205, 0.08],
        [0.29, -0.1],
        [0.29, -0.125],
        [0.33, -0.125],
      ].map((p) => new T.Vector2(...p)),
      48,
    ),
    new T.MeshStandardMaterial({
      color: "#283338",
      metalness: 0.55,
      roughness: 0.3,
    }),
  );
  housing.name = "hollow-condenser-housing";
  group.add(housing);
  const lens = new T.Mesh(
    new T.SphereGeometry(
      0.4,
      40,
      10,
      0,
      2 * Math.PI,
      0,
      Math.asin(0.205 / 0.4),
    ),
    new T.MeshPhysicalMaterial({
      color: "#c8e1dd",
      transparent: true,
      opacity: 0.27,
      depthWrite: false,
      roughness: 0.09,
      metalness: 0.08,
      clearcoat: 1,
      side: T.DoubleSide,
    }),
  );
  lens.name = "condenser-front-lens";
  lens.position.y = -0.25;
  group.add(lens);
  const geometry = new T.RingGeometry(condenserOpening(), 0.295, 7, 1);
  geometry.rotateX(-Math.PI / 2);
  const iris = new T.Mesh(
    geometry,
    new T.MeshStandardMaterial({
      color: "#59636a",
      metalness: 0.7,
      roughness: 0.42,
      side: T.DoubleSide,
    }),
  );
  iris.name = "condenser-aperture-iris";
  iris.position.y = -0.09;
  group.add(iris);
  const lines = new T.LineSegments(
    new T.BufferGeometry().setAttribute(
      "position",
      new T.Float32BufferAttribute(new Float32Array(42), 3),
    ),
    new T.LineBasicMaterial({ color: "#27343a" }),
  );
  lines.position.y = -0.087;
  lines.name = "condenser-blade-seams";
  // Decorative seams must not intercept picks with Raycaster's wide line tolerance.
  lines.raycast = () => {};
  group.add(lines);
  const lever = new T.Group();
  lever.name = "condenser-aperture-lever";
  lever.position.y = -0.09;
  lever.userData = {
    action: "parameter",
    key: "aperture",
    delta: 10,
    min: 20,
    max: 100,
  };
  group.add(lever);
  box(lever, [0.34, 0.025, 0.045], "#a8b2b5", [0.39, 0, 0], 0.006);
  box(lever, [0.11, 0.065, 0.1], "#334d53", [0.58, 0, 0], 0.018);
  const positions = geometry.attributes.position;
  const seamPositions = lines.geometry.attributes.position;
  let previous;
  return (value) => {
    const radius = condenserOpening(value);
    if (radius === previous) return;
    previous = radius;
    for (let i = 0; i <= 7; i++) {
      const a = (i * Math.PI * 2) / 7;
      positions.setXYZ(i, radius * Math.cos(a), 0, -radius * Math.sin(a));
      if (i < 7) {
        seamPositions.setXYZ(
          i * 2,
          radius * Math.cos(a),
          0,
          -radius * Math.sin(a),
        );
        seamPositions.setXYZ(
          i * 2 + 1,
          0.295 * Math.cos(a + 0.28),
          0,
          -0.295 * Math.sin(a + 0.28),
        );
      }
    }
    positions.needsUpdate = seamPositions.needsUpdate = true;
    geometry.computeBoundingSphere();
    lines.geometry.computeBoundingSphere();
    lever.rotation.y = -0.8 + (radius / 0.19) * 1.4;
    iris.userData.clearRadius = radius;
  };
}
