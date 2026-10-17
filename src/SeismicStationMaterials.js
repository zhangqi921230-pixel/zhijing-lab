import * as THREE from "three";
import { createInstrumentFinishTexture } from "./MicroscopeMaterials.js";

export function finishSeismicStation(station) {
  const paint = createInstrumentFinishTexture(false),
    metal = createInstrumentFinishTexture(true);
  const size = 128,
    data = new Uint8Array(size * size * 4);
  let seed = 31871;
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  for (let i = 0; i < size * size; i++) {
    const pore = random(),
      value = Math.round(
        pore < 0.035 ? 105 + random() * 40 : 193 + random() * 48,
      );
    data.set(
      [value, Math.round(value * 0.985), Math.round(value * 0.95), 255],
      i * 4,
    );
  }
  const concrete = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  concrete.colorSpace = THREE.SRGBColorSpace;
  concrete.wrapS = concrete.wrapT = THREE.RepeatWrapping;
  concrete.repeat.set(3, 3);
  concrete.magFilter = THREE.LinearFilter;
  concrete.minFilter = THREE.LinearMipmapLinearFilter;
  concrete.generateMipmaps = true;
  concrete.needsUpdate = true;
  for (const [name, texture] of [
    ["paint", paint],
    ["metal", metal],
    ["concrete", concrete],
  ]) {
    const owner = new THREE.Group();
    owner.name = `seismic-${name}-resource`;
    owner.userData.ownedTexture = texture;
    station.add(owner);
  }
  station.traverse((object) => {
    const material = object.material;
    if (!material?.isMeshStandardMaterial || material.map) return;
    const color = material.color.getHexString();
    if (["b2b8ab", "a4a89b"].includes(color)) {
      material.map = concrete;
      material.bumpMap = concrete;
      material.bumpScale = 0.005;
      material.roughness = 0.96;
      material.metalness = 0;
      material.name = "seismic-concrete";
    } else if (color === "d7d8c9") {
      material.roughnessMap = paint;
      material.bumpMap = paint;
      material.bumpScale = 0.001;
      material.roughness = 0.68;
      material.metalness = 0.03;
      material.name = "seismic-enclosure-coating";
    } else if (["889da3", "aebfc2", "9ba8ad", "869597"].includes(color)) {
      material.roughnessMap = metal;
      material.metalness = 0.78;
      material.roughness = 0.42;
      material.name = "seismic-brushed-metal";
    }
  });
}
