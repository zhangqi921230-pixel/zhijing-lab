// Small visual surface disturbances, not a fluid or mixing solver.
export function createLiquidRipples(geometry, radius = 0.811) {
  const positions = geometry.getAttribute("position");
  const base = Float32Array.from(positions.array);
  const distances = new Float32Array(positions.count);
  const envelopes = new Float32Array(positions.count);
  const impact = new Float32Array(positions.count);
  for (let i = 0; i < positions.count; i++) {
    const r = Math.hypot(positions.getX(i), positions.getZ(i));
    const f = Math.min(1, r / radius);
    distances[i] = r;
    envelopes[i] = f < 0.999 ? 4 * f * (1 - f) ** 2 : 0;
    // Local indentation under the inlet; zero at the glass contact line.
    // This remains an illustrative surface, not a flow-rate/pressure solver.
    impact[i] = f < 0.999 ? Math.exp(-((r / 0.085) ** 2)) * (1 - f) ** 2 : 0;
  }
  let flowing = false,
    amplitude = 0,
    previous = null,
    phase = 0;
  function restore() {
    if (!amplitude) return;
    positions.array.set(base);
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    amplitude = 0;
  }
  return {
    setFlow(value) {
      flowing = !!value;
    },
    animate(now, reducedMotion = false) {
      const dt =
        previous === null
          ? 0
          : Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      if (reducedMotion) {
        restore();
        return false;
      }
      if (!flowing && amplitude < 0.0001) {
        restore();
        return false;
      }
      amplitude +=
        ((flowing ? 0.012 : 0) - amplitude) *
        (1 - Math.exp(-dt * (flowing ? 7 : 5)));
      phase += dt * 9;
      for (let i = 0; i < positions.count; i++)
        positions.setY(
          i,
          base[i * 3 + 1] +
            amplitude *
              (envelopes[i] * Math.sin(distances[i] * 14 - phase) -
                0.6 * impact[i]),
        );
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      return true;
    },
  };
}
