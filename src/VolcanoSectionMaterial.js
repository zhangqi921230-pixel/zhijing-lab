import * as THREE from "three";

// Synthetic layers illustrate successive deposits; not a surveyed stratigraphy.
export function createVolcanoSectionMaterial() {
  const material = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.98,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  material.name = "volcano-layered-section";
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = "varying vec3 sectionPoint;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nsectionPoint=position;",
    );
    shader.fragmentShader =
      `varying vec3 sectionPoint;
      float sectionHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float sectionNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(sectionHash(i),sectionHash(i+vec2(1,0)),f.x),mix(sectionHash(i+vec2(0,1)),sectionHash(i+vec2(1,1)),f.x),f.y);}
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      float radius=length(sectionPoint.xz);
      vec2 p=vec2(radius,sectionPoint.y);
      float height=sectionPoint.y + .67*radius;
      // Uneven deposit thickness and gently undulating contacts avoid printed stripes.
      float warp=.11*sin(radius*2.7)+.13*(sectionNoise(p*2.3)-.5);
      float phase=(height+warp)*3.1+.38*sin(height*3.7)+.16*sectionNoise(p*5.);
      float band=fract(phase);
      float aa=max(fwidth(phase),.01);
      float deposit=sectionHash(vec2(floor(phase),19.));
      float width=.23+.3*deposit+.08*sectionNoise(vec2(floor(phase),radius*1.7));
      float dark=smoothstep(.1-aa,.1+aa,band)*(1.-smoothstep(width-aa,width+aa,band));
      float fineFade=1.-smoothstep(.25,1.,length(fwidth(p*70.)));
      float grain=sectionNoise(p*19.)*.65+mix(.5,sectionNoise(p*70.),fineFade)*.35;
      vec3 ash=mix(vec3(.27,.205,.15),vec3(.36,.29,.205),deposit);
      vec3 solid=mix(vec3(.13,.12,.105),vec3(.205,.17,.14),deposit);
      // Sparse embedded fragments are a texture only, not additional scene objects.
      vec2 clastGrid=p*vec2(23.,31.);
      vec2 cell=floor(clastGrid);
      vec2 center=vec2(sectionHash(cell+7.),sectionHash(cell+31.))*.48+.26;
      float distanceToClast=length((fract(clastGrid)-center)*vec2(1.,1.35));
      float edge=max(length(fwidth(clastGrid)),.025);
      float clast=(1.-smoothstep(.13-edge,.13+edge,distanceToClast))*step(.68,sectionHash(cell));
      vec3 rockColor=mix(ash,solid,dark)*(.8+grain*.4);
      diffuseColor.rgb=mix(rockColor,rockColor*.56,clast*.65*fineFade);
    `,
    );
  };
  material.customProgramCacheKey = () => "volcano-section-strata-v2";
  return material;
}
