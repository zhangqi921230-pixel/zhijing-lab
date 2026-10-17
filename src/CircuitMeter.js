import * as THREE from "three";

// The dial artwork uses a 768 × 384 canvas. Keep the mechanical pointer in
// exactly the same coordinate system so perspective cannot change its reading.
export function addCircuitMeter(root, position, range, name) {
  const dial = new THREE.Group();
  dial.name = `circuit-meter-${name}`;
  dial.position.set(
    position[0],
    position[1] + (0.5 - 255 / 384) * 0.74,
    position[2] + 0.008,
  );
  root.add(dial);
  const scaled = new THREE.Group();
  scaled.scale.set(1.37 / 768, 0.74 / 384, 1);
  dial.add(scaled);
  const pointer = new THREE.Group();
  pointer.name = `circuit-pointer-${name}`;
  scaled.add(pointer);
  const shape = new THREE.Shape();
  shape.moveTo(-12, -3);
  shape.lineTo(160, -2);
  shape.lineTo(178, 0);
  shape.lineTo(160, 2);
  shape.lineTo(-12, 3);
  shape.closePath();
  const needle = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, {
      depth: 0.003,
      bevelEnabled: false,
      steps: 1,
    }),
    new THREE.MeshStandardMaterial({
      color: "#ad3025",
      roughness: 0.38,
      metalness: 0.25,
    }),
  );
  needle.castShadow = true;
  pointer.add(needle);
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.021, 0.012, 20),
    new THREE.MeshStandardMaterial({
      color: "#3b4441",
      roughness: 0.3,
      metalness: 0.6,
    }),
  );
  hub.rotation.x = Math.PI / 2;
  hub.position.z = 0.009;
  hub.castShadow = true;
  dial.add(hub);
  let current = 0,
    target = 0,
    from = 0,
    started = null,
    initialized = false;
  const paint = () => {
    pointer.rotation.z = Math.PI * (1 - current);
  };
  paint();
  return {
    set(value) {
      const next = THREE.MathUtils.clamp(value / range, 0, 1);
      if (!initialized) {
        initialized = true;
        current = target = next;
        paint();
      } else if (next !== target) {
        from = current;
        target = next;
        started = null;
      }
    },
    animate(now, reducedMotion) {
      if (current === target) return false;
      if (started === null) started = now;
      const t = reducedMotion
        ? 1
        : Math.min(1, Math.max(0, (now - started) / 420));
      current =
        t === 1 ? target : from + (target - from) * (t * t * (3 - 2 * t));
      paint();
      return t < 1;
    },
  };
}
