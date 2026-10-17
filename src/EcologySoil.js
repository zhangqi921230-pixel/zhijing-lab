import * as THREE from "three";
import { HABITAT_POND } from "./ecologyHabitat.mjs";

export function ecologySoilGeometry() {
  const axis = (length, count, center) => {
    const values = [];
    for (let i = 0; i < count; i++) {
      const start = -length / 2 + (i * length) / count;
      const end = start + length / count;
      const divisions = end > center - 1 && start < center + 1 ? 4 : 1;
      for (let j = 0; j < divisions; j++)
        values.push(start + ((end - start) * j) / divisions);
    }
    values.push(length / 2);
    return values;
  };
  const xs = axis(7.2, 60, HABITAT_POND.x),
    zs = axis(5, 40, HABITAT_POND.z);
  const positions = [],
    uvs = [],
    indices = [];
  for (const z of zs)
    for (const x of xs) {
      positions.push(x, 0, z);
      uvs.push(x / 7.2 + 0.5, 0.5 - z / 5);
    }
  for (let j = 0; j < zs.length - 1; j++)
    for (let i = 0; i < xs.length - 1; i++) {
      const a = j * xs.length + i,
        b = a + 1,
        c = a + xs.length,
        d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

// Periodic value noise: the repeat boundary has the same height and slope.
function soilNoise(x, y, period) {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  const smooth = (v) => v * v * (3 - 2 * v);
  const u = smooth(x - ix),
    v = smooth(y - iy);
  const hash = (a, b) => {
    const n =
      Math.sin(
        (((a % period) + period) % period) * 127.1 +
          (((b % period) + period) % period) * 311.7,
      ) * 43758.5453;
    return n - Math.floor(n);
  };
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), u),
    THREE.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), u),
    v,
  );
}

export function ecologySoilTexture() {
  const size = 256,
    data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const u = x / size,
        v = y / size;
      const clumps = soilNoise(u * 16, v * 16, 16);
      const grains = soilNoise(u * 80, v * 80, 80);
      const pores = Math.max(0, 0.35 - grains) * 0.7;
      const value = Math.round(150 + 42 * clumps + 40 * grains - 80 * pores);
      const i = (y * size + x) * 4;
      data[i] = value;
      data[i + 1] = Math.round(value * 0.9);
      data[i + 2] = Math.round(value * 0.75);
      data[i + 3] = 255;
    }
  const texture = new THREE.DataTexture(data, size, size);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(7, 5);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
