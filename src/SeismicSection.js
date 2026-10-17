import * as THREE from "three";
export const SEISMIC_SCALE = 0.04,
  SECTION_Z = 1.615;

// Clip each wavefront chord to the exposed geological section, never the air.
function clip(x0, y0, x1, y1) {
  const dx = x1 - x0,
    dy = y1 - y0;
  let lo = 0,
    hi = 1;
  const p = [-dx, dx, -dy, dy],
    q = [x0 + 3.5, 3.5 - x0, y0 + 1.6, -y0];
  for (let i = 0; i < 4; i++) {
    if (Math.abs(p[i]) < 1e-12) {
      if (q[i] < 0) return null;
      continue;
    }
    const t = q[i] / p[i];
    if (p[i] < 0) lo = Math.max(lo, t);
    else hi = Math.min(hi, t);
    if (lo > hi) return null;
  }
  return [x0 + lo * dx, y0 + lo * dy, x0 + hi * dx, y0 + hi * dy];
}
export function addSectionWave(root, color) {
  const positions = new Float32Array(512 * 6),
    geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const line = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color }),
  );
  line.frustumCulled = false;
  root.add(line);
  let lastRadius, lastDepth;
  return (radius, depth) => {
    if (radius === lastRadius && depth === lastDepth) return;
    lastRadius = radius;
    lastDepth = depth;
    let count = 0;
    if (radius > 0)
      for (let i = 0; i < 512; i++) {
        const a = (i * Math.PI * 2) / 512,
          b = ((i + 1) * Math.PI * 2) / 512;
        const segment = clip(
          -1.7 + radius * Math.cos(a),
          -depth * SEISMIC_SCALE + radius * Math.sin(a),
          -1.7 + radius * Math.cos(b),
          -depth * SEISMIC_SCALE + radius * Math.sin(b),
        );
        if (!segment) continue;
        positions.set(
          [
            segment[0],
            segment[1],
            SECTION_Z,
            segment[2],
            segment[3],
            SECTION_Z,
          ],
          count * 3,
        );
        count += 2;
      }
    geometry.setDrawRange(0, count);
    geometry.attributes.position.needsUpdate = true;
    line.visible = count > 0;
  };
}
