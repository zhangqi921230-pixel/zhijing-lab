// Submit hidden organelle materials during an idle slot after the first frame.
// compile() visits hidden objects too; it does not render or change visibility.
export function scheduleCellMaterialWarmup(
  renderer,
  scene,
  camera,
  host = window,
) {
  let cancelled = false;
  const idle = typeof host.requestIdleCallback === "function";
  const run = () => {
    if (cancelled) return;
    const started = performance.now();
    try {
      renderer.compile(scene, camera);
      renderer.domElement.dataset.materialWarmup = "submitted";
      renderer.domElement.dataset.materialWarmupMs = (
        performance.now() - started
      ).toFixed(1);
    } catch {
      // Demand rendering remains the fallback if eager preparation fails.
      renderer.domElement.dataset.materialWarmup = "deferred";
    }
  };
  const token = idle
    ? host.requestIdleCallback(run, { timeout: 1500 })
    : host.setTimeout(run, 100);
  return () => {
    cancelled = true;
    if (idle) host.cancelIdleCallback(token);
    else host.clearTimeout(token);
  };
}
