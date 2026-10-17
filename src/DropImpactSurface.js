// Qualitative, bounded contact ripples; not a fluid or mixing solver.
export function createDropImpactSurface(geometry, radius = 0.811) {
  const positions = geometry.attributes.position;
  const base = Float32Array.from(positions.array);
  const distances = Array.from({ length: positions.count }, (_, i) =>
    Math.hypot(positions.getX(i), positions.getZ(i)),
  );
  const ages = new Float64Array(8).fill(-1);
  let next = 0,
    previous = null,
    dirty = false;
  function restore() {
    if (!dirty) return;
    positions.array.set(base);
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    dirty = false;
  }
  return {
    impact() {
      ages[next] = 0;
      next = (next + 1) % ages.length;
    },
    animate(now, reducedMotion = false) {
      const dt =
        previous === null
          ? 0
          : Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      if (reducedMotion) {
        ages.fill(-1);
        restore();
        return false;
      }
      for (let i = 0; i < ages.length; i++) {
        if (ages[i] < 0) continue;
        ages[i] += dt;
        if (ages[i] >= 1) ages[i] = -1;
      }
      if (!ages.some((age) => age >= 0)) {
        restore();
        return false;
      }
      for (let i = 0; i < positions.count; i++) {
        const r = distances[i],
          edge = Math.max(0, 1 - r / radius) ** 2;
        let displacement = 0;
        for (const age of ages) {
          if (age < 0) continue;
          const d = r - age * 0.85;
          displacement -=
            0.009 *
            edge *
            Math.exp((-d * d) / 0.013 - age * 4) *
            Math.cos(d * 32);
        }
        positions.setY(
          i,
          base[i * 3 + 1] + Math.max(-0.015, Math.min(0.015, displacement)),
        );
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      dirty = true;
      return true;
    },
  };
}
