import * as T from "three";

export function createSolidVolume(root, cone) {
  const geometry = new T.CylinderGeometry(1, 1, 1, 64, 1, false);
  const original = geometry.attributes.position.array.slice();
  const mesh = new T.Mesh(
    geometry,
    new T.MeshPhysicalMaterial({
      color: cone ? "#c99835" : "#3b968e",
      roughness: 0.32,
      clearcoat: 0.3,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    }),
  );
  mesh.name = cone ? "solid-volume-cone" : "solid-volume-cylinder";
  root.add(mesh);
  let previous = -1;
  return (fraction, radius, height, x, base, enabled) => {
    mesh.visible = enabled && fraction > 0;
    mesh.position.set(x, base + (fraction * height) / 2, 0);
    mesh.scale.set(radius, fraction * height, radius);
    if (cone && fraction !== previous) {
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const y = original[i * 3 + 1],
          ratio = 1 - fraction * (y + 0.5);
        positions.setXYZ(
          i,
          original[i * 3] * ratio,
          y,
          original[i * 3 + 2] * ratio,
        );
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
    }
    previous = fraction;
  };
}
