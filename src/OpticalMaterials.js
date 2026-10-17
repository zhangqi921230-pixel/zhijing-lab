import * as T from "three";
import { createInstrumentFinishTexture } from "./MicroscopeMaterials.js";

export function finishOpticalInstrument(root) {
  const brushed = createInstrumentFinishTexture(true);
  const paint = createInstrumentFinishTexture(false);
  for (const [name, texture] of [
    ["optical-brushed-resource", brushed],
    ["optical-paint-resource", paint],
  ]) {
    const resource = new T.Group();
    resource.name = name;
    resource.userData.ownedTexture = texture;
    root.add(resource);
  }
  root.traverse((object) => {
    const material = object.material;
    if (
      !material?.isMeshStandardMaterial ||
      material.transparent ||
      material.map
    )
      return;
    const color = material.color.getHexString();
    if (["9faeb1", "bac4c3", "a5b6bb", "c0c8c9"].includes(color)) {
      material.name = "optical-machined-metal";
      material.metalness = 0.88;
      material.roughness = 0.34;
      material.roughnessMap = brushed;
    } else if (["263c43", "344e56", "46565d"].includes(color)) {
      material.name = "optical-coated-metal";
      material.metalness = 0.24;
      material.roughness = 0.56;
      material.roughnessMap = paint;
    } else if (["222d32", "36434a", "242d30"].includes(color)) {
      material.name = "optical-rubber-grip";
      material.metalness = 0;
      material.roughness = 0.82;
      material.roughnessMap = paint;
    }
  });
}
