import * as THREE from "three";

// Thin-leaf back lighting, using the same shadow-attenuated incident light as
// the standard material. This is a visual approximation, not a plant optics model.
export function ecologyLeafMaterial() {
  const material = new THREE.MeshStandardMaterial({
    color: "#638e43",
    vertexColors: true,
    roughness: 0.86,
    side: THREE.DoubleSide,
  });
  material.onBeforeCompile = (shader) => {
    const direct =
      "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );";
    const lighting = THREE.ShaderChunk.lights_fragment_begin.replaceAll(
      direct,
      `${direct}
      reflectedLight.directDiffuse +=
        0.42 * max(0.0, -dot(geometryNormal, directLight.direction))
        * directLight.color * BRDF_Lambert(material.diffuseColor)
        * vec3(1.0, 0.94, 0.65);`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <lights_fragment_begin>",
      lighting,
    );
  };
  material.customProgramCacheKey = () => "ecology-thin-leaf-v1";
  return material;
}
