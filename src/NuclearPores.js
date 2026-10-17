import * as T from "three";

export function createNuclearPoreRim(detail = true) {
  const geometry = new T.TorusGeometry(
    0.029,
    0.01,
    detail ? 12 : 8,
    detail ? 64 : 32,
  );
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const dark = new T.Color("#9680a6"),
    light = new T.Color("#d4c4dc"),
    color = new T.Color();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i),
      z = positions.getZ(i);
    const angle = Math.atan2(y, x),
      sector = 0.5 + 0.5 * Math.cos(angle * 8);
    const radial = Math.hypot(x, y),
      thickness = 0.66 + 0.34 * sector;
    const newRadius = 0.029 + (radial - 0.029) * thickness;
    positions.setXYZ(
      i,
      newRadius * Math.cos(angle),
      newRadius * Math.sin(angle),
      z * thickness,
    );
    color
      .copy(dark)
      .lerp(light, 0.3 + 0.7 * sector)
      .toArray(colors, i * 3);
  }
  geometry.setAttribute("color", new T.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}
export function addNuclearPores(root, nucleus, centers) {
  const positions = nucleus.geometry.attributes.position,
    index = nucleus.geometry.index;
  const retained = [],
    point = new T.Vector3(),
    centroid = new T.Vector3();
  const sites = centers.map((p) => new T.Vector3(...p));
  for (let i = 0; i < index.count; i += 3) {
    centroid.set(0, 0, 0);
    for (let j = 0; j < 3; j++)
      centroid.add(
        point
          .fromBufferAttribute(positions, index.getX(i + j))
          .multiply(nucleus.scale)
          .add(nucleus.position),
      );
    centroid.multiplyScalar(1 / 3);
    if (!sites.some((p) => p.distanceToSquared(centroid) < 0.025 ** 2))
      retained.push(index.getX(i), index.getX(i + 1), index.getX(i + 2));
  }
  nucleus.geometry.setIndex(retained);
  const pores = new T.InstancedMesh(
    // Enlarged teaching rim covers the triangulated aperture boundary while
    // retaining an open centre; it is not a molecular-scale pore model.
    createNuclearPoreRim(),
    new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.72 }),
    sites.length,
  );
  pores.name = "nuclear-pores";
  const matrix = new T.Matrix4(),
    rotation = new T.Quaternion(),
    normal = new T.Vector3(),
    axis = new T.Vector3(0, 0, 1),
    scale = new T.Vector3(1, 1, 1);
  sites.forEach((p, i) => {
    normal
      .copy(p)
      .sub(nucleus.position)
      .divide(new T.Vector3(0.55 ** 2, 0.506 ** 2, 0.55 ** 2))
      .normalize();
    rotation.setFromUnitVectors(axis, normal);
    pores.setMatrixAt(i, matrix.compose(p, rotation, scale));
  });
  pores.userData = { action: "parameter", key: "part", value: 1 };
  root.add(pores);
  return pores;
}
