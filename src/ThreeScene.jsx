import MicroscopeObjectiveChoice from "./MicroscopeObjectiveChoice.jsx";
import { useTheme } from "./Theme.jsx";
import { applySceneTheme } from "./sceneTheme.mjs";
import { conicCameraFov } from "./conicCamera.mjs";
import { buretteReadingHeight } from "./buretteScale.mjs";
import { cellCloseupCamera, cellCameraFov } from "./cellCamera.mjs";
import { fitCellCamera } from "./CellFraming.js";
import { frameTitration, frameApparatus } from "./TitrationFraming.js";
import { addCircuitRoom } from "./CircuitRoom.js";
import { scheduleCellMaterialWarmup } from "./CellMaterialWarmup.js";
import {
  captureOrbit,
  createCellCameraTransition,
  reduceCellCameraMotion,
} from "./CellCameraTransition.js";
import { frameFocusBounds } from "./PrecipitationCamera.js";
import { frameDilution } from "./DilutionCamera.js";
import { frameIncline } from "./InclineCamera.js";
import { opticalCameraFov, opticalScreenViewOffset } from "./opticalCamera.mjs";
import { updateForestLod } from "./ForestLod.js";
import { installMicroscopeHover } from "./MicroscopeHover.js";
import { circuitHoverAction } from "./CircuitHover.js";
import { cellHoverAction, isCellPickable } from "./CellHover.js";
import { moleculeGeometry } from "./moleculeGeometry.mjs";
import { addMoleculeAnnotations } from "./MoleculeAnnotations.js";
import { addMoleculeLonePairs } from "./MoleculeLonePairs.js";
import { createMoleculeEnsemble } from "./MoleculeEnsemble.js";
import { disposeSceneResources } from "./disposeSceneResources.mjs";
import { buildPlateScene } from "./PlateScene.js";
import { setPlateVisibility } from "./plateVisibility.mjs";
import { threeIds } from "./sceneCatalog.mjs";
import {
  circuitViews,
  circuitDetailFov,
  rcDetailViews,
} from "./circuitViews.mjs";
import { solubilityViews } from "./solubilityViews.mjs";
import { buildTitrationLab } from "./TitrationLab.js";
import { dilutionViews, dilutionCloseViews } from "./dilutionViews.mjs";
import { opticalScale, opticalAxis } from "./opticalModel.mjs";
import { installMicroscopeKnobDrag } from "./MicroscopeKnobDrag.js";
import { firstVisibleHit } from "./visibleSceneHit.mjs";
import { installSceneClick } from "./sceneClick.mjs";
import EcologyObservation from "./EcologyObservation.jsx";
import { installMicroscopeSlideDrag } from "./MicroscopeSlideDrag.js";
import { installOpticalDrag } from "./OpticalDrag.js";
import { microscopeParts } from "./microscopeParts.mjs";
import { northScreenAngle } from "./terrainCompass.mjs";
import { buildRiverFlow, updateRiverFlow } from "./RiverFlow.js";
import {
  buildTerrainProjection,
  updateTerrainProjection,
} from "./TerrainProjection.js";
import { TERRAIN_SCALE, TEACHING_BASIN } from "./terrainWorld.mjs";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { subscribeTerrainTexture } from "./TerrainTextures.js";
import { buildTerrainSurface } from "./TerrainSurface.js";
import {
  contourSegments,
  terrainSection,
  terrainHeightAt,
  solar,
  rad,
} from "./models.mjs";
import {
  addStudio,
  atmosphere,
  surfaceTexture,
  terrainDetails,
  earthTexture,
} from "./SceneCraft.js";
import { buildOpticalBench } from "./OpticalBench.js";
import { buildCell } from "./CellModel.js";
import { buildCube } from "./CubeModel.js";
import { buildCircuitBench } from "./CircuitBench.js";
import { buildGlassLab } from "./GlassLab.js";
import { buildAdvanced, advancedBuilders } from "./AdvancedScene.js";
export { threeIds } from "./sceneCatalog.mjs";
export function pickedParameterValue(meta, current, reverse = false) {
  return (
    meta.value ??
    Math.max(
      meta.min ?? 0,
      Math.min(meta.max ?? 100, current + meta.delta * (reverse ? -1 : 1)),
    )
  );
}
const mat = (color, extra = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.65,
    metalness: 0.05,
    ...extra,
  });
function updateContourLines(root, interval) {
  const group = root.getObjectByName("contour-lines");
  group.children.forEach((o) => {
    o.geometry.dispose();
    o.material.dispose();
  });
  group.clear();
  for (let h = interval; h < 2600; h += interval)
    lines(
      group,
      contourSegments(h)
        .flat()
        .map(([x, y, z]) => [x, y / TERRAIN_SCALE + 0.012, z]),
      "#dedbbe",
      0.48,
    );
  root.userData.interval = interval;
}
function mesh(parent, geo, material, pos = [0, 0, 0]) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(...pos);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function sphere(parent, pos, r, color, extra = {}) {
  return mesh(
    parent,
    new THREE.SphereGeometry(r, 36, 24),
    mat(color, extra),
    pos,
  );
}
function rod(parent, a, b, r, color) {
  const start = new THREE.Vector3(...a),
    end = new THREE.Vector3(...b),
    delta = end.clone().sub(start);
  const obj = mesh(
    parent,
    new THREE.CylinderGeometry(r, r, delta.length(), 16),
    mat(color),
    start.add(end).multiplyScalar(0.5).toArray(),
  );
  obj.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    delta.normalize(),
  );
  return obj;
}
function lines(parent, points, color, opacity = 1) {
  const geo = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(...p)),
  );
  const line = new THREE.LineSegments(
    geo,
    new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }),
  );
  parent.add(line);
  return line;
}
function earth(parent, r = 1.6) {
  const g = new THREE.Group();
  parent.add(g);
  const xyz = ([lon, lat]) => {
    let a = rad(lat),
      b = rad(lon);
    return [
      r * 1.009 * Math.cos(a) * Math.cos(b),
      r * 1.009 * Math.sin(a),
      r * 1.009 * Math.cos(a) * Math.sin(b),
    ];
  };
  mesh(
    g,
    new THREE.SphereGeometry(r, 128, 80),
    mat("#ffffff", { map: earthTexture(), roughness: 0.83, metalness: 0 }),
  );
  atmosphere(g, r);
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = [];
    for (let lon = 0; lon < 360; lon += 3)
      pts.push(xyz([lon, lat]), xyz([lon + 3, lat]));
    lines(g, pts, "#a4d1cc", 0.18);
  }
  for (let lon = 0; lon < 360; lon += 30) {
    const pts = [];
    for (let lat = -90; lat < 90; lat += 3)
      pts.push(xyz([lon, lat]), xyz([lon, lat + 3]));
    lines(g, pts, "#a4d1cc", 0.18);
  }
  return g;
}
export function buildScene(root, id, p) {
  if (id === "plates") return buildPlateScene(root, p);
  if (id === "acid") return buildTitrationLab(root, p);
  if (id === "cube") return buildCube(root, p);
  if (advancedBuilders[id]) return buildAdvanced(root, id, p);
  if (id === "ohm") return buildCircuitBench(root, p);
  if (id === "lens") return buildOpticalBench(root, p);
  if (["dilution", "solubility"].includes(id))
    return buildGlassLab(root, id, p);
  if (id === "contour") {
    root.userData.interval = p.interval;
    buildTerrainSurface(root);
    buildTerrainProjection(root);
    terrainDetails(root);
    buildRiverFlow(root);
    const plane = mesh(
      root,
      new THREE.PlaneGeometry(6.3, 6.3),
      mat("#8fc6e8", {
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      [0, p.level / TERRAIN_SCALE, 0],
    );
    plane.rotation.x = -Math.PI / 2;
    plane.name = "cut-plane";
    plane.castShadow = plane.receiveShadow = false;
    const contours = new THREE.Group();
    contours.name = "contour-lines";
    root.add(contours);
    updateContourLines(root, p.interval);
    const selected = lines(
      root,
      contourSegments(p.level)
        .flat()
        .map(([x, y, z]) => [x, y / TERRAIN_SCALE + 0.025, z]),
      "#f6f4dc",
    );
    selected.name = "selected-contour";
    const section = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        terrainSection(p.section ?? 50, p.sectionAngle ?? 0).map(
          ([x, y, z]) => new THREE.Vector3(x, y / TERRAIN_SCALE + 0.035, z),
        ),
      ),
      new THREE.LineBasicMaterial({ color: "#81ddf5", depthTest: false }),
    );
    section.name = "terrain-section";
    section.renderOrder = 8;
    root.add(section);
    root.position.y = -1;
  } else if (id === "molecule") {
    const { points, types, faces } = moleculeGeometry(p.type, p.spread);
    points.forEach((pt, i) =>
      sphere(
        root,
        pt,
        types[i] === "H" ? 0.36 : 0.55,
        types[i] === "H"
          ? "#e8eee4"
          : types[i] === "O"
            ? "#c96451"
            : types[i] === "N"
              ? "#4d83ce"
              : "#41525c",
        { roughness: 0.17, metalness: 0.14 },
      ),
    );
    points.slice(1).forEach((pt) => {
      if (p.type === 1) {
        rod(root, [0, 0.12, 0], [pt[0], 0.12, 0], 0.07, "#bcc6c4");
        rod(root, [0, -0.12, 0], [pt[0], -0.12, 0], 0.07, "#bcc6c4");
      } else rod(root, [0, 0, 0], pt, 0.11, "#bdc6bd");
    });
    const original = [...root.children];
    const updateEnsemble = createMoleculeEnsemble(root, original);
    const annotations = addMoleculeAnnotations(root, points, types, p.spread);
    const lonePairs = addMoleculeLonePairs(root, p.type, p.spread);
    const scaffold = new THREE.Group();
    scaffold.name = "molecule-scaffold";
    const positions = faces.flatMap((face) => face.flatMap((i) => points[i]));
    if (positions.length) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      scaffold.add(
        new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({
            color: "#d1a352",
            transparent: true,
            opacity: 0.09,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        ),
      );
      const edges = new THREE.EdgesGeometry(geometry);
      scaffold.add(
        new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({
            color: "#d1a352",
            transparent: true,
            opacity: 0.55,
          }),
        ),
      );
    }
    root.add(scaffold);
    root.userData.update = (q) => {
      if (q.type !== p.type || q.spread !== p.spread) return false;
      scaffold.visible = !q.ensemble && q.scaffold === 1;
      annotations.visible = !q.ensemble && q.annotations !== 0;
      lonePairs.visible = !q.ensemble && q.lonePairs === 1;
      original.forEach((o) => (o.visible = !q.ensemble));
      root.rotation.y = q.ensemble ? 0 : (q.time || 0) * 0.3;
      updateEnsemble(!!q.ensemble, q.time || 0);
    };
    root.userData.update(p);
  } else if (id === "cell") {
    buildCell(root, p);
  } else if (id === "seasons") {
    const q = solar(p.day, p.lat),
      a = q.lambda;
    const orbit = [];
    for (let i = 0; i < 180; i++) {
      let b = (i * Math.PI) / 90,
        c = ((i + 1) * Math.PI) / 90;
      orbit.push(
        [Math.cos(b) * 3.4, 0, Math.sin(b) * 3.4],
        [Math.cos(c) * 3.4, 0, Math.sin(c) * 3.4],
      );
    }
    lines(root, orbit, "#7b9a9c", 0.5);
    sphere(root, [0, 0, 0], 0.65, "#ffcf73", {
      emissive: "#ffb439",
      emissiveIntensity: 1,
    });
    const location = new THREE.Group();
    root.add(location);
    location.position.set(3.4 * Math.cos(a), 0, 3.4 * Math.sin(a));
    const tilt = new THREE.Group();
    location.add(tilt);
    tilt.rotation.x = -rad(23.44);
    earth(tilt, 0.68);
    rod(tilt, [0, -1, 0], [0, 1, 0], 0.012, "#e1e9de");
    const localSun = new THREE.Vector3(
      -Math.cos(a),
      0,
      -Math.sin(a),
    ).applyAxisAngle(new THREE.Vector3(1, 0, 0), rad(23.44));
    const longitude = Math.atan2(localSun.z, localSun.x),
      latitude = rad(p.lat);
    const marker = sphere(
      tilt,
      [
        0.7 * Math.cos(latitude) * Math.cos(longitude),
        0.7 * Math.sin(latitude),
        0.7 * Math.cos(latitude) * Math.sin(longitude),
      ],
      0.035,
      "#fbd788",
      { emissive: "#fbd788", emissiveIntensity: 0.5 },
    );
    const sun = new THREE.PointLight("#fff4d7", 65, 20, 2);
    root.add(sun);
    const axis = new THREE.Vector3(1, 0, 0);
    root.userData.update = (state) => {
      const angle = solar(state.day, state.lat).lambda;
      location.position.set(3.4 * Math.cos(angle), 0, 3.4 * Math.sin(angle));
      localSun
        .set(-Math.cos(angle), 0, -Math.sin(angle))
        .applyAxisAngle(axis, rad(23.44));
      const longitude = Math.atan2(localSun.z, localSun.x),
        latitude = rad(state.lat);
      marker.position.set(
        0.7 * Math.cos(latitude) * Math.cos(longitude),
        0.7 * Math.sin(latitude),
        0.7 * Math.cos(latitude) * Math.sin(longitude),
      );
    };
    // Fixed axis toward -Z; at lambda=pi/2 north tilts toward the Sun at origin.
  } else if (id === "daynight") {
    const g = earth(root, 1.7);
    g.rotation.y = -rad((p.hour - 12) * 15);
    const loc = new THREE.Vector3(
      1.74 * Math.cos(rad(p.lat)),
      1.74 * Math.sin(rad(p.lat)),
      0,
    );
    const marker = sphere(g, loc.toArray(), 0.065, "#f8cb6c", {
      emissive: "#ffe49c",
      emissiveIntensity: 1,
    });
    rod(root, [0, -2.05, 0], [0, 2.05, 0], 0.012, "#dbe8df");
    root.userData.update = (state) => {
      g.rotation.y = -rad((state.hour - 12) * 15);
      marker.position.set(
        1.74 * Math.cos(rad(state.lat)),
        1.74 * Math.sin(rad(state.lat)),
        0,
      );
    };
  }
}
export default function ThreeScene({
  id,
  p,
  view = "perspective",
  small = false,
  preview = false,
  onPreviewError,
  onChange,
  t = 0,
  running = false,
  dosePulse = 0,
  onToggleSupply,
  onToggleDosing,
  onViewChange,
  onUseDiagram,
}) {
  const { theme } = useTheme();
  const latest = useRef({
    p,
    view,
    onChange,
    onToggleSupply,
    onToggleDosing,
    onViewChange,
  });
  const previousDosePulse = useRef({ id, value: dosePulse });
  latest.current = {
    p,
    view,
    onChange,
    onToggleSupply,
    onToggleDosing,
    onViewChange,
  };
  const [instrumentQualities, setInstrumentQualities] = useState(() => {
    return Object.fromEntries(
      threeIds
        .filter((name) => name !== "contour")
        .map((name) => {
          try {
            return [
              name,
              localStorage.getItem(`zhijing:${name}:quality`) === "detail"
                ? "detail"
                : "fluent",
            ];
          } catch {
            return [name, "fluent"];
          }
        }),
    );
  });
  const instrumentQuality = preview ? "fluent" : instrumentQualities[id];
  const setInstrumentQuality = (quality) =>
    setInstrumentQualities((previous) => ({ ...previous, [id]: quality }));
  const compass = useRef(null);
  const partMarker = useRef(null);
  const reagentLabel = useRef(null);
  const reagentLeader = useRef(null);
  const microscopeHint = useRef(null);
  const instrumentView = useRef(null);
  const [partCloseup, setPartCloseup] = useState(false);
  function focusInstrumentPart() {
    const e = engine.current;
    if (!e) return;
    const part = microscopeParts[partIndex];
    const node = part.node ? e.root.getObjectByName(part.node) : e.root;
    if (!node) return;
    if (!instrumentView.current)
      instrumentView.current = {
        position: e.camera.position.clone(),
        target: e.controls.target.clone(),
      };
    const target = node.localToWorld(new THREE.Vector3(...part.point));
    const direction =
      partIndex >= 3
        ? new THREE.Vector3(-1, 0.35, 0.7)
        : new THREE.Vector3(0.5, 0.5, 1);
    // OrbitControls minimum distance is retained; focus changes composition,
    // never the microscope's optical magnification or experiment parameters.
    direction.setLength(partIndex === 2 ? 5.8 : 4.4);
    if (part.cameraOffset) direction.fromArray(part.cameraOffset);
    e.controls.target.copy(target);
    e.camera.position.copy(target).add(direction);
    e.controls.update();
    e.invalidate();
    setPartCloseup(true);
    if (window.matchMedia("(max-width: 900px)").matches)
      host.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function restoreInstrumentView() {
    const e = engine.current,
      saved = instrumentView.current;
    if (!e || !saved) return;
    e.camera.position.copy(saved.position);
    e.controls.target.copy(saved.target);
    e.controls.update();
    e.invalidate();
    instrumentView.current = null;
    setPartCloseup(false);
  }
  const [partIndex, setPartIndex] = useState(0);
  const partAdjustment = microscopeParts[partIndex].adjustment;
  const partValue = partAdjustment
    ? (p[partAdjustment.key] ?? partAdjustment.fallback ?? 50)
    : 0;
  const [partsOpen, setPartsOpen] = useState(false);
  const [ecologySelection, setEcologySelection] = useState(null);
  useEffect(() => {
    const key = {
      plant: "plants",
      insect: "insects",
      bird: "birds",
      fungus: "fungi",
    }[ecologySelection];
    if (id !== "biodiversity" || (key && !p[key])) setEcologySelection(null);
  }, [id, p.plants, p.insects, p.birds, p.fungi, ecologySelection]);
  const [accessoriesVisible, setAccessoriesVisible] = useState(true);
  const [roomVisible, setRoomVisible] = useState(true);
  const roomVisibleRef = useRef(true);
  roomVisibleRef.current = roomVisible;
  const [plateVisibility, setPlateDisplay] = useState({
    vegetation: true,
    markers: true,
    arrows: true,
  });
  const trackingScreen = useRef(false);
  const screenPosition = id === "lens" && view === "screen" ? p.screen : null;
  const selectedPart = useRef({ partIndex, partsOpen });
  selectedPart.current = { partIndex, partsOpen };
  useEffect(() => {
    engine.current?.invalidate();
  }, [partIndex, partsOpen]);
  const host = useRef(null),
    engine = useRef(null),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let renderer,
      controls,
      ro,
      frame,
      lost,
      disposeStudio,
      disposeSlideDrag,
      disposeOpticalDrag,
      disposeKnobDrag,
      disposeMicroscopeHover,
      unsubscribeTerrainTexture,
      invalidate,
      disposePicking,
      cancelMaterialWarmup,
      visibility;
    let active = true;
    let scene, root, camera;
    const node = host.current;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1));
      renderer.shadowMap.enabled = !preview && id !== "contour";
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // Cell orbiting changes only the camera; its fixed lights and geometry
      // share one shadow map until the model, inspection or quality changes.
      // Ecology shadows depend on specimen state, not the orbit camera.
      // Parameter/time and quality effects below explicitly invalidate them.
      renderer.shadowMap.autoUpdate = ![
        "cell",
        "biodiversity",
        "acid",
        "microscope",
      ].includes(id);
      renderer.shadowMap.needsUpdate = true;
      renderer.setClearColor(
        id === "contour" || id === "seasons" || id === "daynight"
          ? "#102f31"
          : "#eef1e7",
        1,
      );
      renderer.domElement.setAttribute("aria-label", "可旋转的三维教学模型");
      renderer.domElement.setAttribute("role", "img");
      node.appendChild(renderer.domElement);
      scene = new THREE.Scene();
      disposeStudio = addStudio(scene, renderer, id);
      const circuitRoom = id === "ohm" ? addCircuitRoom(scene) : null;
      root = new THREE.Group();
      scene.add(root);
      camera = new THREE.PerspectiveCamera(
        id === "seasons"
          ? 36
          : id === "conics"
            ? 32
            : id === "daynight"
              ? 20
              : id === "molecule"
                ? 26
                : [
                      "contour",
                      "cell",
                      "seasons",
                      "dilution",
                      "solubility",
                      "microscope",
                      "solids",
                      "capacitor",
                    ].includes(id)
                  ? 28
                  : ["contour", "ohm", "incline"].includes(id)
                    ? 34
                    : 38,
        1,
        0.1,
        100,
      );
      camera.position.set(
        ...(id === "conics"
          ? [-5, 4.6, 9]
          : id === "acid"
            ? [4.8, 4.94, 11.2]
            : id === "dilution"
              ? dilutionViews.perspective
              : id === "volcano"
                ? [-4.8, 6, 13.2]
                : [
                      "ohm",
                      "dilution",
                      "solubility",
                      "lens",
                      "solids",
                      "incline",
                      "capacitor",
                    ].includes(id)
                  ? [4.5, 4, 10]
                  : id === "contour"
                    ? [3.6, 5.4, 13.6]
                    : id === "molecule"
                      ? [5, 3, 8]
                      : [7, 6, 9]),
      );
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = preview;
      controls.autoRotateSpeed = 0.55;
      controls.enabled = !preview;
      controls.enablePan = false;
      controls.minDistance = 4;
      controls.maxDistance = 18;
      controls.target.set(
        0,
        id === "conics"
          ? 1.1
          : id === "acid"
            ? 1.5
            : id === "contour"
              ? -0.6
              : id === "ohm"
                ? -0.2
                : id === "dilution"
                  ? 0.9
                  : id === "incline"
                    ? 0.65
                    : id === "volcano"
                      ? 1.3
                      : id === "precipitation"
                        ? 1.35
                        : 0.3,
        id === "ohm" ? 0.7 : id === "cube" ? 1 - p.fold / 100 : 0,
      );
      controls.update();
      scene.add(
        new THREE.AmbientLight(
          "#dceadf",
          id === "daynight"
            ? 0.03
            : ["seasons", "contour"].includes(id)
              ? 0.2
              : id === "biodiversity"
                ? 0.22
                : id === "solubility"
                  ? 0.3
                  : 0.65,
        ),
      );
      if (id !== "seasons") {
        const sun = new THREE.DirectionalLight(
          "#fff4d8",
          id === "daynight" ? 3 : id === "contour" ? 2.1 : 2.2,
        );
        sun.position.set(
          id === "daynight"
            ? 10
            : ["contour", "solubility", "biodiversity"].includes(id)
              ? -4
              : 5,
          id === "daynight" ? 0 : id === "biodiversity" ? 5 : 9,
          id === "daynight" ? 0 : 5,
        );
        sun.castShadow = id !== "daynight";
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.left = sun.shadow.camera.bottom = -7;
        sun.shadow.camera.right = sun.shadow.camera.top = 7;
        sun.shadow.normalBias = ["contour", "biodiversity"].includes(id)
          ? 0.006
          : 0.025;
        if (id === "biodiversity") {
          // Cover the sample plot and flight paths without wasting shadow texels.
          sun.shadow.camera.left = sun.shadow.camera.bottom = -5;
          sun.shadow.camera.right = sun.shadow.camera.top = 5;
          sun.shadow.camera.near = 0.5;
          sun.shadow.camera.far = 20;
        }
        sun.shadow.bias = -0.0001;
        scene.add(sun);
      }
      const cellCameraTransition =
        id === "cell" ? createCellCameraTransition(camera, controls) : null;
      controls.addEventListener("start", () => cellCameraTransition?.cancel());
      let lastRender = 0,
        flowTime = 0,
        shadowPasses = 0,
        presetFrames = 0;
      // Continue only while controls or scene mechanics are actually moving.
      const render = () => {
        frame = null;
        if (!active || document.hidden) return;
        if (circuitRoom)
          circuitRoom.visible =
            roomVisibleRef.current && camera.position.z > controls.target.z + 1;
        const flow =
          id === "contour" && latest.current.p.flow && latest.current.p.water;
        const now = performance.now();
        if ((flow || preview) && now - lastRender < 1000 / 30) {
          if (!frame) frame = requestAnimationFrame(render);
          return;
        }
        if (flow) flowTime += Math.min(0.1, (now - lastRender) / 1000);
        lastRender = now;
        const mechanicalMotion =
          root.userData.animate?.(
            now,
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          ) || false;
        if (["acid", "microscope"].includes(id) && root.userData.shadowDirty) {
          renderer.shadowMap.needsUpdate = true;
          root.userData.shadowDirty = false;
        }
        if (id === "microscope")
          renderer.domElement.dataset.mechanicalMotion =
            String(mechanicalMotion);
        if (id === "contour") updateRiverFlow(root, flowTime, !!flow);
        const presetMotion =
          cellCameraTransition?.sample(
            now,
            reduceCellCameraMotion(
              latest.current.p.cellMotion,
              window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            ),
          ) || false;
        const cameraMotion = controls.update(preview ? 1 / 30 : undefined);
        if (id === "cell")
          renderer.domElement.dataset.cameraTransition = String(presetMotion);
        if (presetMotion)
          renderer.domElement.dataset.cameraTransitionFrames = String(
            ++presetFrames,
          );
        if (id === "contour") {
          renderer.domElement.dataset.forestLod = updateForestLod(
            root,
            camera,
            controls.target,
            node.clientHeight,
            latest.current.p,
          );
          renderer.domElement.dataset.detailedForest = String(
            !!root.getObjectByName("mountain-conifer-forest"),
          );
        }
        root.userData.beforeRender?.(camera, node.clientHeight);
        if (
          renderer.shadowMap.enabled &&
          (renderer.shadowMap.autoUpdate || renderer.shadowMap.needsUpdate)
        )
          shadowPasses++;
        renderer.render(scene, camera);
        if (id === "cell" && !cancelMaterialWarmup)
          cancelMaterialWarmup = scheduleCellMaterialWarmup(
            renderer,
            scene,
            camera,
          );
        if (id === "cell") {
          const painted = performance.now();
          renderer.domElement.dataset.frameCpuMs = (painted - now).toFixed(1);
          if (presetMotion)
            renderer.domElement.dataset.cameraPeakFrameCpuMs = Math.max(
              Number(renderer.domElement.dataset.cameraPeakFrameCpuMs || 0),
              painted - now,
            ).toFixed(1);
          const preparation = cellCameraTransition.painted(painted);
          if (preparation !== null)
            renderer.domElement.dataset.cameraPreparationMs =
              preparation.toFixed(1);
        }
        renderer.domElement.dataset.shadowPasses = String(shadowPasses);
        if (
          ["precipitation", "volcano"].includes(id) &&
          reagentLabel.current &&
          reagentLeader.current
        ) {
          const point = root
            .localToWorld(new THREE.Vector3(-0.67, 3.5, -0.15))
            .project(camera);
          const visible =
            point.z > -1 &&
            point.z < 1 &&
            Math.abs(point.x) < 1 &&
            Math.abs(point.y) < 1;
          reagentLabel.current.style.visibility = visible
            ? "visible"
            : "hidden";
          reagentLeader.current.style.visibility = visible
            ? "visible"
            : "hidden";
          if (visible) {
            const w = node.clientWidth,
              h = node.clientHeight;
            const x = ((point.x + 1) * w) / 2,
              y = ((1 - point.y) * h) / 2;
            const labelWidth = w < 480 ? 144 : 168;
            const left = Math.max(
              12,
              Math.min(w - labelWidth - 12, x - labelWidth - 37),
            );
            const top = Math.max(100, Math.min(h - 90, y - 28));
            reagentLabel.current.style.transform = `translate(${left}px, ${top}px)`;
            reagentLabel.current.style.width = `${labelWidth}px`;
            reagentLeader.current.setAttribute(
              "d",
              `M ${left + labelWidth} ${top + 28} L ${x} ${y}`,
            );
          }
        }
        if (
          id === "microscope" &&
          partMarker.current &&
          selectedPart.current.partsOpen
        ) {
          const part = microscopeParts[selectedPart.current.partIndex];
          const target = part.node ? root.getObjectByName(part.node) : root;
          if (target) {
            const point = target
              .localToWorld(new THREE.Vector3(...part.point))
              .project(camera);
            const visible =
              point.z > -1 &&
              point.z < 1 &&
              Math.abs(point.x) < 1 &&
              Math.abs(point.y) < 1;
            partMarker.current.style.visibility = visible
              ? "visible"
              : "hidden";
            partMarker.current.style.left = `${((point.x + 1) / 2) * host.current.clientWidth}px`;
            partMarker.current.style.top = `${((1 - point.y) / 2) * host.current.clientHeight}px`;
          }
        }
        if (id === "contour" && compass.current) {
          const angle = northScreenAngle(camera.matrixWorldInverse.elements);
          compass.current.style.transform = `rotate(${angle ?? 0}deg)`;
          compass.current.style.opacity = angle === null ? "0.25" : "1";
        }
        renderer.domElement.dataset.triangles = String(
          renderer.info.render.triangles,
        );
        renderer.domElement.dataset.drawCalls = String(
          renderer.info.render.calls,
        );
        renderer.domElement.dataset.renderFrames = String(
          renderer.info.render.frame,
        );
        if (
          (preview ||
            flow ||
            mechanicalMotion ||
            cameraMotion ||
            presetMotion) &&
          !frame
        )
          frame = requestAnimationFrame(render);
      };
      invalidate = () => {
        if (!active || document.hidden) return;
        if (!frame) frame = requestAnimationFrame(render);
      };
      controls.addEventListener("change", invalidate);
      visibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = null;
        } else invalidate();
      };
      document.addEventListener("visibilitychange", visibility);
      disposePicking = installSceneClick(renderer.domElement, (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const ray = new THREE.Raycaster();
        ray.setFromCamera(
          new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            1 - ((event.clientY - rect.top) / rect.height) * 2,
          ),
          camera,
        );
        if (id === "contour") {
          const surface = root.getObjectByName("terrain-surface");
          if (!surface || !latest.current.p.measure) return;
          const hit = ray.intersectObject(surface, false)[0];
          if (hit) {
            const point = root.worldToLocal(hit.point.clone());
            latest.current.onChange?.("probe", {
              x: point.x,
              z: point.z,
              h: terrainHeightAt(point.x, point.z),
              slope: THREE.MathUtils.radToDeg(
                Math.acos(
                  THREE.MathUtils.clamp(Math.abs(hit.face.normal.y), 0, 1),
                ),
              ),
            });
          }
          return;
        }
        const intersections = ray.intersectObject(root, true);
        const hit = firstVisibleHit(
          ["lens", "ohm", "cell"].includes(id)
            ? intersections.filter((hit) =>
                id === "cell" ? isCellPickable(hit.object) : hit.object.isMesh,
              )
            : intersections,
        );
        if (hit?.object.userData.action === "switch")
          latest.current.onChange?.("closed", latest.current.p.closed ? 0 : 1);
        let target = hit?.object;
        while (target && !target.userData.action) target = target.parent;
        if (id === "biodiversity") {
          setEcologySelection(target?.userData.specimenKind ?? null);
          return;
        }
        if (id === "dilution" && target?.userData.action === "balance-view")
          latest.current.onViewChange?.(target.userData.view);
        if (target?.userData.action === "water-supply")
          latest.current.onToggleSupply?.();
        if (
          ["titration-valve", "precipitation-valve"].includes(
            target?.userData.action,
          )
        )
          latest.current.onToggleDosing?.();
        if (target?.userData.action === "parameter") {
          const { key } = target.userData;
          latest.current.onChange?.(
            key,
            pickedParameterValue(
              target.userData,
              latest.current.p[key],
              event.shiftKey,
            ),
          );
        }
      });
      if (["microscope", "ohm", "cell", "capacitor"].includes(id))
        disposeMicroscopeHover = installMicroscopeHover({
          element: renderer.domElement,
          camera,
          root,
          meshesOnly: ["ohm", "cell", "capacitor"].includes(id),
          pickable: id === "cell" ? isCellPickable : undefined,
          resolveAction: ["ohm", "capacitor"].includes(id)
            ? (object) => circuitHoverAction(object, latest.current.p)
            : id === "cell"
              ? (object) =>
                  cellHoverAction(
                    object,
                    ["perspective", "front", "top"].includes(
                      latest.current.view,
                    )
                      ? 0
                      : latest.current.p.part,
                  )
              : undefined,
          onHint: (text) => {
            if (microscopeHint.current) {
              microscopeHint.current.textContent = text;
              microscopeHint.current.hidden = !text;
            }
          },
        });
      if (id === "microscope")
        disposeKnobDrag = installMicroscopeKnobDrag({
          element: renderer.domElement,
          camera,
          root,
          controls,
          getParams: () => latest.current.p,
          onChange: (key, value) => latest.current.onChange?.(key, value),
        });
      if (id === "microscope")
        disposeSlideDrag = installMicroscopeSlideDrag({
          element: renderer.domElement,
          camera,
          root,
          controls,
          getParams: () => latest.current.p,
          onChange: (key, value) => latest.current.onChange?.(key, value),
        });
      if (id === "lens")
        disposeOpticalDrag = installOpticalDrag({
          element: renderer.domElement,
          camera,
          root,
          controls,
          getParams: () => latest.current.p,
          onChange: (key, value) => latest.current.onChange?.(key, value),
        });
      renderer.domElement.dataset.modelGeneration = String(Date.now());
      engine.current = {
        root,
        scene,
        camera,
        controls,
        renderer,
        invalidate,
        clearHover: disposeMicroscopeHover?.clear,
        cellCameraTransition,
      };
      const initialFov = camera.fov;
      ro = new ResizeObserver(() => {
        const w = node.clientWidth,
          h = node.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        if (
          (id === "ohm" && circuitViews[latest.current.view]) ||
          (id === "capacitor" && rcDetailViews[latest.current.view])
        ) {
          camera.fov = circuitDetailFov(camera.aspect);
        } else if (id === "lens") {
          camera.fov = opticalCameraFov(initialFov, camera.aspect);
        } else if (
          id === "precipitation" &&
          root.userData.focusBounds?.[latest.current.view]
        ) {
          camera.fov = 40;
        } else if (id === "conics") {
          camera.fov = conicCameraFov(initialFov, camera.aspect);
        } else if (id === "cell") {
          camera.fov = cellCameraFov(initialFov, camera.aspect);
        } else if (id === "contour") {
          camera.fov = THREE.MathUtils.radToDeg(
            2 *
              Math.atan(
                Math.tan(THREE.MathUtils.degToRad(initialFov) / 2) *
                  Math.max(
                    1,
                    (camera.aspect < 0.85 ? 1.35 : 1.65) / camera.aspect,
                  ),
              ),
          );
        } else if (
          [
            "ohm",
            "dilution",
            "solubility",
            "acid",
            "lens",
            ...Object.keys(advancedBuilders),
          ].includes(id)
        ) {
          camera.fov = THREE.MathUtils.radToDeg(
            2 *
              Math.atan(
                Math.tan(THREE.MathUtils.degToRad(initialFov) / 2) *
                  Math.max(1, 1.85 / camera.aspect),
              ),
          );
        }
        camera.updateProjectionMatrix();
        if (id === "lens" && latest.current.view === "screen") {
          const offset = camera.position.clone().sub(controls.target);
          const fitted = opticalScreenViewOffset(
            camera.fov,
            camera.aspect,
            offset,
          );
          if (offset.length() < fitted.length()) {
            camera.position.copy(controls.target).add(fitted);
            controls.update();
          }
        }
        if (id === "cell")
          cellCameraTransition.refit(
            () => fitCellCamera(camera, root, initialFov),
            performance.now(),
          );
        if (id === "dilution")
          frameDilution(camera, controls, root, latest.current.view, false);
        if (id === "acid")
          frameTitration(camera, controls, root, latest.current.view, false);
        if (
          ["ohm", "capacitor"].includes(id) &&
          ["perspective", "front", "top"].includes(latest.current.view)
        )
          frameApparatus(camera, controls, root, [-5.5, 6.1, 9.1], false);
        if (id === "incline")
          frameIncline(
            camera,
            controls,
            root,
            latest.current.p,
            latest.current.view,
            false,
          );
        if (["precipitation", "volcano"].includes(id))
          frameFocusBounds(camera, controls, root, latest.current.view, false);
        invalidate();
      });
      ro.observe(node);
      if (id === "contour")
        unsubscribeTerrainTexture = subscribeTerrainTexture(invalidate);
      invalidate();
      // The map image loads asynchronously, after the first demand-rendered frame.
      if (["daynight", "seasons"].includes(id)) {
        earthTexture(invalidate);
      }
      lost = (e) => {
        e.preventDefault();
        cancelAnimationFrame(frame);
        active = false;
        setError("三维绘图上下文已丢失，参数与记录仍然保留。");
      };
      renderer.domElement.addEventListener("webglcontextlost", lost);
      setError("");
    } catch (e) {
      setError("三维场景暂不可用，参数与记录仍然保留。可以重新加载场景。");
    }
    return () => {
      active = false;
      cancelMaterialWarmup?.();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
      disposePicking?.();
      ro?.disconnect();
      disposeMicroscopeHover?.();
      disposeSlideDrag?.();
      disposeOpticalDrag?.();
      disposeKnobDrag?.();
      controls?.dispose();
      disposeStudio?.();
      unsubscribeTerrainTexture?.();
      if (lost)
        renderer?.domElement.removeEventListener("webglcontextlost", lost);
      if (scene) disposeSceneResources(scene);
      renderer?.dispose();
      renderer?.forceContextLoss();
      node.replaceChildren();
      engine.current = null;
    };
  }, [id, revision]);
  useEffect(() => {
    const e = engine.current;
    if (!e || !instrumentQuality) return;
    const detailed = instrumentQuality === "detail";
    if (preview) e.renderer.shadowMap.enabled = false;
    if (id === "water") {
      e.renderer.shadowMap.enabled = !preview && detailed;
    }
    e.root.userData.setQuality?.(instrumentQuality);
    const ratio = Math.min(devicePixelRatio, detailed ? 1.5 : 1);
    const shadowSize = detailed ? 2048 : 1024;
    e.renderer.setPixelRatio(ratio);
    e.scene.traverse((object) => {
      if (!object.isLight || !object.shadow) return;
      if (object.shadow.mapSize.x !== shadowSize) {
        object.shadow.map?.dispose();
        object.shadow.mapPass?.dispose();
        object.shadow.map = null;
        object.shadow.mapPass = null;
        object.shadow.mapSize.set(shadowSize, shadowSize);
        object.shadow.needsUpdate = true;
      }
    });
    e.renderer.domElement.dataset.quality = instrumentQuality;
    e.renderer.domElement.dataset.pixelRatio = String(ratio);
    e.renderer.domElement.dataset.shadowSize = String(shadowSize);
    e.renderer.shadowMap.needsUpdate = true;
    e.invalidate();
    try {
      if (!preview)
        localStorage.setItem(`zhijing:${id}:quality`, instrumentQuality);
    } catch {
      /* Display remains usable without browser storage. */
    }
  }, [id, revision, instrumentQuality]);
  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    const sceneParams = {
      ...p,
      time: t,
      addingWater: id === "dilution" && running,
      dosing: ["acid", "precipitation"].includes(id) && running,
    };
    if (id === "cell" && e.root.userData.updateOverlay?.(sceneParams)) {
      e.invalidate();
      return;
    }
    // These scenes change readouts/materials without moving shadow casters.
    if (!["acid", "photosynthesis"].includes(id))
      e.renderer.shadowMap.needsUpdate = true;
    e.invalidate();
    if (id === "cube") {
      e.camera.fov = 42 - (23 * p.fold) / 100;
      e.camera.updateProjectionMatrix();
      e.controls.target.z = 1 - p.fold / 100;
      if (view === "top") e.camera.position.z = e.controls.target.z + 0.01;
      e.controls.update();
    }
    if (e.root.userData.update) {
      const updateStarted = performance.now();
      const updated = e.root.userData.update(sceneParams);
      if (id === "cell")
        e.renderer.domElement.dataset.modelUpdateMs = (
          performance.now() - updateStarted
        ).toFixed(1);
      if (id === "biodiversity" && view === "insect") {
        const insect = e.root.getObjectByName("sample-insect");
        if (insect?.visible) {
          const target = insect.getWorldPosition(new THREE.Vector3());
          e.camera.position.add(target.clone().sub(e.controls.target));
          e.controls.target.copy(target);
          e.controls.update();
        }
      }
      if (id === "precipitation" && view === "volumeReadout") {
        const target = e.root.localToWorld(
          new THREE.Vector3(0, e.root.userData.measurement.surface, 0),
        );
        e.camera.position.add(target.clone().sub(e.controls.target));
        e.controls.target.copy(target);
        e.controls.update();
      }
      if (id === "incline" && view === "block") {
        const block = e.root.getObjectByName("incline-block");
        if (block) {
          const target = block.getWorldPosition(new THREE.Vector3());
          const delta = target.clone().sub(e.controls.target);
          e.camera.position.add(delta);
          e.controls.target.copy(target);
          e.controls.update();
        }
      }
      if (updated !== false) return;
    }
    if (id === "contour") {
      const root = e.root;
      if (!root.getObjectByName("contour-lines")) buildScene(root, id, p);
      if (root.userData.interval !== p.interval)
        updateContourLines(root, p.interval);
      if (
        root.userData.section !== p.section ||
        root.userData.sectionAngle !== p.sectionAngle
      ) {
        const section = root.getObjectByName("terrain-section");
        section.geometry.dispose();
        section.geometry = new THREE.BufferGeometry().setFromPoints(
          terrainSection(p.section ?? 50, p.sectionAngle ?? 0).map(
            ([x, y, z]) => new THREE.Vector3(x, y / TERRAIN_SCALE + 0.035, z),
          ),
        );
        root.userData.section = p.section;
        root.userData.sectionAngle = p.sectionAngle;
      }
      if (root.userData.level !== p.level) {
        const line = root.getObjectByName("selected-contour");
        line.geometry.dispose();
        line.geometry = new THREE.BufferGeometry().setFromPoints(
          contourSegments(p.level)
            .flat()
            .map(
              ([x, y, z]) => new THREE.Vector3(x, y / TERRAIN_SCALE + 0.025, z),
            ),
        );
        root.getObjectByName("cut-plane").position.y = p.level / TERRAIN_SCALE;
        root.userData.level = p.level;
      }
      let probes = root.getObjectByName("terrain-probes");
      if (!probes) {
        probes = new THREE.Group();
        probes.name = "terrain-probes";
        root.add(probes);
        for (const color of ["#ffd78a", "#86e6ff"]) {
          const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 12, 8),
            new THREE.MeshBasicMaterial({ color, depthTest: false }),
          );
          marker.renderOrder = 12;
          probes.add(marker);
        }
      }
      probes.children.forEach((marker, i) => {
        const point = p.probes?.[i];
        marker.visible = !!point;
        if (point)
          marker.position.set(point.x, point.h / TERRAIN_SCALE + 0.04, point.z);
      });
      root.getObjectByName(
        "terrain-surface",
      ).material.userData.displayMode.value =
        p.surfaceMode === "height" ? 1 : p.surfaceMode === "slope" ? 2 : 0;
      updateTerrainProjection(root, p);
      const detailed = p.quality === "detail";
      const visibility = {
        "terrain-boulders": p.rocks !== false,
        "connected-river-and-lake": p.water !== false,
        "terrain-label": p.labels !== false,
        "contour-lines": p.contours !== false,
        "selected-contour": p.contours !== false,
        "cut-plane": p.slice === true,
        "terrain-section": p.profile === true,
      };
      root.traverse((o) => {
        if (o.name in visibility) o.visible = visibility[o.name];
      });
      if (root.userData.quality !== p.quality) {
        e.renderer.setPixelRatio(
          Math.min(devicePixelRatio, detailed ? 1.5 : 1),
        );
        e.renderer.shadowMap.enabled = detailed;
        e.scene.traverse((o) => {
          if (o.material) o.material.needsUpdate = true;
        });
        root.userData.quality = p.quality;
      }
      return;
    }
    disposeSceneResources(e.root);
    e.root.clear();
    e.root.userData = {};
    buildScene(e.root, id, sceneParams);
    e.root.userData.setQuality?.(
      e.renderer.domElement.dataset.quality || "fluent",
    );
    e.renderer.domElement.dataset.sceneObjects = String(e.root.children.length);
  }, [id, p, t, revision, running]);
  useEffect(() => {
    const previous = previousDosePulse.current;
    previousDosePulse.current = { id, value: dosePulse };
    if (id !== "acid" || previous.id !== id || dosePulse <= previous.value)
      return;
    const e = engine.current;
    e?.root.userData.emitDoseDrop?.();
    e?.invalidate();
  }, [id, dosePulse]);
  useEffect(() => {
    if (id !== "microscope") return;
    const e = engine.current;
    const accessories = e?.root.getObjectByName("microscope-accessories");
    if (accessories) {
      accessories.visible = accessoriesVisible;
      e.renderer.shadowMap.needsUpdate = true;
      e.renderer.domElement.dataset.accessories = String(accessoriesVisible);
      e.invalidate();
    }
  }, [id, revision, accessoriesVisible]);
  useEffect(() => {
    const e = engine.current;
    if (!e || id !== "plates") return;
    setPlateVisibility(e.root, plateVisibility);
    e.renderer.domElement.dataset.plateLayers = JSON.stringify(plateVisibility);
    e.invalidate();
  }, [id, revision, plateVisibility]);
  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    if (id === "cell") {
      e.clearHover?.();
      e.renderer.shadowMap.needsUpdate = true;
    }
    const previousCellOrbit =
      id === "cell" ? captureOrbit(e.camera, e.controls) : null;
    e.cellCameraTransition?.cancel();
    const previousCellInspection = e.root.userData.getInspection?.();
    const finishCellView = () => {
      const fitStarted = performance.now();
      fitCellCamera(e.camera, e.root);
      e.renderer.domElement.dataset.cameraFitMs = (
        performance.now() - fitStarted
      ).toFixed(1);
      e.renderer.domElement.dataset.cameraPeakFrameCpuMs = "0";
      if (
        e.hasCellView &&
        !reduceCellCameraMotion(
          p.cellMotion,
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        )
      ) {
        const destinationPart = e.root.userData.getInspection?.();
        const showContext =
          previousCellInspection !== destinationPart && destinationPart > 0;
        const showDestination = () => {
          e.root.userData.setInspection(destinationPart);
          e.renderer.shadowMap.needsUpdate = true;
        };
        e.cellCameraTransition.begin(
          previousCellOrbit,
          captureOrbit(e.camera, e.controls),
          performance.now(),
          showContext
            ? {
                settle: showDestination,
                beforeFit: () => e.root.userData.setInspection(destinationPart),
                afterFit: () => e.root.userData.setInspection(0),
              }
            : {},
        );
        if (showContext) e.root.userData.setInspection(0);
      }
      e.hasCellView = true;
      e.controls.update();
      e.invalidate();
    };
    if (id === "microscope") {
      instrumentView.current = null;
      setPartCloseup(false);
    }
    if (id === "lens")
      e.root.userData.setOpticalScreenView?.(view === "screen");
    if (id === "lens" && view === "screen") {
      if (!e.controls.enabled) return;
      const target = e.root.localToWorld(
        new THREE.Vector3((p.screen ?? 15) * opticalScale, opticalAxis, 0),
      );
      const offset =
        trackingScreen.current === e
          ? e.camera.position.clone().sub(e.controls.target)
          : opticalScreenViewOffset(e.camera.fov, e.camera.aspect);
      e.controls.minDistance = 0.8;
      e.controls.target.copy(target);
      e.camera.position.copy(target).add(offset);
      e.controls.update();
      e.invalidate();
      trackingScreen.current = e;
      return;
    }
    trackingScreen.current = false;
    e.controls.minDistance =
      id === "ohm" ? (circuitViews[view]?.minDistance ?? 4) : 4;
    if (id === "ohm" && circuitViews[view]) {
      e.camera.fov = circuitDetailFov(e.camera.aspect);
      e.camera.updateProjectionMatrix();
      e.controls.target.set(...circuitViews[view].target);
      e.camera.position.set(...circuitViews[view].position);
      e.controls.update();
      e.invalidate();
      return;
    }
    if (
      ["ohm", "capacitor"].includes(id) &&
      ["perspective", "front", "top"].includes(view)
    ) {
      const direction =
        view === "front"
          ? [0, 0, 1]
          : view === "top"
            ? [0, 1, 0.001]
            : [-5.5, 6.1, 9.1];
      frameApparatus(e.camera, e.controls, e.root, direction);
      e.invalidate();
      return;
    }
    if (id === "solubility" && solubilityViews[view]) {
      const preset = solubilityViews[view];
      e.controls.minDistance = preset.minDistance;
      e.controls.target.set(...preset.target);
      e.camera.position.set(...preset.position);
      e.controls.update();
      e.invalidate();
      return;
    }
    if (
      ["precipitation", "volcano"].includes(id) &&
      frameFocusBounds(e.camera, e.controls, e.root, view)
    ) {
      e.invalidate();
      return;
    }
    if (["precipitation", "volcano"].includes(id)) {
      e.camera.fov = THREE.MathUtils.radToDeg(
        2 *
          Math.atan(
            Math.tan(THREE.MathUtils.degToRad(38) / 2) *
              Math.max(1, 1.85 / e.camera.aspect),
          ),
      );
      e.camera.updateProjectionMatrix();
    }
    if (id === "cell")
      e.root.userData.setInspection?.(
        view === "nucleus"
          ? 1
          : view === "vacuole"
            ? 2
            : view === "chloroplast"
              ? 3
              : view === "mitochondrion"
                ? 4
                : view === "golgi"
                  ? 5
                  : view === "reticulum"
                    ? 6
                    : 0,
      );

    if (id === "capacitor" && rcDetailViews[view]) {
      const preset = rcDetailViews[view];
      e.camera.fov = circuitDetailFov(e.camera.aspect);
      e.camera.updateProjectionMatrix();
      e.controls.minDistance = preset.minDistance;
      e.controls.target.set(...preset.target);
      e.camera.position.set(...preset.position);
      e.controls.update();
      e.invalidate();
      return;
    }

    const cellCamera =
      id === "cell" ? cellCloseupCamera(view, p.cellAngle) : null;
    if (cellCamera) {
      e.controls.minDistance = cellCamera.minDistance;
      e.controls.target.set(...cellCamera.target);
      e.camera.position.set(...cellCamera.position);
      e.controls.update();
      finishCellView();
      return;
    }
    if (id === "cell" && view === "perspective") {
      e.controls.target.set(0, -0.25, 0);
      e.camera.position.set(4.4, 5.5, 7);
      e.controls.update();
      finishCellView();
      return;
    }

    if (id === "biodiversity" && ["plant", "fungus", "insect"].includes(view)) {
      const fungus = view === "fungus";
      const insect = view === "insect";
      const plant = e.root.getObjectByName(
        insect ? "sample-insect" : fungus ? "sample-fungus" : "sample-plant",
      );
      if (plant) {
        e.controls.minDistance = insect ? 0.4 : fungus ? 0.35 : 0.8;
        e.controls.target
          .copy(plant.position)
          .add(new THREE.Vector3(0, insect ? 0 : fungus ? 0.18 : 0.38, 0));
        e.camera.position
          .copy(e.controls.target)
          .add(
            insect
              ? new THREE.Vector3(0.65, 0.8, 1.1)
              : fungus
                ? new THREE.Vector3(0.75, -0.1, 0.9)
                : new THREE.Vector3(-1.6, 0.55, -1.05),
          );
        e.controls.update();
        e.invalidate();
        return;
      }
    }
    if (id === "contour" && view === "basin") {
      const { x, z } = TEACHING_BASIN,
        y = terrainHeightAt(x, z) / TERRAIN_SCALE - 1;
      e.controls.target.set(x, y, z);
      e.camera.position.set(x + 0.4, y + 3, z + 3.2);
      e.controls.update();
      e.invalidate();
      return;
    }

    if (id === "dilution") {
      const close = dilutionCloseViews[view];
      if (close) {
        e.camera.fov = THREE.MathUtils.radToDeg(
          2 *
            Math.atan(
              Math.tan(THREE.MathUtils.degToRad(38) / 2) *
                Math.max(1, 1.85 / e.camera.aspect),
            ),
        );
        e.camera.updateProjectionMatrix();
        e.controls.minDistance = 0.6;
        e.controls.target.set(...close.target);
        e.camera.position.set(...close.position);
        e.controls.update();
        e.invalidate();
        return;
      }
      frameDilution(e.camera, e.controls, e.root, view);
      e.invalidate();
      return;
    }
    if (id === "photosynthesis") {
      if (["leaf", "readout", "lamp"].includes(view)) {
        e.controls.minDistance = 0.8;
        e.controls.target.set(
          ...(view === "lamp"
            ? [-1.2, 2.65, -0.3]
            : view === "leaf"
              ? [-0.65, 1.25, 0]
              : [1.65, -0.1, 0.64]),
        );
        e.camera.position.set(
          ...(view === "lamp"
            ? [0.5, 3.8, 2.1]
            : view === "leaf"
              ? [0.9, 2.25, 2.5]
              : [1.65, 0.15, 3.5]),
        );
        e.controls.update();
        e.invalidate();
        return;
      }
      e.controls.minDistance = 4;
      e.controls.target.set(0, 1, 0);
      e.camera.position.set(
        ...(view === "top"
          ? [0, 8, 0.01]
          : view === "front"
            ? [0, 1.5, 7.5]
            : [4.5, 3.4, 7.5]),
      );
      e.controls.update();
      e.invalidate();
      return;
    }
    if (id === "water") {
      e.controls.target.set(0, 0.65, 0);
      e.camera.position.set(
        ...(view === "top"
          ? [0, 9, 0.01]
          : view === "front"
            ? [0, 1.8, 9]
            : [5, 4.8, 6.5]),
      );
      e.controls.update();
      e.invalidate();
      return;
    }
    if (id === "conics") {
      e.controls.minDistance = view === "conicUpper" ? 1.5 : 4;
      e.controls.target.set(0, view === "conicUpper" ? 1.9 : 1.1, 0);
      e.camera.position.set(
        ...(view === "conicUpper"
          ? [-2, 3.2, 4]
          : view === "front"
            ? [0, 1.1, 11]
            : view === "top"
              ? [0, 12, 0.01]
              : [-5, 4.6, 9]),
      );
      e.controls.update();
      e.invalidate();
      return;
    }
    if (id === "acid") {
      e.root.userData.setFocusAnnotations?.(view);
      if (frameTitration(e.camera, e.controls, e.root, view)) {
        e.invalidate();
        return;
      }
      // Restore the established close-up lens after leaving fitted overview.
      e.camera.fov = THREE.MathUtils.radToDeg(
        2 *
          Math.atan(
            Math.tan(THREE.MathUtils.degToRad(38) / 2) *
              Math.max(1, 1.85 / e.camera.aspect),
          ),
      );
      e.camera.updateProjectionMatrix();
      if (view === "surface") {
        e.controls.minDistance = 1.5;
        e.controls.target.set(0, 0.8, 0);
        e.camera.position.set(-2, 2.8, 3);
        e.controls.update();
        e.invalidate();
        return;
      }
      if (view === "readout" || view === "electrode") {
        e.controls.minDistance = 0.5;
        if (view === "readout") {
          e.controls.target.set(2.55, -0.15, 0.6);
          e.camera.position.set(3, 0.5, 3.5);
        } else {
          e.controls.target.set(-0.6, 0.25, -0.2);
          e.camera.position.set(-2, 1, 2.5);
        }
        e.controls.update();
        e.invalidate();
        return;
      }
      if (view === "clamps") {
        e.controls.minDistance = 0.7;
        e.controls.target.set(0.55, 4.65, -0.25);
        e.camera.position.set(1.6, 5.25, 1.8);
        e.controls.update();
        e.invalidate();
        return;
      }
      if (view === "meniscus" || view === "stopcock") {
        const y = view === "meniscus" ? buretteReadingHeight(p.base) : 2.5;
        e.controls.minDistance = 0.35;
        e.controls.target.set(0, y, 0);
        e.camera.position.set(0, y, view === "meniscus" ? 1.2 : 1.7);
        e.controls.update();
        e.invalidate();
        return;
      }
      e.controls.target.set(0, 1.5, 0);
      e.camera.position.set(
        ...(view === "front"
          ? [0, 1.5, 16]
          : view === "top"
            ? [0, 17, 0.01]
            : [4.8, 4.94, 11.2]),
      );
      e.controls.update();
      e.invalidate();
      return;
    }
    if (id === "plates") {
      e.controls.target.set(0, -0.25, 0);
      e.camera.position.set(
        ...(view === "front"
          ? [0, 0.1, 12]
          : view === "top"
            ? [0, 12, 0.01]
            : [5, 4.2, 10]),
      );
      e.controls.update();
      e.invalidate();
      return;
    }
    if (id === "incline" && view === "block") {
      const block = e.root.getObjectByName("incline-block");
      if (block) {
        const target = block.getWorldPosition(new THREE.Vector3());
        e.controls.minDistance = 0.6;
        e.controls.target.copy(target);
        e.camera.position.copy(target).add(new THREE.Vector3(0.8, 0.8, 3));
        e.controls.update();
        e.invalidate();
      }
      return;
    }
    if (id === "incline") {
      frameIncline(e.camera, e.controls, e.root, p, view);
      e.invalidate();
      return;
    }
    if (id === "earthquake") {
      e.root.userData.setSeismicView?.(view);
      if (view === "station") {
        const x = -1.7 + p.distance * 0.04;
        e.controls.minDistance = 0.6;
        e.controls.target.set(x - 0.2, 0.4, 1.2);
        e.camera.position.set(x + 1.2, 1.5, 3.6);
        e.controls.update();
        e.invalidate();
        return;
      }
      e.controls.target.set(0, -0.45, 0.6);
      e.camera.position.set(
        ...(view === "front"
          ? [0, -0.45, 8.5]
          : view === "top"
            ? [0, 11, 0.61]
            : [2.5, 2.2, 9]),
      );
      e.controls.update();
      e.invalidate();
      return;
    }
    e.camera.position.set(
      ...(view === "top"
        ? [
            id === "lens" ? 0.55 : 0,
            id === "contour" ? 16 : id === "seasons" ? 14 : 11,
            (id === "cube" ? 1 - p.fold / 100 : 0) + 0.01,
          ]
        : view === "front"
          ? [0, 1.4, 11]
          : id === "volcano"
            ? [-4.8, 6, 13.2]
            : [
                  "ohm",
                  "dilution",
                  "solubility",
                  "lens",
                  "solids",
                  "capacitor",
                  "incline",
                ].includes(id)
              ? [4.5, 4, 10]
              : id === "contour"
                ? [3.6, 5.4, 13.6]
                : id === "molecule"
                  ? [5, 3, 8]
                  : [7, 6, 9]),
    );
    e.controls.target.set(
      id === "lens" ? 0.55 : 0,
      id === "contour"
        ? -0.6
        : id === "lens"
          ? -0.25
          : id === "ohm"
            ? -0.2
            : id === "incline"
              ? 0.65
              : id === "volcano"
                ? 1.3
                : id === "precipitation"
                  ? 1.35
                  : 0.3,
      id === "ohm" ? 0.7 : id === "cube" ? 1 - p.fold / 100 : 0,
    );
    e.controls.update();
    if (id === "cell") finishCellView();
    e.invalidate();
  }, [
    view,
    id,
    revision,
    p.resetView,
    p.cellAngle,
    screenPosition,
    id === "earthquake" && view === "station" ? p.distance : null,
    id === "acid" && view === "meniscus" ? p.base : null,
  ]);
  useEffect(() => {
    const e = engine.current;
    if (e) {
      applySceneTheme(e.scene, theme);
      e.invalidate();
    }
  }, [theme, id, revision]);
  useEffect(() => {
    if (preview && error) onPreviewError?.();
  }, [preview, error, onPreviewError]);
  return (
    <>
      <div className={"three-wrap scene-" + id + " " + (small ? "small" : "")}>
        <div className="three-host" ref={host} />
        {id === "biodiversity" && !small && !error && (
          <EcologyObservation
            selected={ecologySelection}
            onSelect={setEcologySelection}
            p={p}
            onViewChange={(nextView) => {
              onViewChange?.(nextView);
              if (window.matchMedia("(max-width: 760px)").matches)
                host.current?.scrollIntoView({
                  block: "start",
                  behavior: "instant",
                });
            }}
          />
        )}
        {id === "precipitation" && !small && !error && (
          <>
            <svg className="reagent-leader" aria-hidden="true">
              <path ref={reagentLeader} />
            </svg>
            <div className="reagent-annotation" ref={reagentLabel}>
              <strong>NaOH · 氢氧化钠</strong>
              <span>0.2 mol/L · 无色溶液</span>
            </div>
          </>
        )}
        {error && (
          <div className="scene-error" role="alert">
            {error}
            {onUseDiagram && (
              <button className="btn" onClick={onUseDiagram}>
                切换原理图，继续实验
              </button>
            )}
            <button className="btn" onClick={() => setRevision((r) => r + 1)}>
              重新加载三维场景
            </button>
          </div>
        )}
        {!small && !error && (
          <div className="scene-zoom" role="group" aria-label="三维场景缩放">
            {[
              { label: "放大三维场景", text: "+", factor: 0.82 },
              { label: "缩小三维场景", text: "−", factor: 1.22 },
            ].map(({ label, text, factor }) => (
              <button
                key={label}
                aria-label={label}
                onClick={() => {
                  const e = engine.current;
                  if (!e) return;
                  const delta = e.camera.position
                    .clone()
                    .sub(e.controls.target);
                  delta.setLength(
                    THREE.MathUtils.clamp(
                      delta.length() * factor,
                      e.controls.minDistance,
                      e.controls.maxDistance,
                    ),
                  );
                  e.camera.position.copy(e.controls.target).add(delta);
                  e.controls.update();
                  e.invalidate();
                }}
              >
                {text}
              </button>
            ))}
          </div>
        )}
        {!small && id === "contour" && (
          <div
            className="terrain-compass"
            role="img"
            aria-label="北向指示，随三维视角旋转"
            title="北向与平面图一致，随三维视角旋转"
          >
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r="29"
                fill="#0c151bcc"
                stroke="#465150"
              />
              <path d="M32 2V6M62 32H58M32 62V58M2 32H6" stroke="#798580" />
              <g ref={compass} style={{ transformOrigin: "32px 32px" }}>
                <text
                  x="32"
                  y="15"
                  textAnchor="middle"
                  fill="#e8ce8d"
                  fontSize="9"
                >
                  N
                </text>
                <path d="M32 18L39 40L32 36Z" fill="#e2c47e" />
                <path d="M32 18L25 40L32 36Z" fill="#a88c50" />
                <path d="M32 48L27 36L32 38L37 36Z" fill="#819092" />
              </g>
              <circle cx="32" cy="34" r="2" fill="#f5e1ab" />
            </svg>
            <span>北向</span>
          </div>
        )}
        {!small && (
          <span className="orbit-hint">
            {id === "cell"
              ? "拖动旋转 · 点击结构近看 · Esc 返回全景"
              : "拖动旋转 · 滚轮缩放"}
          </span>
        )}
        {!small && ["ohm", "capacitor"].includes(id) && (
          <div className="scene-legend">
            {id === "capacitor" ? "点击手柄切换充放电" : "点击刀闸通断"} ·
            电源旋钮 +0.5 V，Shift + 点击 −0.5 V · 理想电路
          </div>
        )}
        {!small && id === "plates" && (
          <div
            className="plate-layer-controls"
            role="group"
            aria-label="地表显示"
          >
            {[
              ["vegetation", "植被"],
              ["markers", "地表标记"],
              ["arrows", "方向箭头"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={plateVisibility[key]}
                title={`${plateVisibility[key] ? "隐藏" : "显示"}${label}`}
                onClick={() =>
                  setPlateDisplay((current) => ({
                    ...current,
                    [key]: !current[key],
                  }))
                }
              >
                {label}
              </button>
            ))}
          </div>
        )}
        {!small && instrumentQuality && (
          <div
            className="microscope-quality"
            role="group"
            aria-label={
              id === "acid"
                ? "中和实验显示与画质"
                : id === "solubility"
                  ? "溶解结晶显示与画质"
                  : id === "dilution"
                    ? "溶液稀释显示与画质"
                    : id === "ohm"
                      ? "电学实验显示与画质"
                      : id === "lens"
                        ? "凸透镜显示与画质"
                        : id === "microscope"
                          ? "显微镜显示与画质"
                          : "三维显示与画质"
            }
          >
            {id === "capacitor" && (
              <button
                type="button"
                aria-pressed={p.fieldLines === 1}
                title="半透明显示极板，观察正极板到负极板的理想电场方向"
                onClick={() =>
                  onChange?.("fieldLines", p.fieldLines === 1 ? 0 : 1)
                }
              >
                电场透视
              </button>
            )}
            {id === "capacitor" && (
              <button
                type="button"
                aria-pressed={p.chargeMarkers !== 0}
                title="显示或隐藏极板上的定性电荷标记，保持当前实验进度"
                onClick={() =>
                  onChange?.("chargeMarkers", p.chargeMarkers === 0 ? 1 : 0)
                }
              >
                电荷标记
              </button>
            )}
            {id === "ohm" && (
              <button
                type="button"
                aria-pressed={roomVisible}
                title="显示或隐藏实验室墙面、窗户和橱柜；保留仪器、实验台和当前视角"
                onClick={() => {
                  roomVisibleRef.current = !roomVisible;
                  setRoomVisible(!roomVisible);
                  engine.current?.invalidate();
                }}
              >
                实验室背景
              </button>
            )}
            {id === "microscope" && (
              <button
                type="button"
                aria-pressed={accessoriesVisible}
                title="显示或隐藏备用玻片、制片用品与镊子"
                onClick={() => setAccessoriesVisible(!accessoriesVisible)}
              >
                实验台附件
              </button>
            )}
            {id === "incline" && (
              <button
                type="button"
                aria-pressed={p.forces !== 0}
                title="显示或隐藏力箭头与名称，便于切换器材观察和受力讲解"
                onClick={() => onChange?.("forces", p.forces === 0 ? 1 : 0)}
              >
                受力标注
              </button>
            )}
            {id === "solids" &&
              [
                ["solidShell", "透明外壳"],
                ["solidMeasures", "标尺辅助"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={p[key] !== 0}
                  title={`显示或隐藏${label}，保留当前截面与扫描进度`}
                  onClick={() => onChange?.(key, p[key] === 0 ? 1 : 0)}
                >
                  {label}
                </button>
              ))}
            <span>画质</span>
            <button
              type="button"
              aria-pressed={instrumentQuality === "fluent"}
              title="降低像素密度和阴影分辨率，保留模型细节"
              onClick={() => setInstrumentQuality("fluent")}
            >
              流畅
            </button>
            <button
              type="button"
              aria-pressed={instrumentQuality === "detail"}
              title="提高像素密度和阴影分辨率，需要更高图形性能"
              onClick={() => setInstrumentQuality("detail")}
            >
              精细
            </button>
          </div>
        )}
        {!small && id === "ohm" && (
          <span className="microscope-hover-hint" ref={microscopeHint} hidden />
        )}
        {!small && id === "microscope" && (
          <>
            {partsOpen && (
              <span
                ref={partMarker}
                className="microscope-part-marker"
                aria-hidden="true"
              />
            )}
            <span
              className="microscope-hover-hint"
              ref={microscopeHint}
              hidden
            />
            <div className="microscope-parts">
              <button
                type="button"
                aria-expanded={partsOpen}
                aria-controls="microscope-parts-body"
                onClick={() => setPartsOpen(!partsOpen)}
              >
                {partsOpen ? "收起部件导览 −" : "认识仪器部件 +"}
              </button>
              <div id="microscope-parts-body" hidden={!partsOpen}>
                <label>
                  定位部件
                  <select
                    value={partIndex}
                    onChange={(e) => setPartIndex(Number(e.target.value))}
                  >
                    {microscopeParts.map((part, i) => (
                      <option key={part.name} value={i}>
                        {part.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p>{microscopeParts[partIndex].text}</p>
                {partIndex === 1 && (
                  <MicroscopeObjectiveChoice mag={p.mag} onChange={onChange} />
                )}
                {partAdjustment && (
                  <div
                    className="microscope-part-adjust"
                    role="group"
                    aria-label={`${partAdjustment.label}快捷调节`}
                  >
                    <button
                      type="button"
                      aria-label={`减小${partAdjustment.label}`}
                      disabled={partValue <= partAdjustment.min}
                      onClick={() =>
                        onChange?.(
                          partAdjustment.key,
                          Math.max(
                            partAdjustment.min,
                            partValue - partAdjustment.step,
                          ),
                        )
                      }
                    >
                      −
                    </button>
                    <output aria-live="polite">
                      {partAdjustment.label} {partValue}
                      {partAdjustment.unit || ""}
                    </output>
                    <button
                      type="button"
                      aria-label={`增大${partAdjustment.label}`}
                      disabled={partValue >= partAdjustment.max}
                      onClick={() =>
                        onChange?.(
                          partAdjustment.key,
                          Math.min(
                            partAdjustment.max,
                            partValue + partAdjustment.step,
                          ),
                        )
                      }
                    >
                      ＋
                    </button>
                  </div>
                )}
                <div className="microscope-part-actions">
                  <button type="button" onClick={focusInstrumentPart}>
                    近看该部件
                  </button>
                  <button
                    type="button"
                    disabled={!partCloseup}
                    onClick={restoreInstrumentView}
                  >
                    返回原视角
                  </button>
                </div>
                <small>金色圆点指示位置 · 近看不改变光学倍率</small>
              </div>
            </div>
          </>
        )}
        {!small && id === "microscope" && (
          <div className="scene-legend">
            拖动载物台玻片 · 点击左侧玻片换片 · 点击物镜换倍率 · Shift +
            点击手轮反向 · 调焦旋钮可上下拖动 · 也可使用参数栏
          </div>
        )}
        {!small && ["dilution", "solubility"].includes(id) && (
          <div className="scene-legend">
            {id === "dilution"
              ? "点击仪表近看净质量 · 蓝色阀柄控制供水 · 液位示意"
              : "无色溶液 · 相对液位与晶体数量为示意，精确质量见计算结果"}
          </div>
        )}
        {!small && id === "acid" && (
          <div className="scene-legend">
            {view === "meniscus"
              ? "平视凹液面最低处 · 每小格 0.2 mL，长线间隔 5 mL · 数值为模型加入量"
              : view === "stopcock"
                ? "点击蓝色旋塞开始 / 暂停滴加 · 也可使用下方按钮 · 液滴大小非校准体积"
                : "无色溶液 · 滴定管从 0 mL 起读 · 仪表显示理想 pH，非实测"}
          </div>
        )}
        {!small && id === "volcano" && (
          <div className="scene-legend">
            {view === "volcanoInterior"
              ? "通道剖面近景 · 对照岩浆储集区与主通道的连接"
              : view === "volcanoCrater"
                ? "火山口近景 · 对照喷出位置与地表熔岩流"
                : p.cut === 1
                  ? "内部剖面 · 岩浆储集区 → 主通道 → 火山口"
                  : "完整外观 · 旋转观察地形与熔岩流迹"}
            <br />
            教学示意 · 演示强度不代表灾害等级
          </div>
        )}
        {!small && id === "earthquake" && (
          <div className="scene-legend">
            金色 P 波 · 青色 S 波 · 圆弧为地下波前的剖面截线 · 台站外形放大
            <br />
            震源深度 {p.depth} km · 震中距 {p.distance} km
          </div>
        )}
        {!small && id === "cell" && (
          <div className="scene-legend">
            {p.labels === 0
              ? "结构标注已隐藏 · 旋转观察并尝试辨认，点击下方按钮显示标注"
              : view === "vacuole"
                ? "中央液泡 · 液泡膜包围细胞液 · 剖面非自由液面 · 颜色及膜厚为示意"
                : view === "reticulum"
                  ? p.erMode === 1
                    ? "粗面区域 · 附着核糖体位于膜外侧 · 管网暂时隐藏"
                    : p.erMode === 2
                      ? "光面区域 · 相连的管状网络 · 粗面膜囊暂时隐藏"
                      : "内质网局部 · 膜囊 / 管网 / 附着核糖体 · 放大示意"
                  : view === "golgi"
                    ? p.golgiMode === 1
                      ? "膜囊堆叠 · 囊泡暂时隐藏 · 顺面接收 / 反面输出"
                      : p.golgiMode === 2
                        ? "囊泡与出芽 · 细线为母体膜囊边缘参照 · 静态形态示意"
                        : "高尔基体 · 膜囊 / 出芽细颈 / 囊泡 · 放大示意"
                    : view === "mitochondrion"
                      ? p.mitochondrionMode === 1
                        ? "内膜与嵴 · 外膜暂时隐藏 · 分层观察示意"
                        : p.mitochondrionMode === 2
                          ? "双层膜 · 嵴暂时隐藏，观察膜间隙 · 间距非实测比例"
                          : p.mitochondrionMode === 3
                            ? "基质细节 · 外膜、嵴及其 ATP 合酶暂时隐藏 · 非结构消失"
                            : "线粒体剖面 · 外膜 / 内膜与嵴 / 基质 · 结构示意"
                      : view === "chloroplast"
                        ? p.chloroplastMode === 1
                          ? "类囊体膜系统 · 基粒与基质片层 · 包膜及基质内容暂时隐藏"
                          : p.chloroplastMode === 2
                            ? "基质内容 · 类囊体膜系统暂时隐藏 · 放大结构示意"
                            : "叶绿体剖面 · 双层膜 / 基粒 / 基质 · 结构示意"
                        : view === "nucleus"
                          ? p.nucleusMode === 1
                            ? "核膜与核孔 · 核内内容暂时隐藏 · 分层观察示意"
                            : p.nucleusMode === 2
                              ? "染色质与核仁 · 核膜暂时隐藏 · 纤维形态为教学示意"
                              : "细胞核剖面 · 核膜 / 染色质 / 核仁 · 结构示意"
                          : p.cytoskeleton > 0
                            ? "细胞骨架 · 金色：皮层微管 · 浅蓝：肌动蛋白丝 · 直径与间距放大示意"
                            : p.organelleCutaway === 1
                              ? "全景内部对照 · 各展开一个叶绿体与线粒体 · 虚拟剖面"
                              : "植物叶肉细胞 · 绿色：叶绿体 · 蓝色：液泡 · 紫色：细胞核"}
          </div>
        )}
        {!small && id === "molecule" && (
          <div className="scene-legend">
            白 H · 红 O · 灰 C · 蓝 N　|　球棍结构示意
          </div>
        )}
        {!small && ["seasons", "daynight"].includes(id) && (
          <div className="scene-legend">
            地表纹理示意 · 金色点为观察地点 · 尺寸与距离非同比例
          </div>
        )}
      </div>
    </>
  );
}
