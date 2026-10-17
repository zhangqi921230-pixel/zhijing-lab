import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function createRCSelectorHardware(root, common, contacts) {
  const length = new THREE.Vector3(...common).distanceTo(
    new THREE.Vector3(...contacts[0]),
  );
  // Local X is the blade thickness, Y spans pivot to contact, Z is its width.
  const selector = new THREE.Mesh(
    new RoundedBoxGeometry(0.028, length, 0.11, 2, 0.007),
    new THREE.MeshStandardMaterial({
      color: "#c6a768",
      metalness: 0.8,
      roughness: 0.32,
    }),
  );
  selector.name = "rc-selector";
  const profile = [
    new THREE.Vector2(0, 0.014),
    new THREE.Vector2(0.043, 0.014),
    new THREE.Vector2(0.043, 0.04),
  ];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40,
      y = 0.04 + t * 0.18;
    const dome = Math.sin(Math.PI * (0.16 + 0.74 * t));
    const ribs = Math.pow(Math.sin(t * Math.PI * 7), 2) * 0.006;
    profile.push(new THREE.Vector2(0.047 + 0.041 * dome + ribs, y));
  }
  profile.push(new THREE.Vector2(0.041, 0.236), new THREE.Vector2(0, 0.245));
  const grip = new THREE.Mesh(
    new THREE.LatheGeometry(profile, 32),
    new THREE.MeshStandardMaterial({
      color: "#233b32",
      roughness: 0.48,
      metalness: 0,
    }),
  );
  grip.name = "rc-selector-grip";
  for (const object of [selector, grip]) {
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData = { action: "parameter", key: "mode", value: 1 };
    root.add(object);
  }
  return { selector, grip };
}
