import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { addLaboratorySoftboxes } from "./LaboratorySoftboxes.js";
import { laboratorySurface } from "./LaboratorySurface.js";

// All textures are generated locally. Surface detail never changes model geometry.
const textures = new Map();
const earthListeners = new Set();
export function earthTexture(onLoad) {
  if (typeof document === "undefined") return null;
  if (onLoad && !textures.get("earth")?.image?.complete)
    earthListeners.add(onLoad);
  if (!textures.has("earth")) {
    const texture = new THREE.TextureLoader().load(
      "./textures/earth_atmos_2048.jpg",
      () => {
        earthListeners.forEach((callback) => callback());
        earthListeners.clear();
      },
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    // Our east-positive longitude points toward +Z; SphereGeometry's U runs oppositely.
    texture.repeat.x = -1;
    texture.offset.x = 1;
    textures.set("earth", texture);
  }
  return textures.get("earth");
}
export function surfaceTexture(kind, label = "") {
  if (typeof document === "undefined") return null;
  const key = kind + label;
  if (textures.has(key)) return textures.get(key);
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d");
  ctx.fillStyle = kind === "rock" ? "#a9a397" : "#f4efdf";
  ctx.fillRect(0, 0, 512, 512);
  let seed = 29;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 26000; i++) {
    const a = random() * (kind === "rock" ? 0.24 : 0.11);
    ctx.fillStyle = `rgba(45,39,25,${a})`;
    ctx.fillRect(
      random() * 512,
      random() * 512,
      1 + random() * 3,
      1 + random() * 2,
    );
  }
  if (kind === "paper") {
    ctx.strokeStyle = "#45555255";
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 7]);
    ctx.strokeRect(18, 18, 476, 476);
    ctx.fillStyle = "#183d36";
    ctx.textAlign = "center";
    ctx.font = "500 126px Georgia";
    ctx.fillText(label, 256, 297);
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#183d3688";
    ctx.fillText("知 境 · 几 何", 256, 450);
  }
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  textures.set(key, texture);
  return texture;
}

export function addStudio(scene, renderer, id) {
  const cosmic = ["seasons", "daynight"].includes(id);
  const glassLab = ["dilution", "solubility", "acid", "precipitation"].includes(
    id,
  );
  const dark =
    cosmic ||
    [
      "contour",
      "water",
      "volcano",
      "earthquake",
      "plates",
      "microscope",
      "lens",
    ].includes(id);
  scene.background = new THREE.Color(
    id === "conics"
      ? "#f5f3ed"
      : id === "molecule"
        ? "#080e14"
        : glassLab
          ? "#24343b"
          : dark
            ? "#0b1723"
            : "#e9eee8",
  );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = id === "contour" ? 0.72 : 0.95;
  if (id === "cell") {
    scene.background = new THREE.Color("#060e10");
    const generator = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.25;
    room.dispose();
    generator.dispose();
    const rim = new THREE.DirectionalLight("#83c9c5", 2.1);
    rim.position.set(-4, 2, -5);
    scene.add(rim);
    return () => environment.dispose();
  }
  let target;
  if (!cosmic) {
    const generator = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    if (glassLab) addLaboratorySoftboxes(room);
    target = generator.fromScene(room, glassLab ? 0.02 : 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity =
      id === "contour"
        ? 0.13
        : id === "biodiversity"
          ? 0.22
          : id === "solubility"
            ? 0.28
            : 0.45;
    room.dispose();
    generator.dispose();
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({
        color:
          id === "conics"
            ? "#f5f3ed"
            : glassLab
              ? "#26383d"
              : dark
                ? "#101e2b"
                : "#e4e7dd",
        roughness: 0.85,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.name = "studio-floor";
    floor.position.y = ["volcano", "earthquake", "plates"].includes(id)
      ? -2.6
      : id === "contour"
        ? -3.6
        : id === "cube"
          ? -0.76
          : id === "ohm"
            ? -3.7
            : -1.45;
    floor.receiveShadow = true;
    if (id === "ohm") {
      const texture = laboratorySurface("floor");
      floor.material.map = texture;
      floor.material.color.set("#ffffff");
      floor.userData.ownedTexture = texture;
    }
    if (id !== "molecule") scene.add(floor);
    else {
      floor.geometry.dispose();
      floor.material.dispose();
    }
    const grid = new THREE.GridHelper(
      30,
      60,
      dark ? "#314354" : "#bccac2",
      dark ? "#233342" : "#d1d9d0",
    );
    grid.position.y = floor.position.y + 0.003;
    grid.name = "studio-grid";
    grid.material.transparent = true;
    grid.material.opacity = id === "conics" ? 0.16 : 0.4;
    if (
      !glassLab &&
      ![
        "contour",
        "water",
        "microscope",
        "lens",
        "molecule",
        "biodiversity",
        "ohm",
      ].includes(id)
    )
      scene.add(grid);
    else {
      grid.geometry.dispose();
      grid.material.dispose();
    }
    scene.fog = new THREE.Fog(scene.background, 18, 45);
    const rim = new THREE.DirectionalLight(
      "#bddcfa",
      id === "contour" ? 0.35 : id === "biodiversity" ? 0.45 : 1,
    );
    rim.position.set(-6, 5, -7);
    scene.add(rim);
  } else {
    const positions = [];
    for (let i = 0; i < 1200; i++) {
      const a = i * 2.399963,
        y = 1 - (i / 1199) * 2,
        s = Math.sqrt(1 - y * y);
      positions.push(42 * Math.cos(a) * s, 42 * y, 42 * Math.sin(a) * s);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    scene.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          color: "#b0c5e0",
          size: 0.045,
          transparent: true,
          opacity: 0.7,
        }),
      ),
    );
  }
  return () => target?.dispose();
}

export { buildTerrainEcology as terrainDetails } from "./TerrainEcology.js";

export function atmosphere(parent, r) {
  // Rim-only glow: no bright transparent shell across the night hemisphere.
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(r * 1.025, 64, 48),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: `varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`,
      fragmentShader: `varying vec3 n; varying vec3 v; void main(){float a=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(.18,.52,.9,a*.55);}`,
    }),
  );
  parent.add(shell);
}
