import * as THREE from "three";

// Deterministic screen-space packing; anchors never move on the model.
export function separateCellLabels(items) {
  const result = items.map((item) => ({ ...item }));
  const clamp = (item) => {
    item.x = THREE.MathUtils.clamp(
      item.x,
      -Math.max(0, 0.96 - item.width / 2),
      Math.max(0, 0.96 - item.width / 2),
    );
    item.y = THREE.MathUtils.clamp(
      item.y,
      -Math.max(0, 0.94 - item.height / 2),
      Math.max(0, 0.94 - item.height / 2),
    );
  };
  result.forEach(clamp);
  const ordered = result
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.y - b.item.y || a.index - b.index);
  const overlapsX = (a, b) =>
    Math.abs(a.x - b.x) < (a.width + b.width) / 2 + 0.018;
  const gap = (a, b) => (a.height + b.height) / 2 + 0.022;
  // Forward constraints separate rectangles; reverse constraints keep the
  // entire chain below the top edge instead of repeatedly clamping one pair.
  for (let i = 0; i < ordered.length; i++) {
    const a = ordered[i].item;
    for (let j = 0; j < i; j++) {
      const b = ordered[j].item;
      if (overlapsX(a, b)) a.y = Math.max(a.y, b.y + gap(a, b));
    }
  }
  for (let i = ordered.length - 1; i >= 0; i--) {
    const a = ordered[i].item;
    a.y = Math.min(a.y, Math.max(0, 0.94 - a.height / 2));
    for (let j = i + 1; j < ordered.length; j++) {
      const b = ordered[j].item;
      if (overlapsX(a, b)) a.y = Math.min(a.y, b.y - gap(a, b));
    }
  }
  // Translate each horizontally connected cluster toward its original centre
  // without breaking spacing or pushing any fitting rectangle off screen.
  const pending = new Set(result.map((_, i) => i));
  while (pending.size) {
    const cluster = [pending.values().next().value];
    pending.delete(cluster[0]);
    for (let k = 0; k < cluster.length; k++)
      for (const i of pending)
        if (overlapsX(result[cluster[k]], result[i])) {
          cluster.push(i);
          pending.delete(i);
        }
    const low = Math.max(
      ...cluster.map((i) => -0.94 + result[i].height / 2 - result[i].y),
    );
    const high = Math.min(
      ...cluster.map((i) => 0.94 - result[i].height / 2 - result[i].y),
    );
    if (low <= high) {
      const preferred =
        cluster.reduce((sum, i) => sum + items[i].y - result[i].y, 0) /
        cluster.length;
      const shift = THREE.MathUtils.clamp(preferred, low, high);
      for (const i of cluster) result[i].y += shift;
    }
  }
  // Oversized, physically un-packable sets remain bounded. Normal teaching
  // labels fit the available height; zoomed-in overflow is not hidden.
  result.forEach(clamp);
  return result;
}

export function cellLabelLayout(
  root,
  {
    maxScreenHeight = Infinity,
    minPixelHeight = 0,
    maxPixelHeight = Infinity,
  } = {},
) {
  const entries = [];
  root.traverse((group) => {
    if (
      !group.userData.structureLabels &&
      !["cell-overview-labels", "cell-boundary-labels"].includes(group.name)
    )
      return;
    for (const sprite of group?.children ?? []) {
      if (!sprite.isSprite) continue;
      const line = group.children.find(
        (child) => child.isLine && child.name === sprite.name,
      );
      if (line)
        entries.push({
          sprite,
          line,
          anchor: sprite.position.clone(),
          scale: sprite.scale.clone(),
        });
    }
  });
  let previousKey = "";
  const point = new THREE.Vector3(),
    size = new THREE.Vector3();
  function visible(object) {
    for (let p = object; p; p = p.parent) if (!p.visible) return false;
    return true;
  }
  function restore() {
    previousKey = "";
    for (const { sprite, line, anchor, scale } of entries) {
      sprite.scale.copy(scale);
      if (sprite.userData.layoutAnchor)
        anchor.fromArray(sprite.userData.layoutAnchor);
      sprite.position.copy(anchor);
      const pos = line.geometry.attributes.position;
      pos.setXYZ(pos.count - 1, ...anchor.toArray());
      pos.needsUpdate = true;
      line.geometry.boundingBox = null;
      line.geometry.computeBoundingSphere();
    }
  }
  function update(camera, viewportHeight = 0) {
    camera.updateMatrixWorld();
    root.updateMatrixWorld(true);
    const active = entries.filter((entry) => visible(entry.sprite));
    const key = [
      viewportHeight,
      ...camera.matrixWorld.elements,
      ...camera.projectionMatrix.elements,
      ...root.matrixWorld.elements,
      ...active.flatMap((e) => [
        e.sprite.id,
        ...e.sprite.parent.matrixWorld.elements,
        ...(e.sprite.userData.layoutAnchor ?? e.anchor.toArray()),
      ]),
    ].join(",");
    if (key === previousKey) return;
    previousKey = key;
    const items = active
      .map(({ sprite, anchor, scale }, index) => {
        if (sprite.userData.layoutAnchor)
          anchor.fromArray(sprite.userData.layoutAnchor);
        point.copy(anchor);
        sprite.parent.localToWorld(point);
        const depth = -point.clone().applyMatrix4(camera.matrixWorldInverse).z;
        point.project(camera);
        sprite.scale.copy(scale);
        sprite.updateWorldMatrix(true, false);
        sprite.getWorldScale(size);
        const factor =
          camera.projectionMatrix.elements[5] / Math.max(0.1, depth);
        const lower =
          viewportHeight > 0 ? (2 * minPixelHeight) / viewportHeight : 0;
        const upper = Math.min(
          maxScreenHeight,
          viewportHeight > 0 ? (2 * maxPixelHeight) / viewportHeight : Infinity,
        );
        const projectedHeight = size.y * factor;
        const cap =
          THREE.MathUtils.clamp(
            projectedHeight,
            Math.min(lower, upper),
            upper,
          ) / Math.max(1e-10, projectedHeight);
        sprite.scale.multiplyScalar(cap);
        size.multiplyScalar(cap);
        return {
          index,
          x: point.x,
          y: point.y,
          z: point.z,
          width: (size.x * factor) / camera.aspect,
          height: size.y * factor,
        };
      })
      .filter(
        (item) =>
          item.z >= -1 && item.z <= 1 && Number.isFinite(item.x + item.y),
      );
    const placed = separateCellLabels(items);
    placed.forEach((item) => {
      const { sprite, line } = active[item.index];
      point.set(item.x, item.y, item.z).unproject(camera);
      sprite.parent.worldToLocal(point);
      sprite.position.copy(point);
      const pos = line.geometry.attributes.position;
      pos.setXYZ(pos.count - 1, point.x, point.y, point.z);
      pos.needsUpdate = true;
      line.geometry.boundingBox = null;
      line.geometry.computeBoundingSphere();
    });
  }
  return { restore, update };
}
