import * as T from "three";

// Subtle illustrative material grain; not a molecular map or a measured membrane surface.
export function createMembraneSurface(owner) {
  const size = 128,
    data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2,
        v = (y / size) * Math.PI * 2;
      const value = Math.round(
        184 +
          18 * Math.sin(13 * u + 9 * v) * Math.cos(7 * u - 11 * v) +
          10 * Math.sin(29 * u - 23 * v),
      );
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 255;
    }
  const texture = new T.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  const resource = new T.Group();
  resource.name = "membrane-surface-resource";
  resource.userData.ownedTexture = texture;
  owner.add(resource);
  return texture;
}
