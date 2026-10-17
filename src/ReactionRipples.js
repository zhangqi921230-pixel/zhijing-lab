import * as T from "three";
import { reactionTiming } from "./precipitationDosing.mjs";

// Teaching-time impacts: first drop travels for .5 s, then one every .1 s.
// These rings illustrate impact and damping, not calibrated wave speed.
export function addReactionRipples(root) {
  const geometry = new T.RingGeometry(0.97, 1, 64);
  const rings = Array.from({ length: 6 }, (_, i) => {
    const material = new T.MeshBasicMaterial({
      color: "#c5e3e6",
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: T.DoubleSide,
    });
    const ring = new T.Mesh(geometry, material);
    ring.name = `reaction-impact-ring-${i}`;
    ring.rotation.x = -Math.PI / 2;
    ring.renderOrder = 3;
    ring.visible = false;
    root.add(ring);
    return ring;
  });
  return (time, surface, hasReagent) => {
    const { firstImpact, end, interval } = reactionTiming;
    const latest = Math.min(
      Math.round((end - firstImpact) / interval),
      Math.floor((time - firstImpact + 1e-9) / interval),
    );
    rings.forEach((ring, i) => {
      const impact = latest - i;
      const age = time - (firstImpact + impact * interval);
      ring.visible =
        hasReagent && impact >= 0 && age >= -1e-9 && age < 0.6 - 1e-9;
      if (!ring.visible) return;
      const progress = Math.max(0, age) / 0.6;
      ring.position.set(0, surface + 0.008, -0.15);
      ring.scale.setScalar(0.025 + 0.62 * progress);
      ring.material.opacity = 0.24 * (1 - progress) ** 2;
    });
  };
}
