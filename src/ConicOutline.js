import * as THREE from "three";
import { CONIC_HEIGHT } from "./conicGeometry.mjs";

export function addConicOutline(root, center) {
  const group = new THREE.Group();
  group.name = "conic-construction-lines";
  root.add(group);
  const make = (name, dashed, parent = group) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(1200), 3),
    );
    geometry.setAttribute(
      "lineDistance",
      new THREE.BufferAttribute(new Float32Array(400), 1),
    );
    const material = dashed
      ? new THREE.LineDashedMaterial({
          color: "#75817c",
          dashSize: 0.075,
          gapSize: 0.055,
          transparent: true,
          opacity: 0.7,
          toneMapped: false,
        })
      : new THREE.LineBasicMaterial({
          color: "#394a40",
          transparent: true,
          opacity: 0.9,
          toneMapped: false,
        });
    const lines = new THREE.LineSegments(geometry, material);
    lines.name = name;
    lines.frustumCulled = false;
    parent.add(lines);
    return lines;
  };
  const front = make("conic-visible-outline", false),
    back = make("conic-back-outline", true),
    axis = make("conic-axis-guide", true, root);
  const eye = new THREE.Vector3();
  let previous = "";
  const write = (lines, segments) => {
    const pos = lines.geometry.attributes.position,
      distance = lines.geometry.attributes.lineDistance;
    let i = 0,
      j = 0;
    for (const [a, b, start = 0] of segments) {
      pos.array.set(a, i);
      pos.array.set(b, i + 3);
      i += 6;
      distance.array[j++] = start;
      distance.array[j++] = start + Math.hypot(...a.map((v, k) => v - b[k]));
    }
    pos.needsUpdate = true;
    distance.needsUpdate = true;
    lines.geometry.setDrawRange(0, i / 3);
  };
  write(axis, [
    [
      [0, center - CONIC_HEIGHT, 0],
      [0, center + CONIC_HEIGHT, 0],
    ],
  ]);
  return {
    group,
    axis,
    update(camera, k) {
      if (!group.visible) return;
      root.updateWorldMatrix(true, false);
      camera.getWorldPosition(eye);
      root.worldToLocal(eye);
      eye.y -= center;
      const key = `${k}/${eye.x}/${eye.y}/${eye.z}`;
      if (key === previous) return;
      previous = key;
      const visible = [],
        hidden = [],
        H = CONIC_HEIGHT,
        R = k * H,
        rimStep = 2 * R * Math.sin(Math.PI / 96);
      const point = (angle, sign) => [
        R * Math.cos(angle),
        center + sign * H,
        R * Math.sin(angle),
      ];
      for (const sign of [-1, 1]) {
        for (let i = 0; i < 96; i++) {
          const a = (i * Math.PI) / 48,
            b = ((i + 1) * Math.PI) / 48,
            m = (a + b) / 2;
          const facing =
            eye.x * Math.cos(m) + eye.z * Math.sin(m) - sign * k * eye.y;
          (facing >= 0 ? visible : hidden).push([
            point(a, sign),
            point(b, sign),
            i * rimStep,
          ]);
        }
        const radial = Math.hypot(eye.x, eye.z),
          ratio = (sign * k * eye.y) / radial;
        if (radial > 1e-10 && Math.abs(ratio) < 1) {
          const azimuth = Math.atan2(eye.z, eye.x),
            angle = Math.acos(ratio);
          for (const a of [azimuth - angle, azimuth + angle])
            visible.push([[0, center, 0], point(a, sign)]);
        }
      }
      write(front, visible);
      write(back, hidden);
    },
  };
}
