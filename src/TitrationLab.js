import * as THREE from "three";
import { buretteGraduations } from "./buretteScale.mjs";
import { beaker } from "./GlassLab.js";
import { box, panel } from "./CircuitBench.js";
import { teachingGlassMaterial } from "./TeachingGlass.js";
import { ph } from "./models.mjs";
import { addTitrationDrops } from "./TitrationDrops.js";
import { createDropImpactSurface } from "./DropImpactSurface.js";
import { addBuretteDetails } from "./BuretteDetails.js";
import { addBuretteClamps } from "./BuretteClamps.js";
import { addStructureLabels } from "./ChloroplastLabels.js";
import { createInstrumentFinishTexture } from "./MicroscopeMaterials.js";
import { addPHMeterHousing } from "./PHMeterHousing.js";

export function buildTitrationLab(root, p) {
  box(root, [7.3, 0.23, 4.4], "#314e4e", [0, -0.92, 0.1]);
  for (const x of [-3.1, 3.1])
    for (const z of [-1.5, 1.7])
      box(root, [0.28, 0.415, 0.28], "#263633", [x, -1.2425, z]);
  box(root, [2.1, 0.305, 2.1], "#e0e2d6", [0, -0.6525, 0]);
  const support = box(
    root,
    [1.8, 0.0275, 1.8],
    "#344847",
    [0, -0.48625, 0],
    0.012,
  );
  support.name = "titration-support-mat";
  support.material.metalness = 0;
  support.material.roughness = 0.88;
  support.material.roughnessMap = createInstrumentFinishTexture(false);
  support.userData.ownedTexture = support.material.roughnessMap;
  const cup = beaker(root, 0);
  const impacts = createDropImpactSurface(cup.meniscus.geometry);
  const drops = addTitrationDrops(root, impacts.impact);
  root.userData.emitDoseDrop = () => {
    burette.pulse();
    drops.emitOne();
  };
  root.userData.animate = (now, reducedMotion) => {
    const valveMoving = burette.animate(now, reducedMotion);
    const falling = drops.animate(now, reducedMotion);
    const rippling = impacts.animate(now, reducedMotion);
    return valveMoving || falling || rippling;
  };
  const metal = new THREE.MeshStandardMaterial({
    color: "#a5b4b8",
    metalness: 0.8,
    roughness: 0.3,
  });
  const plastic = new THREE.MeshStandardMaterial({
    color: "#31515b",
    roughness: 0.7,
  });
  function rod(a, b, r, material, name) {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b),
      delta = end.clone().sub(start);
    const object = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, delta.length(), 24),
      material,
    );
    object.position.copy(start.add(end).multiplyScalar(0.5));
    object.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      delta.normalize(),
    );
    object.name = name;
    object.castShadow = object.receiveShadow = true;
    root.add(object);
    return object;
  }
  box(root, [1, 0.12, 0.9], "#253d46", [1.55, -0.745, -0.7]);
  rod([1.55, -0.685, -0.7], [1.55, 5.25, -0.7], 0.04, metal, "burette-support");
  addBuretteClamps(root, metal);
  const liquid = rod(
    [0, 2.6, 0],
    [0, 5.1, 0],
    0.097,
    new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      transmission: 1,
      roughness: 0.025,
      thickness: 0.05,
      ior: 1.333,
    }),
    "burette-liquid",
  );
  const burette = addBuretteDetails(root, liquid.material);
  // Ordinary shadow maps treat transmissive liquid as opaque. Keep the clear
  // column from casting a solid moving shadow; caustics are not simulated.
  liquid.castShadow = false;
  // Open at the reading plane: the concave meniscus supplies the only top
  // surface. A capped cylinder would add a second, flat refracting surface.
  liquid.geometry.dispose();
  liquid.geometry = new THREE.LatheGeometry(
    [
      [0, -1.25],
      [0.097, -1.25],
      [0.097, 1.25],
    ].map((point) => new THREE.Vector2(...point)),
    40,
  );
  const marks = panel(
    root,
    [0, 3.85, 0.124],
    0.2,
    2.5,
    (ctx) => {
      ctx.clearRect(0, 0, 128, 4096);
      ctx.save();
      ctx.scale(1, 4);
      ctx.strokeStyle = ctx.fillStyle = "#dae5df";
      ctx.font = "22px sans-serif";
      ctx.textBaseline = "middle";
      for (const { volume, fraction, kind } of buretteGraduations) {
        const y = fraction * 1024;
        ctx.lineWidth = kind === "minor" ? 0.45 : 1;
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(kind === "numbered" ? 65 : kind === "unit" ? 48 : 32, y);
        ctx.stroke();
        if (kind === "numbered")
          ctx.fillText(String(volume), 70, Math.max(11, Math.min(1013, y)));
      }
      ctx.restore();
    },
    [128, 4096],
  );
  if (marks.object) {
    marks.object.material.transparent = true;
    marks.object.material.depthWrite = false;
    marks.object.userData.dynamicDisplay = false;
    marks.update();
  }
  // A glass sensing bulb stays immersed at the minimum allowed sample volume.
  rod(
    [-0.5, -0.28, -0.2],
    [-0.5, 2.28, -0.2],
    0.035,
    teachingGlassMaterial(),
    "ph-electrode-stem",
  );
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 24, 16),
    new THREE.MeshPhysicalMaterial({
      color: "#becdc5",
      roughness: 0.2,
      transparent: true,
      opacity: 0.72,
      ior: 1.47,
    }),
  );
  bulb.position.set(-0.5, -0.3, -0.2);
  bulb.name = "ph-electrode-bulb";
  root.add(bulb);
  rod(
    [-0.5, 2.05, -0.2],
    [-0.5, 2.45, -0.2],
    0.065,
    plastic,
    "ph-electrode-handle",
  );
  rod([1.55, 2.3, -0.7], [-0.5, 2.3, -0.2], 0.025, metal, "ph-electrode-clamp");
  box(root, [1.55, 0.6, 0.8], "#304b55", [2.55, -0.43, 0.6]);
  addPHMeterHousing(root);
  for (const x of [2, 3.1])
    for (const z of [0.35, 0.85])
      box(root, [0.15, 0.075, 0.15], "#243737", [x, -0.7675, z], 0.012);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(
        [
          [-0.5, 2.45, -0.2],
          [0.3, 2.7, -0.65],
          [1.5, 1.4, -0.65],
          [2.55, -0.08, 0.45],
        ].map((v) => new THREE.Vector3(...v)),
      ),
      48,
      0.025,
      8,
      false,
    ),
    plastic,
  );
  root.add(cable);
  const display = panel(
    root,
    [2.55, -0.4, 1.011],
    1.3,
    0.42,
    (ctx, q) => {
      ctx.fillStyle = "#112b30";
      ctx.fillRect(0, 0, 512, 160);
      ctx.textAlign = "center";
      ctx.fillStyle = "#c8e7d9";
      ctx.font = "bold 66px monospace";
      ctx.fillText(`pH ${ph(q.acid, q.base, q.c).toFixed(2)}`, 256, 78);
      ctx.font = "24px sans-serif";
      ctx.fillText("25°C · 理想模型", 256, 133);
    },
    [512, 160],
  );
  const meterLabels = addStructureLabels(
    root,
    "titration-meter-labels",
    [
      ["模型 pH 读数", [1.92, -0.2, 1.015], [2.55, 0.17, 1.05]],
      ["电极信号线", [2.55, -0.08, 0.45], [3.3, 0.35, 0.5]],
    ],
    0.1,
  );
  const electrodeLabels = addStructureLabels(
    root,
    "titration-electrode-labels",
    [
      ["玻璃感应球泡", [-0.5, -0.3, -0.2], [-1.25, 0.15, 0]],
      ["电极杆", [-0.5, 0.5, -0.2], [-1.3, 0.85, 0]],
    ],
    0.08,
  );
  meterLabels.visible = electrodeLabels.visible = false;
  root.userData.setFocusAnnotations = (view) => {
    meterLabels.visible = view === "readout";
    electrodeLabels.visible = view === "electrode";
  };
  let last;
  root.userData.update = (q) => {
    burette.update(q.base, q.dosing);
    cup.setLevel((q.acid + q.base) / 250);
    drops.setState(
      q.dosing && q.base < 100,
      -0.4725 + 0.07 + 0.08 + (2.12 * (q.acid + q.base)) / 250,
      q.doseRate,
    );
    const h = (2.5 * (100 - q.base)) / 100;
    liquid.visible = h > 0;
    liquid.scale.y = Math.max(0.0001, h / 2.5);
    liquid.position.y = 2.6 + h / 2;
    const reading = ph(q.acid, q.base, q.c).toFixed(2);
    if (reading !== last) {
      last = reading;
      display.update(q);
    }
  };
  root.userData.update(p);
}
