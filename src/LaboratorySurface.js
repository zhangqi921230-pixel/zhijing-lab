import * as THREE from "three";
export function laboratorySurface(kind) {
  const size = 128,
    pixels = new Uint8Array(size * size * 4);
  let seed = 719;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const grain = (seed / 4294967296 - 0.5) * 9;
      const grout = kind === "floor" && (x === 0 || y === 0);
      const tone = grout ? 161 : (kind === "floor" ? 219 : 190) + grain;
      const i = (y * size + x) * 4;
      pixels[i] = tone;
      pixels[i + 1] = tone;
      pixels[i + 2] = tone - (kind === "floor" ? 7 : 2);
      pixels[i + 3] = 255;
    }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.repeat.set(kind === "floor" ? 80 : 7, kind === "floor" ? 80 : 4);
  texture.needsUpdate = true;
  return texture;
}
