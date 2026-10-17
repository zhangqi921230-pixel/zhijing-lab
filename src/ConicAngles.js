import * as T from "three";
import { conicPointLabel } from "./ConicPointLabel.js";

// Angle construction lies in the axial XY section (z=0).
export function conicAnglePoints(degrees, radius, fromVertical = false) {
  return Array.from({ length: 33 }, (_, i) => {
    const angle = (T.MathUtils.degToRad(degrees) * i) / 32;
    return new T.Vector3(
      radius * (fromVertical ? Math.sin(angle) : Math.cos(angle)),
      radius * (fromVertical ? Math.cos(angle) : Math.sin(angle)),
      0,
    );
  });
}
export function addConicAngles(root, center) {
  const make = (name, color, symbol, offset) => {
    const group = new T.Group();
    group.name = name;
    root.add(group);
    const material = new T.LineBasicMaterial({
      color,
      depthTest: false,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    const arc = new T.Line(
      new T.BufferGeometry().setFromPoints(conicAnglePoints(0, 1)),
      material,
    );
    arc.renderOrder = 8;
    const rays = new T.LineSegments(
      new T.BufferGeometry().setFromPoints(
        Array.from({ length: 4 }, () => new T.Vector3()),
      ),
      material,
    );
    rays.renderOrder = 8;
    group.add(arc, rays);
    const label = conicPointLabel(group, symbol, color, offset, 72);
    const update = (angle, radius, vertical) => {
      label.setText(`${symbol} ${Number(angle.toFixed(1))}°`);
      const points = conicAnglePoints(angle, radius, vertical);
      points.forEach((point, i) =>
        arc.geometry.attributes.position.setXYZ(i, ...point.toArray()),
      );
      arc.geometry.attributes.position.needsUpdate = true;
      arc.geometry.computeBoundingSphere();
      const ends = [
        new T.Vector3(),
        points[0].clone().multiplyScalar(1.3),
        new T.Vector3(),
        points[32].clone().multiplyScalar(1.3),
      ];
      ends.forEach((point, i) =>
        rays.geometry.attributes.position.setXYZ(i, ...point.toArray()),
      );
      rays.geometry.attributes.position.needsUpdate = true;
      rays.geometry.computeBoundingSphere();
      label.group.position.copy(points[16]);
    };
    return { group, update };
  };
  const alpha = make("conic-half-angle", "#65766d", "α", [0.25, 0.1, 0]);
  // Use the equivalent lower-nappe half angle to separate it from the plane angle.
  alpha.group.rotation.z = Math.PI;
  const theta = make("conic-plane-angle", "#397999", "θ", [0.3, -0.16, 0]);
  let previous = "";
  return (p) => {
    alpha.group.visible = p.showGuides !== 0;
    theta.group.visible = p.showGuides !== 0 && p.showPlane !== 0;
    const key = `${p.alpha}/${p.tilt}/${p.offset}`;
    if (previous === key) return;
    previous = key;
    alpha.group.position.set(0, center, 0);
    alpha.update(p.alpha, 0.7, true);
    const tilt = T.MathUtils.degToRad(p.tilt);
    theta.group.position.set(
      -p.offset * Math.sin(tilt),
      center + p.offset * Math.cos(tilt),
      0,
    );
    theta.update(p.tilt, 0.42, false);
  };
}
