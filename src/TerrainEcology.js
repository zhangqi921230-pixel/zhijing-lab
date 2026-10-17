import {
  forestImpostorGeometry,
  forestImpostorTexture,
  forestImpostorDimensions,
} from "./ForestImpostor.js";
import * as T from "three";
import {
  terrainHeightAt,
  terrainTriangles,
  shorelineWater,
} from "./models.mjs";
import {
  TERRAIN_SCALE,
  terrainNoise,
  riverHeight,
  TEACHING_BASIN,
} from "./terrainWorld.mjs";

export function pineCrown() {
  const p = [],
    colors = [];
  for (let layer = 0; layer < 7; layer++) {
    const y = 0.18 + layer * 0.115,
      radius = 0.27 * (1 - layer / 7.5);
    for (let j = 0; j < 9; j++) {
      const a = (j / 9) * Math.PI * 2 + layer * 0.71;
      const r = radius * (0.8 + terrainNoise(j * 4, layer * 3) * 0.4);
      const vertices = [
        [0, y + 0.09, 0],
        [Math.cos(a - 0.23) * r * 0.7, y, Math.sin(a - 0.23) * r * 0.7],
        [Math.cos(a) * r, y - 0.035, Math.sin(a) * r],
        [Math.cos(a + 0.23) * r * 0.7, y, Math.sin(a + 0.23) * r * 0.7],
      ];
      for (const ix of [0, 1, 2, 0, 2, 3]) {
        p.push(...vertices[ix]);
        colors.push(
          0.64 + layer * 0.03,
          0.77 + layer * 0.02,
          0.54 + layer * 0.025,
        );
      }
    }
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(p, 3));
  g.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

export function forestSites() {
  const sites = [],
    occupied = new Map();
  const cellSize = 0.045;
  const key = (x, z) => `${x},${z}`;
  const smooth = (a, b, v) => {
    const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  let seed = 592;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < 46000; i++) {
    const x = random() * 5.96 - 2.98,
      z = random() * 5.96 - 2.98,
      h = terrainHeightAt(x, z);
    const slope =
      Math.hypot(
        terrainHeightAt(x + 0.025, z) - terrainHeightAt(x - 0.025, z),
        terrainHeightAt(x, z + 0.025) - terrainHeightAt(x, z - 0.025),
      ) /
      0.05 /
      TERRAIN_SCALE;
    const patch = terrainNoise(x * 1.6 + 12, z * 1.6 + 21);
    const edge = smooth(0, 0.2, 3 - Math.max(Math.abs(x), Math.abs(z)));
    const density =
      (0.06 + 0.85 * smooth(0.3, 0.72, patch)) *
      edge *
      (1 - smooth(1000, 1500, h));
    if (
      h < riverHeight(z) + 22 ||
      h > 1500 ||
      slope > 1.3 ||
      random() > density
    )
      continue;
    const height =
      (0.038 + random() * 0.056) * (1 - Math.max(0, h - 900) / 2500);
    const radius = 0.009 + height * 0.1;
    const cx = Math.floor(x / cellSize),
      cz = Math.floor(z / cellSize);
    let crowded = false;
    for (let ix = cx - 1; ix <= cx + 1; ix++)
      for (let iz = cz - 1; iz <= cz + 1; iz++) {
        for (const neighbor of occupied.get(key(ix, iz)) ?? [])
          if (
            Math.hypot(x - neighbor.x, z - neighbor.z) <
            radius + neighbor.radius
          )
            crowded = true;
      }
    if (crowded) continue;
    const bucket = key(cx, cz);
    if (!occupied.has(bucket)) occupied.set(bucket, []);
    occupied.get(bucket).push({ x, z, radius });
    sites.push({
      x,
      z,
      h,
      height,
      yaw: random() * Math.PI * 2,
      color: random(),
      broad: random() < 0.38 && h < 850,
      radius,
    });
  }
  return sites;
}

export function buildTerrainEcology(root) {
  const sites = forestSites(),
    pineSites = sites.filter((s) => !s.broad),
    broadSites = sites.filter((s) => s.broad);
  const dummy = new T.Object3D(),
    color = new T.Color();
  // Default fluent mode never allocates detailed instance matrices or crowns.
  // The first explicit request builds them once, and subsequent switches reuse.
  root.userData.ensureDetailedForest = () => {
    if (root.getObjectByName("mountain-conifer-forest")) return;
    const pine = new T.InstancedMesh(
      pineCrown(),
      new T.MeshStandardMaterial({
        color: "#ffffff",
        vertexColors: true,
        side: T.DoubleSide,
        roughness: 0.96,
      }),
      pineSites.length,
    );
    const broad = new T.InstancedMesh(
      new T.IcosahedronGeometry(0.35, 1),
      new T.MeshStandardMaterial({ color: "#ffffff", roughness: 1 }),
      broadSites.length * 3,
    );
    const trunk = new T.InstancedMesh(
      new T.CylinderGeometry(0.018, 0.032, 0.75, 5),
      new T.MeshStandardMaterial({ color: "#625345", roughness: 1 }),
      sites.length,
    );
    sites.forEach((s, i) => {
      dummy.position.set(s.x, s.h / TERRAIN_SCALE + s.height * 0.375, s.z);
      dummy.scale.setScalar(s.height);
      dummy.rotation.set(0, s.yaw, 0);
      dummy.updateMatrix();
      trunk.setMatrixAt(i, dummy.matrix);
    });
    pineSites.forEach((s, i) => {
      dummy.position.set(s.x, s.h / TERRAIN_SCALE, s.z);
      dummy.scale.setScalar(s.height);
      dummy.rotation.set(0, s.yaw, 0);
      dummy.updateMatrix();
      pine.setMatrixAt(i, dummy.matrix);
      pine.setColorAt(
        i,
        color.setHSL(0.22 + s.color * 0.055, 0.44, 0.1 + s.color * 0.075),
      );
    });
    broadSites.forEach((s, i) => {
      for (let j = 0; j < 3; j++) {
        dummy.position.set(
          s.x + Math.cos(j * 2.4) * s.height * 0.15,
          s.h / TERRAIN_SCALE + s.height * (0.55 + j * 0.11),
          s.z + Math.sin(j * 2.4) * s.height * 0.16,
        );
        dummy.scale.set(s.height * 0.9, s.height * 0.8, s.height * 0.85);
        dummy.rotation.set(j, s.yaw, j * 0.2);
        dummy.updateMatrix();
        broad.setMatrixAt(i * 3 + j, dummy.matrix);
        broad.setColorAt(
          i * 3 + j,
          color.setHSL(0.19 + s.color * 0.07, 0.43, 0.14 + s.color * 0.08),
        );
      }
    });
    pine.name = "mountain-conifer-forest";
    broad.name = "valley-broadleaf-forest";
    for (const o of [pine, broad, trunk]) {
      o.castShadow = o.receiveShadow = true;
      root.add(o);
    }
    trunk.name = "forest-trunks";
  };
  // Two species batches share site data with detailed crowns. Each tree keeps
  // the same eight-triangle budget, with only one additional draw call.
  for (const [species, batch] of [
    ["pine", pineSites],
    ["broad", broadSites],
  ]) {
    const foliageTexture = forestImpostorTexture(species);
    const low = new T.InstancedMesh(
      forestImpostorGeometry(),
      new T.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 1,
        map: foliageTexture,
        alphaTest: 0.22,
        alphaToCoverage: true,
        side: T.DoubleSide,
      }),
      batch.length,
    );
    batch.forEach((s, i) => {
      const dimensions = forestImpostorDimensions(s.height, s.broad);
      dummy.position.set(s.x, s.h / TERRAIN_SCALE + dimensions.centerY, s.z);
      dummy.scale.set(...dimensions.scale);
      dummy.rotation.set(0, s.yaw, 0);
      dummy.updateMatrix();
      low.setMatrixAt(i, dummy.matrix);
      low.setColorAt(
        i,
        color.setHSL(
          (s.broad ? 0.19 : 0.22) + s.color * 0.055,
          0.4,
          0.23 + s.color * 0.095,
        ),
      );
    });
    low.userData.ownedTexture = foliageTexture;
    low.castShadow = low.receiveShadow = true;
    low.name =
      species === "pine" ? "forest-low-detail" : "forest-low-broadleaf";
    low.visible = false;
    root.add(low);
  }
  const boulders = new T.InstancedMesh(
    new T.IcosahedronGeometry(1, 1),
    new T.MeshStandardMaterial({ color: "#aaa18c", roughness: 1 }),
    220,
  );
  for (let i = 0; i < 220; i++) {
    const x = terrainNoise(i * 2.7, 11) * 5.9 - 2.95,
      z = terrainNoise(i * 4.9, 39) * 5.9 - 2.95,
      h = terrainHeightAt(x, z);
    const size =
      h > riverHeight(z) + 5 ? 0.008 + terrainNoise(i, 23) * 0.02 : 0;
    dummy.position.set(x, h / TERRAIN_SCALE, z);
    dummy.rotation.set(i, i * 0.73, i * 0.3);
    dummy.scale.set(size * 1.2, size * 0.72, size);
    dummy.updateMatrix();
    boulders.setMatrixAt(i, dummy.matrix);
    boulders.setColorAt(
      i,
      color.setHSL(0.1, 0.12, 0.27 + terrainNoise(i, 2) * 0.12),
    );
  }
  boulders.castShadow = boulders.receiveShadow = true;
  boulders.name = "terrain-boulders";
  root.add(boulders);
  const positions = [],
    colors = [];
  for (const tri of shorelineWater)
    for (const p of tri) {
      positions.push(p.x, p.y / TERRAIN_SCALE + 0.003, p.z);
      color
        .set("#58999d")
        .lerp(new T.Color("#174657"), Math.min(1, p.depth / 45));
      colors.push(color.r, color.g, color.b);
    }
  const waterGeometry = new T.BufferGeometry();
  waterGeometry.setAttribute(
    "position",
    new T.Float32BufferAttribute(positions, 3),
  );
  waterGeometry.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  waterGeometry.computeVertexNormals();
  const waterMaterial = new T.MeshPhysicalMaterial({
    color: "#ffffff",
    vertexColors: true,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.12,
    side: T.DoubleSide,
  });
  const waterTime = { value: 0 };
  waterMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.waterTime = waterTime;
    shader.vertexShader = "varying vec3 waterPosition;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nwaterPosition=position;",
    );
    shader.fragmentShader =
      "varying vec3 waterPosition; uniform float waterTime;\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      "#include <color_fragment>\nfloat ripple=sin(waterPosition.x*290.+sin(waterPosition.z*75.-waterTime*1.7))*sin(waterPosition.z*150.-waterTime*2.3);diffuseColor.rgb*=.92+.12*ripple;",
    );
  };
  const water = new T.Mesh(waterGeometry, waterMaterial);
  water.name = "connected-river-and-lake";
  water.receiveShadow = true;
  root.add(water);
  root.userData.waterTime = waterTime;
  root.userData.forestCount = sites.length;
  if (typeof document !== "undefined") {
    for (const [name, side] of [
      ["主峰", -1],
      ["东峰", 1],
      ["盆地底", 0],
    ]) {
      const peak =
        side === 0
          ? [
              TEACHING_BASIN.x,
              terrainHeightAt(TEACHING_BASIN.x, TEACHING_BASIN.z),
              TEACHING_BASIN.z,
            ]
          : terrainTriangles
              .flat()
              .reduce(
                (best, p) => (p[0] * side > 0.6 && p[1] > best[1] ? p : best),
                [0, 0, 0],
              );
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");
      ctx.font = '500 29px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = "#edf3f6";
      ctx.shadowColor = "#081422";
      ctx.shadowBlur = 6;
      ctx.fillText(`${name}  ${Math.round(peak[1])} m`, 12, 49);
      const texture = new T.CanvasTexture(canvas);
      texture.colorSpace = T.SRGBColorSpace;
      const sprite = new T.Sprite(
        new T.SpriteMaterial({
          map: texture,
          depthTest: false,
          sizeAttenuation: false,
          transparent: true,
        }),
      );
      sprite.position.set(peak[0], peak[1] / TERRAIN_SCALE + 0.28, peak[2]);
      sprite.scale.set(0.14, 0.022, 1);
      sprite.center.set(0, 0.5);
      sprite.renderOrder = 9;
      sprite.userData.ownedTexture = texture;
      sprite.name = "terrain-label";
      root.add(sprite);
      const leader = new T.Line(
        new T.BufferGeometry().setFromPoints([
          new T.Vector3(peak[0], peak[1] / TERRAIN_SCALE + 0.02, peak[2]),
          new T.Vector3(peak[0], peak[1] / TERRAIN_SCALE + 0.3, peak[2]),
        ]),
        new T.LineBasicMaterial({
          color: "#dce8ee",
          transparent: true,
          opacity: 0.7,
        }),
      );
      leader.name = "terrain-label";
      root.add(leader);
    }
  }
}
