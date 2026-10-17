import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { createLamellaGeometry, lamellaPoint } from "./ChloroplastLamella.js";
import { detailChloroplastMembrane } from "./ChloroplastMembraneMaterial.js";

function membraneContour(geometry, plane) {
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      v = plane === "xy" ? positions.getY(i) : positions.getZ(i);
    const angle = Math.atan2(v, x);
    const factor =
      0.965 + 0.02 * Math.cos(angle * 3) + 0.015 * Math.sin(angle * 5);
    if (plane === "xy") positions.setXY(i, x * factor, v * factor);
    else {
      const y = positions.getY(i);
      // Rounded sacs have gently uneven faces, while the joining rim stays put.
      const face = Math.max(0, 1 - Math.hypot(x, v) / 0.047);
      const relief =
        Math.sign(y) *
        0.0011 *
        face *
        (0.75 + 0.25 * Math.sin(x * 90 + 0.8) * Math.cos(v * 80));
      positions.setXYZ(i, x * factor, y + relief, v * factor);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Enlarged cutaway: stacked thylakoids (grana) joined by stroma lamellae.
// Dimensions and colors are illustrative, not an ultrastructure measurement.
export function createChloroplastTemplate(surfaceTexture) {
  const group = new THREE.Group();
  group.name = "chloroplast-cutaway";
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(
      1,
      64,
      24,
      0,
      Math.PI * 2,
      Math.PI / 2,
      Math.PI / 2,
    ),
    new THREE.MeshStandardMaterial({
      color: "#648f49",
      roughness: 0.55,
      side: THREE.DoubleSide,
      bumpMap: surfaceTexture || null,
      bumpScale: 0.003,
      roughnessMap: surfaceTexture || null,
    }),
  );
  shell.scale.set(0.365, 0.19, 0.27);
  shell.name = "chloroplast-envelope";
  group.add(shell);
  const inner = new THREE.Mesh(
    shell.geometry,
    new THREE.MeshStandardMaterial({
      color: "#a7c58a",
      roughness: 0.65,
      side: THREE.DoubleSide,
    }),
  );
  inner.scale.set(0.357, 0.18, 0.262);
  inner.name = "chloroplast-inner-envelope";
  group.add(inner);
  for (const scale of [1, 0.977]) {
    const points = Array.from({ length: 97 }, (_, i) => {
      const a = (i / 96) * Math.PI * 2;
      return new THREE.Vector3(
        0.365 * scale * Math.cos(a),
        0,
        0.27 * scale * Math.sin(a),
      );
    });
    const rim = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        96,
        0.0018,
        6,
        false,
      ),
      new THREE.MeshStandardMaterial({ color: "#ceddb1", roughness: 0.55 }),
    );
    rim.name = "chloroplast-cut-rim";
    group.add(rim);
  }
  const stroma = new THREE.Mesh(
    new THREE.CircleGeometry(1, 40),
    new THREE.MeshStandardMaterial({
      color: "#9ebd78",
      roughness: 0.8,
      side: THREE.DoubleSide,
      bumpMap: surfaceTexture || null,
      bumpScale: 0.0015,
    }),
  );
  stroma.rotation.x = -Math.PI / 2;
  stroma.scale.set(0.35, 0.258, 1);
  stroma.position.y = -0.065;
  stroma.name = "chloroplast-stroma";
  group.add(stroma);
  const sites = [
    [-0.21, 0],
    [-0.105, 0.1],
    [0, -0.07],
    [0.115, 0.1],
    [0.215, -0.025],
  ];
  const stackScale = [1, 0.9, 0.96, 0.86, 0.94];
  const stackLayers = [6, 4, 7, 5, 6];
  // Illustrative variation. The two connected levels keep their original
  // centres, so stroma lamellae still terminate within the membrane sacs.
  const sacs = sites.flatMap(([x, z], i) =>
    Array.from({ length: stackLayers[i] }, (_, j) => ({
      x: x + 0.0015 * Math.sin(i * 2.1 + j * 0.7),
      y: -0.045 + j * 0.018,
      z: z + 0.0015 * Math.cos(i * 1.3 + j * 0.8),
      scale: stackScale[i] * (0.97 + 0.025 * Math.sin(j * 1.1 + i)),
      tint: new THREE.Color().setHSL(
        0.3 + 0.012 * Math.sin(i + j),
        0.16,
        0.86 + 0.05 * Math.sin(j * 1.7 + i),
      ),
    })),
  );
  const disks = new THREE.InstancedMesh(
    membraneContour(
      new THREE.LatheGeometry(
        [
          [0, -0.0065],
          [0.038, -0.0065],
          [0.047, -0.0058],
          [0.051, -0.0035],
          [0.052, 0],
          [0.051, 0.0035],
          [0.047, 0.0058],
          [0.038, 0.0065],
          [0, 0.0065],
        ].map(([radius, height]) => new THREE.Vector2(radius, height)),
        40,
      ),
      "xz",
    ),
    detailChloroplastMembrane(
      new THREE.MeshStandardMaterial({
        color: "#397437",
        roughness: 0.56,
        bumpMap: surfaceTexture || null,
        bumpScale: 0.0012,
        roughnessMap: surfaceTexture || null,
      }),
    ),
    sacs.length,
  );
  disks.name = "chloroplast-thylakoids";
  const matrix = new THREE.Matrix4();
  sacs.forEach(({ x, y, z, scale, tint }, i) => {
    disks.setMatrixAt(
      i,
      matrix.makeScale(scale, 1, scale).setPosition(x, y, z),
    );
    disks.setColorAt(i, tint);
  });
  group.add(disks);
  const rims = new THREE.InstancedMesh(
    membraneContour(new THREE.TorusGeometry(0.049, 0.0013, 6, 32), "xy"),
    new THREE.MeshStandardMaterial({ color: "#78a85d", roughness: 0.65 }),
    sacs.length * 2,
  );
  rims.name = "chloroplast-disc-rims";
  const rotation = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    Math.PI / 2,
  );
  const unit = new THREE.Vector3(1, 1, 1);
  sacs.forEach(({ x, y, z, scale }, i) => {
    for (let side = 0; side < 2; side++)
      rims.setMatrixAt(
        i * 2 + side,
        matrix.compose(
          new THREE.Vector3(x, y + (side ? 0.004 : -0.004), z),
          rotation,
          unit.set(scale, scale, 1),
        ),
      );
  });
  disks.userData.labelPoint = [sacs[5].x, sacs[5].y + 0.0065, sacs[5].z];
  group.add(rims);
  const particles = [];
  for (let i = 0; i < 240; i++) {
    const x = Math.sin(i * 12.9898) * 0.32,
      z = Math.cos(i * 7.233) * 0.23;
    if (
      (x / 0.34) ** 2 + (z / 0.25) ** 2 < 0.93 &&
      sites.every(([a, b]) => Math.hypot(x - a, z - b) > 0.065)
    )
      particles.push([x, -0.052, z]);
  }
  addCellParticles(
    group,
    "chloroplast-stroma-particles",
    particles,
    0.0028,
    "#dacb85",
  );
  for (const [x, z] of [
    [-0.06, 0.18],
    [0.09, -0.16],
  ]) {
    const grain = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 24, 16),
      new THREE.MeshStandardMaterial({
        color: "#e1dfc3",
        roughness: 0.8,
        bumpMap: surfaceTexture || null,
        bumpScale: 0.001,
      }),
    );
    grain.position.set(x, -0.025, z);
    grain.scale.set(1.4, 0.65, 1);
    grain.name = "chloroplast-starch";
    group.add(grain);
  }
  const dnaPoints = Array.from({ length: 97 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2;
    return new THREE.Vector3(
      -0.14 + Math.cos(a) * 0.034,
      -0.025 + Math.sin(a * 3) * 0.007,
      -0.15 + Math.sin(a) * 0.018,
    );
  });
  const dna = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(dnaPoints),
      96,
      0.0015,
      6,
      false,
    ),
    new THREE.MeshStandardMaterial({ color: "#c3a5ce", roughness: 0.7 }),
  );
  dna.name = "chloroplast-dna";
  group.add(dna);
  const material = new THREE.MeshStandardMaterial({
    color: "#638c42",
    roughness: 0.7,
  });
  const bands = [];
  for (let i = 1; i < sites.length; i++)
    for (const [level, phase] of [
      [-0.027, -1],
      [-0.009, 1],
    ])
      bands.push(createLamellaGeometry(sites[i - 1], sites[i], level, phase));
  const ribbon = new THREE.Mesh(mergeGeometries(bands), material);
  bands.forEach((geometry) => geometry.dispose());
  ribbon.name = "chloroplast-lamella";
  ribbon.userData.labelPoint = lamellaPoint(sites[0], sites[1], -0.009, 0.5, 1);
  group.add(ribbon);
  return group;
}

export function addCellParticles(root, name, positions, radius, color) {
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(radius, 10, 6),
    new THREE.MeshStandardMaterial({ color, roughness: 0.65 }),
    positions.length,
  );
  mesh.name = name;
  const matrix = new THREE.Matrix4();
  positions.forEach((point, i) =>
    mesh.setMatrixAt(i, matrix.makeTranslation(...point)),
  );
  root.add(mesh);
  return mesh;
}
