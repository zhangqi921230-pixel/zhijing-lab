import * as THREE from "three";
import { erCenter, erSurface } from "./EndoplasmicReticulum.js";
import { golgiCenter } from "./GolgiApparatus.js";
import { envelopePoint } from "./CellEnvelope.js";

const start = new THREE.Vector3(
  erCenter[0],
  erCenter[1] + erSurface(0, 0, 2),
  erCenter[2],
);
const entry = new THREE.Vector3(
  golgiCenter[0] - 0.0325,
  golgiCenter[1] - 0.1875,
  golgiCenter[2],
);
const exit = new THREE.Vector3(
  golgiCenter[0] + 0.0325,
  golgiCenter[1] + 0.1875,
  golgiCenter[2],
);
const membrane = new THREE.Vector3(
  ...envelopePoint(-Math.sqrt(0.96), 0, -0.2, 0.977),
);
const outside = membrane.clone().add(new THREE.Vector3(-0.28, 0, -0.03));
const paths = [
  new THREE.CatmullRomCurve3([
    start,
    start.clone().add(new THREE.Vector3(0.32, -0.015, 0.1)),
    entry,
  ]),
  new THREE.LineCurve3(entry, exit),
  new THREE.CatmullRomCurve3([
    exit,
    exit.clone().add(new THREE.Vector3(-0.25, 0.12, -0.13)),
    membrane,
  ]),
  new THREE.LineCurve3(membrane, outside),
];

export function secretoryState(progress) {
  const value = THREE.MathUtils.clamp(Number(progress) || 0, 0, 100);
  const segment = value < 35 ? 0 : value < 60 ? 1 : value < 90 ? 2 : 3;
  const limits = [15, 35, 60, 90, 100];
  const fraction =
    Math.max(0, value - limits[segment]) /
    (limits[segment + 1] - limits[segment]);
  return {
    position: paths[segment].getPoint(fraction),
    segment,
    value,
    carrier: (segment === 0 && value >= 15) || segment === 2,
  };
}

export function createSecretoryPathway() {
  const group = new THREE.Group();
  group.name = "secretory-pathway";
  const guide = new THREE.LineDashedMaterial({
    color: "#e9bd62",
    dashSize: 0.035,
    gapSize: 0.025,
    transparent: true,
    opacity: 0.85,
    depthTest: false,
  });
  const routeLines = [];
  const activeRoutes = [];
  for (const [index, path] of paths.entries()) {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(path.getPoints(64)),
      index === 0 ? guide : guide.clone(),
    );
    line.computeLineDistances();
    line.renderOrder = 20;
    line.name = `secretory-route-${index}`;
    group.add(line);
    routeLines.push(line);
    const emphasis = new THREE.Mesh(
      new THREE.TubeGeometry(path, 64, 0.005, 4, false),
      new THREE.MeshBasicMaterial({
        color: "#ffe29a",
        transparent: true,
        opacity: 0.85,
        depthTest: false,
        depthWrite: false,
      }),
    );
    emphasis.name = `secretory-active-route-${index}`;
    emphasis.renderOrder = 20;
    group.add(emphasis);
    activeRoutes.push(emphasis);
  }
  const marker = new THREE.Group();
  marker.name = "secretory-cargo-tracker";
  const pixels = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++)
    for (let x = 0; x < 64; x++) {
      const radius = Math.hypot((x + 0.5 - 32) / 32, (y + 0.5 - 32) / 32);
      const ring = Math.max(0, 1 - Math.abs(radius - 0.72) / 0.07);
      const glow = Math.max(0, 1 - radius) * 0.18;
      const offset = (y * 64 + x) * 4;
      pixels.set(
        [255, 255, 255, Math.round(Math.max(ring, glow) * 255)],
        offset,
      );
    }
  const texture = new THREE.DataTexture(pixels, 64, 64);
  texture.needsUpdate = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      color: "#ffda83",
      transparent: true,
      depthTest: false,
      depthWrite: false,
    }),
  );
  halo.name = "secretory-tracking-ring";
  halo.userData.ownedTexture = texture;
  halo.scale.set(0.24, 0.24, 1);
  halo.renderOrder = 23;
  marker.add(halo);
  const cargo = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.045, 1),
    new THREE.MeshBasicMaterial({ color: "#ffd154", depthTest: false }),
  );
  cargo.renderOrder = 22;
  const carrier = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 20, 12),
    new THREE.MeshBasicMaterial({
      color: "#eac075",
      transparent: true,
      opacity: 0.3,
      wireframe: true,
      depthTest: false,
    }),
  );
  carrier.renderOrder = 21;
  marker.add(cargo, carrier);
  group.add(marker);
  group.userData.update = (progress) => {
    const state = secretoryState(progress);
    marker.position.copy(state.position);
    carrier.visible = state.carrier;
    routeLines.forEach((line, index) => {
      line.material.opacity =
        index === state.segment ? 0.9 : index < state.segment ? 0.4 : 0.18;
      activeRoutes[index].visible =
        index === state.segment && state.value >= 15 && state.value < 100;
    });
  };
  group.userData.update(0);
  group.traverse((object) => {
    object.raycast = () => {};
  });
  return group;
}
