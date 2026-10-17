import { repeatedBoxes } from "./MicroscopeBatch.js";
import { microscopeBenchMaterial } from "./MicroscopeMaterials.js";
import * as T from "three";
import { box, panel } from "./CircuitBench.js";

function cylinder(parent, radius, length, position, color, axis = "y") {
  const part = new T.Mesh(
    new T.CylinderGeometry(radius, radius, length, 48),
    new T.MeshStandardMaterial({
      color,
      metalness: color === "#aab3b7" ? 0.75 : 0.08,
      roughness: 0.36,
    }),
  );
  part.position.set(...position);
  if (axis === "x") part.rotation.z = Math.PI / 2;
  part.castShadow = part.receiveShadow = true;
  parent.add(part);
  return part;
}

export function microscopeArm(root) {
  const shape = new T.Shape();
  shape.moveTo(-2, -0.82);
  shape.lineTo(-2.03, 1.55);
  shape.quadraticCurveTo(-2.03, 2.26, -1.45, 2.32);
  shape.lineTo(-0.26, 2.32);
  shape.quadraticCurveTo(0.02, 2.32, 0.02, 2.07);
  shape.lineTo(0.02, 1.85);
  shape.lineTo(-0.65, 1.85);
  shape.quadraticCurveTo(-1.3, 1.83, -1.33, 1.22);
  shape.lineTo(-1.33, -0.82);
  shape.closePath();
  const body = new T.Mesh(
    new T.ExtrudeGeometry(shape, {
      depth: 0.58,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.055,
      bevelSegments: 4,
      steps: 1,
      curveSegments: 24,
    }),
    new T.MeshPhysicalMaterial({
      color: "#d9dddc",
      roughness: 0.32,
      metalness: 0.08,
      clearcoat: 0.25,
      clearcoatRoughness: 0.3,
    }),
  );
  body.position.z = -0.8;
  body.name = "cast-microscope-arm";
  body.castShadow = body.receiveShadow = true;
  root.add(body);
  // Vertical rack and carriage remain connected as the stage moves.
  box(root, [0.12, 1.62, 0.08], "#aab3b7", [-1.3, 0.43, -0.2], 0.008);
  repeatedBoxes(
    root,
    [0.14, 0.014, 0.028],
    "#687478",
    0.002,
    Array.from({ length: 38 }, (_, i) => ({
      position: [-1.3, -0.31 + i * 0.04, -0.144],
    })),
    "rack-teeth",
    1,
  );
}

export function microscopeWorkbench(root, stage) {
  // Feet end at -1.19, mat top is -1.19, bench top is -1.24.
  const bench = box(root, [7.8, 0.2, 4.4], "#aeb9bb", [-0.7, -1.34, 0], 0.04);
  bench.name = "microscope-workbench";
  bench.material.dispose();
  bench.material = microscopeBenchMaterial();
  box(root, [3.45, 0.05, 2.85], "#3b494c", [-0.8, -1.215, 0.05], 0.04);
  box(stage, [0.44, 0.46, 0.6], "#323f44", [-1.42, 0.22, -0.34], 0.06);
  box(stage, [1.05, 0.14, 0.44], "#313e43", [-0.99, 0.17, -0.34], 0.035);
  // Handwheels on a supported bracket drive the same X/Y slide coordinates.
  box(stage, [0.25, 0.21, 0.55], "#29373a", [0.79, 0.1, 0.43], 0.025);
  const wheels = [];
  for (const [key, y] of [
    ["x", 0.06],
    ["y", -0.14],
  ]) {
    const g = new T.Group();
    g.name = `stage-${key}-handwheel`;
    g.position.set(0.9, y, 0.43);
    g.userData = { action: "parameter", key, delta: 2, min: -40, max: 40 };
    stage.add(g);
    cylinder(g, 0.12, 0.17, [0, 0, 0], "#24343b", "x");
    repeatedBoxes(
      g,
      [0.18, 0.012, 0.018],
      "#657074",
      0.002,
      Array.from({ length: 24 }, (_, j) => {
        const a = (j * Math.PI) / 12;
        return {
          position: [0, Math.cos(a) * 0.12, Math.sin(a) * 0.12],
          rotation: [a, 0, 0],
        };
      }),
      "stage-wheel-ribs",
      1,
    );
    cylinder(g, 0.065, 0.01, [0.09, 0, 0], "#aab3b7", "x");
    wheels.push({ g, key });
  }
  const accessories = new T.Group();
  accessories.name = "microscope-accessories";
  root.add(accessories);
  // Slide storage: distinct glass blanks, labels, cover-slip case and forceps.
  box(accessories, [1.03, 0.12, 1.85], "#e3e6e1", [-3.05, -1.18, 0.1], 0.035);
  repeatedBoxes(
    accessories,
    [0.89, 0.025, 0.024],
    "#8b9794",
    0.004,
    Array.from({ length: 6 }, (_, i) => ({
      position: [-3.05, -1.109, -0.715 + i * 0.31],
    })),
    "slide-tray-dividers",
    1,
  );
  const stored = [];
  for (let i = 0; i < 5; i++) {
    const holder = new T.Group();
    holder.name = `stored-specimen-${i}`;
    if (i < 3)
      holder.userData = { action: "parameter", key: "specimen", value: i };
    accessories.add(holder);
    const slide = box(
      holder,
      [0.82, 0.018, 0.23],
      "#b7d0d0",
      [-3.05, -1.108, -0.56 + i * 0.31],
      0.009,
    );
    slide.name = "stored-glass-slide";
    slide.material.dispose();
    slide.material = new T.MeshPhysicalMaterial({
      color: "#bad9d9",
      roughness: 0.12,
      metalness: 0,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      clearcoat: 0.6,
    });
    const paper = box(
      holder,
      [0.22, 0.019, 0.23],
      "#f1ecd9",
      [-3.33, -1.1, -0.56 + i * 0.31],
      0.003,
    );
    const inscription = panel(
      holder,
      [-3.33, -1.088, -0.56 + i * 0.31],
      0.205,
      0.215,
      (c) => {
        c.clearRect(0, 0, c.canvas.width, c.canvas.height);
        c.fillStyle = "#3d4d4d";
        c.textAlign = "center";
        c.font = "bold 30px sans-serif";
        c.fillText(["字母 e", "洋葱", "池塘", "空白", "空白"][i], 64, 62);
        c.font = "19px sans-serif";
        c.fillText(i < 3 ? `0${i + 1}` : "—", 64, 98);
      },
      [128, 128],
    );
    if (inscription.object) {
      inscription.object.rotation.x = -Math.PI / 2;
      inscription.object.material.transparent = true;
      inscription.object.material.depthWrite = false;
    }
    inscription.update();
    if (i < 3) {
      const sample = new T.Group();
      sample.position.set(-2.91, -1.108, -0.56 + i * 0.31);
      holder.add(sample);
      microscopeSpecimenMark(sample)(i);
      const cover = box(
        sample,
        [0.205, 0.006, 0.205],
        "#c6dfdf",
        [0, 0.019, 0],
        0.002,
      );
      cover.material.dispose();
      cover.material = slide.material.clone();
      cover.material.opacity = 0.2;
    }
    stored.push(paper);
  }
  box(accessories, [0.72, 0.14, 0.62], "#dce2df", [-2.88, -1.17, 1.43], 0.025);
  const title = panel(accessories, [-2.88, -1.093, 1.43], 0.63, 0.44, (c) => {
    const w = c.canvas.width,
      h = c.canvas.height;
    c.fillStyle = "#eef0e8";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#30434b";
    c.textAlign = "center";
    c.font = "bold 38px sans-serif";
    c.fillText("盖玻片", w / 2, h * 0.48);
    c.font = "24px sans-serif";
    c.fillText("18 × 18 mm", w / 2, h * 0.73);
  });
  if (title.object) title.object.rotation.x = -Math.PI / 2;
  title.update();
  for (const offset of [-0.055, 0.055]) {
    const strip = box(
      accessories,
      [0.024, 0.019, 1.08],
      "#aab3b7",
      [1.35 + offset, -1.218, 0.85],
      0.008,
    );
    strip.rotation.y = offset * 1.8;
  }
  box(
    accessories,
    [0.035, 0.022, 0.12],
    "#aab3b7",
    [1.35, -1.216, 0.34],
    0.008,
  );
  const tissue = box(
    accessories,
    [0.65, 0.016, 0.5],
    "#f4f1e7",
    [1.4, -1.226, -0.45],
    0.008,
  );
  tissue.rotation.y = 0.15;
  // Closed sample-preparation bottles are visual bench equipment, not controls.
  for (const [x, name, amber] of [
    [1.8, "蒸馏水", false],
    [2.35, "碘液", true],
  ]) {
    const bottle = new T.Group();
    bottle.name = "preparation-bottle";
    bottle.position.set(x, -1.24, -1.1);
    accessories.add(bottle);
    const profile = [
      [0, 0],
      [0.12, 0],
      [0.153, 0.018],
      [0.16, 0.05],
      [0.16, 0.31],
      [0.15, 0.36],
      [0.115, 0.395],
      [0.074, 0.416],
      [0.07, 0.465],
      [0.061, 0.465],
      [0.061, 0.423],
      [0.105, 0.404],
      [0.142, 0.36],
      [0.15, 0.31],
      [0.15, 0.055],
      [0.12, 0.019],
      [0, 0.019],
    ].map(([x, y]) => new T.Vector2(x, y));
    const body = new T.Mesh(
      new T.LatheGeometry(profile, 32),
      new T.MeshPhysicalMaterial({
        color: amber ? "#71380f" : "#c9e4df",
        roughness: 0.13,
        metalness: 0,
        transparent: true,
        opacity: amber ? 0.88 : 0.3,
        depthWrite: false,
        clearcoat: 0.8,
        side: T.DoubleSide,
      }),
    );
    body.name = "reagent-glass-bottle";
    body.renderOrder = 2;
    bottle.add(body);
    const liquid = cylinder(
      bottle,
      0.146,
      0.245,
      [0, 0.145, 0],
      amber ? "#854e19" : "#b9d2cb",
    );
    liquid.name = "reagent-liquid";
    liquid.material.roughness = 0.13;
    // Opaque liquid avoids costly transmission passes and transparent sorting inside glass.
    const bulb = new T.Mesh(
      new T.LatheGeometry(
        [
          [0, 0.49],
          [0.059, 0.49],
          [0.059, 0.53],
          [0.075, 0.59],
          [0.071, 0.655],
          [0.052, 0.7],
          [0.026, 0.718],
          [0, 0.722],
        ].map(([x, y]) => new T.Vector2(x, y)),
        24,
      ),
      new T.MeshStandardMaterial({ color: "#20292a", roughness: 0.78 }),
    );
    bulb.name = "dropper-rubber-bulb";
    bottle.add(bulb);
    cylinder(bottle, 0.091, 0.072, [0, 0.468, 0], "#343a3b");
    repeatedBoxes(
      bottle,
      [0.01, 0.06, 0.012],
      "#252d2d",
      0,
      Array.from({ length: 24 }, (_, j) => {
        const angle = (j * Math.PI) / 12;
        return {
          position: [Math.sin(angle) * 0.091, 0.468, Math.cos(angle) * 0.091],
          rotation: [0, angle, 0],
        };
      }),
      "dropper-cap-grip",
    );
    const label = panel(bottle, [0, 0.26, 0.161], 0.245, 0.25, (c) => {
      const w = c.canvas.width,
        h = c.canvas.height;
      c.fillStyle = "#e8e5d8";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#263a3d";
      c.textAlign = "center";
      c.font = "bold 44px sans-serif";
      c.fillText(name, w / 2, h * 0.48);
      c.font = "24px sans-serif";
      c.fillText("标本制备", w / 2, h * 0.73);
    });
    label.update();
  }
  return (p) => {
    wheels.forEach(({ g, key }) => (g.rotation.x = p[key] * 0.13));
    stored.forEach((paper, i) =>
      paper.material.color.set(
        i < 3 && i === p.specimen ? "#d4b974" : "#f1ecd9",
      ),
    );
  };
}

export function objectiveEngraving(parent, magnification, length) {
  if (typeof document === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const c = canvas.getContext("2d");
  c.clearRect(0, 0, 512, 128);
  c.fillStyle = "#202c31";
  c.textAlign = "center";
  for (const x of [128, 384]) {
    c.font = "bold 46px sans-serif";
    c.fillText(`${magnification}×`, x, 57);
    c.font = "18px sans-serif";
    c.fillText("ACHROMAT", x, 93);
  }
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  const sleeve = new T.Mesh(
    new T.CylinderGeometry(0.116, 0.116, 0.13, 48, 1, true),
    new T.MeshStandardMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      roughness: 0.38,
      metalness: 0.15,
    }),
  );
  sleeve.name = `objective-engraving-${magnification}`;
  sleeve.position.y = -length + 0.085;
  sleeve.userData.ownedTexture = texture;
  parent.add(sleeve);
}

export function microscopeFasteners(root, stage) {
  const poses = [
    [-1.2, 0.384, -0.54],
    [0.6, 0.384, -0.54],
    [-1.2, 0.384, 0.72],
    [0.6, 0.384, 0.72],
  ];
  const screws = new T.InstancedMesh(
    new T.CylinderGeometry(0.034, 0.031, 0.009, 20),
    new T.MeshStandardMaterial({
      color: "#77868b",
      metalness: 0.8,
      roughness: 0.3,
    }),
    4,
  );
  screws.name = "stage-recessed-fasteners";
  const matrix = new T.Matrix4();
  poses.forEach((p, i) => screws.setMatrixAt(i, matrix.makeTranslation(...p)));
  screws.castShadow = screws.receiveShadow = true;
  stage.add(screws);
  repeatedBoxes(
    stage,
    [0.044, 0.002, 0.006],
    "#1b2428",
    0.001,
    poses.map(([x, y, z]) => ({
      position: [x, y + 0.005, z],
      rotation: [0, 0.35, 0],
    })),
    "fastener-slots",
    1,
  );
  // The head seam is recessed below the upper housing, clear of the optical axis.
  box(root, [0.78, 0.012, 0.6], "#737d7e", [-0.3, 1.823, 0.1], 0.004);
  const badge = panel(
    root,
    [-0.8, -0.925, 1.332],
    0.86,
    0.095,
    (c) => {
      c.clearRect(0, 0, c.canvas.width, c.canvas.height);
      c.fillStyle = "#66736f";
      c.textAlign = "center";
      c.font = "24px sans-serif";
      c.fillText("知境 · 教学显微镜", c.canvas.width / 2, 40);
    },
    [384, 64],
  );
  if (badge.object) {
    badge.object.material.transparent = true;
    badge.object.material.depthWrite = false;
  }
  badge.update();
}

export function microscopeSpecimenMark(slide) {
  const label = panel(
    slide,
    [-0.43, 0.0185, 0],
    0.36,
    0.18,
    (c, specimen) => {
      c.fillStyle = "#f0ecd8";
      c.fillRect(0, 0, 256, 128);
      c.fillStyle = "#53615a";
      c.font = "18px sans-serif";
      c.textAlign = "left";
      c.fillText(`BIO / 0${specimen + 1}`, 16, 27);
      c.fillStyle = "#283532";
      c.font = "bold 30px sans-serif";
      c.fillText(["字母 e", "洋葱表皮", "池塘水样"][specimen], 16, 70);
      c.strokeStyle = "#929888";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(16, 84);
      c.lineTo(240, 84);
      c.stroke();
      c.fillStyle = "#626b60";
      c.font = "17px sans-serif";
      c.fillText("教学标本", 16, 111);
    },
    [256, 128],
  );
  if (label.object) {
    label.object.name = "microscope-specimen-label";
    label.object.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
  }
  const stamp = panel(
    slide,
    [0, 0.013, 0],
    0.19,
    0.19,
    (c, specimen) => {
      c.clearRect(0, 0, 128, 128);
      if (specimen === 0) {
        c.fillStyle = "#e6e3d5";
        c.fillRect(8, 8, 112, 112);
        c.fillStyle = "#283532";
        c.textAlign = "center";
        c.font = "bold 100px serif";
        c.fillText("e", 64, 96);
      } else {
        c.fillStyle =
          specimen === 1 ? "rgba(178,143,81,.65)" : "rgba(116,151,137,.4)";
        c.beginPath();
        c.ellipse(
          64,
          64,
          specimen === 1 ? 42 : 48,
          specimen === 1 ? 32 : 48,
          0.2,
          0,
          Math.PI * 2,
        );
        c.fill();
      }
    },
    [128, 128],
  );
  if (stamp.object) {
    stamp.object.rotation.x = -Math.PI / 2;
    stamp.object.material.transparent = true;
    stamp.object.material.depthWrite = false;
  }
  let previous;
  return (specimen) => {
    if (previous !== specimen) {
      stamp.update(specimen);
      label.update(specimen);
      previous = specimen;
    }
  };
}
