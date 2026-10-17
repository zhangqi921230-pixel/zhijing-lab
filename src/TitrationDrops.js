import * as THREE from "three";
import { titrationFlowRate } from "./titrationFlow.mjs";

// Qualitative falling drops; their visible size is not a calibrated volume.
export function addTitrationDrops(root, onImpact = () => {}) {
  const drops = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.034, 12, 8),
    new THREE.MeshStandardMaterial({ color: "#bcdce0", roughness: 0.16 }),
    9,
  );
  drops.name = "titration-drops";
  drops.count = 0;
  drops.frustumCulled = false;
  root.add(drops);
  const ages = new Float64Array(8).fill(-1);
  const object = new THREE.Object3D();
  let flowing = false,
    surface = 0,
    previous = null,
    elapsed = 0,
    interval = 0.1;
  return {
    emitOne() {
      const slot = ages.findIndex((age) => age < 0);
      if (slot >= 0) ages[slot] = 0;
    },
    setState(active, height, rate = 0.5) {
      const nextInterval = 0.05 / titrationFlowRate(rate);
      elapsed *= nextInterval / interval;
      interval = nextInterval;
      if (active && !flowing) elapsed = 0;
      flowing = !!active;
      surface = height;
    },
    animate(now, reducedMotion = false) {
      const dt =
        previous === null
          ? 0
          : Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      if (reducedMotion) {
        ages.fill(-1);
        drops.count = 0;
        return false;
      }
      for (let i = 0; i < ages.length; i++) if (ages[i] >= 0) ages[i] += dt;
      if (flowing) {
        elapsed += dt;
        if (elapsed >= interval) {
          const slot = ages.findIndex((age) => age < 0);
          if (slot >= 0) ages[slot] = elapsed % interval;
          elapsed %= interval;
        }
      }
      let count = 0;
      for (let i = 0; i < ages.length; i++) {
        if (ages[i] < 0) continue;
        // Detach from the same centre as the fully grown pendant drop.
        const y = 2.18 - 0.034 * 1.3 - 18 * ages[i] ** 2;
        if (y - 0.045 <= surface) {
          ages[i] = -1;
          onImpact();
          continue;
        }
        object.position.set(0, y, 0);
        object.scale.set(1, 1.3, 1);
        object.updateMatrix();
        drops.setMatrixAt(count++, object.matrix);
      }
      const fallingCount = count;
      if (flowing && elapsed > 0) {
        // Constant qualitative supply: volume grows linearly, radius as cbrt(t).
        const growth = Math.cbrt(Math.min(1, elapsed / interval));
        object.scale.set(growth, 1.3 * growth, growth);
        object.position.set(0, 2.18 - 0.034 * 1.3 * growth, 0);
        object.updateMatrix();
        drops.setMatrixAt(count++, object.matrix);
      }
      drops.count = count;
      if (count) drops.instanceMatrix.needsUpdate = true;
      return flowing || fallingCount > 0;
    },
  };
}
