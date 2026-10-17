import * as T from "three";
import { aperture, opticalAxis } from "./opticalModel.mjs";

export function addOpticalAperture(parent) {
  const segments = 64;
  const geometry = new T.RingGeometry(aperture, 0.51, segments);
  const ring = new T.Mesh(
    geometry,
    new T.MeshStandardMaterial({
      color: "#263033",
      roughness: 0.65,
      metalness: 0.45,
      side: T.DoubleSide,
    }),
  );
  ring.name = "optical-aperture";
  ring.rotation.y = Math.PI / 2;
  ring.position.y = opticalAxis;
  parent.add(ring);
  const edges = new T.LineSegments(
    new T.BufferGeometry().setAttribute(
      "position",
      new T.Float32BufferAttribute(new Float32Array(8 * 6), 3),
    ),
    new T.LineBasicMaterial({ color: "#647270" }),
  );
  edges.name = "optical-aperture-seams";
  ring.add(edges);
  let previous;
  return (ratio) => {
    if (ratio === previous) return;
    previous = ratio;
    const radius = aperture * ratio;
    const positions = geometry.attributes.position;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * 2 * Math.PI;
      positions.setXYZ(i, radius * Math.cos(a), radius * Math.sin(a), 0);
    }
    positions.needsUpdate = true;
    geometry.computeBoundingSphere();
    const seams = edges.geometry.attributes.position;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      seams.setXYZ(
        i * 2,
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0.001,
      );
      seams.setXYZ(
        i * 2 + 1,
        0.505 * Math.cos(angle + 0.28),
        0.505 * Math.sin(angle + 0.28),
        0.001,
      );
    }
    seams.needsUpdate = true;
    edges.geometry.computeBoundingSphere();
  };
}
