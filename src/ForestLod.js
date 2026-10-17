const detailedNames = [
  "mountain-conifer-forest",
  "valley-broadleaf-forest",
  "forest-trunks",
];
const simpleNames = ["forest-low-detail", "forest-low-broadleaf"];
export function forestDetailLevel(previous, quality, trees, projectedHeight) {
  if (!trees) return "hidden";
  if (quality !== "detail") return "simple";
  return projectedHeight > (previous === "detailed" ? 9 : 12)
    ? "detailed"
    : "simple";
}
export function updateForestLod(root, camera, target, viewportHeight, params) {
  const distance = Math.max(0.1, camera.position.distanceTo(target));
  const projectedHeight =
    (0.094 * viewportHeight * camera.zoom) /
    (2 * Math.tan((camera.fov * Math.PI) / 360) * distance);
  const mode = forestDetailLevel(
    root.userData.forestLod,
    params.quality,
    params.trees !== false,
    projectedHeight,
  );
  if (mode === root.userData.forestLod) return mode;
  if (mode === "detailed") root.userData.ensureDetailedForest?.();
  for (const name of [...detailedNames, ...simpleNames]) {
    const object = root.getObjectByName(name);
    if (object)
      object.visible =
        mode === (detailedNames.includes(name) ? "detailed" : "simple");
  }
  root.userData.forestLod = mode;
  return mode;
}
