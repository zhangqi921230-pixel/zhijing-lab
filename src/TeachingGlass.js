import * as THREE from "three";

// View-dependent transparency keeps liquid and graduations visible without
// requiring another transmission pass for every nested glass shell.
export function teachingGlassMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    color: "#d7e5e4",
    metalness: 0,
    roughness: 0.08,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    thickness: 0.055,
    ior: 1.47,
    side: THREE.DoubleSide,
  });
  material.customProgramCacheKey = () => "teaching-glass-fresnel-v2";
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `float edgeFacing = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));
       float glassBodyAlpha = 0.018 + 0.18 * pow(clamp(edgeFacing, 0.0, 1.0), 3.0);
       float reflectionStrength = max(max(totalSpecular.r, totalSpecular.g), totalSpecular.b);
       diffuseColor.a = clamp(glassBodyAlpha + reflectionStrength, 0.018, 0.9);
       // Keep baked softbox reflections visible when the glass body is clear.
       // This is alpha-composited teaching glass, not a refraction solver.
       outgoingLight = (totalSpecular + totalDiffuse * glassBodyAlpha * 0.3) / diffuseColor.a;
       #include <opaque_fragment>`,
    );
  };
  return material;
}
