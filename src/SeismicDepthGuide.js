import * as THREE from "three";
import { seismicLabel } from "./SeismicLabel.js";
import { SEISMIC_SCALE, SECTION_Z } from "./SeismicSection.js";

export function addSeismicDepthGuide(root) {
  const group = new THREE.Group();
  group.name = "seismic-depth-guide";
  root.add(group);
  const positions = new THREE.BufferAttribute(new Float32Array(18), 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", positions);
  const bracket = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color: "#dfc18b" }),
  );
  bracket.frustumCulled = false;
  group.add(bracket);
  const label = seismicLabel(group, "h = 15 km", [
    -3.03,
    -0.3,
    // Lift the billboard clear of the front face at oblique teaching views.
    // The measured bracket remains on the actual section plane below.
    SECTION_Z + 0.3,
  ]);
  label.userData.pixelScale = 0.85;
  let lastDepth;
  return (depth) => {
    if (depth === lastDepth) return;
    lastDepth = depth;
    const y = -depth * SEISMIC_SCALE,
      x = -2.35,
      z = SECTION_Z + 0.02;
    positions.array.set([
      x,
      0,
      z,
      x,
      y,
      z,
      x - 0.08,
      0,
      z,
      x + 0.08,
      0,
      z,
      x - 0.08,
      y,
      z,
      x + 0.08,
      y,
      z,
    ]);
    positions.needsUpdate = true;
    label.position.y = y / 2;
    label.userData.setText(`h = ${depth} km`);
  };
}
