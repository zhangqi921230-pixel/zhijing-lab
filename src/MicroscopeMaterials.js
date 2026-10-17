import * as T from "three";
// A sealed hardwood teaching bench. Procedural grain avoids a texture download.
export function microscopeBenchMaterial(palette = "dark") {
  const material = new T.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: palette === "light" ? 0.52 : 0.4,
    metalness: 0,
    clearcoat: palette === "light" ? 0.12 : 0.28,
    clearcoatRoughness: 0.34,
  });
  material.customProgramCacheKey = () => `microscope-hardwood-v2-${palette}`;
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = "varying vec3 benchPosition;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nbenchPosition=position;",
    );
    shader.fragmentShader =
      "varying vec3 benchPosition;\n" + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec3 q=benchPosition;
      // Long, nearly straight fibres with restrained variation, rather than
      // periodic waves across the whole board. Screen derivatives fade fine
      // detail before it aliases when the instrument is viewed from afar.
      float warp=sin(q.x*.8+sin(q.z*1.9))*.018+sin(q.x*3.1+q.z)*.003;
      float phase=(q.z+warp)*96.+sin(q.z*17.+q.x*.4)*1.3;
      float grain=sin(phase)*exp(-pow(fwidth(phase)*.65,2.));
      float porePhase=(q.z+warp)*410.+sin(q.x*7.3)*.3;
      float pores=pow(.5+.5*sin(porePhase),12.)*exp(-pow(fwidth(porePhase)*.65,2.));
      float broad=.5+.25*sin(q.z*5.3+q.x*.12)+.15*sin(q.z*13.1-q.x*.08);
      vec3 wood=mix(${palette === "light" ? "vec3(.42,.29,.16),vec3(.62,.46,.27)" : "vec3(.105,.033,.012),vec3(.32,.13,.047)"},broad);
      wood*=.97+.025*grain-.028*pores;
      ${palette === "light" ? "float joint=0.;" : "float joint=1.-smoothstep(.008,.025,abs(fract((q.z+2.2)/1.1)-.5));"}
      diffuseColor.rgb*=wood*(1.-joint*.12);
    `,
    );
  };
  return material;
}

export function createInstrumentFinishTexture(brushed) {
  const size = 128,
    pixels = new Uint8Array(size * size * 4);
  let seed = 941;
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  for (let y = 0; y < size; y++) {
    const band = random();
    for (let x = 0; x < size; x++) {
      const value = Math.round(
        brushed ? 174 + band * 62 + random() * 18 : 222 + random() * 30,
      );
      const k = (y * size + x) * 4;
      pixels[k] = pixels[k + 1] = pixels[k + 2] = value;
      pixels[k + 3] = 255;
    }
  }
  const texture = new T.DataTexture(pixels, size, size, T.RGBAFormat);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.repeat.set(brushed ? 3 : 10, brushed ? 6 : 10);
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export function finishMicroscopeInstrument(root) {
  const paint = createInstrumentFinishTexture(false),
    metal = createInstrumentFinishTexture(true);
  // Own each shared map once so scene disposal releases the small textures.
  for (const [name, texture] of [
    ["paint-finish-resource", paint],
    ["metal-finish-resource", metal],
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
    if (["dedfd5", "d9dddc"].includes(color)) {
      object.material = new T.MeshPhysicalMaterial({
        color: material.color,
        metalness: 0.02,
        roughness: 0.34,
        roughnessMap: paint,
        clearcoat: 0.32,
        clearcoatRoughness: 0.25,
      });
      object.material.name = "instrument-enamel";
      material.dispose();
    } else if (["a3b0ad", "aab3b7", "77868b"].includes(color)) {
      material.metalness = 0.86;
      material.roughness = 0.31;
      material.roughnessMap = metal;
      material.name = "machined-instrument-metal";
    } else if (
      ["263437", "24343b", "29373a", "313e43", "323f44"].includes(color)
    ) {
      material.metalness = 0.14;
      material.roughness = 0.68;
      material.roughnessMap = paint;
      material.name = "matte-instrument-surface";
    }
  });
}
