import { conicPointLabel } from "./ConicPointLabel.js";
import * as THREE from "three";
import { dandelinSpheres, dandelinTangents } from "./conicDandelin.mjs";
export function addDandelinSpheres(root, center) {
  const sphereGeometry = new THREE.SphereGeometry(1, 40, 24);
  const ringGeometry = new THREE.BufferGeometry().setFromPoints(
    Array.from(
      { length: 97 },
      (_, i) =>
        new THREE.Vector3(
          Math.cos((i / 96) * Math.PI * 2),
          0,
          Math.sin((i / 96) * Math.PI * 2),
        ),
    ),
  );
  const items = ["#679c8c", "#c99461"].map((color, i) => {
    const group = new THREE.Group();
    group.name = `dandelin-sphere-${i}`;
    root.add(group);
    const body = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: 0.38,
        roughness: 0.25,
        metalness: 0,
        depthWrite: false,
      }),
    );
    group.add(body);
    const ring = new THREE.Line(
      ringGeometry,
      new THREE.LineBasicMaterial({
        color,
        depthTest: false,
        toneMapped: false,
      }),
    );
    ring.renderOrder = 4;
    group.add(ring);
    const positions = new Float32Array(12),
      geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const lines = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({
        color,
        depthTest: false,
        toneMapped: false,
      }),
    );
    lines.renderOrder = 6;
    group.add(lines);
    const annotation = conicPointLabel(
      group,
      `T${i + 1}`,
      i ? "#8d5524" : "#285f52",
      [i ? 0.5 : -0.35, i ? 0.35 : -0.25, 0.08],
    );
    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.027, 10, 8),
      new THREE.MeshBasicMaterial({
        color,
        depthTest: false,
        toneMapped: false,
      }),
    );
    point.renderOrder = 7;
    group.add(point);
    return { group, body, ring, lines, positions, annotation, point };
  });
  return (p, probe) => {
    const spheres = dandelinSpheres(p);
    items.forEach((item, i) => {
      const sphere = spheres[i];
      item.group.visible = p.showSpheres === 1 && !!sphere?.visible;
      if (!item.group.visible) return;
      item.body.position.y = center + sphere.y;
      item.body.scale.setScalar(sphere.radius);
      item.ring.position.y = center + sphere.ringY;
      item.ring.scale.setScalar(sphere.ringRadius);
      const proof = dandelinTangents(sphere, probe?.point);
      item.lines.visible = !!proof && p.showFocus !== 0;
      item.annotation.group.visible = item.lines.visible;
      item.point.visible = item.lines.visible;
      if (proof) {
        item.point.position.set(
          proof.tangent[0],
          center + proof.tangent[1],
          proof.tangent[2],
        );
        item.annotation.group.position.copy(item.point.position);
      }
      if (proof) {
        let offset = 0;
        for (const point of [
          probe.point,
          sphere.focus,
          probe.point,
          proof.tangent,
        ])
          for (let axis = 0; axis < 3; axis++)
            item.positions[offset++] = point[axis] + (axis === 1 ? center : 0);
        item.lines.geometry.attributes.position.needsUpdate = true;
        item.lines.geometry.computeBoundingSphere();
      }
    });
  };
}
