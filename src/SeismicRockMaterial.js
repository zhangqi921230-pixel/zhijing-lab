import * as T from "three";

// Illustrative rock fabric. Optical detail does not set the seismic velocity.
export function seismicRockMaterial(color, texture, layer) {
  const material = new T.MeshStandardMaterial({
    color,
    map: texture,
    bumpMap: texture,
    bumpScale: 0.025,
    roughness: 1,
    metalness: 0,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.rockLayer = { value: layer };
    shader.vertexShader = "varying vec3 rockPoint;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nrockPoint=position;",
    );
    shader.fragmentShader =
      `varying vec3 rockPoint;
    uniform float rockLayer;
    float rockHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float rockNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(rockHash(i),rockHash(i+vec2(1,0)),f.x),mix(rockHash(i+vec2(0,1)),rockHash(i+vec2(1,1)),f.x),f.y);}
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec2 p=vec2(rockPoint.x+rockPoint.z*.43,rockPoint.y);
      float warp=rockNoise(vec2(p.x*1.6,rockLayer*7.1))*.8+sin(p.x*2.3+rockLayer)*.22;
      float phase=p.y*(34.+rockLayer*3.)+warp;
      float fineFade=exp(-pow(fwidth(phase)*1.2,2.));
      float lamina=(.5+.5*sin(phase*6.283185))*fineFade;
      float grainPhase=length(fwidth(p*95.));
      float grain=mix(.5,rockNoise(p*95.+rockLayer*9.),1.-smoothstep(.3,1.2,grainPhase));
      vec2 joint=vec2(p.x*1.9+p.y*.6+rockLayer*.7,p.y*7.);
      float line=abs(fract(joint.x)-.5);
      float aa=max(fwidth(joint.x),.002);
      float fracture=(1.-smoothstep(.009-aa,.009+aa,line))*smoothstep(.35,.65,rockNoise(joint*vec2(1.,1.7)));
      diffuseColor.rgb*=.88+.13*lamina+.13*grain;
      diffuseColor.rgb*=1.-fracture*.2;
    `,
    );
  };
  material.customProgramCacheKey = () => "seismic-rock-fabric-v1";
  return material;
}
