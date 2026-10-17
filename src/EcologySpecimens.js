import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { leafSurface } from "./leafSurface.mjs";
import { terrainNoise } from "./terrainWorld.mjs";
import { butterflyPattern } from "./ButterflyPattern.js";
import { ecologyLeafMaterial } from "./EcologyLeafMaterial.js";

function merged(parts) {
  const geometry = mergeGeometries(parts);
  parts.forEach((part) => part.dispose());
  return geometry;
}
function lineGeometry(points) {
  return new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(...p)),
  );
}

// Small shared height maps add surface relief without extra specimen meshes.
// Periodic angular coordinates keep the lathe seam continuous.
function fungusRelief(stem = false) {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const angle = (x / size) * Math.PI * 2;
      const v = y / size;
      const n = terrainNoise(
        Math.cos(angle) * 12 + v * (stem ? 0.8 : 18),
        Math.sin(angle) * 12 + v * (stem ? 0.4 : 11),
      );
      const fibers = Math.sin(angle * 43 + 0.7 * Math.sin(v * 9));
      const value = Math.round(
        255 *
          THREE.MathUtils.clamp(
            0.5 + n * 0.3 + (stem ? fibers * 0.12 : 0),
            0,
            1,
          ),
      );
      const offset = (y * size + x) * 4;
      pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = value;
      pixels[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.wrapS = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export function createEcologySpecimens({ plantOnly = false } = {}) {
  const green = ecologyLeafMaterial();
  const stems = new THREE.MeshStandardMaterial({
    color: "#688147",
    roughness: 1,
  });
  const veinMat = new THREE.LineBasicMaterial({
    color: "#8fa66a",
    transparent: true,
    opacity: 0.38,
  });
  const leafParts = [],
    stemParts = [
      new THREE.CylinderGeometry(0.0025, 0.014, 0.72, 8).translate(0, 0.36, 0),
      new THREE.SphereGeometry(1, 8, 8)
        .scale(0.007, 0.018, 0.006)
        .translate(0, 0.712, 0),
    ],
    veins = [];
  for (let j = 0; j < 6; j++) {
    const a = j * 2.39996,
      height = 0.15 + j * 0.085;
    const point = (t, edge = 0) =>
      new THREE.Vector3(...leafSurface(t, edge, j))
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), a)
        .add(new THREE.Vector3(0, height, 0));
    const positions = [],
      colors = [],
      indices = [];
    for (let i = 0; i <= 32; i++)
      for (let k = 0; k <= 8; k++) {
        const edge = (k - 4) / 4;
        positions.push(...point(i / 32, edge).toArray());
        const light =
          0.68 + 0.25 * Math.sin((i / 32) * Math.PI) - Math.abs(edge) * 0.12;
        colors.push(light, light, light * 0.9);
      }
    for (let i = 0; i < 32; i++)
      for (let k = 0; k < 8; k++) {
        const n = i * 9 + k;
        indices.push(n, n + 9, n + 1, n + 1, n + 9, n + 10);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geo.setIndex(indices);
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    leafParts.push(geo.toNonIndexed());
    geo.dispose();
    for (let i = 0; i < 16; i++)
      veins.push(
        point(i / 16)
          .add(new THREE.Vector3(0, 0.002, 0))
          .toArray(),
        point((i + 1) / 16)
          .add(new THREE.Vector3(0, 0.002, 0))
          .toArray(),
      );
    const vein = (t0, e0, t1, e1) => {
      for (let n = 0; n < 8; n++)
        for (const step of [n, n + 1]) {
          const f = step / 8;
          veins.push(
            point(t0 + (t1 - t0) * f, e0 + (e1 - e0) * f)
              .add(new THREE.Vector3(0, 0.0015, 0))
              .toArray(),
          );
        }
    };
    for (let i = 3; i < 26; i += 4)
      for (const side of [-1, 1]) {
        const t = i / 32;
        vein(t, 0, t + 0.13, side * 0.9);
        vein(t + 0.065, side * 0.45, t + 0.16, side * 0.62);
      }
    const start = new THREE.Vector3(0, height, 0),
      end = point(0),
      direction = end.clone().sub(start);
    const petiole = new THREE.CylinderGeometry(
      0.003,
      0.005,
      direction.length(),
      6,
    );
    petiole.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize(),
      ),
    );
    petiole.translate(...start.add(end).multiplyScalar(0.5).toArray());
    stemParts.push(petiole);
  }
  const leaves = merged(leafParts),
    stalk = merged(stemParts),
    veinGeometry = lineGeometry(veins);
  // Bend all connected structures together, including vein lines and petioles.
  for (const geometry of [leaves, stalk, veinGeometry]) {
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      positions.setX(i, positions.getX(i) + 0.025 * Math.sin((y / 0.72) * 2.4));
      positions.setZ(i, positions.getZ(i) + 0.018 * (y / 0.72) ** 2);
    }
    if (geometry.attributes.normal) geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }
  const plantVariants = new Map([[0, [leaves, stalk, veinGeometry]]]);
  function plant(variant = 0) {
    const key = Math.abs(Math.trunc(variant)) % 4;
    if (!plantVariants.has(key)) {
      const twist = [0, 0.45, -0.35, 0.65][key];
      plantVariants.set(
        key,
        [leaves, stalk, veinGeometry].map((source) => {
          const geometry = source.clone();
          const positions = geometry.attributes.position;
          for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i),
              y = positions.getY(i),
              z = positions.getZ(i);
            const angle = (twist * y) / 0.72;
            const radius = Math.hypot(x, z);
            positions.setXYZ(
              i,
              x * Math.cos(angle) - z * Math.sin(angle),
              y + Math.sin(y * 15 + key) * radius * 0.12,
              x * Math.sin(angle) + z * Math.cos(angle),
            );
          }
          if (geometry.attributes.normal) geometry.computeVertexNormals();
          geometry.computeBoundingSphere();
          return geometry;
        }),
      );
    }
    const [leafShape, stalkShape, veinShape] = plantVariants.get(key);
    const g = new THREE.Group();
    g.add(
      new THREE.Mesh(leafShape, green),
      new THREE.Mesh(stalkShape, stems),
      new THREE.LineSegments(veinShape, veinMat),
    );
    g.children.forEach((o) => {
      o.castShadow = true;
      o.receiveShadow = true;
    });
    return g;
  }
  if (plantOnly) return { plant };
  // Shared attachment surface: sample it on both the cap and the gill roots.
  // Sparse underside rings previously cut across the curled gills.
  const undersideHeight = (r) =>
    r < 0.15
      ? 0.255 - ((r - 0.045) / 0.105) * 0.01
      : 0.245 - ((r - 0.15) / 0.065) * 0.01;
  const capProfile = [
    ...Array.from({ length: 25 }, (_, i) => {
      const t = i / 24;
      return [0.22 * t, 0.25 + 0.12 * (1 - t * t)];
    }),
    [0.221, 0.245],
    [0.219, 0.239],
    [0.215, 0.235],
    ...Array.from({ length: 36 }, (_, i) => {
      const r = 0.215 - ((i + 1) / 36) * 0.17;
      return [r, undersideHeight(r)];
    }),
  ].map((p) => new THREE.Vector2(...p));
  const cap = new THREE.LatheGeometry(capProfile, 96);
  const capPositions = cap.attributes.position,
    capColors = [];
  const capColor = new THREE.Color(),
    centerColor = new THREE.Color("#91613f"),
    edgeColor = new THREE.Color("#c7a16f");
  for (let i = 0; i < capPositions.count; i++) {
    const x = capPositions.getX(i),
      y = capPositions.getY(i),
      z = capPositions.getZ(i);
    const radial = Math.min(1, Math.hypot(x, z) / 0.22);
    if (i % capProfile.length >= 28) capColor.set("#b7a385");
    else capColor.copy(centerColor).lerp(edgeColor, radial ** 1.6);
    const mottling =
      terrainNoise(x * 38 + 17, z * 38 + 29) * 0.11 +
      terrainNoise(x * 95, z * 95) * 0.04;
    capColor.multiplyScalar(0.92 + mottling);
    capColors.push(capColor.r, capColor.g, capColor.b);
  }
  cap.setAttribute("color", new THREE.Float32BufferAttribute(capColors, 3));
  const stem = new THREE.LatheGeometry(
    Array.from({ length: 25 }, (_, i) => {
      const y = (i / 24) * 0.27;
      const radius =
        0.025 +
        0.016 * Math.exp(-(((y - 0.025) / 0.065) ** 2)) +
        0.013 * Math.exp(-(((y - 0.27) / 0.025) ** 2));
      return new THREE.Vector2(radius, y);
    }),
    32,
  );
  const capMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    vertexColors: true,
    roughness: 0.86,
    bumpMap: fungusRelief(),
    bumpScale: 0.004,
    side: THREE.DoubleSide,
  });
  const stemMat = new THREE.MeshStandardMaterial({
    color: "#dbcba8",
    roughness: 0.92,
    bumpMap: fungusRelief(true),
    bumpScale: 0.002,
  });
  const gillPoints = [],
    gillIndices = [];
  for (let i = 0; i < 96; i++) {
    const a = (i * Math.PI) / 48,
      start = i % 2 ? 0.105 : 0.045;
    const first = gillPoints.length / 3;
    for (let j = 0; j <= 12; j++) {
      const t = j / 12,
        r = start + (0.212 - start) * t;
      const y = undersideHeight(r);
      gillPoints.push(
        r * Math.cos(a),
        y + 0.0005,
        r * Math.sin(a),
        r * Math.cos(a),
        y - 0.0005 - 0.009 * Math.sin(Math.PI * t),
        r * Math.sin(a),
      );
      if (j < 12) {
        const n = first + j * 2;
        gillIndices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
      }
    }
  }
  const gills = new THREE.BufferGeometry();
  gills.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(gillPoints, 3),
  );
  gills.setIndex(gillIndices);
  // One continuous deformation for cap, underside and stem keeps their
  // attachment points aligned while breaking the perfect lathed silhouette.
  for (const geometry of [cap, stem, gills]) {
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        y = positions.getY(i),
        z = positions.getZ(i);
      const r = Math.hypot(x, z),
        angle = Math.atan2(z, x),
        edge = THREE.MathUtils.clamp(r / 0.22, 0, 1);
      const asymmetry = 1 + 0.045 * Math.sin(angle * 3 + 0.8) * edge;
      const curl =
        edge ** 3 *
        (0.008 * Math.sin(angle * 5 + 0.4) + 0.003 * Math.sin(angle * 11));
      positions.setXYZ(
        i,
        x * asymmetry + 0.018 * Math.sin((y / 0.37) * Math.PI * 0.8),
        y + curl * Math.min(1, y / 0.2),
        z * asymmetry + 0.006 * Math.sin((y / 0.37) * Math.PI),
      );
    }
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }
  const gillMat = new THREE.MeshStandardMaterial({
    color: "#a59375",
    roughness: 1,
    side: THREE.DoubleSide,
  });
  return {
    plant,
    fungus() {
      const g = new THREE.Group();
      g.add(
        new THREE.Mesh(cap, capMat),
        new THREE.Mesh(stem, stemMat),
        new THREE.Mesh(gills, gillMat),
      );
      g.children[0].userData.ownedTexture = capMat.bumpMap;
      g.children[1].userData.ownedTexture = stemMat.bumpMap;
      g.children.forEach((o) => (o.castShadow = true));
      return g;
    },
  };
}

export function createButterflyTemplate() {
  const fore = new THREE.Shape();
  fore.moveTo(0.015, 0.04);
  fore.bezierCurveTo(0.1, 0.24, 0.29, 0.23, 0.24, 0.08);
  fore.bezierCurveTo(0.22, 0.01, 0.11, -0.02, 0.015, 0.015);
  const hind = new THREE.Shape();
  hind.moveTo(0.015, 0.015);
  hind.bezierCurveTo(0.2, 0.045, 0.21, -0.15, 0.1, -0.15);
  hind.bezierCurveTo(0.025, -0.12, 0.015, -0.05, 0.015, 0.015);
  const geometry = merged(
    [fore, hind].map((shape) =>
      new THREE.ShapeGeometry(shape, 12).rotateX(Math.PI / 2).toNonIndexed(),
    ),
  );
  const wingMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    map: butterflyPattern(),
    roughness: 0.85,
    side: THREE.DoubleSide,
  });
  const outlines = [];
  for (const shape of [fore, hind]) {
    const points = shape.getPoints(24);
    for (let i = 0; i < points.length - 1; i++)
      outlines.push(
        [points[i].x, 0.001, points[i].y],
        [points[i + 1].x, 0.001, points[i + 1].y],
      );
  }
  for (const tip of [
    [0.2, 0.15],
    [0.24, 0.08],
    [0.16, -0.1],
    [0.1, -0.13],
  ])
    outlines.push([0.025, 0.002, 0.02], [tip[0], 0.002, tip[1]]);
  const veins = lineGeometry(outlines),
    darkLines = new THREE.LineBasicMaterial({ color: "#4d3c2e" });
  const body = merged(
    [
      [0.025, 0.045, 0.055],
      [0.03, 0.025, 0],
      [0.018, 0.058, -0.07],
    ].map(([r, len, z]) =>
      new THREE.SphereGeometry(r, 10, 8)
        .scale(1, 0.8, len / r)
        .translate(0, 0.005, z),
    ),
  );
  const bodyMat = new THREE.MeshStandardMaterial({
    color: "#423e32",
    roughness: 0.9,
  });
  const legs = [];
  for (const side of [-1, 1]) {
    for (const z of [-0.025, 0, 0.025])
      legs.push(
        [side * 0.012, 0, z],
        [side * 0.045, -0.025, z - 0.01],
        [side * 0.045, -0.025, z - 0.01],
        [side * 0.07, -0.015, z - 0.04],
      );
    legs.push(
      [side * 0.012, 0.015, 0.08],
      [side * 0.04, 0.025, 0.13],
      [side * 0.04, 0.025, 0.13],
      [side * 0.06, 0.025, 0.145],
    );
  }
  const appendages = lineGeometry(legs);
  const headDetails = merged(
    [-1, 1].flatMap((side) => [
      new THREE.SphereGeometry(1, 10, 8)
        .scale(0.009, 0.012, 0.012)
        .translate(side * 0.022, 0.011, 0.077),
      new THREE.SphereGeometry(1, 8, 6)
        .scale(0.005, 0.004, 0.009)
        .translate(side * 0.06, 0.025, 0.145),
    ]),
  );
  const coilPoints = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    const angle = -Math.PI / 2 + t * Math.PI * 3.5;
    const radius = 0.019 * (1 - t * 0.72);
    return new THREE.Vector3(
      0,
      -0.025 - radius * Math.sin(angle),
      0.1 + radius * Math.cos(angle),
    );
  });
  const proboscis = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(coilPoints),
    40,
    0.0016,
    5,
    false,
  );
  const headMat = new THREE.MeshStandardMaterial({
    color: "#242522",
    roughness: 0.48,
  });
  return () => {
    const g = new THREE.Group();
    g.add(
      new THREE.Mesh(body, bodyMat),
      new THREE.LineSegments(appendages, darkLines),
    );
    const details = new THREE.Mesh(headDetails, headMat);
    details.name = "butterfly-eyes-and-antenna-tips";
    const mouth = new THREE.Mesh(proboscis, bodyMat);
    mouth.name = "butterfly-coiled-proboscis";
    g.add(details, mouth);
    for (const side of [-1, 1]) {
      const wing = new THREE.Group();
      wing.userData.wing = true;
      wing.userData.side = side;
      wing.scale.x = side;
      wing.add(
        new THREE.Mesh(geometry, wingMat),
        new THREE.LineSegments(veins, darkLines),
      );
      wing.children[0].userData.ownedTexture = wingMat.map;
      g.add(wing);
    }
    return g;
  };
}
