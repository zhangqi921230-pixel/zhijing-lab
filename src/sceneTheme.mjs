export function applySceneTheme(scene, theme) {
  const dark = theme === "dark",
    bg = dark ? "#101a23" : "#edf0e9";
  scene.background?.set?.(bg);
  scene.fog?.color?.set?.(bg);
  const floor = scene.getObjectByName("studio-floor");
  if (floor && !floor.material.map)
    floor.material.color.set(dark ? "#14222b" : "#e5e9e0");
  const grid = scene.getObjectByName("studio-grid");
  if (grid) grid.material.opacity = dark ? 0.22 : 0.32;
}
