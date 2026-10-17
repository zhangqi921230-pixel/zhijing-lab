import * as T from "three";
import { addStructureLabels } from "./ChloroplastLabels.js";
import { createMembraneSurface } from "./MembraneSurface.js";

export const golgiCenter = [-1.6, -0.12, -0.5];
const membraneBend = (x, z, layer) =>
  0.075 * x * x +
  0.004 * Math.sin(13 * x + 11 * z + 0.4 * layer) * Math.cos(7 * z - 3 * x);
export function createGolgiApparatus() {
  const group = new T.Group();
  group.name = "golgi-apparatus";
  group.position.set(...golgiCenter);
  group.userData = { action: "parameter", key: "part", value: 5 };
  const surface = createMembraneSurface(group);
  const colors = [
    "#b58a56",
    "#c39962",
    "#ccaa72",
    "#d5b57e",
    "#dfc18e",
    "#e7cea0",
  ];
  const sacs = [];
  for (let layer = 0; layer < 6; layer++) {
    // Closed flattened sacs, bent together; surface thickness is exaggerated.
    const geometry = new T.SphereGeometry(1, 48, 20);
    const positions = geometry.attributes.position;
    const width = 0.31 - Math.abs(layer - 2.5) * 0.016;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        y = positions.getY(i),
        z = positions.getZ(i);
      const radial = Math.hypot(x, z);
      const angle = Math.atan2(z, x);
      const ripple =
        1 +
        0.055 * Math.sin(angle * 5 + layer * 0.3) +
        0.025 * Math.cos(angle * 9 - layer * 0.5);
      positions.setXYZ(
        i,
        x * width * ripple,
        y * (0.012 + 0.039 * radial ** 5) + membraneBend(x, z, layer),
        z * 0.145 * ripple,
      );
    }
    geometry.computeVertexNormals();
    const sac = new T.Mesh(
      geometry,
      new T.MeshStandardMaterial({
        color: colors[layer],
        roughness: 0.86,
        map: surface,
        roughnessMap: surface,
        bumpMap: surface,
        bumpScale: 0.0012,
      }),
    );
    sac.name = `golgi-cisterna-${layer}`;
    sac.position.set((layer - 2.5) * 0.013, (layer - 2.5) * 0.075, 0);
    group.add(sac);
    sacs.push(sac);
  }
  // A continuous neck-to-bulb silhouette attached to the membrane rim.
  // This is a static budding morphology, not a timed vesicle-fission model.
  const budProfile = [
    [0.009, -0.012],
    [0.011, 0],
    [0.009, 0.012],
    [0.014, 0.025],
    [0.025, 0.039],
    [0.027, 0.05],
    [0.021, 0.064],
    [0.01, 0.074],
    [0, 0.077],
  ];
  const budGeometry = new T.LatheGeometry(
    budProfile.map(([r, y]) => new T.Vector2(r, y)),
    20,
  );
  const buds = new T.Group();
  buds.name = "golgi-buds";
  const budTips = [];
  for (const [layer, angle] of [
    [4, 0.5],
    [5, 2.6],
    [5, -0.65],
  ]) {
    const x = Math.cos(angle),
      z = Math.sin(angle);
    const width = 0.31 - Math.abs(layer - 2.5) * 0.016;
    const ripple =
      1 +
      0.055 * Math.sin(angle * 5 + layer * 0.3) +
      0.025 * Math.cos(angle * 9 - layer * 0.5);
    const bud = new T.Mesh(budGeometry, sacs[layer].material);
    const direction = new T.Vector3(x, 0.48, z).normalize();
    bud.position.set(
      x * width * ripple + sacs[layer].position.x,
      membraneBend(x, z, layer) + sacs[layer].position.y,
      z * 0.145 * ripple,
    );
    bud.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction);
    bud.userData.layer = layer;
    bud.userData.anchor = bud.position.toArray();
    budTips.push(
      bud.position.clone().addScaledVector(direction, 0.05).toArray(),
    );
    buds.add(bud);
  }
  group.add(buds);
  const attachmentRims = new T.Group();
  attachmentRims.name = "golgi-attachment-rims";
  const rimMaterial = new T.LineBasicMaterial({
    color: "#c5ac80",
    transparent: true,
    opacity: 0.5,
  });
  for (const layer of new Set(buds.children.map((bud) => bud.userData.layer))) {
    const width = 0.31 - Math.abs(layer - 2.5) * 0.016;
    const points = Array.from({ length: 128 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 128;
      const x = Math.cos(angle),
        z = Math.sin(angle);
      const ripple =
        1 +
        0.055 * Math.sin(angle * 5 + layer * 0.3) +
        0.025 * Math.cos(angle * 9 - layer * 0.5);
      return new T.Vector3(
        x * width * ripple + sacs[layer].position.x,
        membraneBend(x, z, layer) + sacs[layer].position.y,
        z * 0.145 * ripple,
      );
    });
    const rim = new T.LineLoop(
      new T.BufferGeometry().setFromPoints(points),
      rimMaterial,
    );
    rim.name = `golgi-attachment-rim-${layer}`;
    attachmentRims.add(rim);
  }
  attachmentRims.visible = false;
  group.add(attachmentRims);
  const vesicleGeometry = new T.SphereGeometry(0.027, 20, 12);
  const vesicles = new T.InstancedMesh(
    vesicleGeometry,
    new T.MeshStandardMaterial({ color: "#e2c68e", roughness: 0.5 }),
    12,
  );
  vesicles.name = "golgi-vesicles";
  const matrix = new T.Matrix4();
  for (let i = 0; i < 12; i++) {
    const side = i % 2 ? 1 : -1,
      scale = 0.72 + (i % 3) * 0.18;
    matrix
      .makeScale(scale, scale, scale)
      .setPosition(
        side * (0.35 + 0.045 * (i % 3)),
        -0.21 + (i / 11) * 0.49,
        Math.sin(i * 2.4) * 0.17,
      );
    vesicles.setMatrixAt(i, matrix);
  }
  group.add(vesicles);
  const labels = new T.Group();
  labels.name = "golgi-labels";
  group.add(labels);
  const entries = [
    ["顺面 · 接收侧", [-0.0325, -0.19, 0], [-0.49, -0.23, 0.08]],
    ["扁平膜囊", [0.3, 0.04, 0], [0.55, 0.02, 0.06]],
    ["反面 · 输出侧", [0.0325, 0.19, 0], [0.05, 0.4, 0]],
    [
      "运输囊泡",
      [0.395, -0.21 + 0.49 / 11, Math.sin(2.4) * 0.17],
      [0.58, -0.06, 0.14],
    ],
    ["出芽中的囊泡", budTips[1], [-0.45, 0.37, 0.02]],
  ];
  entries.forEach((entry, index) =>
    addStructureLabels(labels, `golgi-label-${index}`, [entry], 0.052),
  );
  group.userData.setDetail = (mode = 0) => {
    attachmentRims.visible = mode === 2;
    sacs.forEach((sac) => {
      sac.visible = mode !== 2;
    });
    buds.visible = vesicles.visible = mode !== 1;
    labels.children.forEach((label, index) => {
      label.visible = index < 3 ? mode !== 2 : mode !== 1;
    });
  };
  return group;
}
