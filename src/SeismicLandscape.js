import * as THREE from "three";
import { watershedCrownGeometry } from "./WatershedVegetation.js";

export function seismicPlantSites() {
  let seed = 1231;
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  return Array.from({ length: 120 }, () => ({
    x: -3.25 + random() * 6.5,
    z: -1.98 + random() * 2.35,
    scale: 0.4 + random() * 0.65,
    angle: random() * Math.PI * 2,
  }));
}
export function addSeismicLandscape(root) {
  const groundGeometry = new THREE.PlaneGeometry(6.98, 3.78, 48, 26);
  groundGeometry.rotateX(-Math.PI / 2);
  groundGeometry.translate(0, 0.006, -0.3);
  const positions = groundGeometry.attributes.position,
    colors = [];
  const color = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      z = positions.getZ(i);
    const patch =
      0.5 + 0.25 * Math.sin(x * 3 + z * 2) + 0.25 * Math.cos(z * 5 - x);
    color.set("#68775a").lerp(new THREE.Color("#aa9e78"), patch);
    colors.push(color.r, color.g, color.b);
  }
  groundGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );
  const ground = new THREE.Mesh(
    groundGeometry,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
  );
  ground.name = "seismic-ground-cover";
  root.add(ground);
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(6.96, 0.78),
    new THREE.MeshStandardMaterial({ color: "#9c947c", roughness: 1 }),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.009, 1.17);
  road.name = "seismic-service-strip";
  root.add(road);
  const sites = seismicPlantSites(),
    vegetation = new THREE.Group();
  vegetation.name = "seismic-vegetation";
  root.add(vegetation);
  const trunks = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.009, 0.016, 0.13, 5),
    new THREE.MeshStandardMaterial({ color: "#63503c", roughness: 1 }),
    sites.length,
  );
  const crowns = new THREE.InstancedMesh(
    watershedCrownGeometry(),
    new THREE.MeshStandardMaterial({ color: "#758264", roughness: 1 }),
    sites.length,
  );
  const dummy = new THREE.Object3D();
  sites.forEach((site, i) => {
    dummy.scale.setScalar(site.scale);
    dummy.rotation.set(0, site.angle, 0);
    dummy.position.set(site.x, 0.006 + 0.065 * site.scale, site.z);
    dummy.updateMatrix();
    trunks.setMatrixAt(i, dummy.matrix);
    dummy.position.y = 0.006 + 0.2 * site.scale;
    dummy.updateMatrix();
    crowns.setMatrixAt(i, dummy.matrix);
    crowns.setColorAt(
      i,
      new THREE.Color().setHSL(
        0.22 + (i % 7) * 0.008,
        0.22,
        0.3 + (i % 9) * 0.016,
      ),
    );
  });
  trunks.instanceMatrix.needsUpdate = crowns.instanceMatrix.needsUpdate = true;
  vegetation.add(trunks, crowns);
  const stones = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: "#a7a38f", roughness: 1 }),
    80,
  );
  stones.name = "seismic-gravel";
  root.add(stones);
  for (let i = 0; i < 80; i++) {
    const s = 0.009 + (i % 5) * 0.003;
    dummy.position.set(
      -3.3 + 6.6 * ((i * 0.618034) % 1),
      0.012,
      0.79 + (i % 2) * 0.75,
    );
    dummy.scale.set(s, s * 0.45, s * 0.8);
    dummy.rotation.set(i * 0.4, i * 0.7, 0);
    dummy.updateMatrix();
    stones.setMatrixAt(i, dummy.matrix);
  }
  stones.instanceMatrix.needsUpdate = true;
  return vegetation;
}
