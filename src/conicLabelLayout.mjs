import * as THREE from "three";

export function placeConicLabels(items, width, height) {
  const placed = [];
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  for (const item of items) {
    const halfWidth = (item.width ?? 36) / 2;
    const candidates = [[item.x, item.y]];
    for (let ring = 1; ring <= 6; ring++)
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ])
        candidates.push([item.x + dx * ring * 42, item.y + dy * ring * 28]);
    let best,
      score = Infinity;
    for (const [cx, cy] of candidates) {
      const x = clamp(
          cx,
          halfWidth + 4,
          Math.max(halfWidth + 4, width - halfWidth - 4),
        ),
        y = clamp(cy, 16, Math.max(16, height - 16));
      const collisions = placed.filter(
        (p) =>
          Math.abs(p.x - x) < ((p.width ?? 36) + (item.width ?? 36)) / 2 + 4 &&
          Math.abs(p.y - y) < 28,
      ).length;
      const cost = collisions * 1e6 + (x - item.x) ** 2 + (y - item.y) ** 2;
      if (cost < score) {
        best = { ...item, x, y };
        score = cost;
      }
    }
    placed.push(best);
  }
  return placed;
}
export function layoutConicLabels(root, camera, height) {
  if (!height) return;
  const width = height * camera.aspect,
    items = [];
  root.updateMatrixWorld(true);
  root.traverseVisible((group) => {
    const label = group.userData.conicLabel;
    if (!label) return;
    const projected = group
      .localToWorld(new THREE.Vector3(...label.offset))
      .project(camera);
    if (projected.z < -1 || projected.z > 1) return;
    items.push({
      group,
      label,
      width: label.width,
      z: projected.z,
      x: ((projected.x + 1) * width) / 2,
      y: ((1 - projected.y) * height) / 2,
    });
  });
  for (const item of placeConicLabels(items, width, height)) {
    const local = item.group.worldToLocal(
      new THREE.Vector3(
        (item.x / width) * 2 - 1,
        1 - (item.y / height) * 2,
        item.z,
      ).unproject(camera),
    );
    item.label.sprite.position.copy(local);
    const geometry = item.label.line.geometry;
    geometry.attributes.position.setXYZ(1, local.x, local.y, local.z);
    geometry.attributes.position.needsUpdate = true;
    geometry.computeBoundingSphere();
    item.label.sprite.updateMatrixWorld();
  }
}
