import * as T from "three";
import { createEcologySpecimens } from "./EcologySpecimens.js";
import { panel } from "./CircuitBench.js";
import { photo } from "./models.mjs";
import { addStructureLabels } from "./ChloroplastLabels.js";
import { addPhotoBenchDetails } from "./PhotoBenchDetails.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createInstrumentFinishTexture } from "./MicroscopeMaterials.js";

export function buildPhotosynthesisBench(root, p) {
  const material = (color, metalness = 0) =>
    new T.MeshStandardMaterial({
      color,
      metalness,
      roughness: metalness ? 0.3 : 0.8,
    });
  const add = (geometry, mat, position) => {
    const mesh = new T.Mesh(geometry, mat);
    mesh.position.set(...position);
    mesh.castShadow = mesh.receiveShadow = true;
    root.add(mesh);
    return mesh;
  };
  const metal = material("#829794", 0.7),
    dark = material("#283b3d"),
    ceramic = material("#b8805b");
  const brushed = createInstrumentFinishTexture(true),
    paint = createInstrumentFinishTexture(false);
  for (const [name, texture] of [
    ["photo-metal-finish", brushed],
    ["photo-paint-finish", paint],
  ]) {
    const owner = new T.Group();
    owner.name = name;
    owner.userData.ownedTexture = texture;
    root.add(owner);
  }
  metal.roughnessMap = brushed;
  metal.roughness = 0.38;
  dark.roughnessMap = paint;
  dark.metalness = 0.25;
  dark.roughness = 0.56;
  ceramic.bumpMap = paint;
  ceramic.bumpScale = 0.002;
  add(
    new RoundedBoxGeometry(5.4, 0.16, 3, 2, 0.035),
    material("#d4d5c5"),
    [0, -0.75, 0],
  );
  const profile = [
    [0.39, 0],
    [0.48, 0.65],
    [0.52, 0.65],
    [0.52, 0.72],
    [0.46, 0.72],
    [0.36, 0.07],
    [0, 0.07],
  ].map((v) => new T.Vector2(...v));
  const pot = add(new T.LatheGeometry(profile, 48), ceramic, [-0.65, -0.67, 0]);
  pot.name = "photosynthesis-pot";
  add(
    new T.CylinderGeometry(0.44, 0.44, 0.05, 40),
    material("#40372b"),
    [-0.65, -0.025, 0],
  );
  const plant = createEcologySpecimens({ plantOnly: true }).plant();
  plant.scale.setScalar(3);
  plant.position.set(-0.65, 0, 0);
  plant.name = "photosynthesis-plant";
  root.add(plant);
  add(
    new RoundedBoxGeometry(0.8, 0.12, 0.65, 2, 0.025),
    dark,
    [-2, -0.63, -0.8],
  );
  add(new T.CylinderGeometry(0.045, 0.045, 3.45, 16), metal, [-2, 1.08, -0.8]);
  add(new T.BoxGeometry(2, 0.075, 0.07), metal, [-1.1, 2.8, -0.8]);
  add(new T.BoxGeometry(0.07, 0.12, 0.72), metal, [-0.7, 2.77, -0.45]);
  add(
    new RoundedBoxGeometry(1.8, 0.12, 0.8, 2, 0.025),
    dark,
    [-0.7, 2.69, -0.15],
  ).name = "photo-lamp-housing";
  const emitter = new T.MeshStandardMaterial({
    color: "#fff1bb",
    emissive: "#ffdf83",
    emissiveIntensity: 1,
  });
  add(new T.BoxGeometry(1.65, 0.025, 0.68), emitter, [-0.7, 2.62, -0.15]);
  const light = new T.SpotLight("#fff3c6", 25, 6, 0.7, 0.7, 1);
  light.position.set(-0.7, 2.6, -0.15);
  light.target.position.set(-0.65, 0.4, 0);
  root.add(light, light.target);
  add(
    new RoundedBoxGeometry(1.45, 0.95, 0.36, 3, 0.035),
    dark,
    [1.65, -0.195, 0.45],
  ).name = "photo-readout-housing";
  const display = panel(
    root,
    [1.65, -0.195, 0.638],
    1.25,
    0.72,
    (ctx, draw) => draw(ctx),
    [640, 384],
  );
  addStructureLabels(
    root,
    "photosynthesis-labels",
    [
      ["补光灯 · 相对光照", [-0.7, 2.7, 0], [-0.2, 3.18, 0]],
      ["叶片与叶脉", [-0.5, 1.2, 0.5], [0.75, 1.65, 0.8]],
      ["定性模型 · 非实测仪器", [1.65, 0.4, 0.5], [1.7, 0.85, 0.6]],
    ],
    0.14,
  );
  let last = "";
  root.userData.update = (q) => {
    light.intensity = q.light * 0.25;
    emitter.emissiveIntensity = q.light / 60;
    const key = `${q.light}/${q.co2}/${q.temp}`;
    if (key === last) return;
    last = key;
    const rate = photo(q);
    root.userData.rate = rate;
    display.update((ctx) => {
      ctx.fillStyle = "#122a2c";
      ctx.fillRect(0, 0, 640, 384);
      ctx.fillStyle = "#b1d0c2";
      ctx.font = '26px "Microsoft YaHei"';
      ctx.fillText("总光合相对速率 · 定性模型", 30, 55);
      ctx.fillStyle = "#e9d8a4";
      ctx.font = "bold 76px Georgia";
      ctx.fillText(`${rate.toFixed(1)} %`, 30, 150);
      ctx.fillStyle = "#294848";
      ctx.fillRect(30, 178, 580, 18);
      ctx.fillStyle = "#75ba91";
      ctx.fillRect(30, 178, (580 * rate) / 100, 18);
      ctx.fillStyle = "#d0ddd5";
      ctx.font = '27px "Microsoft YaHei"';
      ctx.fillText(`光照 ${q.light}%    CO₂ 供给 ${q.co2}%`, 30, 258);
      ctx.fillText(`温度 ${q.temp}°C    ·    最适点设为 25°C`, 30, 321);
    });
  };
  root.userData.update(p);
  addPhotoBenchDetails(root);
}
