import * as THREE from "three";

function addAxis(list, vector) {
  if (vector.lengthSq() < 1e-14) return;
  vector.normalize();
  if (!list.some((axis) => Math.abs(axis.dot(vector)) > 1 - 1e-7))
    list.push(vector);
}

export function crystalHull(geometry, matrix) {
  const p = geometry.attributes.position,
    points = [],
    normals = [],
    edges = [];
  const triangles = [];
  for (let i = 0; i < p.count; i++) {
    const v = new THREE.Vector3()
      .fromBufferAttribute(p, i)
      .applyMatrix4(matrix);
    triangles.push(v);
    if (!points.some((other) => other.distanceToSquared(v) < 1e-14))
      points.push(v);
  }
  for (let i = 0; i < triangles.length; i += 3) {
    const a = triangles[i],
      b = triangles[i + 1],
      c = triangles[i + 2];
    const ab = b.clone().sub(a),
      ac = c.clone().sub(a);
    addAxis(normals, ab.clone().cross(ac));
    addAxis(edges, ab);
    addAxis(edges, ac);
    addAxis(edges, c.clone().sub(b));
  }
  return {
    points,
    normals,
    edges,
    bounds: new THREE.Box3().setFromPoints(points),
  };
}

// Convex separating axes give the interval of vertical translations that collide.
// The upper endpoint is first contact when lowering from above, at fixed orientation.
export function verticalContact(a, b) {
  if (
    a.bounds.max.x < b.bounds.min.x ||
    a.bounds.min.x > b.bounds.max.x ||
    a.bounds.max.z < b.bounds.min.z ||
    a.bounds.min.z > b.bounds.max.z
  )
    return null;
  let low = -Infinity,
    high = Infinity;
  const axes = [...a.normals, ...b.normals];
  for (const ea of a.edges)
    for (const eb of b.edges) addAxis(axes, ea.clone().cross(eb));
  for (const axis of axes) {
    let amin = Infinity,
      amax = -Infinity,
      bmin = Infinity,
      bmax = -Infinity;
    for (const p of a.points) {
      const d = p.dot(axis);
      amin = Math.min(amin, d);
      amax = Math.max(amax, d);
    }
    for (const p of b.points) {
      const d = p.dot(axis);
      bmin = Math.min(bmin, d);
      bmax = Math.max(bmax, d);
    }
    if (Math.abs(axis.y) < 1e-10) {
      if (amax < bmin - 1e-9 || bmax < amin - 1e-9) return null;
    } else {
      const x = (bmin - amax) / axis.y,
        y = (bmax - amin) / axis.y;
      low = Math.max(low, Math.min(x, y));
      high = Math.min(high, Math.max(x, y));
      if (low > high + 1e-9) return null;
    }
  }
  return { low, high };
}

export function settleCrystal(
  geometry,
  matrix,
  supports,
  count = supports.length,
) {
  matrix.elements[13] = 0;
  const hull = crystalHull(geometry, matrix);
  let height = 0.074 - hull.bounds.min.y;
  for (let i = 0; i < count; i++) {
    const contact = verticalContact(hull, supports[i]);
    if (contact) height = Math.max(height, contact.high);
  }
  matrix.elements[13] = height;
  for (const p of hull.points) p.y += height;
  hull.bounds.min.y += height;
  hull.bounds.max.y += height;
  return hull;
}
