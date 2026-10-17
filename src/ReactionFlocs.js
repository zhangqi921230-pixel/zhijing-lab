import * as THREE from "three";
import {
  dosingTime,
  dosingFraction,
  reactionTiming,
} from "./precipitationDosing.mjs";
import {
  mergeGeometries,
  mergeVertices,
} from "three/addons/utils/BufferGeometryUtils.js";

export function flocGeometry(detail = 1) {
  const lobes = [
    [0, 0, 0, 0.022],
    [0.021, 0.009, 0.005, 0.019],
    [-0.018, -0.01, 0.009, 0.018],
    [0.008, -0.019, -0.012, 0.018],
    [-0.01, 0.018, -0.012, 0.019],
  ];
  const parts = lobes.map(([x, y, z, r], lobe) => {
    const raw = new THREE.IcosahedronGeometry(r, detail);
    raw.deleteAttribute("normal");
    raw.deleteAttribute("uv");
    const smooth = mergeVertices(raw);
    raw.dispose();
    // Irregular, compressed gel fragments rather than identical round beads.
    // Deform only the shared template; instance count and settling are unchanged.
    const positions = smooth.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const px = positions.getX(i) / r,
        py = positions.getY(i) / r,
        pz = positions.getZ(i) / r;
      const ripple =
        1 +
        0.16 * Math.sin(px * 5.1 + lobe * 1.7) * Math.cos(pz * 4.3 - py * 3.7);
      positions.setXYZ(
        i,
        px * r * ripple,
        py * r * ripple * 0.58,
        pz * r * ripple * 0.85,
      );
    }
    smooth.rotateX(lobe * 0.7);
    smooth.rotateZ(lobe * 1.1);
    smooth.computeVertexNormals();
    return smooth.translate(x, y, z);
  });
  const geometry = mergeGeometries(parts);
  parts.forEach((part) => part.dispose());
  // Bounds stay inside the same radius used for collision and liquid containment.
  const a = geometry.attributes.position;
  let radius = 0;
  for (let i = 0; i < a.count; i++)
    radius = Math.max(radius, Math.hypot(a.getX(i), a.getY(i), a.getZ(i)));
  geometry.scale(0.045 / radius, 0.045 / radius, 0.045 / radius);
  geometry.computeBoundingSphere();
  return geometry;
}

// Deterministic deposition patches keep rewinding stable without a particle solver.
export function flocAppearance(index) {
  const noise = (seed) => {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const patch = index % 11;
  const angle = patch * 2.399963;
  const centerRadius = 0.62 * Math.sqrt((patch + 0.5) / 11);
  const localAngle = noise(index + 1) * Math.PI * 2;
  const localRadius = 0.16 * Math.sqrt(noise(index + 61));
  return {
    x: Math.cos(angle) * centerRadius + Math.cos(localAngle) * localRadius,
    z: Math.sin(angle) * centerRadius + Math.sin(localAngle) * localRadius,
    size: 0.55 + 1.05 * noise(index + 121) ** 2,
    shade: noise(index + 181),
    bed: noise(index + 241) * 0.018,
  };
}

// A qualitative size-dependent settling demonstration, not Stokes-law data:
// gel aggregates have unknown density, shape and liquid drag in this model.
export const flocSettlingSpeed = (size) => 0.13 + 0.08 * size * size;

// Qualitative aggregation, not a calibrated reaction-rate or mass model.
export function flocGrowth(age) {
  const t = THREE.MathUtils.clamp(age / 0.4, 0, 1);
  return t * t * (3 - 2 * t);
}

// Vertical support of the actual rotated aggregate, not its enclosing sphere.
// Read the shared template directly; no per-particle geometry or GPU allocation.
export function flocFloorSupport(geometry, rotation) {
  const vertices = geometry.attributes.position;
  const e = rotation.elements;
  let lowest = 0;
  for (let i = 0; i < vertices.count; i++) {
    lowest = Math.min(
      lowest,
      e[1] * vertices.getX(i) +
        e[5] * vertices.getY(i) +
        e[9] * vertices.getZ(i),
    );
  }
  return -lowest;
}

export function addReactionFlocs(root, bottom = -0.82) {
  const flocs = new THREE.InstancedMesh(
    flocGeometry(0),
    new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.95,
      metalness: 0,
    }),
    400,
  );
  flocs.name = "reaction-precipitate";
  const geometries = { fluent: flocs.geometry };
  flocs.userData.ownedGeometries = [flocs.geometry];
  root.userData.setQuality = (quality) => {
    const key = quality === "detail" ? "detail" : "fluent";
    if (!geometries[key]) {
      geometries[key] = flocGeometry(1);
      flocs.userData.ownedGeometries.push(geometries[key]);
    }
    flocs.geometry = geometries[key];
  };
  flocs.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.3, 0), 1.8);
  const appearances = Array.from({ length: 400 }, (_, i) => flocAppearance(i));
  const color = new THREE.Color();
  appearances.forEach((item, i) => {
    color.setHSL(
      0.555 + item.shade * 0.012,
      0.62,
      0.42 + item.shade * 0.12,
      THREE.SRGBColorSpace,
    );
    flocs.setColorAt(i, color);
  });
  flocs.count = 0;
  root.add(flocs);
  const dummy = new THREE.Object3D();
  const rotationMatrix = new THREE.Matrix4();
  let last = "";
  return (q, model, height) => {
    const key = `${q.copper}:${q.base}:${q.time}:${flocs.geometry.id}`;
    if (key === last) return;
    last = key;
    flocs.count = Math.round(model.solid * 40);
    const surface = bottom + height;
    for (let i = 0; i < flocs.count; i++) {
      const birth =
        i === 0 ? reactionTiming.firstImpact : dosingTime(i / 40 / 0.1, q.base);
      const age = Math.max(0, q.time - birth);
      const appearance = appearances[i];
      const size = Math.min(appearance.size, (height - 0.01) / 0.18);
      const radius = 0.045 * size;
      const speed = flocSettlingSpeed(size);
      const bed = bottom + radius + 0.005 + appearance.bed;
      // Qualitative floc settling: a fixed birth height prevents later dosing
      // from lifting an already settled aggregate with the rising liquid level.
      const birthVolume = q.copper + q.base * dosingFraction(birth);
      const birthHeight = (birthVolume * 2.2) / 250;
      const y = Math.min(
        surface - radius - 0.005,
        Math.max(bed, bottom + birthHeight - radius - 0.005 - age * speed),
      );
      const settled = y <= bed + 1e-6;
      const travel = Math.min(
        age,
        Math.max(0, (birthHeight - radius - 0.005 - (bed - bottom)) / speed),
      );
      // Begin below the nozzle's impact point, then widen into a gently
      // curling plume. Use capped travel so deposited flocs stay at rest.
      const spread = 0.035 + 0.965 * (1 - Math.exp(-travel * 0.65));
      const curl = 0.14 * spread * (1 - spread);
      const phase = appearance.shade * Math.PI * 2;
      dummy.position.set(
        appearance.x * spread + curl * Math.sin(travel * 1.8 + phase),
        y,
        appearance.z * spread -
          0.15 * (1 - spread) +
          curl * Math.sin(travel * 1.3 + phase * 0.7),
      );
      dummy.rotation.set(
        i + travel * 0.12,
        i * 0.3,
        i * 0.7 + (settled ? travel : age) * 0.08,
      );
      // Reserve the mature radius for containment; only visible size grows.
      dummy.scale.setScalar(size * flocGrowth(age));
      // Ease into contact as the fragment reaches the floor. Bounding spheres
      // remain useful during descent, but leave flattened aggregates floating.
      const contact = THREE.MathUtils.clamp(1 - (y - bed) / 0.12, 0, 1);
      if (contact > 0) {
        rotationMatrix.makeRotationFromEuler(dummy.rotation);
        const support =
          flocFloorSupport(flocs.geometry, rotationMatrix) * dummy.scale.x;
        const floor = bottom + support + 0.001;
        dummy.position.y = Math.max(
          floor,
          y - (bed - floor) * contact * contact * (3 - 2 * contact),
        );
      }
      dummy.updateMatrix();
      flocs.setMatrixAt(i, dummy.matrix);
    }
    flocs.instanceMatrix.needsUpdate = true;
  };
}
