import * as THREE from "three";
export function addRCMarkers(root, curve) {
  const sphere = new THREE.SphereGeometry(0.035, 12, 8),
    matrix = new THREE.Matrix4();
  const charges = [0, 1].map((side) => {
    const color = side ? "#87d9ff" : "#f5cf7c";
    const group = new THREE.InstancedMesh(
      sphere,
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
        roughness: 0.65,
      }),
      25,
    );
    group.name = side ? "rc-negative-charge" : "rc-positive-charge";
    for (let i = 0; i < 25; i++) {
      matrix.makeTranslation(
        side ? 2.1 : 1.5,
        -0.6 + (i % 5) * 0.3,
        -0.58 + Math.floor(i / 5) * 0.28,
      );
      group.setMatrixAt(i, matrix);
    }
    group.computeBoundingSphere();
    root.add(group);
    return group;
  });
  const carriers = new THREE.InstancedMesh(
    new THREE.ConeGeometry(0.085, 0.23, 8),
    new THREE.MeshStandardMaterial({
      color: "#f3d888",
      emissive: "#e8be63",
      emissiveIntensity: 0.7,
      roughness: 0.65,
    }),
    8,
  );
  carriers.name = "rc-current-markers";
  carriers.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
  root.add(carriers);
  const point = new THREE.Vector3(),
    tangent = new THREE.Vector3(),
    rotation = new THREE.Quaternion(),
    up = new THREE.Vector3(0, 1, 0),
    scale = new THREE.Vector3(1, 1, 1);
  let last = "";
  return (q, state) => {
    const count = Math.round((state.voltage / q.u) * 25);
    for (const group of charges) {
      group.count = count;
      group.visible = q.chargeMarkers !== 0 && count > 0;
    }
    carriers.visible =
      q.currentArrows !== 0 && Math.abs(state.current) > 0.00005;
    const key = `${q.mode}:${q.time}:${state.tau}`;
    if (key === last || !carriers.visible) return;
    last = key;
    const traveled = (1 - Math.exp(-(q.time ?? 0) / state.tau)) * 3;
    for (let i = 0; i < 8; i++) {
      let phase = (i / 8 + traveled) % 1;
      if (q.mode) phase = 1 - phase;
      curve.getPointAt(phase, point);
      // Teaching arrows hover above the conductor, outside opaque components.
      point.y += 0.2;
      curve.getTangentAt(phase, tangent);
      if (q.mode) tangent.negate();
      rotation.setFromUnitVectors(up, tangent.normalize());
      matrix.compose(point, rotation, scale);
      carriers.setMatrixAt(i, matrix);
    }
    carriers.instanceMatrix.needsUpdate = true;
  };
}
