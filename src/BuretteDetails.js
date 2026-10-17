import * as THREE from "three";
import { buretteReadingHeight } from "./buretteScale.mjs";
import { teachingGlassMaterial } from "./TeachingGlass.js";
import { createBuretteStopcock } from "./BuretteStopcock.js";

// Concave surface is exaggerated for teaching; its lowest point is the reading.
export function addBuretteDetails(root, liquidMaterial) {
  const glass = teachingGlassMaterial();
  const shell = new THREE.Mesh(
    new THREE.LatheGeometry(
      [
        [0.105, 2.6],
        [0.105, 5.1],
        [0.107, 5.125],
        [0.122, 5.125],
        [0.126, 5.11],
        [0.12, 5.08],
        [0.12, 2.6],
        [0.105, 2.6],
      ].map((p) => new THREE.Vector2(...p)),
      40,
    ),
    glass,
  );
  shell.name = "burette-glass";
  root.add(shell);
  const tip = new THREE.Mesh(
    new THREE.LatheGeometry(
      [
        [0.12, 2.6],
        [0.09, 2.56],
        [0.035, 2.4],
        [0.022, 2.18],
        [0.012, 2.18],
        [0.022, 2.4],
        [0.078, 2.56],
        [0.105, 2.6],
        [0.12, 2.6],
      ].map((p) => new THREE.Vector2(...p)),
      32,
    ),
    glass,
  );
  tip.name = "burette-tip";
  root.add(tip);
  const points = Array.from({ length: 13 }, (_, i) => {
    const radius = (0.097 * i) / 12;
    return new THREE.Vector2(radius, 0.015 * (i / 12) ** 4);
  });
  // Join the raised rim to the open liquid column at the reading plane.
  points.push(new THREE.Vector2(0.097, 0));
  const surface = new THREE.Mesh(
    new THREE.LatheGeometry(points, 40),
    liquidMaterial,
  );
  surface.material.side = THREE.DoubleSide;
  surface.name = "burette-meniscus";
  root.add(surface);
  const valve = createBuretteStopcock(root);
  let remaining = 0,
    previous = null,
    currentBase = 0,
    flowing = false;
  const updateValve = () => {
    const closing = 1 - Math.min(1, remaining / 0.1);
    const angle =
      flowing && currentBase < 100
        ? 0
        : (closing * closing * (3 - 2 * closing) * Math.PI) / 2;
    if (valve.rotation.z !== angle) root.userData.shadowDirty = true;
    valve.rotation.z = angle;
  };
  return {
    pulse() {
      remaining = 0.22;
      previous = null;
      updateValve();
    },
    animate(now, reducedMotion = false) {
      const dt =
        previous === null
          ? 0
          : Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      remaining = reducedMotion ? 0 : Math.max(0, remaining - dt);
      updateValve();
      return remaining > 0;
    },
    update(base, dosing) {
      if (base !== currentBase || !!dosing !== flowing) remaining = 0;
      currentBase = base;
      flowing = !!dosing;
      surface.position.y = buretteReadingHeight(base);
      surface.visible = base < 100;
      updateValve();
    },
  };
}
