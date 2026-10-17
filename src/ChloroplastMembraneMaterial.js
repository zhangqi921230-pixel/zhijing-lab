// Surface contrast is illustrative, not a map of individual membrane proteins.
// Object-space detail stays attached during rotation and uses the existing batch.
export function detailChloroplastMembrane(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = "varying vec3 membranePoint;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nmembranePoint=position;",
    );
    shader.fragmentShader =
      `varying vec3 membranePoint;
      float membraneHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float membraneNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(membraneHash(i),membraneHash(i+vec2(1,0)),f.x),mix(membraneHash(i+vec2(0,1)),membraneHash(i+vec2(1,1)),f.x),f.y);}
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec2 membraneUV=membranePoint.xz+membranePoint.y*vec2(.37,.61);
      float membraneFade=1.-smoothstep(.3,1.2,length(fwidth(membraneUV*1600.)));
      float membraneGrain=mix(.5,membraneNoise(membraneUV*1600.),membraneFade);
      float membranePatch=membraneNoise(membraneUV*180.);
      diffuseColor.rgb*=.79+.28*membraneGrain+.14*membranePatch;
      `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      "#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+.16*membraneGrain,.35,1.);",
    );
  };
  material.customProgramCacheKey = () => "chloroplast-membrane-detail-v1";
  return material;
}
