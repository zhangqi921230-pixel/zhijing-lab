import * as T from "three";

// Flowing colour structure for the synthetic cutaway, not a temperature map.
export function createVolcanoMagmaMaterial() {
  const time = { value: 0 };
  const material = new T.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    roughness: 0.74,
    metalness: 0,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.magmaTime = time;
    shader.vertexShader = "varying vec3 magmaPoint;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nmagmaPoint=position;",
    );
    shader.fragmentShader =
      `varying vec3 magmaPoint;
      uniform float magmaTime;
      float magmaHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float magmaNoise(vec3 p){
        vec3 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(mix(magmaHash(i),magmaHash(i+vec3(1,0,0)),f.x),
          mix(magmaHash(i+vec3(0,1,0)),magmaHash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(magmaHash(i+vec3(0,0,1)),magmaHash(i+vec3(1,0,1)),f.x),
          mix(magmaHash(i+vec3(0,1,1)),magmaHash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec3 p=magmaPoint*5.5-vec3(0.,magmaTime*.24,0.);
      float broad=magmaNoise(p);
      float detail=magmaNoise(p*2.1+vec3(broad*1.8));
      float glow=smoothstep(.25,.8,broad*.7+detail*.3);
      vec3 magmaColor=mix(vec3(.3,.035,.012),vec3(.8,.17,.018),glow);
      diffuseColor.rgb=magmaColor;
    `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>
      totalEmissiveRadiance=magmaColor*(.15+glow*.3);
    `,
    );
  };
  material.customProgramCacheKey = () => "volcano-magma-volume-v1";
  material.userData.updateMagma = (value) => {
    time.value = Number.isFinite(value) ? value : 0;
  };
  return material;
}
