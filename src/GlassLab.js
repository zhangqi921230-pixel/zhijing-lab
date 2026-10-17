import * as THREE from "three";
import { box, panel } from "./CircuitBench.js";
import { solubility } from "./models.mjs";
import {
  beakerWallGeometry,
  beakerLipGeometry,
  beakerGraduationGeometry,
  BEAKER_SCALE_BOTTOM,
  BEAKER_SCALE_SPAN,
  BEAKER_PRINT_BOTTOM,
  BEAKER_PRINT_HEIGHT,
} from "./BeakerGeometry.js";
import { repeatedBoxes } from "./MicroscopeBatch.js";
import {
  liquidSurfaceGeometry,
  MENISCUS_RISE,
  beakerLiquidWall,
} from "./LiquidSurface.js";
import { teachingGlassMaterial } from "./TeachingGlass.js";
import { addWaterDispenser } from "./WaterDispenser.js";
import { createLiquidRipples } from "./LiquidRipples.js";
import { addTemperatureProbe } from "./TemperatureProbe.js";
import { addSolutionCrystals } from "./SolutionCrystals.js";
import { drawBalanceDisplay } from "./BalanceDisplay.js";

function add(root, geometry, material, pos) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...pos);
  root.add(mesh);
  mesh.receiveShadow = true;
  return mesh;
}
export function beaker(root, x) {
  const g = new THREE.Group();
  g.position.set(x, -0.4725, 0);
  root.add(g);
  const glass = teachingGlassMaterial();
  const wall = add(g, beakerWallGeometry(), glass, [0, 0, 0]);
  wall.name = "beaker-glass-wall";
  add(
    g,
    beakerLipGeometry(),
    new THREE.MeshStandardMaterial({
      color: "#d7e5e4",
      roughness: 0.16,
      metalness: 0,
      transparent: true,
      opacity: 0.45,
    }),
    [0, 0, 0],
  );
  const waterMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.025,
    transmission: 1,
    thickness: 0.15,
    ior: 1.333,
    metalness: 0,
  });
  const liquidWall = beakerLiquidWall();
  const liquid = add(g, liquidWall.geometry, waterMaterial, [0, 0, 0]);
  liquid.name = "beaker-liquid-wall";
  const bottom = add(
    g,
    new THREE.CircleGeometry(0.759, 64),
    waterMaterial,
    [0, 0.07, 0],
  );
  bottom.rotation.x = Math.PI / 2;
  const surfaceMaterial = waterMaterial.clone();
  surfaceMaterial.roughness = 0.025;
  surfaceMaterial.clearcoat = 0;
  surfaceMaterial.clearcoatRoughness = 0.04;
  const meniscus = add(g, liquidSurfaceGeometry(), surfaceMaterial, [0, 1, 0]);
  meniscus.name = "beaker-liquid-surface";
  // Relative level, not mL: no density assumption is made by this teaching model.
  if (typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 768;
    const ctx = c.getContext("2d");
    ctx.strokeStyle = "#ecf2eb";
    ctx.fillStyle = "#ecf2eb";
    ctx.font = "27px sans-serif";
    for (let i = 1; i <= 25; i++) {
      const level = BEAKER_SCALE_BOTTOM + (BEAKER_SCALE_SPAN * i) / 25;
      const y = 768 * (1 - (level - BEAKER_PRINT_BOTTOM) / BEAKER_PRINT_HEIGHT);
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(i % 5 === 0 ? 92 : 62, y);
      ctx.lineWidth = 3;
      ctx.stroke();
      if (i % 5 === 0) ctx.fillText(`${i * 4}%`, 112, y + 8);
    }
    ctx.font = "22px sans-serif";
    ctx.fillText("相对高度", 24, 22);
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    const marks = add(
      g,
      beakerGraduationGeometry(),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
      [0, 0, 0],
    );
    marks.name = "beaker-printed-graduations";
    marks.userData.ownedTexture = texture;
  }
  return {
    g,
    liquid,
    meniscus,
    setLevel(fraction) {
      const h = BEAKER_SCALE_BOTTOM - 0.07 + BEAKER_SCALE_SPAN * fraction;
      meniscus.position.y = 0.07 + h;
      const radius = liquidWall.update(meniscus.position.y + MENISCUS_RISE);
      meniscus.scale.set(radius / 0.811, 1, radius / 0.811);
    },
  };
}
function plate(root, x, title, label = null, mass = null) {
  const base = box(root, [2.05, 0.22, label ? 2.55 : 2.05], "#dadfd7", [
    x,
    -0.64,
    label ? 0.22 : 0,
  ]);
  const balanceAction = label
    ? { action: "balance-view", view: x < 0 ? "originalBalance" : "balance" }
    : null;
  if (balanceAction) Object.assign(base.userData, balanceAction);
  if (label) {
    const pan = add(
      root,
      new THREE.CylinderGeometry(0.94, 0.91, 0.055, 64),
      new THREE.MeshStandardMaterial({
        color: "#a9b4b2",
        metalness: 0.75,
        roughness: 0.42,
      }),
      [x, -0.5, 0],
    );
    pan.name = `balance-pan-${x}`;
    box(root, [1.85, 0.035, 0.39], "#30484d", [x, -0.518, 1.17], 0.015);
    const nameplate = panel(
      root,
      [x, -0.498, 1.17],
      1.68,
      0.29,
      (ctx) => {
        ctx.fillStyle = "#30484d";
        ctx.fillRect(0, 0, 512, 96);
        ctx.fillStyle = "#e1d6b2";
        ctx.font = "bold 38px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, 256, 43);
        ctx.fillStyle = "#afc4c3";
        ctx.font = "22px sans-serif";
        ctx.fillText("溶液净质量 · 已去皮", 256, 78);
      },
      [512, 96],
    );
    if (nameplate.object) {
      nameplate.object.rotation.x = -Math.PI / 2;
      nameplate.object.userData.dynamicDisplay = false;
      nameplate.object.name = `balance-label-${x}`;
      Object.assign(nameplate.object.userData, balanceAction);
      nameplate.update();
    }
  } else box(root, [1.72, 0.055, 1.7], "#839a96", [x, -0.5, 0]);
  repeatedBoxes(
    root,
    [0.2, 0.055, 0.2],
    "#263633",
    0.012,
    [-0.78, 0.78].flatMap((dx) =>
      [-0.78, 0.78].map((z) => ({ position: [x + dx, -0.7775, z] })),
    ),
    `glass-base-feet-${x}`,
  );
  const display = panel(
    root,
    [x, -0.62, label ? 1.505 : 1.035],
    1.6,
    0.16,
    (ctx, p) => {
      if (mass) {
        drawBalanceDisplay(ctx, mass(p));
        return;
      }
      ctx.fillStyle = "#183b3b";
      ctx.fillRect(0, 0, 768, 80);
      ctx.fillStyle = "#d6eee4";
      ctx.font = "bold 52px monospace";
      ctx.textAlign = "center";
      ctx.fillText(title(p), 384, 59);
      ctx.textAlign = "left";
    },
    [768, 80],
  );
  if (display.object && balanceAction)
    Object.assign(display.object.userData, balanceAction);
  let previousText;
  return {
    update(q) {
      const text = title(q);
      if (text === previousText) return;
      previousText = text;
      display.update(q);
    },
  };
}
export function buildGlassLab(root, id, p) {
  box(root, [7.3, 0.23, 4.4], "#314e4e", [0, -0.92, 0.1]);
  repeatedBoxes(
    root,
    [0.28, 0.415, 0.28],
    "#263633",
    0.035,
    [-3.1, 3.1].flatMap((x) =>
      [-1.5, 1.7].map((z) => ({ position: [x, -1.2425, z] })),
    ),
    "glass-table-feet",
  );
  const xs = id === "dilution" ? [-1.65, 1.65] : [0];
  const cups = xs.map((x) => beaker(root, x));
  const updateDispenser = id === "dilution" ? addWaterDispenser(root) : null;
  const ripples =
    id === "dilution" ? createLiquidRipples(cups[1].meniscus.geometry) : null;
  let supplying = false;
  const updateWaterContact = () => {
    const surface = cups[1].meniscus;
    updateDispenser(
      supplying,
      cups[1].g.position.y +
        surface.position.y +
        surface.geometry.attributes.position.getY(0),
    );
  };
  if (ripples)
    root.userData.animate = (now, reducedMotion) => {
      const active = ripples.animate(now, reducedMotion);
      updateWaterContact();
      return active;
    };
  const displays = xs.map((x, i) =>
    plate(
      root,
      x,
      (q) =>
        id === "dilution"
          ? `净重 ${(q.solute + q.water + (i ? q.add : 0)).toFixed(1)} g`
          : `KNO₃  ·  ${q.temp.toFixed(1)} °C`,
      id === "dilution" ? (i ? "02 · 稀释后" : "01 · 原溶液") : null,
      id === "dilution" ? (q) => q.solute + q.water + (i ? q.add : 0) : null,
    ),
  );
  let updateCrystals;
  const updateTemperature =
    id === "solubility" ? addTemperatureProbe(root) : null;
  if (id === "solubility") {
    updateCrystals = addSolutionCrystals(cups[0].g);
    // A glass stirring rod rests beside the vessel, not through the liquid surface.
    const rod = add(
      root,
      new THREE.CylinderGeometry(0.035, 0.035, 3, 16),
      new THREE.MeshPhysicalMaterial({
        color: "#b8d8d2",
        transmission: 0.7,
        roughness: 0.1,
        thickness: 0.06,
      }),
      [1.8, -0.77, 0.2],
    );
    rod.rotation.x = Math.PI / 2;
    rod.rotation.z = 0.3;
  }
  let previous;
  root.userData.update = (q) => {
    supplying = !!q.addingWater && q.add < 300;
    ripples?.setFlow(supplying);
    const state =
      id === "dilution"
        ? [q.solute, q.water, q.add]
        : [q.temp, q.water, q.mass];
    if (previous && state.every((value, index) => value === previous[index])) {
      if (updateDispenser) updateWaterContact();
      return;
    }
    previous = state;
    if (id === "dilution")
      cups.forEach((cup, i) =>
        cup.setLevel((q.solute + q.water + (i ? q.add : 0)) / 560),
      );
    else {
      cups[0].setLevel(q.water / 240);
      const remaining = Math.max(
        0,
        q.mass - (solubility(q.temp) * q.water) / 100,
      );
      updateCrystals(remaining);
    }
    if (updateDispenser) updateWaterContact();
    displays.forEach((d) => d.update(q));
    updateTemperature?.(q);
  };
  root.userData.update(p);
}
