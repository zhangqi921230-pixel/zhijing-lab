import * as THREE from "three";
import { createInstrumentFinishTexture } from "./MicroscopeMaterials.js";

export function finishCircuitInstruments(root) {
  const finish = createInstrumentFinishTexture(false);
  const resource = new THREE.Group();
  resource.name = "circuit-finish-resource";
  resource.userData.ownedTexture = finish;
  root.add(resource);
  root.traverse((object) => {
    const mat = object.material;
    if (!mat?.isMeshStandardMaterial || mat.map) return;
    const color = mat.color.getHexString();
    if (["324a4f", "dfdfd2", "264449", "28494b"].includes(color)) {
      mat.name = "circuit-powder-coat";
      mat.metalness = 0.18;
      mat.roughness = 0.58;
      mat.roughnessMap = finish;
    } else if (["263633", "293a3e", "253c3d"].includes(color)) {
      mat.name = "circuit-rubber";
      mat.metalness = 0;
      mat.roughness = 0.86;
      mat.roughnessMap = finish;
    }
  });
}
