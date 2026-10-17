import * as T from "three";
import { box } from "./CircuitBench.js";
import { addOpticalBaseHardware, addOpticalKnurl } from "./OpticalHardware.js";
import { finishOpticalInstrument } from "./OpticalMaterials.js";
import { addOpticalPowerSwitch } from "./OpticalPowerSwitch.js";
import { addOpticalFocalMarks } from "./OpticalFocalMarks.js";
import { addOpticalApparatusLabels } from "./OpticalApparatusLabels.js";
import { addOpticalAperture } from "./OpticalAperture.js";
import { addOpticalHeightSupport } from "./OpticalHeightSupport.js";
import { drawScreenScale } from "./OpticalScreenScale.js";
import {
  createScreenSurface,
  drawProjectedArrow,
} from "./OpticalScreenSurface.js";
import { repeatedBoxes } from "./MicroscopeBatch.js";
import {
  opticalScale,
  opticalAxis,
  objectHeight,
  aperture,
  opticalState,
  objectArrow,
  opticalScreen,
} from "./opticalModel.mjs";
export {
  opticalScale,
  opticalAxis,
  objectHeight,
  aperture,
  opticalState,
} from "./opticalModel.mjs";
function add(root, g, m, pos) {
  const o = new T.Mesh(g, m);
  o.position.set(...pos);
  o.castShadow = o.receiveShadow = true;
  root.add(o);
  return o;
}
function metal(color) {
  return new T.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.6 });
}
function texturePlane(
  root,
  w,
  h,
  pos,
  rotation,
  draw,
  resolution = [512, 512],
) {
  const plane = add(
    root,
    new T.PlaneGeometry(w, h),
    new T.MeshBasicMaterial({ color: "#ebeee5", side: T.DoubleSide }),
    pos,
  );
  plane.rotation.y = rotation;
  if (typeof document === "undefined") return { plane, update() {} };
  const canvas = document.createElement("canvas");
  [canvas.width, canvas.height] = resolution;
  const c = canvas.getContext("2d"),
    texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  plane.material.map = texture;
  plane.userData.ownedTexture = texture;
  return {
    plane,
    update(p) {
      draw(c, p);
      texture.needsUpdate = true;
    },
  };
}
export function buildOpticalBench(root, p) {
  const updateFocalMarks = addOpticalFocalMarks(root);
  box(root, [8.8, 0.22, 2.5], "#263c43", [0.55, -1.1, 0]);
  addOpticalBaseHardware(root);
  for (const z of [-0.3, 0.3])
    box(root, [8.5, 0.13, 0.1], "#9faeb1", [0.55, -0.85, z]);
  const ruler = texturePlane(
    root,
    8.25,
    0.32,
    [0.55, -0.83, 0.68],
    0,
    (c) => {
      c.fillStyle = "#e6e3d4";
      c.fillRect(0, 0, 4096, 160);
      c.strokeStyle = c.fillStyle = "#273d3f";
      for (let cm = -65; cm <= 85; cm++) {
        const x = ((cm + 65) / 150) * 4096;
        c.fillStyle = cm === 0 ? "#a44126" : "#273d3f";
        c.fillRect(
          x - 1,
          0,
          cm === 0 ? 4 : 2,
          cm % 10 === 0 ? 68 : cm % 5 === 0 ? 49 : 28,
        );
        if (cm % 10 === 0) {
          c.font = "bold 44px sans-serif";
          c.textAlign = "center";
          c.fillText(String(cm), x, 125);
        }
      }
      c.font = "28px sans-serif";
      c.textAlign = "right";
      c.fillText("cm", 4075, 125);
    },
    [4096, 160],
  );
  ruler.plane.name = "optical-ruler";
  ruler.plane.rotation.x = -Math.PI / 2;
  ruler.update({});
  function carriage(name, top) {
    const g = new T.Group();
    g.name = name;
    root.add(g);
    box(g, [0.44, 0.16, 0.8], "#344e56", [0, -0.7, 0]);
    const post = add(
      g,
      new T.CylinderGeometry(0.065, 0.065, top + 0.62, 24),
      metal("#bac4c3"),
      [0, (top - 0.62) / 2, 0],
    );
    post.name = "optical-post";
    const screw = add(
      g,
      new T.CylinderGeometry(0.07, 0.07, 0.15, 20),
      metal("#222d32"),
      [0, -0.68, 0.48],
    );
    screw.rotation.x = Math.PI / 2;
    addOpticalKnurl(g);
    // Index tip is exactly at the carrier's optical plane, never at its edge.
    const indexShape = new T.Shape();
    indexShape.moveTo(-0.085, 0);
    indexShape.lineTo(0.085, 0);
    indexShape.lineTo(0, -0.2);
    indexShape.closePath();
    const index = add(
      g,
      new T.ShapeGeometry(indexShape),
      metal("#d0a45c"),
      [0, -0.81, 0.36],
    );
    index.name = "optical-index";
    index.rotation.x = -Math.PI / 2;
    return g;
  }
  const source = carriage("optical-object", 0.23);
  const updateHeightLock = addOpticalHeightSupport(source);
  const sourceHead = new T.Group();
  sourceHead.name = "optical-source-head";
  source.add(sourceHead);
  box(sourceHead, [0.1, 0.72, 0.55], "#192a2d", [
    -0.055,
    opticalAxis + 0.19,
    0,
  ]);
  const updatePowerSwitch = addOpticalPowerSwitch(sourceHead);
  // Luminous arrow is on the lens-facing surface of the source slide.
  const shaftHeight = objectHeight - objectArrow.headHeight;
  const shaft = box(
    sourceHead,
    [0.012, shaftHeight, objectArrow.shaftWidth],
    "#f4d479",
    [0, opticalAxis + shaftHeight / 2, 0],
  );
  const triangle = new T.Shape();
  triangle.moveTo(-objectArrow.headWidth / 2, 0);
  triangle.lineTo(objectArrow.headWidth / 2, 0);
  triangle.lineTo(0, objectArrow.headHeight);
  triangle.closePath();
  const arrow = add(
    sourceHead,
    new T.ShapeGeometry(triangle),
    new T.MeshBasicMaterial({ color: "#ffe3a0", side: T.DoubleSide }),
    [0, opticalAxis + shaftHeight, 0],
  );
  arrow.rotation.y = Math.PI / 2;
  const lensStand = carriage("optical-lens", -0.14);
  const updateAperture = addOpticalAperture(lensStand);
  const rim = add(
    lensStand,
    new T.TorusGeometry(0.54, 0.048, 16, 96),
    metal("#a5b6bb"),
    [0, opticalAxis, 0],
  );
  rim.rotation.y = Math.PI / 2;
  // Biconvex visual envelope; all rays use the ideal thin-lens principal plane x=0.
  const profile = [];
  for (let i = 0; i <= 32; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 32;
    profile.push(new T.Vector2(0.5 * Math.cos(angle), 0.085 * Math.sin(angle)));
  }
  const glass = add(
    lensStand,
    new T.LatheGeometry(profile, 96),
    new T.MeshPhysicalMaterial({
      color: "#a9d8e2",
      transparent: true,
      opacity: 0.23,
      roughness: 0.06,
      metalness: 0,
      side: T.DoubleSide,
      depthWrite: false,
    }),
    [0, opticalAxis, 0],
  );
  glass.rotation.z = Math.PI / 2;
  const screen = carriage("optical-screen", -0.42);
  const updateApparatusLabels = addOpticalApparatusLabels([
    source,
    lensStand,
    screen,
  ]);
  // Opaque projection board: a real image is viewed on the illuminated side.
  const backing = box(
    screen,
    [0.04, opticalScreen.height, opticalScreen.width],
    "#344e56",
    [0.03, opticalAxis, 0],
    0,
  );
  backing.name = "optical-screen-backing";
  repeatedBoxes(
    screen,
    [0.025, 0.09, 0.065],
    "#9faeb1",
    0,
    [-0.77, 0.77].flatMap((y) =>
      [-0.79, 0.79].map((z) => ({ position: [-0.022, opticalAxis + y, z] })),
    ),
    "optical-screen-retainers",
  );
  for (const y of [-0.82, 0.82])
    box(screen, [0.12, 0.055, 1.7], "#b5b6a4", [0, opticalAxis + y, 0]);
  for (const z of [-0.85, 0.85])
    box(screen, [0.12, 1.65, 0.055], "#b5b6a4", [0, opticalAxis, z]);
  const finishScreenSurface = createScreenSurface();
  const face = texturePlane(
    screen,
    opticalScreen.width,
    opticalScreen.height,
    [0, opticalAxis, 0],
    -Math.PI / 2,
    (c, q) => {
      const state = opticalState(q);
      c.fillStyle = "#626760";
      c.fillRect(0, 0, 512, 512);
      drawScreenScale(c);
      const blur = Math.min(
          180,
          (state.spread / opticalScreen.height) * 512 * 0.55,
        ),
        h = ((state.tip - state.base) / opticalScreen.height) * 512,
        shaftWidth = (state.projectedShaftWidth / opticalScreen.width) * 512,
        headWidth = (state.projectedHeadWidth / opticalScreen.width) * 512,
        shaftFraction = shaftHeight / objectHeight;
      c.save();
      c.translate(256, 256 - (state.base / opticalScreen.height) * 512);
      c.filter = `blur(${blur}px)`;
      c.globalAlpha = state.illuminated
        ? state.relativeLight * Math.max(0.1, 1 / (1 + state.spread * 3))
        : 0;
      c.fillStyle = "#fff5c4";
      drawProjectedArrow(c, h, shaftWidth, headWidth, shaftFraction);
      c.restore();
      c.strokeStyle = "rgba(73,85,71,.3)";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(244, 256);
      c.lineTo(268, 256);
      c.moveTo(256, 244);
      c.lineTo(256, 268);
      c.stroke();
      finishScreenSurface(c);
    },
  );
  face.plane.name = "optical-screen-face";
  face.plane.material.side = T.FrontSide;
  const lines = [],
    extensions = [];
  for (let i = 0; i < 3; i++) {
    const g = new T.BufferGeometry();
    g.setAttribute(
      "position",
      new T.Float32BufferAttribute(new Float32Array(9), 3),
    );
    const line = new T.Line(
      g,
      new T.LineBasicMaterial({
        color: ["#efb96f", "#75d5e9", "#b6d68d"][i],
        transparent: true,
        opacity: 0.85,
      }),
    );
    line.frustumCulled = false;
    root.add(line);
    lines.push(line);
    const extension = new T.Line(
      new T.BufferGeometry().setAttribute(
        "position",
        new T.Float32BufferAttribute(new Float32Array(6), 3),
      ),
      new T.LineDashedMaterial({
        color: line.material.color,
        dashSize: 0.065,
        gapSize: 0.045,
        transparent: true,
        opacity: 0.8,
      }),
    );
    extension.name = `optical-virtual-extension-${i}`;
    extension.geometry.setAttribute(
      "lineDistance",
      new T.Float32BufferAttribute([0, 0], 1),
    );
    extension.frustumCulled = false;
    root.add(extension);
    extensions.push(extension);
  }
  let lastOpticalInputs = null;
  let currentParams = p;
  let observingScreen = false;
  const updateTeachingVisibility = () => {
    updateApparatusLabels(currentParams, !observingScreen);
    updateFocalMarks(currentParams, !observingScreen);
  };
  root.userData.setOpticalScreenView = (active) => {
    observingScreen = active;
    updateTeachingVisibility();
  };
  root.userData.update = (q) => {
    currentParams = q;
    updateTeachingVisibility();
    const state = opticalState(q),
      s = state.screen;
    updateAperture(state.apertureRatio);
    updateHeightLock(q.heightLock === 1);
    const virtual = state.v !== null && state.v < 0;
    lines.forEach((line, i) => {
      line.visible = q.rays !== 0 && state.illuminated;
      extensions[i].visible = q.rays !== 0 && state.illuminated && virtual;
    });
    // Visibility and unrelated UI state do not change the image or ray geometry.
    if (
      lastOpticalInputs?.[0] === q.u &&
      lastOpticalInputs[1] === q.f &&
      lastOpticalInputs[2] === s &&
      lastOpticalInputs[3] === state.illuminated &&
      lastOpticalInputs[4] === state.sourceOffset &&
      lastOpticalInputs[5] === state.apertureRatio
    )
      return;
    lastOpticalInputs = [
      q.u,
      q.f,
      s,
      state.illuminated,
      state.sourceOffset,
      state.apertureRatio,
    ];
    sourceHead.position.y = state.sourceOffset;
    const post = source.getObjectByName("optical-post");
    post.scale.y = (0.85 + state.sourceOffset) / 0.85;
    post.position.y = (0.23 + state.sourceOffset - 0.62) / 2;
    updatePowerSwitch(state.illuminated);
    shaft.material.color.set(state.illuminated ? "#f4d479" : "#444943");
    arrow.material.color.set(state.illuminated ? "#ffe3a0" : "#444943");
    source.position.x = -q.u * opticalScale;
    screen.position.x = s * opticalScale;
    face.update(q);
    const paths = [];
    for (let i = 0; i < 3; i++) {
      const height = [objectHeight, 0, -0.3][i] * state.apertureRatio;
      const incoming =
          (height - objectHeight - state.sourceOffset) / (q.u * opticalScale),
        outgoing = incoming - height / (q.f * opticalScale),
        end = height + outgoing * s * opticalScale;
      const coordinates = [
        -q.u * opticalScale,
        opticalAxis + objectHeight + state.sourceOffset,
        0,
        0,
        opticalAxis + height,
        0,
        s * opticalScale,
        opticalAxis + end,
        0,
      ];
      lines[i].geometry.attributes.position.array.set(coordinates);
      lines[i].geometry.attributes.position.needsUpdate = true;
      const extension = extensions[i];
      if (virtual) {
        const imageX = state.v * opticalScale;
        extension.geometry.attributes.position.array.set([
          0,
          opticalAxis + height,
          0,
          imageX,
          opticalAxis + height + outgoing * imageX,
          0,
        ]);
        extension.geometry.attributes.position.needsUpdate = true;
        const distances = extension.geometry.attributes.lineDistance;
        distances.array[1] = Math.hypot(imageX, outgoing * imageX);
        distances.needsUpdate = true;
      }
      paths.push({ height, outgoing, end });
    }
    root.userData.optics = { ...state, paths };
  };
  finishOpticalInstrument(root);
  root.userData.update(p);
}
