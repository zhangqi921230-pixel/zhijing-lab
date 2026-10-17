import * as THREE from "three";

// Appearance only: this is not a thermodynamic temperature calculation.
export function ejectaGlow(age) {
  return Math.exp(-Math.max(0, age) * 1.15);
}

export function createVolcanoEjecta(count) {
  const geometry = new THREE.IcosahedronGeometry(0.035, 1);
  const position = geometry.getAttribute("position");
  const point = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i).normalize();
    // Equal input vertices receive equal deformation, keeping triangle seams shut.
    const grain = Math.sin(point.x * 17 + point.y * 11 + point.z * 23);
    point.multiplyScalar(0.035 * (0.83 + grain * 0.12));
    point.y *= 0.83;
    point.z *= 0.92;
    position.setXYZ(i, point.x, point.y, point.z);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  const glow = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
  geometry.setAttribute("ejectaGlow", glow);
  const material = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.95,
    emissive: "#ff5214",
    emissiveIntensity: 1.5,
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader =
      "attribute float ejectaGlow; varying float vEjectaGlow; varying vec3 vRock;\n" +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvEjectaGlow=ejectaGlow; vRock=position/0.035;",
      );
    shader.fragmentShader =
      "varying float vEjectaGlow; varying vec3 vRock;\n" +
      shader.fragmentShader
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          float rockPattern = sin(vRock.x*13.+sin(vRock.z*9.))*sin(vRock.y*11.+vRock.z*7.);
          float cracks = 1.-smoothstep(.06,.2,abs(rockPattern));
          float heat = vEjectaGlow * (.1 + .9*cracks);
          vec3 crust = mix(vec3(.055,.045,.038),vec3(.15,.12,.09),rockPattern*.5+.5);
          diffuseColor.rgb *= mix(crust,vec3(.8,.24,.035),heat);`,
        )
        .replace(
          "#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\ntotalEmissiveRadiance *= heat;",
        );
  };
  material.customProgramCacheKey = () => "volcano-ejecta-crust-v1";
  const fragments = new THREE.InstancedMesh(geometry, material, count);
  fragments.name = "volcano-ejecta";
  fragments.frustumCulled = false;
  return fragments;
}
