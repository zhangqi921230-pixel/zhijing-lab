import * as T from "three";
import { addStructureLabels } from "./ChloroplastLabels.js";
import {
  createCellSurfaceTexture,
  colorCytoplasmGeometry,
} from "./CellSurface.js";

export function envelopePoint(x, y, z, scale = 1) {
  const rounded = (v, power) => Math.sign(v) * Math.pow(Math.abs(v), power);
  const ripple =
    1 + 0.009 * Math.sin(x * 21 + z * 13) * Math.sin(y * 17 - z * 9);
  return [
    rounded(x, 0.47) * 2.48 * scale * ripple,
    rounded(y, 0.67) * 1.23 * scale - 0.03,
    rounded(z, 0.47) * 1.82 * scale * ripple,
  ];
}

export function cellBoundaryStrip(outer, inner) {
  const positions = [],
    indices = [];
  for (let i = 0; i <= 80; i++) {
    const phi = Math.PI + (i * Math.PI) / 80;
    for (const scale of [outer, inner])
      positions.push(...envelopePoint(-Math.cos(phi), 0, Math.sin(phi), scale));
    if (i < 80) {
      const j = i * 2;
      indices.push(j, j + 1, j + 2, j + 1, j + 3, j + 2);
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function addBoundaryLayers(root) {
  const group = new T.Group();
  group.name = "cell-boundary-layers";
  root.add(group);
  for (const [name, outer, inner, color] of [
    ["cell-wall-cut-face", 1, 0.981, "#c5c2a5"],
    ["cell-membrane-cut-edge", 0.981, 0.973, "#d3aa65"],
    ["cell-cytoplasm-cut-edge", 0.973, 0.965, "#4eaaa2"],
  ]) {
    const mesh = new T.Mesh(
      cellBoundaryStrip(outer, inner),
      new T.MeshStandardMaterial({
        color,
        roughness: 0.65,
        side: T.DoubleSide,
      }),
    );
    mesh.name = name;
    group.add(mesh);
  }
  const at = (phi, scale) =>
    envelopePoint(-Math.cos(phi), 0, Math.sin(phi), scale);
  addStructureLabels(
    group,
    "cell-boundary-labels",
    [
      ["细胞壁", at(3.9, 0.991), [1.8, 0.9, -1.6]],
      ["细胞膜", at(4.45, 0.977), [0.55, 0.9, -1.9]],
      ["细胞质", at(4.95, 0.966), [-0.85, 0.9, -1.9]],
    ],
    0.24,
  );
}

// A rounded plant-cell envelope, split into reusable cutaway sectors.
// Dimensions are pedagogical; the surface detail does not encode measurements.
export function cellEnvelopeGeometry(
  phiStart,
  phiLength,
  thetaStart,
  thetaLength,
  scale = 1,
) {
  const geometry = new T.SphereGeometry(
    1,
    80,
    36,
    phiStart,
    phiLength,
    thetaStart,
    thetaLength,
  );
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i),
      y = position.getY(i),
      z = position.getZ(i);
    position.setXYZ(i, ...envelopePoint(x, y, z, scale));
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Lower the front cut edge smoothly toward the viewer. At both side seams
// it meets the rear cytoplasm at the equator, avoiding a stepped silhouette.
export function cellCytoplasmFrontGeometry() {
  const geometry = new T.SphereGeometry(
    1,
    80,
    36,
    0,
    Math.PI,
    Math.PI / 2,
    Math.PI / 2,
  );
  const { position, uv } = geometry.attributes;
  for (let i = 0; i < position.count; i++) {
    const phi = uv.getX(i) * Math.PI;
    const start = Math.PI * (0.5 + 0.22 * Math.sin(phi) ** 2);
    const theta = start + (Math.PI - start) * (1 - uv.getY(i));
    position.setXYZ(
      i,
      ...envelopePoint(
        -Math.sin(theta) * Math.cos(phi),
        Math.cos(theta),
        Math.sin(theta) * Math.sin(phi),
        0.965,
      ),
    );
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function addCellEnvelope(root) {
  const texture = createCellSurfaceTexture();
  const textureOwner = new T.Object3D();
  textureOwner.userData.ownedTexture = texture;
  root.add(textureOwner);
  const material = (color, opacity = 1) =>
    new T.MeshPhysicalMaterial({
      color,
      roughness: 0.69,
      side: T.DoubleSide,
      transparent: opacity < 1,
      opacity,
      depthWrite: opacity === 1,
      clearcoat: 0.13,
      bumpMap: texture,
      bumpScale: 0.018,
      roughnessMap: texture,
    });
  const add = (name, geometry, mat) => {
    if (name === "cell-cytoplasm-shell" || name === "cell-cytoplasm-base") {
      colorCytoplasmGeometry(geometry);
      mat.color.set("#ffffff");
      mat.vertexColors = true;
      mat.clearcoat = 0.06;
      mat.roughness = 0.8;
    }
    const mesh = new T.Mesh(geometry, mat);
    mesh.name = name;
    root.add(mesh);
    return mesh;
  };
  // SphereGeometry has +z for phi in [0, PI]. Remove that near side plus
  // the upper hemisphere for an unobstructed view of the organelles.
  add(
    "cell-rear-wall",
    cellEnvelopeGeometry(Math.PI, Math.PI, Math.PI / 2, Math.PI / 2),
    material("#c5c2a5"),
  );
  const front = add(
    "cell-front-wall",
    cellEnvelopeGeometry(0, Math.PI, Math.PI / 2, Math.PI / 2),
    material("#d7d3b6", 0.7),
  );
  const top = add(
    "cell-top-wall",
    cellEnvelopeGeometry(0, Math.PI * 2, 0, Math.PI / 2),
    material("#d7d3b6", 0.9),
  );
  add(
    "cell-cytoplasm-shell",
    cellEnvelopeGeometry(Math.PI, Math.PI, Math.PI / 2, Math.PI / 2, 0.965),
    material("#246b68"),
  );
  // Lower curved cytoplasm provides a continuous body rather than a flat tray.
  add("cell-cytoplasm-base", cellCytoplasmFrontGeometry(), material("#286e67"));
  addBoundaryLayers(root);
  return { front, top };
}
