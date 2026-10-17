// Shared maps from the texture cache are not owned by a model. Only explicit
// ownedTexture fields are released here; environment targets have their own owner.
export function disposeSceneResources(root) {
  const geometries = new Set(),
    materials = new Set(),
    textures = new Set();
  let instances = 0;
  root.traverse((object) => {
    if (object.isInstancedMesh) {
      object.dispose();
      instances++;
    }
    if (object.geometry) geometries.add(object.geometry);
    for (const geometry of object.userData.ownedGeometries ?? [])
      geometries.add(geometry);
    if (object.userData.ownedTexture)
      textures.add(object.userData.ownedTexture);
    if (object.material)
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material])
        materials.add(material);
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  for (const texture of textures) texture.dispose();
  return {
    geometries: geometries.size,
    materials: materials.size,
    textures: textures.size,
    instances,
  };
}
