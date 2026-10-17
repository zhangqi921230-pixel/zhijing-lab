import * as T from "three";

// Shared object-space pigment variation keeps adjoining cutaway sectors coherent.
// These tones illustrate hydrated cytoplasm; they are not microscopy measurements.
export function cytoplasmTint(x, y, z) {
  const cloud =
    0.5 +
    0.23 * Math.sin(x * 3.7 + z * 2.1) * Math.cos(y * 4.3 - z * 2.8) +
    0.12 * Math.sin(x * 10.1 - y * 7.7 + z * 8.3);
  const depth = T.MathUtils.smoothstep(y, -1.2, 0);
  return new T.Color("#1b514f").lerp(
    new T.Color("#41887e"),
    T.MathUtils.clamp(0.15 + cloud * 0.55 + depth * 0.3, 0, 1),
  );
}

export function colorCytoplasmGeometry(geometry) {
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  for (let i = 0; i < positions.count; i++) {
    const tint = cytoplasmTint(
      positions.getX(i),
      positions.getY(i),
      positions.getZ(i),
    );
    tint.toArray(colors, i * 3);
  }
  geometry.setAttribute("color", new T.BufferAttribute(colors, 3));
  return geometry;
}

// Periodic, deterministic illustration texture. Not a molecular-scale map.
export function membraneGrain(u, v) {
  const smooth = (t) => t * t * (3 - 2 * t);
  const noise = (period) => {
    const x = (((u % 1) + 1) % 1) * period;
    const y = (((v % 1) + 1) % 1) * period;
    const ix = Math.floor(x),
      iy = Math.floor(y);
    const hash = (a, b) => {
      const n =
        Math.sin((a % period) * 127.1 + (b % period) * 311.7 + period) *
        43758.5453;
      return n - Math.floor(n);
    };
    const fx = smooth(x - ix),
      fy = smooth(y - iy);
    return T.MathUtils.lerp(
      T.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), fx),
      T.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), fx),
      fy,
    );
  };
  return noise(4) * 0.42 + noise(12) * 0.3 + noise(36) * 0.2 + noise(84) * 0.08;
}

const surfaceSize = 256;
let membranePixels;
function buildMembranePixels() {
  const size = surfaceSize,
    data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const grain = membraneGrain(x / size, y / size),
        i = (y * size + x) * 4;
      data[i] = Math.round(70 + 150 * grain); // bump map reads red
      data[i + 1] = Math.round(170 + 80 * grain); // roughness map reads green
      data[i + 2] = data[i];
      data[i + 3] = 255;
    }
  return data;
}

export function createCellSurfaceTexture() {
  // Keep a single 256 KiB CPU source, created only when this lesson is opened.
  // Each scene owns a pixel copy and GPU texture; disposal and modifications
  // cannot affect the next lesson instance or corrupt the cached source.
  membranePixels ??= buildMembranePixels();
  const texture = new T.DataTexture(
    membranePixels.slice(),
    surfaceSize,
    surfaceSize,
  );
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.repeat.set(3, 2);
  texture.needsUpdate = true;
  return texture;
}
