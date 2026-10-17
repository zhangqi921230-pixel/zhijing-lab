import * as THREE from "three";

// An illustrative wing pattern, not a diagnostic pattern for a named species.
// ShapeGeometry UVs retain the original wing's x/y coordinates after rotation.
export function butterflyPattern() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const spots = [
    [0.15, 0.17, 0.012, 0.007],
    [0.19, 0.155, 0.012, 0.007],
    [0.22, 0.125, 0.01, 0.007],
    [0.232, 0.087, 0.008, 0.007],
    [0.19, -0.025, 0.009, 0.008],
    [0.166, -0.075, 0.01, 0.007],
    [0.12, -0.122, 0.009, 0.006],
    [0.075, -0.118, 0.007, 0.006],
  ];
  for (let row = 0; row < size; row++)
    for (let col = 0; col < size; col++) {
      const x = (col / (size - 1)) * 0.3;
      const y = (row / (size - 1)) * 0.42 - 0.17;
      const fore = Math.hypot((x - 0.075) / 0.155, (y - 0.055) / 0.13);
      const hind = Math.hypot((x - 0.07) / 0.112, (y + 0.022) / 0.1);
      const field = y > 0.018 ? fore : hind;
      const margin = THREE.MathUtils.smoothstep(field, 0.76, 1.06);
      const root = THREE.MathUtils.smoothstep(x, 0.012, 0.055);
      const pigment = root * (1 - margin);
      const seed = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
      const grain = (seed - Math.floor(seed) - 0.5) * 17;
      let cream = 0;
      for (const [sx, sy, rx, ry] of spots) {
        const d = Math.hypot((x - sx) / rx, (y - sy) / ry);
        cream = Math.max(cream, 1 - THREE.MathUtils.smoothstep(d, 0.7, 1.12));
      }
      const offset = (row * size + col) * 4;
      for (let c = 0; c < 3; c++) {
        const base = [48, 37, 27][c] + pigment * [157, 103, 38][c];
        data[offset + c] = Math.round(
          base * (1 - cream) + [239, 220, 169][c] * cream + grain,
        );
      }
      data[offset + 3] = 255;
    }
  const texture = new THREE.DataTexture(data, size, size);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(1 / 0.3, 1 / 0.42);
  texture.offset.set(0, 0.17 / 0.42);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}
