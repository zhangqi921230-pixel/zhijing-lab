import * as THREE from "three";
import { ejectaPosition, ejectaImpactTime } from "./VolcanoBallistics.js";
import { createVolcanoEjecta, ejectaGlow } from "./VolcanoEjecta.js";

// Deterministic teaching particles, not a gas, ash transport or eruption solver.
export function addVolcanoPlume(root) {
  const count = 96,
    positions = new Float32Array(count * 3),
    sizes = new Float32Array(count),
    opacity = new Float32Array(count);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("puffSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("puffOpacity", new THREE.BufferAttribute(opacity, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    uniforms: { pointScale: { value: 500 }, maxPointSize: { value: 64 } },
    vertexShader: `attribute float puffSize; attribute float puffOpacity;
      uniform float pointScale; uniform float maxPointSize;
      varying float opacity; varying float seed;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);
        gl_Position=projectionMatrix*mv;
        gl_PointSize=min(maxPointSize,puffSize*pointScale/max(.1,-mv.z));
        opacity=puffOpacity;seed=position.y*.31;}`,
    fragmentShader: `varying float opacity; varying float seed;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      void main(){vec2 p=gl_PointCoord*2.-1.;
        float n=noise(p*3.+seed)*.6+noise(p*7.+seed)*.28+noise(p*14.)*.12;
        float edge=1.-smoothstep(.48,1.,length(p)+.24*(n-.5));
        float alpha=edge*opacity*(.68+.32*n);
        if(alpha<.005) discard;
        vec3 tint=mix(vec3(.16,.15,.14),vec3(.62,.59,.54),n*.55+(1.-gl_PointCoord.y)*.45);
        gl_FragColor=vec4(tint,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const cloud = new THREE.Points(geometry, material);
  cloud.name = "volcano-ash-plume";
  cloud.frustumCulled = false;
  root.add(cloud);
  const viewport = new THREE.Vector2();
  let maxSize = null;
  cloud.onBeforeRender = (renderer) => {
    renderer.getDrawingBufferSize(viewport);
    material.uniforms.pointScale.value = viewport.y;
    if (maxSize === null)
      maxSize = renderer
        .getContext()
        .getParameter(renderer.getContext().ALIASED_POINT_SIZE_RANGE)[1];
    material.uniforms.maxPointSize.value = Math.min(128, maxSize);
  };
  const fragments = createVolcanoEjecta(140),
    glow = fragments.geometry.getAttribute("ejectaGlow");
  root.add(fragments);
  const object = new THREE.Object3D();
  let last = "";
  let launchKey = "",
    impacts = [];
  return (q) => {
    const t = Math.max(0, q.time || 0),
      key = `${t}:${q.type}:${q.intensity}:${q.showAsh}:${q.showEjecta}`;
    if (key === last) return;
    last = key;
    const speed = (q.type ? 0.7 : 0.22) * q.intensity;
    const showFragments = q.showEjecta !== 0 && t >= 3 && t < 19;
    if (showFragments && launchKey !== `${q.type}:${q.intensity}`) {
      launchKey = `${q.type}:${q.intensity}`;
      impacts = Array.from({ length: 140 }, (_, i) =>
        ejectaImpactTime(speed, i * 2.39996, 0.035 * (1.15 + (i % 5) * 0.19)),
      );
    }
    const showCloud = q.showAsh !== 0 && q.type === 1 && t > 3 && t < 19.5;
    let visible = 0;
    for (let i = 0; showCloud && i < count; i++) {
      const born = 3 + i * 0.1,
        age = t - born,
        alive = q.type === 1 && age > 0 && age < 7;
      const fade = alive
        ? Math.min(1, age / 0.45) * Math.min(1, (7 - age) / 2)
        : 0;
      const a = i * 2.399963,
        rise = Math.max(0, age),
        strength = 0.8 + q.intensity * 0.08,
        width = (0.08 + rise * 0.11 + Math.max(0, rise - 3) * 0.16) * strength;
      positions[i * 3] = Math.sin(a + rise * 0.12) * width + rise * 0.09;
      positions[i * 3 + 1] = 2.15 + rise * 0.39 * strength;
      positions[i * 3 + 2] = Math.cos(a + rise * 0.12) * width;
      sizes[i] = (0.48 + rise * 0.32) * strength;
      opacity[i] = fade * (0.46 + q.intensity * 0.035);
      if (alive) visible++;
    }
    cloud.visible = visible > 0 && q.showAsh !== 0;
    if (showCloud)
      for (const attribute of Object.values(geometry.attributes))
        attribute.needsUpdate = true;
    let emitted = 0;
    for (let i = 0; showFragments && i < 140; i++) {
      const age = t - (3 + i * 0.065);
      if (age < 0 || age >= impacts[i]) continue;
      const point = ejectaPosition(age, speed, i * 2.39996);
      object.position.set(point.x, point.y, point.z);
      object.rotation.set(i * 0.3 + age, i * 0.7, age * 0.4);
      object.scale.setScalar(1.15 + (i % 5) * 0.19);
      object.updateMatrix();
      fragments.setMatrixAt(emitted, object.matrix);
      glow.setX(emitted++, ejectaGlow(age));
    }
    fragments.count = q.showEjecta === 0 ? 0 : emitted;
    if (emitted) {
      fragments.instanceMatrix.needsUpdate = true;
      glow.needsUpdate = true;
    }
  };
}
