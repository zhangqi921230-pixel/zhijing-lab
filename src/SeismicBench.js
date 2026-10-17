import * as THREE from "three";
import { seismicRockMaterial } from "./SeismicRockMaterial.js";
import { box, panel } from "./CircuitBench.js";
import { seismic } from "./advancedModels.mjs";
import { addSectionWave, SEISMIC_SCALE, SECTION_Z } from "./SeismicSection.js";
import { surfaceTexture } from "./SceneCraft.js";
import { addSeismicStationDetails } from "./SeismicStationDetails.js";
import { finishSeismicStation } from "./SeismicStationMaterials.js";
import { addSeismicLandscape } from "./SeismicLandscape.js";
import { seismicLabel } from "./SeismicLabel.js";
import { addSeismicDepthGuide } from "./SeismicDepthGuide.js";

export function buildSeismicBench(root, p) {
  const updateDepthGuide = addSeismicDepthGuide(root);
  const vegetation = addSeismicLandscape(root);
  const rock = surfaceTexture("rock");
  ["#777961", "#8a7864", "#625d58", "#494e50"].forEach((color, i) => {
    const layer = box(
      root,
      [7, 0.4, 3.8],
      color,
      [0, -0.2 - i * 0.4, -0.3],
      0.012,
    );
    layer.material.dispose();
    layer.material = seismicRockMaterial(color, rock, i);
  });
  box(root, [7.15, 0.14, 3.95], "#283840", [0, -1.67, -0.3], 0.025);
  function dot(name, r, color) {
    const object = new THREE.Mesh(
      new THREE.SphereGeometry(r, 16, 12),
      new THREE.MeshBasicMaterial({ color }),
    );
    object.name = name;
    root.add(object);
    return object;
  }
  const focus = dot("seismic-focus", 0.055, "#ffbc66"),
    epicenter = dot("seismic-epicenter", 0.035, "#f4dd9a");
  const captions = [];
  function caption(parent, text, position) {
    captions.push(seismicLabel(parent, text, position));
  }
  root.userData.setSeismicView = (view) => {
    for (const label of captions)
      label.userData.pixelScale = view === "station" ? 0.85 : 1;
  };
  caption(focus, "震源", [-0.42, -0.12, 0.04]);
  caption(epicenter, "震中", [0, 0.22, 0.04]);
  const station = new THREE.Group();
  station.name = "seismic-station";
  root.add(station);
  addSeismicStationDetails(station);
  caption(station, "观测台站", [0, 1.05, 0.04], 0.95);
  box(station, [0.62, 0.08, 0.68], "#b2b8ab", [0, 0.04, -0.38], 0.012);
  box(station, [0.42, 0.36, 0.46], "#d7d8c9", [0, 0.26, -0.38], 0.02);
  box(station, [0.425, 0.012, 0.465], "#334143", [0, 0.438, -0.38], 0.003);
  box(station, [0.48, 0.04, 0.52], "#889da3", [0, 0.46, -0.38], 0.008);
  box(station, [0.28, 0.15, 0.016], "#172e36", [0, 0.29, -0.141], 0.003);
  for (const x of [-0.15, 0.15])
    for (const y of [0.13, 0.39]) {
      const bolt = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 6, 4),
        new THREE.MeshStandardMaterial({
          color: "#7a8687",
          metalness: 0.7,
          roughness: 0.4,
        }),
      );
      bolt.position.set(x, y, -0.14);
      station.add(bolt);
    }
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.42, 8),
    new THREE.MeshStandardMaterial({
      color: "#aebfc2",
      metalness: 0.7,
      roughness: 0.4,
    }),
  );
  antenna.position.set(0.14, 0.69, -0.45);
  station.add(antenna);
  const arrival = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 12, 8),
    new THREE.MeshBasicMaterial({ color: "#536465" }),
  );
  arrival.position.set(0.09, 0.29, -0.122);
  station.add(arrival);
  finishSeismicStation(station);
  const pathGeometry = new THREE.BufferGeometry();
  pathGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(12), 3),
  );
  const guides = new THREE.LineSegments(
    pathGeometry,
    new THREE.LineDashedMaterial({
      color: "#dbc791",
      dashSize: 0.075,
      gapSize: 0.05,
    }),
  );
  root.add(guides);
  const pWave = addSectionWave(root, "#f5c06d"),
    sWave = addSectionWave(root, "#6dd6df");
  const labels = panel(
    root,
    [0, -1.85, SECTION_Z],
    6.8,
    0.25,
    (ctx, q) => {
      ctx.fillStyle = "#15252d";
      ctx.fillRect(0, 0, 1024, 64);
      ctx.fillStyle = "#dfebe4";
      ctx.font = "26px sans-serif";
      ctx.fillText(
        `震源深度 ${q.depth} km  ·  震中距 ${q.distance} km  ·  台站外形放大示意`,
        24,
        43,
      );
    },
    [1024, 64],
  );
  let last = "";
  root.userData.update = (q) => {
    updateDepthGuide(q.depth);
    vegetation.visible = q.vegetation !== 0;
    const t = q.time || 0,
      state = seismic(q, t),
      y = -q.depth * SEISMIC_SCALE,
      x = -1.7 + q.distance * SEISMIC_SCALE;
    focus.position.set(-1.7, y, SECTION_Z + 0.01);
    epicenter.position.set(-1.7, 0, SECTION_Z + 0.01);
    station.position.set(x, 0, SECTION_Z);
    const key = `${q.depth}:${q.distance}`;
    if (key !== last) {
      last = key;
      pathGeometry.attributes.position.array.set([
        -1.7,
        0,
        SECTION_Z,
        -1.7,
        y,
        SECTION_Z,
        -1.7,
        y,
        SECTION_Z,
        x,
        0,
        SECTION_Z,
      ]);
      pathGeometry.attributes.position.needsUpdate = true;
      guides.computeLineDistances();
      labels.update(q);
    }
    arrival.material.color.set(
      t >= state.ts ? "#6dd6df" : t >= state.tp ? "#f5c06d" : "#536465",
    );
    pWave(state.pRadius * SEISMIC_SCALE, q.depth);
    sWave(state.sRadius * SEISMIC_SCALE, q.depth);
  };
  root.userData.update(p);
}
