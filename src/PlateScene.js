import * as THREE from "three";
import { pineCrown } from "./TerrainEcology.js";
import { platePoint, plateColumn } from "./plateModel.mjs";
import { surfaceTexture } from "./SceneCraft.js";
import { panel } from "./CircuitBench.js";

function plateGeometry(side) {
  const samples = [],
    indices = [],
    colors = [],
    uv = [];
  const strata = ["#b0a281", "#a38b6d", "#777269", "#51555a"];
  function grid(nx, nz, sample, color) {
    const start = samples.length;
    for (let j = 0; j <= nz; j++)
      for (let i = 0; i <= nx; i++) {
        const s = sample(i / nx, j / nz);
        samples.push(s);
        const c = new THREE.Color(color);
        if (s[2] === 0 && color === "#849462")
          c.offsetHSL(0, 0, 0.025 * Math.sin(s[0] * 71 + s[1] * 38));
        colors.push(c.r, c.g, c.b);
        uv.push(s[0] * 3 + s[1], s[2] * 2 + s[1]);
        if (i < nx && j < nz) {
          const a = start + j * (nx + 1) + i,
            b = a + nx + 1;
          indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
  }
  grid(48, 40, (u, v) => [u, -2 + v * 4, 0], "#849462");
  // Close the bottom as well as the exposed edges when the model is rotated.
  grid(48, 40, (u, v) => [u, -2 + v * 4, 1], "#51555a");
  const layers = [0, 0.13, 0.42, 0.7, 1];
  for (let k = 0; k < 4; k++) {
    const f = (v) => layers[k] + v * (layers[k + 1] - layers[k]);
    for (const z of [-2, 2]) grid(48, 1, (u, v) => [u, z, f(v)], strata[k]);
    for (const u of [0, 1])
      grid(40, 1, (v, w) => [u, -2 + v * 4, f(w)], strata[k]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(samples.length * 3), 3).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  const grass = new THREE.Color("#849462"),
    rock = new THREE.Color("#8a8174"),
    surfaceColor = new THREE.Color();
  return {
    geometry,
    update(p) {
      const positions = geometry.attributes.position;
      samples.forEach(([u, z, f], i) => {
        const point = platePoint(side, u, z, f, p);
        positions.setXYZ(i, ...point);
        if (i < 49 * 41) {
          surfaceColor
            .copy(grass)
            .lerp(rock, Math.max(0, Math.min(1, (point[1] - 0.2) / 0.65)));
          surfaceColor.multiplyScalar(0.93 + 0.07 * Math.sin(u * 71 + z * 38));
          geometry.attributes.color.setXYZ(
            i,
            surfaceColor.r,
            surfaceColor.g,
            surfaceColor.b,
          );
        }
      });
      geometry.attributes.color.needsUpdate = true;
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
    },
  };
}

export function buildPlateScene(root, p) {
  const texture = surfaceTexture("rock");
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    map: texture,
    bumpMap: texture,
    bumpScale: 0.04,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const halves = [-1, 1].map((side) => {
    const terrain = plateGeometry(side),
      mesh = new THREE.Mesh(terrain.geometry, material);
    mesh.name = `plate-${side}`;
    mesh.castShadow = mesh.receiveShadow = true;
    root.add(mesh);
    return terrain;
  });
  const treeGeometry = pineCrown().scale(0.27, 0.27, 0.27);
  const crown = new THREE.InstancedMesh(
    treeGeometry,
    new THREE.MeshStandardMaterial({
      color: "#436047",
      roughness: 1,
      vertexColors: true,
      side: THREE.DoubleSide,
    }),
    180,
  );
  const trunks = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.009, 0.013, 0.08, 5),
    new THREE.MeshStandardMaterial({ color: "#71563e", roughness: 1 }),
    180,
  );
  crown.name = "plate-forest";
  trunks.name = "plate-trunks";
  crown.castShadow = true;
  root.add(crown, trunks);
  const dummy = new THREE.Object3D();
  let seed = 47;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const trees = Array.from({ length: 180 }, (_, i) => {
    crown.setColorAt(
      i,
      new THREE.Color().setHSL(
        0.28 + random() * 0.09,
        0.22 + random() * 0.18,
        0.17 + random() * 0.1,
      ),
    );
    return {
      u: 0.22 + random() * 0.74,
      z: -1.82 + random() * 3.64,
      scale: 0.55 + random() * 0.8,
    };
  });
  const markers = [-1, 1].map((side) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(65 * 3), 3),
    );
    const line = new THREE.Line(
      geometry,
      new THREE.LineDashedMaterial({
        color: "#f5df9e",
        dashSize: 0.075,
        gapSize: 0.045,
      }),
    );
    line.name = `plate-marker-${side}`;
    root.add(line);
    return { side, line };
  });
  const arrows = [-1, 1].map((side) => {
    const arrow = new THREE.ArrowHelper(
      new THREE.Vector3(side, 0, 0),
      new THREE.Vector3(side * 1.9, 0.55, 1),
      0.65,
      0xf0c57b,
      0.16,
      0.1,
    );
    arrow.name = `plate-arrow-${side}`;
    root.add(arrow);
    return { side, arrow };
  });
  const legend = panel(
    root,
    [0, -1.9, 2.9],
    6.3,
    0.32,
    (ctx, q) => {
      ctx.fillStyle = "#13232c";
      ctx.fillRect(0, 0, 1024, 64);
      ctx.fillStyle = "#e9dfbd";
      ctx.font = "28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        [
          "大陆张裂 · 地壳拉伸变薄与地表下陷",
          "大陆碰撞 · 地壳缩短增厚与山体隆起",
          "水平错动 · 对照两侧原本相连的金色标记",
        ][q.type],
        512,
        43,
      );
    },
    [1024, 64],
  );
  let last = "",
    lastLegendType;
  root.userData.update = (q) => {
    const key = `${q.type}:${q.progress}`;
    if (key === last) return;
    last = key;
    halves.forEach((h) => h.update(q));
    for (let i = 0; i < 180; i++) {
      const side = i < 90 ? -1 : 1;
      const { u, z, scale } = trees[i];
      const point = platePoint(side, u, z, 0, q);
      dummy.position.set(point[0], point[1] + 0.04 * scale, point[2]);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      trunks.setMatrixAt(i, dummy.matrix);
      dummy.position.y = point[1] + 0.02 * scale;
      dummy.updateMatrix();
      crown.setMatrixAt(i, dummy.matrix);
    }
    crown.instanceMatrix.needsUpdate = trunks.instanceMatrix.needsUpdate = true;
    crown.computeBoundingSphere();
    trunks.computeBoundingSphere();
    markers.forEach(({ side, line }) => {
      const a = line.geometry.attributes.position;
      for (let i = 0; i <= 64; i++) {
        const point = platePoint(side, i / 64, 0.1, 0, q);
        a.setXYZ(i, point[0], point[1] + 0.02, point[2]);
      }
      a.needsUpdate = true;
      line.computeLineDistances();
      line.geometry.computeBoundingSphere();
    });
    arrows.forEach(({ side, arrow }) => {
      const point = platePoint(side, 0.65, 1.2, 0, q);
      arrow.position.set(point[0], point[1] + 0.5, point[2]);
      arrow.setDirection(
        new THREE.Vector3(
          q.type === 2 ? 0 : side * (q.type === 1 ? -1 : 1),
          0,
          q.type === 2 ? side : 0,
        ),
      );
    });
    if (q.type !== lastLegendType) {
      legend.update(q);
      lastLegendType = q.type;
    }
    root.userData.centralThickness = plateColumn(0, 0, q).thickness;
  };
  root.userData.update(p);
}
