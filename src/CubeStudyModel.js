import * as THREE from "three";
import { cubeStudy } from "./cubeStudy.mjs";
export function addCubeStudy(root, faces, creases) {
  const grids = faces.map(({ mesh }) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(120), 3),
    );
    const grid = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({ color: "#426b58" }),
    );
    grid.name = "face-area-grid";
    mesh.add(grid);
    return grid;
  });
  let volume, blocks, lastN;
  const transform = new THREE.Object3D();
  const layerColors = [
    "#7aa899",
    "#b8bd83",
    "#d3b87b",
    "#a7bfca",
    "#aeabbf",
    "#d1a990",
  ];
  return (next) => {
    const q = cubeStudy(next),
      mode = next.detail ?? 0;
    if (mode === 2 && !volume) {
      volume = new THREE.Group();
      volume.name = "cube-volume-study";
      blocks = new THREE.InstancedMesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ roughness: 0.83, metalness: 0 }),
        216,
      );
      blocks.name = "cube-volume-cells";
      blocks.castShadow = true;
      blocks.receiveShadow = true;
      blocks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      blocks.frustumCulled = false;
      volume.add(blocks);
      const cageBox = new THREE.BoxGeometry(2, 2, 2);
      const cage = new THREE.LineSegments(
        new THREE.EdgesGeometry(cageBox),
        new THREE.LineBasicMaterial({
          color: "#779588",
          transparent: true,
          opacity: 0.6,
        }),
      );
      cageBox.dispose();
      cage.position.y = 1;
      volume.add(cage);
      root.add(volume);
    }
    faces.forEach(({ mesh }) => {
      mesh.visible = mode !== 2;
    });
    creases.forEach((line) => {
      line.visible = mode !== 2;
    });
    grids.forEach((grid) => {
      grid.visible = mode === 1;
    });
    if (volume) volume.visible = mode === 2;
    if (lastN !== q.n) {
      for (const grid of grids) {
        const a = grid.geometry.attributes.position.array;
        let at = 0;
        for (const y of [-0.017, 0.017])
          for (let i = 1; i < q.n; i++) {
            const u = -1 + (2 * i) / q.n;
            for (const v of [u, y, -0.99, u, y, 0.99, -0.99, y, u, 0.99, y, u])
              a[at++] = v;
          }
        grid.geometry.setDrawRange(0, at / 3);
        grid.geometry.attributes.position.needsUpdate = true;
      }
      lastN = q.n;
    }
    if (blocks && blocks.userData.divisions !== q.n) {
      const s = 2 / q.n;
      for (let layer = 0; layer < q.n; layer++)
        for (let z = 0; z < q.n; z++)
          for (let x = 0; x < q.n; x++) {
            const index = layer * q.n * q.n + z * q.n + x;
            transform.position.set(
              -1 + s * (x + 0.5),
              s * (layer + 0.5),
              -1 + s * (z + 0.5),
            );
            transform.scale.setScalar(s * 0.95);
            transform.updateMatrix();
            blocks.setMatrixAt(index, transform.matrix);
            blocks.setColorAt(index, new THREE.Color(layerColors[layer]));
          }
      blocks.instanceMatrix.needsUpdate = true;
      blocks.instanceColor.needsUpdate = true;
      blocks.userData.divisions = q.n;
    }
    if (blocks) blocks.count = q.count;
  };
}
