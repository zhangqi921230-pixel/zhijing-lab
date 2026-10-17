import * as T from "three";
import { reticulumNetworkGeometry } from "./ReticulumNetworkGeometry.js";
import { addStructureLabels } from "./ChloroplastLabels.js";
import { createMembraneSurface } from "./MembraneSurface.js";
import { createRibosomeGeometry } from "./RibosomeGeometry.js";

export const erCenter = [-1.22, -0.515, -0.5];
export function erOutline(angle, layer) {
  return (
    0.98 +
    0.045 * Math.sin(3 * angle + layer * 0.7) +
    0.025 * Math.cos(5 * angle - layer * 0.4)
  );
}
export function erSurface(x, z, layer, side = 1) {
  const outline = erOutline(Math.atan2(z / 0.135, x / 0.23), layer);
  const radial = Math.max(
    0,
    1 - ((x / 0.23) ** 2 + (z / 0.135) ** 2) / outline ** 2,
  );
  return (
    (layer - 1) * 0.075 +
    0.027 * Math.sin(x * 14) +
    0.012 * Math.sin(z * 22 + x * 6) +
    0.006 * Math.sin(z * 35 + x * 18 + layer * 0.65) +
    0.004 * Math.sin(z * 71 - x * 11) +
    side * 0.017 * Math.sqrt(radial)
  );
}

// An illustrative connected membrane network, not a microscopy reconstruction.
// Branch endpoints reuse trunk control points so no branch hangs in space.
export function erNetworkPaths() {
  const rims = [
    [
      [0.28, -0.082, -0.063],
      [0.39, -0.058, -0.09],
      [0.49, -0.067, 0.005],
      [0.405, -0.093, 0.102],
      [0.29, -0.066, 0.053],
    ],
    [
      [0.267, 0.004, -0.078],
      [0.369, 0.024, -0.105],
      [0.471, 0.012, -0.024],
      [0.427, -0.006, 0.084],
      [0.304, 0.017, 0.062],
    ],
    [
      [0.285, 0.083, -0.05],
      [0.402, 0.101, -0.067],
      [0.481, 0.082, 0.039],
      [0.385, 0.065, 0.112],
      [0.275, 0.086, 0.044],
    ],
  ];
  const anchor = (layer, z) => [
    0.205,
    (erSurface(0.205, z, layer) + erSurface(0.205, z, layer, -1)) / 2,
    z,
  ];
  const paths = rims.map((rim, layer) => [
    anchor(layer, -0.03),
    ...rim,
    anchor(layer, 0.03),
  ]);
  // Cross-layer bridges and shorter internal branches produce unequal openings.
  paths.push(
    [rims[0][0], [0.31, -0.038, -0.066], rims[1][0]],
    [rims[1][1], [0.394, 0.063, -0.089], rims[2][1]],
    [rims[0][3], [0.447, -0.043, 0.115], rims[1][3]],
    [rims[1][4], [0.31, 0.048, 0.084], rims[2][3]],
    [rims[0][1], [0.359, -0.048, -0.012], rims[0][4]],
    [rims[1][0], [0.331, 0.013, -0.016], rims[1][3]],
    [rims[2][1], [0.357, 0.083, 0.018], rims[2][4]],
  );
  return paths;
}

export function createEndoplasmicReticulum() {
  const group = new T.Group();
  group.name = "endoplasmic-reticulum";
  group.position.set(...erCenter);
  group.userData = { action: "parameter", key: "part", value: 6 };
  const surface = createMembraneSurface(group);
  const membrane = new T.MeshStandardMaterial({
    color: "#ffffff",
    vertexColors: true,
    roughness: 0.85,
    metalness: 0,
    roughnessMap: surface,
    bumpMap: surface,
    bumpScale: 0.0005,
  });
  const tintMembrane = (geometry) => {
    const positions = geometry.attributes.position,
      colors = [];
    const dark = new T.Color("#4e8995"),
      light = new T.Color("#80b5ae"),
      color = new T.Color();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        y = positions.getY(i),
        z = positions.getZ(i);
      const pigment =
        0.5 +
        0.2 * Math.sin(x * 31 + z * 17) * Math.cos(y * 29 - z * 13) +
        0.08 * Math.sin(x * 113 + z * 87);
      color.copy(dark).lerp(light, pigment);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
    return geometry;
  };
  for (let layer = 0; layer < 3; layer++) {
    const geometry = new T.SphereGeometry(1, 48, 24);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const outline = erOutline(Math.atan2(pos.getZ(i), pos.getX(i)), layer);
      const x = pos.getX(i) * 0.23 * outline,
        z = pos.getZ(i) * 0.135 * outline;
      pos.setXYZ(i, x, erSurface(x, z, layer, pos.getY(i) >= 0 ? 1 : -1), z);
    }
    geometry.computeVertexNormals();
    const sac = new T.Mesh(tintMembrane(geometry), membrane);
    sac.castShadow = true;
    sac.receiveShadow = true;
    sac.name = `er-sheet-${layer}`;
    group.add(sac);
  }
  const particles = [];
  for (let layer = 0; layer < 3; layer++)
    for (let i = 0; i < 48; i++) {
      const angle = i * 2.399963,
        radial = Math.sqrt((i + 0.5) / 48) * 0.86;
      const x = 0.23 * radial * Math.cos(angle),
        z = 0.135 * radial * Math.sin(angle);
      particles.push([x, erSurface(x, z, layer) + 0.008, z]);
    }
  const ribosomes = new T.InstancedMesh(
    createRibosomeGeometry(),
    new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }),
    particles.length,
  );
  ribosomes.name = "er-attached-ribosomes";
  ribosomes.castShadow = true;
  ribosomes.receiveShadow = true;
  const matrix = new T.Matrix4();
  particles.forEach((point, i) => {
    const [x, , z] = point,
      layer = Math.floor(i / 48),
      h = 1e-5;
    const dx =
      (erSurface(x + h, z, layer) - erSurface(x - h, z, layer)) / (2 * h);
    const dz =
      (erSurface(x, z + h, layer) - erSurface(x, z - h, layer)) / (2 * h);
    const rotation = new T.Quaternion().setFromUnitVectors(
      new T.Vector3(0, 1, 0),
      new T.Vector3(-dx, 1, -dz).normalize(),
    );
    matrix.compose(new T.Vector3(...point), rotation, new T.Vector3(1, 1, 1));
    // Seat the complete two-subunit silhouette outside the curved membrane.
    let clearance = Infinity;
    const vertex = new T.Vector3(),
      positions = ribosomes.geometry.attributes.position;
    for (let j = 0; j < positions.count; j++) {
      vertex.fromBufferAttribute(positions, j).applyMatrix4(matrix);
      clearance = Math.min(
        clearance,
        vertex.y - erSurface(vertex.x, vertex.z, layer),
      );
    }
    point[1] += Math.max(0, 0.0001 - clearance);
    matrix.setPosition(...point);
    ribosomes.setMatrixAt(i, matrix);
  });
  group.add(ribosomes);
  const paths = erNetworkPaths();
  const network = new T.Mesh(
    tintMembrane(reticulumNetworkGeometry(paths)),
    membrane,
  );
  network.name = "er-smooth-network";
  network.castShadow = true;
  network.receiveShadow = true;
  group.add(network);
  const labels = new T.Group();
  labels.name = "er-labels";
  group.add(labels);
  const entries = [
    [
      "粗面内质网 · 膜囊",
      [-0.1, erSurface(-0.1, 0.04, 2), 0.04],
      [-0.25, 0.24, 0.05],
    ],
    ["附着核糖体", particles[110], [0.04, 0.28, -0.06]],
    ["光面内质网 · 管网", paths[1][3], [0.55, 0.19, 0.03]],
  ];
  entries.forEach((entry, i) =>
    addStructureLabels(labels, `er-label-${i}`, [entry], 0.042),
  );
  group.userData.setDetail = (mode = 0) => {
    for (let layer = 0; layer < 3; layer++)
      group.getObjectByName(`er-sheet-${layer}`).visible = mode !== 2;
    ribosomes.visible = mode !== 2;
    network.visible = mode !== 1;
    labels.children.forEach((label, i) => {
      label.visible = i === 2 ? mode !== 1 : mode !== 2;
    });
  };
  return group;
}
