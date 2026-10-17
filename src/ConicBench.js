import { layoutConicLabels } from "./conicLabelLayout.mjs";
import { conicPlaneFrame } from "./conicPlaneFrame.mjs";
import { conicPointLabel } from "./ConicPointLabel.js";
import { addConicAngles } from "./ConicAngles.js";
import { conicSectionTriangles } from "./conicSectionFill.mjs";
import { addConicOutline } from "./ConicOutline.js";
import { addConicCurveDepth } from "./ConicCurveDepth.js";
import { addDandelinSpheres } from "./DandelinSpheres.js";
import { conicProbe } from "./conicProbe.mjs";
import { conicFoci, CONIC_FOCUS_RANGE } from "./conicGeometry.mjs";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import * as THREE from "three";
import { conicSegments, conicState, CONIC_HEIGHT } from "./conicGeometry.mjs";
export function buildConicBench(root, p) {
  const center = 1.1,
    H = CONIC_HEIGHT;
  const shellMaterial = new THREE.MeshPhysicalMaterial({
    color: "#d5cbb1",
    transparent: true,
    opacity: 0.26,
    roughness: 0.4,
    metalness: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const shells = [-1, 1].map((sign) => {
    const mesh = new THREE.Mesh(
      new THREE.ConeGeometry(1, H, 96, 1, true),
      shellMaterial,
    );
    mesh.position.y = center + (sign * H) / 2;
    if (sign === 1) mesh.rotation.z = Math.PI;
    root.add(mesh);
    return mesh;
  });
  const outline = addConicOutline(root, center);
  const edges = outline.group;
  let coneSlope = Math.tan((p.alpha * Math.PI) / 180);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: "#97b6ca",
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  plane.name = "conic-cutting-plane";
  edges.name = "conic-construction-lines";
  shells.forEach((mesh, i) => (mesh.name = `conic-shell-${i}`));
  root.add(plane);
  const positions = new Float32Array(2048 * 6);
  const geometry = new LineSegmentsGeometry().setPositions(positions);
  const curve = new LineSegments2(
    geometry,
    new LineMaterial({
      color: "#a7670b",
      linewidth: 2.5,
      transparent: true,
      depthWrite: false,
      worldUnits: false,
      depthTest: false,
      toneMapped: false,
    }),
  );
  curve.raycast = () => {};
  curve.name = "conic-intersection";
  curve.renderOrder = 5;
  root.add(curve);
  const updateCurveDepth = addConicCurveDepth(root, curve, center);
  root.userData.beforeRender = (camera, height) => {
    layoutConicLabels(root, camera, height);
    outline.update(camera, coneSlope);
    updateCurveDepth(camera, cachedSegments, coneSlope, shells[0].visible);
  };
  const fillPositions = new Float32Array(2048 * 9);
  const fillGeometry = new THREE.BufferGeometry();
  fillGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(fillPositions, 3),
  );
  fillGeometry.setDrawRange(0, 0);
  const section = new THREE.Mesh(
    fillGeometry,
    new THREE.MeshBasicMaterial({
      color: "#d99a32",
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  );
  section.name = "conic-section-fill";
  section.position.y = center;
  section.renderOrder = 3;
  section.raycast = () => {};
  root.add(section);
  const vertex = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 12, 8),
    new THREE.MeshBasicMaterial({
      color: "#b87817",
      depthTest: false,
      transparent: true,
      depthWrite: false,
    }),
  );
  vertex.position.y = center;
  vertex.renderOrder = 6;
  root.add(vertex);
  const focusGeometry = new THREE.SphereGeometry(0.045, 16, 10);
  const focusMaterial = new THREE.MeshBasicMaterial({
    color: "#2673ba",
    transparent: true,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
  });
  const focusMarkers = [0, 1].map((i) => {
    const m = new THREE.Mesh(focusGeometry, focusMaterial);
    m.name = `conic-focus-${i}`;
    m.renderOrder = 6;
    root.add(m);
    m.userData.annotation = conicPointLabel(root, `F${i + 1}`, "#235f95", [
      i ? 0.22 : -0.22,
      0.13,
      0,
    ]);
    return m;
  });
  const probeMarker = new THREE.Mesh(
    focusGeometry,
    new THREE.MeshBasicMaterial({
      color: "#a7670b",
      transparent: true,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    }),
  );
  probeMarker.name = "conic-probe";
  probeMarker.renderOrder = 7;
  root.add(probeMarker);
  const probeLabel = conicPointLabel(root, "P", "#85570f", [0.12, 0.2, 0.08]);
  const updateSpheres = addDandelinSpheres(root, center);
  const updateAngles = addConicAngles(root, center);
  let cachedSegments = [];
  let last = "";
  root.userData.update = (q) => {
    updateAngles(q);
    const foci = conicFoci(q);
    focusMarkers.forEach((marker, i) => {
      const focus = foci[i];
      marker.visible =
        q.showFocus !== 0 && !!focus && Math.abs(focus.u) <= CONIC_FOCUS_RANGE;
      marker.userData.annotation.group.visible = marker.visible;
      marker.userData.annotation.setText(foci.length === 1 ? "F" : `F${i + 1}`);
      if (focus)
        marker.position.set(
          focus.point[0],
          center + focus.point[1],
          focus.point[2],
        );
      marker.userData.annotation.group.position.copy(marker.position);
    });
    plane.visible = q.showPlane !== 0;
    shells.forEach((mesh) => (mesh.visible = q.showShell !== 0));
    edges.visible = q.showShell !== 0;
    outline.axis.visible = q.showGuides !== 0;
    section.visible = q.showFill !== 0;
    const key = `${q.alpha}/${q.tilt}/${q.offset}`;
    if (key !== last) cachedSegments = conicSegments(q);
    const probe = conicProbe(q, cachedSegments);
    updateSpheres(q, probe);
    probeMarker.visible = q.showFocus !== 0 && !!probe;
    if (probe)
      probeMarker.position.set(
        probe.point[0],
        center + probe.point[1],
        probe.point[2],
      );
    probeLabel.group.visible = probeMarker.visible;
    probeLabel.group.position.copy(probeMarker.position);
    if (key === last) return;
    last = key;
    const state = conicState(q);
    shells.forEach((mesh) => mesh.scale.set(state.k * H, 1, state.k * H));
    coneSlope = state.k;
    const segments = cachedSegments;
    const frame = conicPlaneFrame(q, segments);
    plane.scale.set(frame.width, frame.height, 1);
    plane.position.set(
      -q.offset * state.s + frame.u * state.c,
      center + q.offset * state.c + frame.u * state.s,
      0,
    );
    plane.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(
        new THREE.Vector3(state.c, state.s, 0),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-state.s, state.c, 0),
      ),
    );
    const fill = conicSectionTriangles(q, segments);
    fillPositions.set(fill);
    fillGeometry.attributes.position.needsUpdate = true;
    fillGeometry.setDrawRange(0, fill.length / 3);
    fillGeometry.computeBoundingSphere();
    let index = 0;
    for (const segment of segments)
      for (const [x, y, z] of segment) {
        positions[index++] = x;
        positions[index++] = y + center;
        positions[index++] = z;
      }
    geometry.attributes.instanceStart.data.needsUpdate = true;
    geometry.instanceCount = index / 6;
    geometry.computeBoundingSphere();
    vertex.visible = state.degenerate;
    root.userData.conicState = { ...state, segments: segments.length };
  };
  root.userData.update(p);
}
