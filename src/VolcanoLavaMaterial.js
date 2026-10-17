import * as THREE from "three";

// Qualitative crust formation, not a temperature or viscosity solver.
export function lavaCooling(time) {
  return Math.max(0, Math.min(1, (time - 13) / 7));
}
export function createVolcanoLavaMaterial() {
  const uniforms = {
    lavaTime: { value: 0 },
    lavaCooling: { value: 0 },
    lavaFront: { value: 0 },
  };
  const material = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    side: THREE.DoubleSide,
    roughness: 0.87,
    metalness: 0,
    emissive: "#ffffff",
    emissiveIntensity: 1,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = "varying vec2 lavaUV;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nlavaUV = uv;",
    );
    shader.fragmentShader =
      `varying vec2 lavaUV;
      uniform float lavaTime; uniform float lavaCooling; uniform float lavaFront;
      float lavaHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float lavaNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(lavaHash(i),lavaHash(i+vec2(1,0)),f.x),mix(lavaHash(i+vec2(0,1)),lavaHash(i+vec2(1,1)),f.x),f.y);}
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      // Clip within the final submitted row instead of revealing whole rows.
      float edgeLag=min(lavaFront,.012)*pow(abs(lavaUV.x-.5)*2.,2.);
      if(lavaUV.y>lavaFront-edgeLag) discard;
      float travel = min(max(lavaTime-3.,0.),10.);
      vec2 flowUV = vec2(lavaUV.x*7.,lavaUV.y*35.-travel*1.3);
      float grain = lavaNoise(flowUV)*.7+lavaNoise(flowUV*2.8)*.3;
      float banks = smoothstep(.27,.49,abs(lavaUV.x-.5));
      float crust = clamp(smoothstep(.49,.8,grain)*.82+banks+lavaCooling,0.,1.);
      vec3 hot = mix(vec3(.8,.07,.008),vec3(1.,.48,.035),1.-grain);
      diffuseColor.rgb = mix(hot,vec3(.065,.048,.037),crust);
    `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>
      totalEmissiveRadiance = hot * (1.-crust) * (1.-lavaCooling) * 1.25;
    `,
    );
  };
  material.customProgramCacheKey = () => "volcano-lava-crust-v2";
  material.userData.updateLava = (time, fraction = 1) => {
    uniforms.lavaTime.value = time;
    uniforms.lavaCooling.value = lavaCooling(time);
    uniforms.lavaFront.value = Math.max(0, Math.min(1, fraction));
  };
  return material;
}
