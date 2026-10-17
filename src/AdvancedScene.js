import { addRCField } from "./RCField.js";
import { addRCPlateHardware } from "./RCPlateHardware.js";
import { createRCSelectorHardware } from "./RCSelectorHardware.js";
import { createRCResistorHardware } from "./RCResistorHardware.js";
import { createEcologyBirdTemplate } from "./EcologyBird.js";
import { createEcologyPond } from "./EcologyPond.js";
import { addEcologyGround } from "./EcologyGround.js";
import { ecologySoilTexture, ecologySoilGeometry } from "./EcologySoil.js";
import { buildConicBench } from "./ConicBench.js";
import { buildWaterBench } from "./WaterBudgetBench.js";
import { buildPhotosynthesisBench } from "./PhotosynthesisBench.js";
import { microscopeCondenser } from "./MicroscopeCondenser.js";
import { addRCMarkers } from "./RCMarkers.js";
import { RC_SOURCE_OFFSET, rcSourcePoint } from "./rcLayout.mjs";
import { createRCSelectorMotion } from "./RCSelectorMotion.js";
import { rcPathTrace } from "./RCPathTrace.js";
import { addRCInstrumentDetails } from "./RCInstrumentDetails.js";
import {
  createEcologySpecimens,
  createButterflyTemplate,
} from "./EcologySpecimens.js";
import { buildSeismicBench as earthquake } from "./SeismicBench.js";
import {
  HABITAT_POND,
  habitatHeight,
  habitatSites,
} from "./ecologyHabitat.mjs";
import { liquidSurfaceGeometry } from "./LiquidSurface.js";
import { addReactionFlocs } from "./ReactionFlocs.js";
import { addReactionRipples } from "./ReactionRipples.js";
import { reactionTiming } from "./precipitationDosing.mjs";
import { addReactionClamps } from "./ReactionClamps.js";
import { addReactionVolumeGuide } from "./ReactionVolumeGuide.js";
import {
  shapeBeakerSpout,
  reactionNozzleGeometry,
  reactionBeakerGeometry,
  reactionLiquidGeometry,
  setReactionLiquidHeight,
  reactionFunnelGeometry,
} from "./ReactionGlass.js";
import { teachingGlassMaterial } from "./TeachingGlass.js";
import { addRCReadout } from "./RCReadout.js";
import { addVolcanoPlume } from "./VolcanoPlume.js";
import { createVolcanoLavaMaterial } from "./VolcanoLavaMaterial.js";
import { createVolcanoMagmaMaterial } from "./VolcanoMagmaMaterial.js";
import { cellLabelLayout } from "./CellLabelLayout.js";
import { createVolcanoSectionMaterial } from "./VolcanoSectionMaterial.js";
import { addStructureLabels } from "./ChloroplastLabels.js";
import {
  volcanoShell,
  volcanoCutFace,
  volcanoLava,
  addVolcanoDebris,
} from "./VolcanoSurface.js";
import {
  microscopeObjectiveFront,
  microscopeObjectiveBarrel,
} from "./MicroscopeObjective.js";
import { microscopeEyepiece } from "./MicroscopeEyepiece.js";
import { createAngleTransition } from "./angleTransition.mjs";
import { finishMicroscopeInstrument } from "./MicroscopeMaterials.js";
import { repeatedBoxes } from "./MicroscopeBatch.js";
import {
  microscopeArm,
  microscopeWorkbench,
  objectiveEngraving,
  microscopeFasteners,
  microscopeSpecimenMark,
} from "./MicroscopeDetails.js";
import { buildInclineBench as slope } from "./InclineBench.js";
import * as T from "three";
import { box, panel } from "./CircuitBench.js";
import { rc, incline, precipitate, funnelFill } from "./advancedModels.mjs";
import { addCurvedGraduations } from "./CurvedGraduations.js";
import { surfaceTexture } from "./SceneCraft.js";
import { buildSolidsBench as solids } from "./SolidsBench.js";
const v = (p) => new T.Vector3(...p);
const mat = (color, extra = {}) =>
  new T.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.12,
    ...extra,
  });
function mesh(root, geo, m, pos = [0, 0, 0]) {
  const o = new T.Mesh(geo, m);
  o.position.set(...pos);
  o.castShadow = o.receiveShadow = true;
  root.add(o);
  return o;
}
function ball(root, pos, r, color, extra = {}) {
  return mesh(root, new T.SphereGeometry(r, 16, 12), mat(color, extra), pos);
}
function rod(root, a, b, r, color) {
  const d = v(b).sub(v(a));
  const o = mesh(
    root,
    new T.CylinderGeometry(r, r, d.length(), 18),
    mat(color, { metalness: 0.65 }),
    v(a).add(v(b)).multiplyScalar(0.5).toArray(),
  );
  o.quaternion.setFromUnitVectors(v([0, 1, 0]), d.normalize());
  return o;
}
function tube(root, points, r, color, extra = {}) {
  return mesh(
    root,
    new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v)), 80, r, 8, false),
    mat(color, extra),
  );
}
function ring(root, r, color) {
  const o = mesh(
    root,
    new T.TorusGeometry(r, 0.025, 10, 96),
    mat(color, { emissive: color, emissiveIntensity: 0.3 }),
  );
  o.rotation.x = Math.PI / 2;
  return o;
}
function bed(root, color = "#425953") {
  box(root, [7.2, 0.35, 5], color, [0, -1.1, 0]);
}
function label(root, text, pos, width = 2) {
  const display = panel(root, pos, width, 0.3, (ctx) => {
    ctx.fillStyle = "#edf1e6";
    ctx.fillRect(0, 0, 768, 384);
    ctx.fillStyle = "#28433f";
    ctx.textAlign = "center";
    ctx.font = "bold 75px sans-serif";
    ctx.fillText(text, 384, 240);
  });
  display.update({});
}
function capacitor(root, p) {
  bed(root, "#b8c8c1");
  const updateReadout = addRCReadout(root);
  const sourceAssembly = new T.Group();
  sourceAssembly.name = "rc-source-assembly";
  sourceAssembly.position.x = RC_SOURCE_OFFSET;
  root.add(sourceAssembly);
  const sourceBody = box(
    sourceAssembly,
    [1.4, 1.5, 1],
    "#254346",
    [-2, 0.05, 0],
  );
  sourceBody.name = "rc-source-body";
  for (let i = 0; i < 7; i++)
    box(
      sourceAssembly,
      [0.045, 0.42, 0.015],
      "#142d2d",
      [-2.5 + i * 0.065, 0.2, -0.51],
      0.005,
    );
  for (const [x, y, color] of [
    [-2, 0, "#a84533"],
    [-1.65, -0.2, "#283533"],
  ])
    rod(sourceAssembly, [x, y, 0.52], [x, y, 0.65], 0.075, color);
  const source = panel(
    sourceAssembly,
    [-2, 0.28, 0.558],
    1.1,
    0.28,
    (ctx, q) => {
      ctx.fillStyle = "#122f30";
      ctx.fillRect(0, 0, 768, 384);
      ctx.fillStyle = "#b0edd2";
      ctx.font = "110px monospace";
      ctx.fillText(`${q.u.toFixed(1)} V`, 90, 250);
    },
  );
  createRCResistorHardware(root);
  const selectorLead = rod(
    root,
    [-0.7, -0.45, -1],
    [-0.35, -0.45, -1],
    0.028,
    "#b8b9a9",
  );
  selectorLead.name = "rc-selector-resistor-lead";
  const plates = [
    box(root, [0.06, 1.75, 1.6], "#bc7d4a", [1.55, 0.1, 0]),
    box(root, [0.06, 1.75, 1.6], "#729eaa", [2.05, 0.1, 0]),
  ];
  const updateInstrumentDetails = addRCInstrumentDetails(
    sourceAssembly,
    sourceBody,
    plates,
  );
  addRCPlateHardware(root);
  const dielectric = box(root, [0.44, 1.65, 1.5], "#c6dccb", [1.8, 0.1, 0]);
  dielectric.material.transparent = true;
  dielectric.material.opacity = 0.28;
  dielectric.material.depthWrite = false;
  box(root, [1, 0.16, 1.9], "#e4e3d1", [1.8, -0.86, 0]);
  const common = [-0.7, -0.45, -1],
    contacts = [
      [-1.2, -0.45, -1.4],
      [-1.2, -0.45, -0.6],
    ];
  box(root, [0.85, 0.22, 1.12], "#e2decc", [-1.04, -0.67, -1]).name =
    "rc-selector-base";
  for (const x of [-1.37, -0.71])
    for (const z of [-1.43, -0.57]) {
      const screw = mesh(
        root,
        new T.CylinderGeometry(0.026, 0.026, 0.012, 16),
        mat("#899b98", { metalness: 0.75, roughness: 0.35 }),
        [x, -0.554, z],
      );
      screw.name = "rc-selector-fastener";
      box(root, [0.034, 0.003, 0.005], "#354440", [x, -0.547, z]);
    }
  for (const point of [common, ...contacts]) {
    rod(root, [point[0], -0.55, point[2]], point, 0.065, "#bd9854");
    const collar = mesh(
      root,
      new T.CylinderGeometry(0.09, 0.09, 0.018, 6),
      mat("#ad884b", { metalness: 0.7, roughness: 0.38 }),
      [point[0], -0.544, point[2]],
    );
    collar.name = "rc-selector-terminal-nut";
  }
  const { selector, grip: switchGrip } = createRCSelectorHardware(
    root,
    common,
    contacts,
  );
  const selectorMotion = createRCSelectorMotion(
    selector,
    switchGrip,
    common,
    contacts,
    p.mode,
  );
  for (const [index, text] of ["充电", "放电"].entries()) {
    const sign = panel(
      root,
      [-1.22, -0.552, index ? -0.48 : -1.52],
      0.42,
      0.13,
      (ctx) => {
        ctx.fillStyle = "#e2decc";
        ctx.fillRect(0, 0, 384, 128);
        ctx.fillStyle = "#30483c";
        ctx.textAlign = "center";
        ctx.font = 'bold 72px "Microsoft YaHei", sans-serif';
        ctx.fillText(text, 192, 91);
      },
      [384, 128],
    );
    if (sign.object) sign.object.rotation.x = -Math.PI / 2;
    sign.update({});
  }
  const chargePath = [
      rcSourcePoint([-2, 0.0, 0.55]),
      rcSourcePoint([-2, -0.6, 1.5]),
      [-3.4, -0.6, 1.5],
      [-3.4, -0.6, -1],
      contacts[0],
    ],
    dischargePath = [
      contacts[1],
      [-1, -0.6, -1],
      [-1, -0.6, 1.5],
      [2.85, -0.6, 1.5],
      [2.85, -0.6, 0.3],
      [2.1, 0, 0],
    ];
  const charging = tube(root, chargePath, 0.035, "#bf5943");
  charging.name = "rc-charge-lead";
  const resistorLead = tube(
    root,
    [
      [1.05, -0.45, -1],
      [1.2, -0.6, -1],
      [1.5, 0.0, 0],
    ],
    0.035,
    "#bf5943",
  );
  const back = tube(
    root,
    [
      [2.1, 0, 0],
      [2.6, -0.6, 0],
      [2.6, -0.6, 1.8],
      rcSourcePoint([-1.65, -0.6, 1.8]),
      rcSourcePoint([-1.65, -0.2, 0.55]),
    ],
    0.035,
    "#263535",
  );
  const discharging = tube(root, dischargePath, 0.035, "#334947");
  discharging.name = "rc-discharge-lead";
  back.name = "rc-source-return-lead";
  resistorLead.name = "rc-resistor-capacitor-lead";
  const updatePath = rcPathTrace([
    [charging, [0]],
    [back, [0]],
    [discharging, [1]],
    [resistorLead, [0, 1]],
    [selector, [0, 1]],
    [selectorLead, [0, 1]],
  ]);
  const curve = new T.CatmullRomCurve3(
    [
      [-0.7, -0.45, -1],
      [0.35, -0.45, -1],
      [1.05, -0.45, -1],
      [1.2, -0.6, -1],
      [1.5, 0, 0],
    ].map(v),
  );
  const updateMarkers = addRCMarkers(root, curve);
  const updateField = addRCField(root);
  const resistorDisplay = panel(
    root,
    [0.35, -0.4, -0.748],
    1.12,
    0.23,
    (ctx, q) => {
      ctx.fillStyle = "#ded6bd";
      ctx.fillRect(0, 0, 768, 160);
      ctx.fillStyle = "#334c40";
      ctx.textAlign = "center";
      ctx.font = "60px sans-serif";
      ctx.fillText(`R = ${q.r} Ω`, 384, 110);
    },
    [768, 160],
  );
  label(root, "+   电介质   −", [1.8, -0.7, 1.1], 2.2);
  let instrumentKey = "";
  let latest = p;
  root.userData.animate = (now, reducedMotion) => {
    const active = selectorMotion.sample(now, reducedMotion);
    const state = rc(latest, latest.time ?? 0);
    updateMarkers(latest, active ? { ...state, current: 0 } : state);
    updatePath(latest.mode, latest.trace === 1 && !active);
    return active;
  };
  root.userData.update = (q) => {
    latest = q;
    selectorMotion.setMode(q.mode, performance.now());
    const state = rc(q, q.time ?? 0);
    updateField(q, state);
    plates.forEach((plate) => {
      const transparent = q.fieldLines === 1;
      if (plate.material.transparent !== transparent) {
        plate.material.transparent = transparent;
        plate.material.needsUpdate = true;
      }
      plate.material.opacity = transparent ? 0.22 : 1;
      plate.material.depthWrite = !transparent;
    });
    dielectric.material.opacity = q.fieldLines === 1 ? 0.06 : 0.28;
    updateInstrumentDetails(q.u);
    updatePath(q.mode, q.trace === 1);
    updateReadout(q, state);
    const nextKey = `${q.u}/${q.r}`;
    if (nextKey !== instrumentKey) {
      source.update(q);
      resistorDisplay.update(q);
      instrumentKey = nextKey;
    }
    selector.userData.value = switchGrip.userData.value = q.mode ? 0 : 1;
    updateMarkers(q, selectorMotion.active ? { ...state, current: 0 } : state);
  };
  root.userData.update(p);
}
function reaction(root, p) {
  bed(root, "#354f54");
  const glass = teachingGlassMaterial();
  const bottom = -0.82,
    mlHeight = 2.2 / 250;
  const beaker = mesh(root, reactionBeakerGeometry(), glass, [
    0,
    bottom - 0.09,
    0,
  ]);
  beaker.name = "reaction-beaker";
  // Standard shadow maps treat this Fresnel glass as opaque. Keep reflections,
  // but avoid a solid vessel silhouette and self-shadow bands through the liquid.
  beaker.castShadow = false;
  const lipGeometry = new T.TorusGeometry(1.05, 0.018, 8, 96);
  lipGeometry.rotateX(Math.PI / 2);
  const lip = mesh(
    root,
    shapeBeakerSpout(lipGeometry, 1.44),
    glass,
    [0, 1.44, 0],
  );
  lip.name = "reaction-beaker-lip";
  lip.castShadow = false;
  const liquid = mesh(
    root,
    reactionLiquidGeometry(),
    mat("#3797c4", {
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      roughness: 0.3,
      metalness: 0,
      envMapIntensity: 0.08,
    }),
    [0, 0, 0],
  );
  liquid.name = "reaction-liquid";
  liquid.castShadow = false;
  liquid.receiveShadow = false;
  const surfaceMaterial = liquid.material.clone();
  surfaceMaterial.roughness = 0.09;
  surfaceMaterial.envMapIntensity = 0.45;
  surfaceMaterial.side = T.DoubleSide;
  const meniscus = mesh(root, liquidSurfaceGeometry(1.02), surfaceMaterial);
  meniscus.name = "reaction-liquid-surface";
  meniscus.castShadow = false;
  meniscus.receiveShadow = false;
  const liquidBottom = mesh(
    root,
    new T.CircleGeometry(0.98, 64),
    liquid.material,
    [0, bottom, 0],
  );
  liquidBottom.rotation.x = Math.PI / 2;
  liquidBottom.castShadow = false;
  liquidBottom.receiveShadow = false;
  // Graduations and liquid height share the same mL-to-height conversion.
  addCurvedGraduations(root, {
    name: "reaction-beaker-graduations",
    radius: 1.078,
    base: bottom - 0.02,
    height: 2.3,
    marks: [
      { y: bottom + 0.12, caption: "250 mL" },
      ...Array.from({ length: 10 }, (_, i) => {
        const ml = (i + 1) * 25;
        return {
          y: bottom + ml * mlHeight,
          label: ml % 50 === 0 ? `${ml}` : "",
        };
      }),
    ],
  });
  // A graduated 100 mL addition funnel: reservoir, cone, PTFE stopcock and tip.
  const reservoirBottom = 2.32,
    reservoirHeight = funnelFill(100).cylinderHeight;
  const apparatusBounds = new T.Box3(
    new T.Vector3(-3.65, -1.3, -2.55),
    new T.Vector3(
      3.65,
      Math.max(4.65, reservoirBottom + reservoirHeight + 0.2),
      2.55,
    ),
  );
  root.userData.focusBounds = {
    perspective: apparatusBounds,
    front: apparatusBounds,
    top: apparatusBounds,
    dosing: new T.Box3(
      new T.Vector3(-2.05, 1.55, -0.9),
      new T.Vector3(0.82, reservoirBottom + reservoirHeight + 0.22, 0.65),
    ),
    sediment: new T.Box3(
      new T.Vector3(-1.12, bottom - 0.1, -1.12),
      new T.Vector3(1.12, 1.55, 1.28),
    ),
    volumeReadout: new T.Box3(),
  };
  root.userData.focusDirections = {
    perspective: [0.45, 0.3, 1],
    front: [0, 0, 1],
    top: [0, 1, 0.001],
    volumeReadout: [0, 0, 1],
  };
  const funnel = mesh(
    root,
    reactionFunnelGeometry(reservoirBottom, reservoirHeight + 0.14),
    glass,
    [0, 0, -0.15],
  );
  funnel.name = "reaction-funnel-glass";
  funnel.castShadow = false;
  const stock = mesh(
    root,
    new T.CylinderGeometry(0.65, 0.65, 1, 64, 1, true),
    mat("#edf5f4", {
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      roughness: 0.04,
      metalness: 0,
    }),
    [0, 0, -0.15],
  );
  stock.name = "reaction-stock";
  const coneStock = mesh(
    root,
    new T.ConeGeometry(1, 1, 64, 1, true),
    stock.material,
    [0, 0, -0.15],
  );
  coneStock.rotation.z = Math.PI;
  coneStock.name = "reaction-stock-cone";
  const stockSurfaceMaterial = stock.material.clone();
  stockSurfaceMaterial.side = T.DoubleSide;
  stockSurfaceMaterial.opacity = 0.23;
  const stockSurface = mesh(
    root,
    liquidSurfaceGeometry(1),
    stockSurfaceMaterial,
    [0, reservoirBottom, -0.15],
  );
  stockSurface.name = "reaction-stock-surface";
  stockSurface.castShadow = false;
  stock.castShadow = false;
  coneStock.castShadow = false;
  const nozzle = mesh(root, reactionNozzleGeometry(), glass, [0, 0, -0.15]);
  nozzle.name = "reaction-nozzle";
  const valve = new T.Group();
  valve.name = "reaction-stopcock";
  valve.userData.action = "precipitation-valve";
  valve.position.set(0, 1.94, -0.15);
  root.add(valve);
  rod(valve, [-0.2, 0, 0], [0.2, 0, 0], 0.07, "#eee9d4");
  const handle = new T.Group();
  handle.name = "reaction-valve-handle";
  handle.position.set(0.25, 0, 0);
  valve.add(handle);
  box(handle, [0.08, 0.42, 0.09], "#397b8c", [0, 0, 0], 0.025);
  rod(valve, [0.2, 0, 0], [0.28, 0, 0], 0.09, "#cad4d2");
  addCurvedGraduations(root, {
    name: "reaction-funnel-graduations",
    radius: 0.693,
    base: reservoirBottom,
    height: reservoirHeight + 0.07,
    z: -0.15,
    marks: Array.from({ length: 5 }, (_, i) => {
      const ml = (i + 1) * 20;
      return {
        y: reservoirBottom + funnelFill(ml).cylinderHeight,
        label: `${ml}`,
      };
    }),
  });
  rod(root, [1.6, -0.88, -0.55], [1.6, 4.6, -0.55], 0.045, "#7f9398");
  box(root, [1.4, 0.13, 1.4], "#293e44", [1.6, -0.86, -0.55]);
  addReactionClamps(root);
  const drops = Array.from({ length: 5 }, () =>
    ball(root, [0, 0, 0], 0.037, "#b6d9e2", {
      transparent: true,
      opacity: 0.75,
      roughness: 0.05,
    }),
  );
  drops.forEach((drop, i) => {
    drop.name = `reaction-drop-${i}`;
  });
  const updateRipples = addReactionRipples(root);
  const updateFlocs = addReactionFlocs(root, bottom);
  const updateVolumeGuide = addReactionVolumeGuide(root);
  const reactionCaption = panel(
    root,
    [0, -0.8, 1.85],
    6.2,
    0.32,
    (ctx) => {
      ctx.fillStyle = "#172e36";
      ctx.fillRect(0, 0, 1024, 80);
      ctx.fillStyle = "#e3e9df";
      ctx.font = "30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄", 512, 53, 980);
    },
    [1024, 80],
  );
  reactionCaption.update({});
  if (reactionCaption.object)
    reactionCaption.object.name = "reaction-equation-placard";
  root.userData.update = (q) => {
    const model = precipitate(q, q.time),
      height = (q.copper + model.delivered) * mlHeight,
      surface = bottom + height;
    root.userData.focusBounds.volumeReadout.set(
      new T.Vector3(-1.2, surface - 0.58, -1.1),
      new T.Vector3(1.2, surface + 0.58, 1.1),
    );
    updateVolumeGuide(q.copper + model.delivered, q.volumeGuide === 1);
    setReactionLiquidHeight(liquid.geometry, height);
    liquid.position.y = bottom;
    meniscus.position.y = surface;
    const concentration = model.cu / (q.copper + model.delivered);
    const strength = Math.min(1, concentration / 0.1);
    // Qualitative absorption tint, not a calibrated spectrophotometer model.
    liquid.material.color.setRGB(
      Math.exp(-5 * strength),
      Math.exp(-1.4 * strength),
      Math.exp(-0.35 * strength),
    );
    liquid.material.opacity = 0.035 + 0.665 * strength;
    surfaceMaterial.color.copy(liquid.material.color);
    surfaceMaterial.opacity = 0.05 + 0.39 * strength;
    const remaining = q.base - model.delivered;
    const fill = funnelFill(remaining);
    stock.visible = fill.cylinderHeight > 1e-6;
    coneStock.visible = remaining > 1e-6;
    coneStock.scale.set(fill.coneRadius, fill.coneHeight, fill.coneRadius);
    coneStock.position.y = reservoirBottom - 0.42 + fill.coneHeight / 2;
    stock.scale.y = Math.max(0.0001, fill.cylinderHeight);
    stock.position.y = reservoirBottom + stock.scale.y / 2;
    stockSurface.visible = remaining > 1e-6;
    const surfaceRadius = fill.cylinderHeight > 1e-6 ? 0.65 : fill.coneRadius;
    stockSurface.scale.set(
      surfaceRadius,
      Math.min(1, fill.coneHeight / 0.42),
      surfaceRadius,
    );
    stockSurface.position.y =
      reservoirBottom - 0.42 + fill.coneHeight + fill.cylinderHeight;
    const flight = reactionTiming.firstImpact;
    const lastLaunch = reactionTiming.end - flight;
    const flowing =
      q.time >= 0 && q.time <= lastLaunch && q.base > 0 && q.dosing !== false;
    handle.rotation.x = flowing ? Math.PI / 2 : 0;
    drops.forEach((o, i) => {
      const age = q.time - i * reactionTiming.interval;
      const launch =
        i * reactionTiming.interval +
        Math.floor((age + 1e-9) / flight) * flight;
      const phase = Math.max(0, (q.time - launch) / flight);
      o.visible =
        age >= 0 &&
        launch <= lastLaunch + 1e-9 &&
        q.time < reactionTiming.end &&
        q.base > 0;
      o.position.set(0, 1.67 - phase * phase * (1.67 - surface), -0.15);
      o.scale.set(0.7, 1.2, 0.7);
    });
    updateRipples(q.time, surface, q.base > 0);
    updateFlocs(q, model, height);
    root.userData.measurement = {
      surface,
      totalVolume: q.copper + model.delivered,
      remaining,
    };
  };
  root.userData.update(p);
}
function microscope(root, p) {
  const ivory = "#dedfd5",
    black = "#263437",
    steel = "#a3b0ad";
  box(root, [3.15, 0.32, 2.55], ivory, [-0.8, -0.94, 0.05], 0.16);
  for (const x of [-2, 0.4])
    for (const z of [-0.85, 0.95])
      box(root, [0.36, 0.1, 0.32], black, [x, -1.14, z]);
  microscopeArm(root);
  box(root, [0.9, 0.4, 0.72], ivory, [-0.3, 2.02, 0.1], 0.12);
  // Hollow eyecups and recessed lenses share one aligned optical axis.
  for (const x of [-0.57, -0.03])
    microscopeEyepiece(root, [x, 2.12, 0.12], [x + 0.28, 2.85, 0.52]);
  rod(root, [-0.3, 1.45, 0.1], [-0.3, 1.86, 0.1], 0.23, steel);
  const turret = new T.Group();
  turret.position.set(-0.3, 1.45, -0.2);
  root.add(turret);
  turret.name = "microscope-turret";
  const objectiveAngle = (mag) =>
    mag === 40 ? 0 : mag === 100 ? (-Math.PI * 2) / 3 : (-Math.PI * 4) / 3;
  const turn = createAngleTransition(objectiveAngle(p.mag));
  turret.rotation.y = objectiveAngle(p.mag);
  root.userData.animate = (now, reducedMotion) => {
    const angle = turn.sample(now, reducedMotion);
    if (angle !== turret.rotation.y) root.userData.shadowDirty = true;
    turret.rotation.y = angle;
    return turn.active;
  };
  mesh(turret, new T.CylinderGeometry(0.46, 0.46, 0.12, 64), mat(black));
  repeatedBoxes(
    turret,
    [0.025, 0.09, 0.045],
    steel,
    0.003,
    Array.from({ length: 48 }, (_, j) => {
      const a = (j * Math.PI) / 24;
      return {
        position: [Math.sin(a) * 0.46, 0, Math.cos(a) * 0.46],
        rotation: [0, a, 0],
      };
    }),
    "turret-ribs",
    1,
  );
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3,
      g = new T.Group();
    g.position.set(Math.sin(a) * 0.3, 0, Math.cos(a) * 0.3);
    g.name = "objective-" + [40, 100, 400][i];
    g.userData.action = "parameter";
    g.userData.key = "mag";
    g.userData.value = [40, 100, 400][i];
    turret.add(g);
    const length = 0.38 + i * 0.1;
    objectiveEngraving(g, [4, 10, 40][i], length);
    microscopeObjectiveBarrel(g, length);
    mesh(
      g,
      new T.CylinderGeometry(0.12, 0.12, 0.045, 40),
      mat(["#ae4542", "#d4ad48", "#487fb0"][i]),
      [0, -0.2, 0],
    );
    microscopeObjectiveFront(g, length);
  }
  const stage = new T.Group();
  stage.name = "microscope-stage";
  root.add(stage);
  const updateWorkbench = microscopeWorkbench(root, stage);
  // A real through-hole allows illumination from the condenser to reach the slide.
  const shape = new T.Shape();
  shape.moveTo(-1.08, -0.8);
  shape.lineTo(1.08, -0.8);
  shape.lineTo(1.08, 0.8);
  shape.lineTo(-1.08, 0.8);
  shape.closePath();
  const hole = new T.Path();
  hole.absarc(0, 0, 0.26, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const plate = mesh(
    stage,
    new T.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.025,
      bevelSegments: 2,
      steps: 1,
    }),
    mat(black),
    [-0.3, 0.36, 0.1],
  );
  plate.rotation.x = Math.PI / 2;
  microscopeFasteners(root, stage);
  const glass = new T.MeshPhysicalMaterial({
    color: "#dae8e1",
    transparent: true,
    opacity: 0.36,
    roughness: 0.05,
    depthWrite: false,
    metalness: 0,
  });
  const slide = new T.Group();
  slide.name = "microscope-slide";
  stage.add(slide);
  mesh(slide, new T.BoxGeometry(1.1, 0.024, 0.44), glass);
  mesh(slide, new T.BoxGeometry(0.32, 0.012, 0.32), glass, [0, 0.018, 0]);
  const updateSpecimen = microscopeSpecimenMark(slide);
  box(slide, [0.2, 0.026, 0.42], "#f0ecd8", [-0.43, 0.005, 0], 0.003);
  // The mechanical holder travels with the slide; its fingers contact only
  // the glass ends, leaving the coverslip and transmitted-light path clear.
  const holder = new T.Group();
  holder.name = "microscope-slide-holder";
  slide.add(holder);
  box(holder, [1.23, 0.04, 0.08], steel, [0, -0.006, -0.28], 0.006);
  for (const side of [-1, 1]) {
    box(holder, [0.045, 0.05, 0.5], steel, [side * 0.5725, 0, -0.07], 0.004);
    const finger = box(
      holder,
      [0.1, 0.024, 0.09],
      steel,
      [side * 0.52, side < 0 ? 0.03 : 0.024, 0.12],
      0.003,
    );
    finger.name = `microscope-slide-finger-${side}`;
  }
  // Mechanical X/Y rails and graduated vernier strip.
  box(stage, [2.25, 0.07, 0.13], steel, [-0.3, 0.16, -0.64]);
  box(stage, [0.12, 0.07, 1.65], steel, [0.68, 0.16, 0.1]);
  for (const major of [false, true])
    repeatedBoxes(
      stage,
      [0.012, 0.006, major ? 0.11 : 0.055],
      black,
      0,
      Array.from({ length: 25 }, (_, i) => i)
        .filter((i) => (i % 5 === 0) === major)
        .map((i) => ({ position: [-1.28 + i * 0.08, 0.205, -0.64] })),
      major ? "stage-major-graduations" : "stage-minor-graduations",
    );
  const knobs = [];
  for (const side of [-1, 1]) {
    const x = -1.65 + side * 0.36;
    for (const fine of [false, true]) {
      const g = new T.Group();
      g.position.set(x + side * (fine ? 0.13 : 0), 0.48, -0.5);
      root.add(g);
      g.userData.action = "parameter";
      g.userData.key = fine ? "focus" : "coarse";
      g.userData.delta = fine ? 2 : 5;
      g.name = fine ? "fine-focus-knob" : "coarse-focus-knob";
      const radius = fine ? 0.14 : 0.27;
      if (fine) {
        const collar = mesh(
          g,
          new T.RingGeometry(0.095, 0.133, 48),
          mat("#aab3b7", {
            metalness: 0.8,
            roughness: 0.3,
            side: T.DoubleSide,
          }),
          [side * 0.076, 0, 0],
        );
        collar.name = "fine-focus-dial-ring";
        collar.rotation.y = Math.PI / 2;
        repeatedBoxes(
          g,
          [0.003, 0.021, 0.004],
          "#24343b",
          0,
          Array.from({ length: 20 }, (_, j) => {
            const a = (j * Math.PI) / 10;
            return {
              position: [
                side * 0.079,
                Math.cos(a) * 0.115,
                Math.sin(a) * 0.115,
              ],
              rotation: [a, 0, 0],
              scale: [1, j % 5 === 0 ? 1 : 0.55, 1],
            };
          }),
          "fine-focus-dial-ticks",
          1,
        );
      }
      mesh(
        g,
        new T.CylinderGeometry(radius, radius, 0.14, 48),
        mat(black),
      ).rotation.z = Math.PI / 2;
      repeatedBoxes(
        g,
        [0.15, 0.018, 0.025],
        "#4a5556",
        0.003,
        Array.from({ length: 32 }, (_, j) => {
          const a = (j * Math.PI) / 16;
          return {
            position: [0, Math.sin(a) * radius, Math.cos(a) * radius],
            rotation: [-a, 0, 0],
          };
        }),
        "focus-knob-ribs",
        1,
      );
      box(
        g,
        [0.01, 0.04, 0.02],
        "#e8e6cc",
        [side * 0.08, radius * 0.65, 0],
        0.002,
      );
      knobs.push({ g, fine });
    }
  }
  const updateCondenser = microscopeCondenser(stage);
  const lamp = mesh(
    root,
    new T.CylinderGeometry(0.33, 0.39, 0.12, 48),
    mat("#edeacb", { emissive: "#ffecc4", emissiveIntensity: 0.7 }),
    [-0.3, -0.71, 0.1],
  );
  lamp.name = "microscope-illuminator";
  const powerSwitch = new T.Group();
  powerSwitch.name = "microscope-power-switch";
  powerSwitch.position.set(0.35, -0.744, 0.82);
  powerSwitch.userData = { action: "parameter", key: "power", value: 0 };
  root.add(powerSwitch);
  box(powerSwitch, [0.23, 0.035, 0.33], "#161f24", [0, 0, 0], 0.018);
  const rocker = box(
    powerSwitch,
    [0.17, 0.028, 0.25],
    "#455251",
    [0, 0.026, 0],
    0.012,
  );
  box(rocker, [0.045, 0.002, 0.01], "#d9e5db", [0, 0.015, -0.065], 0.002);
  const lampRim = ring(root, 0.37, steel);
  lampRim.position.set(-0.3, -0.64, 0.1);
  tube(
    root,
    [
      [-2, -0.87, -0.65],
      [-2.7, -1, -1.1],
      [-2.5, -1.12, -1.7],
      [-1.8, -1.12, -1.8],
    ],
    0.035,
    black,
  );
  root.userData.update = (q) => {
    updateWorkbench(q);
    updateCondenser(q.aperture ?? 70);
    updateSpecimen(q.specimen);
    stage.position.y = (q.coarse - 50) * 0.004 + (q.focus - 50) * 0.0007;
    slide.position.set(-0.3 + q.x * 0.008, 0.395, 0.1 - q.y * 0.008);
    turn.setTarget(objectiveAngle(q.mag), performance.now());
    knobs.forEach(
      ({ g, fine }) =>
        (g.rotation.x = ((fine ? q.focus : q.coarse) * Math.PI) / 25),
    );
    const powered = q.power !== 0;
    lamp.material.emissiveIntensity = powered ? q.light / 100 : 0;
    lamp.material.color.set(powered ? "#edeacb" : "#65716d");
    powerSwitch.userData.value = powered ? 0 : 1;
    rocker.rotation.x = powered ? -0.15 : 0.15;
  };
  finishMicroscopeInstrument(root);
  root.userData.update(p);
}
function ecology(root, p) {
  bed(root, "#786243");
  const updateGroundDetails = addEcologyGround(root);
  const ground = habitatHeight,
    sites = habitatSites();
  const soil = ecologySoilGeometry();
  const vertices = soil.getAttribute("position"),
    colors = [];
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i),
      z = vertices.getZ(i);
    vertices.setY(i, ground(x, z));
    const wetBank =
      Math.hypot(x - HABITAT_POND.x, z - HABITAT_POND.z) < 1
        ? 1 -
          T.MathUtils.smoothstep(ground(x, z) - HABITAT_POND.level, 0, 0.055)
        : 0;
    const c = new T.Color().setHSL(
      0.11,
      0.2,
      0.24 + 0.04 * Math.sin(x * 5 + z * 3) - wetBank * 0.065,
    );
    colors.push(c.r, c.g, c.b);
  }
  soil.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  soil.computeVertexNormals();
  const soilTexture = ecologySoilTexture();
  const soilSurface = mesh(
    root,
    soil,
    mat("#b8aa79", {
      vertexColors: true,
      roughness: 1,
      map: soilTexture,
      bumpMap: soilTexture,
      bumpScale: 0.012,
    }),
  );
  soilSurface.userData.ownedTexture = soilTexture;
  const specimens = createEcologySpecimens(),
    butterfly = createButterflyTemplate();
  const plants = [],
    bugs = [],
    birds = [],
    fungi = [];
  for (let i = 0; i < 20; i++) {
    const { x, z } = sites[i];
    const plant = specimens.plant(i);
    plant.position.set(x, ground(x, z), z);
    plant.name = "sample-plant";
    plant.userData.action = "ecology-observation";
    plant.userData.specimenKind = "plant";
    plant.rotation.y = i * 2.39996;
    const height = i === 0 ? 1 : 0.72 + ((i * 7) % 11) * 0.028;
    const width = i === 0 ? 1 : 0.82 + ((i * 3) % 7) * 0.035;
    plant.scale.set(width, height, width);
    root.add(plant);
    plants.push(plant);
    const bug = butterfly();
    bug.name = "sample-insect";
    bug.userData.action = "ecology-observation";
    bug.userData.specimenKind = "insect";
    root.add(bug);
    bugs.push(bug);
  }
  const makeBird = createEcologyBirdTemplate();
  for (let i = 0; i < 10; i++) {
    const bird = makeBird();
    bird.name = "sample-bird";
    bird.userData.action = "ecology-observation";
    bird.userData.specimenKind = "bird";
    root.add(bird);
    birds.push(bird);
  }
  for (let i = 0; i < 15; i++) {
    const g = specimens.fungus();
    g.name = "sample-fungus";
    g.userData.action = "ecology-observation";
    g.userData.specimenKind = "fungus";
    const { x, z } = sites[i + 20];
    g.position.set(x, ground(x, z), z);
    // Stable individual variation within one illustrative species. Keep the
    // first specimen at reference scale for the teaching close-up.
    const width = i === 0 ? 1 : 0.72 + ((i * 7) % 11) * 0.03;
    const height = i === 0 ? 1 : 0.8 + ((i * 5) % 9) * 0.035;
    g.scale.set(width, height, width);
    g.rotation.y = i * 2.399963;
    root.add(g);
    fungi.push(g);
  }
  const pond = createEcologyPond();
  root.add(pond);
  // Keep the illustrative flight corridor above the tallest displayed plant.
  // Include a small allowance for the existing wind sway and the full wingspan.
  const plantBounds = new T.Box3();
  let canopyTop = -Infinity;
  for (const plant of plants) {
    plant.updateMatrixWorld(true);
    plantBounds.setFromObject(plant);
    canopyTop = Math.max(canopyTop, plantBounds.max.y);
  }
  const insectFlightCenter = canopyTop + 0.58;
  root.userData.update = (q) => {
    updateGroundDetails(q.groundDetails !== 0);
    pond.userData.update(q.time);
    plants.forEach((g, i) => {
      g.visible = i < q.plants;
      g.rotation.z = Math.sin(q.time * 1.2 + i) * 0.035;
    });
    fungi.forEach((g, i) => (g.visible = i < q.fungi));
    bugs.forEach((g, i) => {
      g.visible = i < q.insects;
      g.position.set(
        Math.sin(q.time * 0.4 + i * 2) * 2.8,
        insectFlightCenter + Math.sin(q.time * 0.7 + i) * 0.18,
        Math.cos(q.time * 0.3 + i) * 1.9,
      );
      const vx = 1.12 * Math.cos(q.time * 0.4 + i * 2),
        vy = 0.126 * Math.cos(q.time * 0.7 + i),
        vz = -0.57 * Math.sin(q.time * 0.3 + i);
      g.rotation.set(
        -Math.atan2(vy, Math.hypot(vx, vz)),
        Math.atan2(vx, vz),
        0,
        "YXZ",
      );
      g.children
        .filter((o) => o.userData.wing)
        .forEach(
          (w, j) =>
            (w.rotation.z =
              (0.25 + Math.sin(q.time * 18 + i) * 0.85) * (j ? 1 : -1)),
        );
    });
    birds.forEach((g, i) => {
      g.visible = i < q.birds;
      const a = q.time * 0.25 + i * 1.6;
      g.position.set(
        Math.cos(a) * 2.9,
        1.3 + (i % 3) * 0.35,
        Math.sin(a) * 1.7,
      );
      g.rotation.y = Math.atan2(-2.9 * Math.sin(a), 1.7 * Math.cos(a));
      g.children
        .filter((o) => o.userData.wing)
        .forEach(
          (w, j) =>
            (w.rotation.z = Math.sin(q.time * 6 + i) * (j ? 1 : -1) * 0.6),
        );
    });
  };
  root.userData.update(p);
}
function volcano(root, p) {
  root.userData.focusBounds = {
    volcanoCrater: new T.Box3(
      new T.Vector3(-1.15, 1.2, -1.15),
      new T.Vector3(1.15, 2.65, 1.15),
    ),
    volcanoInterior: new T.Box3(
      new T.Vector3(-1.1, -1.6, -0.65),
      new T.Vector3(1.1, 2.35, 1.15),
    ),
  };
  root.userData.focusDirections = {
    volcanoCrater: [-0.3, 0.9, 1],
    volcanoInterior: [-0.24, 0.16, 1],
  };
  root.userData.focusMinDistance = { volcanoCrater: 1.5, volcanoInterior: 2 };
  const rock = surfaceTexture("rock");
  const surface = mat("#665747", {
    roughness: 1,
    map: rock,
    bumpMap: rock,
    bumpScale: 0.16,
    side: T.DoubleSide,
    vertexColors: true,
  });
  surface.color.set("#ffffff");
  surface.metalness = 0;
  surface.bumpScale = 0.07;
  const mountain = mesh(
    root,
    volcanoShell(Math.PI * 0.15, Math.PI * 1.55),
    surface,
  );
  const closure = mesh(
    root,
    volcanoShell(Math.PI * 1.7, Math.PI * 0.45, 40),
    surface,
  );
  mountain.name = "volcano-rock-shell";
  closure.name = "volcano-cutaway-shell";
  const updateDebris = addVolcanoDebris(root);
  const sectionMaterial = createVolcanoSectionMaterial();
  const cutFaces = [Math.PI * 0.15, Math.PI * 1.7].map((angle) =>
    mesh(root, volcanoCutFace(angle), sectionMaterial),
  );
  const cutBase = [];
  for (let i = 0; i < 4; i++) {
    const y = -0.82 - i * 0.23,
      color = ["#7c6350", "#9d8061", "#67534a", "#856a52"][i];
    const layerMaterial = mat(color, {
      roughness: 1,
      metalness: 0,
      map: rock,
      bumpMap: rock,
      bumpScale: 0.025,
    });
    const layerBlock = (size, position) => {
      const block = box(root, size, color, position);
      block.material.dispose();
      block.material = layerMaterial;
      block.name = "volcano-basement-layer";
      return block;
    };
    layerBlock([6.6, 0.23, 2.8], [0, y, -1.4]);
    layerBlock([2.25, 0.23, 2.9], [-2.18, y, 1.45]);
    layerBlock([2.25, 0.23, 2.9], [2.18, y, 1.45]);
    cutBase.push(layerBlock([2.1, 0.23, 2.9], [0, y, 1.45]));
  }
  const magma = ball(root, [0, -1.15, 0], 0.7, "#e35422", {
    emissive: "#f15318",
    emissiveIntensity: 1.3,
  });
  magma.scale.set(1.3, 0.7, 1);
  const magmaMaterial = createVolcanoMagmaMaterial();
  const applyMagma = (object) => {
    object.material.dispose();
    object.material = magmaMaterial;
    return object;
  };
  applyMagma(magma);
  applyMagma(
    tube(
      root,
      [
        [0, -1.1, 0],
        [0.2, -0.3, 0],
        [-0.1, 0.8, 0],
        [0, 1.95, 0],
      ],
      0.16,
      "#e2782c",
      { emissive: "#e65314", emissiveIntensity: 1 },
    ),
  );
  for (let j = 0; j < 5; j++)
    applyMagma(
      tube(
        root,
        [
          [0, -0.9, 0],
          [0.6 * Math.cos(j), -0.5, 0.6 * Math.sin(j)],
          [1.3 * Math.cos(j), -0.7, 1.3 * Math.sin(j)],
        ],
        0.07,
        "#ae542f",
        { emissive: "#a73915", emissiveIntensity: 0.5 },
      ),
    );
  const lava = [];
  for (let j = 0; j < 4; j++) {
    const angle = Math.PI / 2 - (j * 1.3 + 1);
    const flow = mesh(root, volcanoLava(angle), createVolcanoLavaMaterial());
    flow.name = "volcano-lava-ribbon";
    lava.push(flow);
  }
  const updatePlume = addVolcanoPlume(root);
  const structureLabels = addStructureLabels(
    root,
    "volcano-structure-labels",
    [
      ["岩浆储集区", [0.1, -1.05, 0.55], [0, -1.35, 2.7]],
      ["主通道", [0, 0.75, 0.16], [0.8, 0.75, 2]],
      ["火山口", [0, 2.05, 0], [1.8, 2.55, 1.5]],
    ],
    0.36,
  );
  // Opaque rock must occlude annotations when the section is viewed from behind.
  structureLabels.traverse((object) => {
    if (object.material) object.material.depthTest = true;
  });
  root.userData.beforeRender = cellLabelLayout(root, {
    minPixelHeight: 24,
    maxPixelHeight: 32,
  }).update;
  root.userData.update = (q) => {
    const t = q.time;
    structureLabels.visible = !!q.cut && q.labels !== 0;
    updatePlume(q);
    closure.visible = !q.cut;
    updateDebris(q.cut);
    cutFaces.forEach((o) => (o.visible = !!q.cut));
    cutBase.forEach((o) => (o.visible = !q.cut));
    magmaMaterial.userData.updateMagma(t);
    lava.forEach((o, i) => {
      const phi =
        (((Math.PI / 2 - (i * 1.3 + 1)) % (2 * Math.PI)) + 2 * Math.PI) %
        (2 * Math.PI);
      o.visible =
        q.showLava !== 0 &&
        t > 3 &&
        (!q.type || i < 2) &&
        (!q.cut || (phi > Math.PI * 0.15 + 0.04 && phi < Math.PI * 1.7 - 0.04));
      const fraction = Math.max(0, Math.min(1, (t - 3) / (q.type ? 9 : 6)));
      o.geometry.setDrawRange(
        0,
        Math.ceil(fraction * o.geometry.userData.rows) * 24,
      );
      o.material.userData.updateLava(t, fraction);
    });
  };
  root.userData.update(p);
}
export const advancedBuilders = {
  photosynthesis: buildPhotosynthesisBench,
  water: buildWaterBench,
  conics: buildConicBench,
  solids,
  slope,
  incline: slope,
  capacitor,
  precipitation: reaction,
  microscope,
  biodiversity: ecology,
  volcano,
  earthquake,
};
export function buildAdvanced(root, id, p) {
  advancedBuilders[id](root, { ...p, time: p.time || 0 });
}
