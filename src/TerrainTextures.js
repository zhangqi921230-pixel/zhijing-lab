import * as THREE from "three";

// Shared, locally served texture. Consumers subscribe only while mounted so a
// late download can wake a demand-rendered scene without retaining old scenes.
const listeners = new Set();
let texture;
export const terrainTextureState = { value: 0 };
export function terrainRockTexture() {
  if (texture || typeof document === "undefined") return texture;
  texture = new THREE.TextureLoader().load(
    "./textures/terrain/cliff-albedo-v1.png",
    () => {
      terrainTextureState.value = 1;
      for (const update of listeners) update();
    },
    undefined,
    () => {
      // The procedural surface remains usable if a local asset cannot load.
      terrainTextureState.value = 0;
    },
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}
export function subscribeTerrainTexture(update) {
  listeners.add(update);
  if (terrainTextureState.value) update();
  return () => listeners.delete(update);
}
