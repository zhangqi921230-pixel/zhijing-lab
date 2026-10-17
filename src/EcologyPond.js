import * as THREE from "three";
import { HABITAT_POND, habitatHeight } from "./ecologyHabitat.mjs";

export function createEcologyPond() {
  const { x, z, radius, level } = HABITAT_POND;
  const geometry = new THREE.RingGeometry(0, radius, 64, 16);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const colors = [],
    shallow = new THREE.Color("#829482"),
    deep = new THREE.Color("#294f50");
  const color = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    const depth = Math.max(
      0,
      level - habitatHeight(x + positions.getX(i), z + positions.getZ(i)),
    );
    color.copy(shallow).lerp(deep, 1 - Math.exp(-depth * 12));
    // Shallow water reveals the bank instead of painting an opaque pale rim.
    const opacity = 0.04 + 0.76 * (1 - Math.exp(-depth * 12));
    colors.push(color.r, color.g, color.b, opacity);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
  // A small repeatable normal texture supplies highlights without tessellating
  // waves or allocating a reflection render target. Water level stays horizontal.
  const size = 128,
    data = new Uint8Array(size * size * 4);
  for (let j = 0; j < size; j++)
    for (let i = 0; i < size; i++) {
      const u = (i / size) * Math.PI * 2,
        v = (j / size) * Math.PI * 2;
      let nx = 0,
        ny = 0;
      for (const [kx, ky, amplitude, phase] of [
        [2, 1, 0.03, 0.7],
        [3, -2, 0.02, 2.1],
        [5, 3, 0.012, 1.2],
        [7, -4, 0.007, 4.8],
        [1, 4, 0.015, 3.2],
      ]) {
        const slope = amplitude * Math.cos(kx * u + ky * v + phase);
        nx += kx * slope;
        ny += ky * slope;
      }
      const n = new THREE.Vector3(nx, ny, 1).normalize();
      const k = (j * size + i) * 4;
      data[k] = Math.round((n.x * 0.5 + 0.5) * 255);
      data[k + 1] = Math.round((n.y * 0.5 + 0.5) * 255);
      data[k + 2] = Math.round((n.z * 0.5 + 0.5) * 255);
      data[k + 3] = 255;
    }
  const normalMap = new THREE.DataTexture(data, size, size);
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.magFilter = THREE.LinearFilter;
  normalMap.minFilter = THREE.LinearMipmapLinearFilter;
  normalMap.generateMipmaps = true;
  normalMap.needsUpdate = true;
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.32,
    metalness: 0,
    ior: 1.333,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    normalMap,
    normalScale: new THREE.Vector2(0.24, 0.24),
    clearcoat: 0.12,
    clearcoatRoughness: 0.3,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "habitat-pond-water";
  mesh.userData.ownedTexture = normalMap;
  mesh.position.set(x, level, z);
  mesh.receiveShadow = true;
  mesh.userData.update = (time) =>
    normalMap.offset.set((time * 0.013) % 1, (time * 0.007) % 1);
  return mesh;
}
