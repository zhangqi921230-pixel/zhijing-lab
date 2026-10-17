import { HEIGHT_BANDS, SLOPE_BANDS } from "./terrainDisplay.mjs";
import { TERRAIN_SCALE } from "./terrainWorld.mjs";
import { terrainRockTexture, terrainTextureState } from "./TerrainTextures.js";
import * as THREE from "three";
import { terrainTriangles } from "./models.mjs";

// Indexed vertices keep the lighting continuous across the very same triangles
// used by contour extraction. No visual-only displacement may alter the surface.
export function terrainGeometry() {
  const positions = [],
    indices = [],
    lookup = new Map();
  for (const triangle of terrainTriangles) {
    for (const [x, height, z] of triangle) {
      const key = `${x},${z}`;
      if (!lookup.has(key)) {
        lookup.set(key, positions.length / 3);
        positions.push(x, height / TERRAIN_SCALE, z);
      }
      indices.push(lookup.get(key));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Edge walls meet the actual terrain vertices, including non-zero boundary
// elevations; four flat boxes leave gaps between the ground and the cutaway.
export function terrainWallGeometry() {
  const edges = new Map();
  for (const tri of terrainTriangles) {
    for (let i = 0; i < 3; i++) {
      const a = tri[i],
        b = tri[(i + 1) % 3];
      if (!(
        (a[0] === b[0] && Math.abs(a[0]) === 3) ||
        (a[2] === b[2] && Math.abs(a[2]) === 3)
      ))
        continue;
      const key = [a.join(","), b.join(",")].sort().join("|");
      edges.set(key, [a, b]);
    }
  }
  const positions = [],
    depths = [];
  for (const [a, b] of edges.values()) {
    const topA = [a[0], a[1] / TERRAIN_SCALE, a[2]],
      topB = [b[0], b[1] / TERRAIN_SCALE, b[2]];
    const bottomA = [a[0], -0.56, a[2]],
      bottomB = [b[0], -0.56, b[2]];
    depths.push(0, topA[1] + 0.56, 0, 0, topA[1] + 0.56, topB[1] + 0.56);
    positions.push(
      ...topA,
      ...bottomA,
      ...topB,
      ...topB,
      ...bottomA,
      ...bottomB,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute(
    "soilDepth",
    new THREE.Float32BufferAttribute(depths, 1),
  );
  geometry.computeVertexNormals();
  return geometry;
}

const noise = `
float hashTerrain(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noiseTerrain(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(hashTerrain(i),hashTerrain(i+vec3(1,0,0)),f.x),mix(hashTerrain(i+vec3(0,1,0)),hashTerrain(i+vec3(1,1,0)),f.x),f.y),
mix(mix(hashTerrain(i+vec3(0,0,1)),hashTerrain(i+vec3(1,0,1)),f.x),mix(hashTerrain(i+vec3(0,1,1)),hashTerrain(i+vec3(1,1,1)),f.x),f.y),f.z);}
float grainTerrain(vec3 p){return .55*noiseTerrain(p)+.28*noiseTerrain(p*2.1)+.17*noiseTerrain(p*4.3);}
`;

export function terrainMaterial(wall = false) {
  const material = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.96,
    metalness: 0,
    side: wall ? THREE.DoubleSide : THREE.FrontSide,
  });
  material.userData.displayMode = { value: 0 };
  const palette = (bands) =>
    bands
      .map(
        (b, i) =>
          `${i ? "else " : ""}${Number.isFinite(b.max) ? `if(value<${b.max.toFixed(1)})` : ""} return vec3(${new THREE.Color(
            b.color,
          )
            .toArray()
            .map((n) => n.toFixed(6))
            .join(",")});`,
      )
      .join("\n");
  material.customProgramCacheKey = () => `terrain-realistic-v4-${wall}`;
  const rockTexture = terrainRockTexture();
  material.onBeforeCompile = (shader) => {
    shader.uniforms.terrainRockMap = { value: rockTexture };
    shader.uniforms.terrainRockReady = terrainTextureState;
    shader.uniforms.terrainDisplayMode = material.userData.displayMode;
    shader.vertexShader =
      "varying vec3 terrainPosition; varying vec3 terrainNormal;\n" +
      (wall ? "attribute float soilDepth; varying float terrainDepth;\n" : "") +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nterrainPosition = position; terrainNormal = normal;" +
        (wall ? "terrainDepth = soilDepth;" : ""),
    );
    shader.fragmentShader =
      "varying vec3 terrainPosition; varying vec3 terrainNormal;\n" +
      (wall ? "varying float terrainDepth;\n" : "") +
      noise +
      `
      uniform float terrainDisplayMode;
      vec3 elevationColor(float value){${palette(HEIGHT_BANDS)}}
      vec3 slopeColor(float value){${palette(SLOPE_BANDS)}}
      uniform sampler2D terrainRockMap;
      uniform float terrainRockReady;
      vec2 rockUV(vec2 uv) {
        float angle=${wall ? "0.07" : "1.08"};
        float c=cos(angle),s=sin(angle);
        return mat2(c,-s,s,c)*uv;
      }
      vec3 rockTriplanar(vec3 p, vec3 n) {
        vec3 w=pow(abs(normalize(n)),vec3(4.));
        w/=max(.00001,w.x+w.y+w.z);
        return texture2D(terrainRockMap,rockUV(p.zy)).rgb*w.x
             + texture2D(terrainRockMap,rockUV(p.xz)).rgb*w.y
             + texture2D(terrainRockMap,rockUV(p.xy)).rgb*w.z;
      }
      ` +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `
      #include <color_fragment>
      vec3 q=terrainPosition;
      float broad=grainTerrain(q*8.);
      float fine=grainTerrain(q*170.);
      vec3 rockScan=mix(rockTriplanar(q*1.55,terrainNormal),rockTriplanar(q*8.1+vec3(.37,1.13,.65),terrainNormal),.17);
      ${
        wall
          ? `
      // Soil follows the actual upper edge; bedrock bedding remains gently
      // undulating and independent of the surface instead of zebra striping.
      float depth=max(0.,terrainDepth);
      float mottling=grainTerrain(q*24.);
      float bedding=q.y*3.4+noiseTerrain(vec3(q.x*.8,0.,q.z*.8))*.24;
      float layer=floor(bedding);
      float layerTone=hashTerrain(vec3(layer,7.,2.));
      vec3 stone=mix(vec3(.075,.085,.09),vec3(.19,.17,.135),layerTone);
      vec3 mineral=rockScan*mix(vec3(.62,.67,.70),vec3(.88,.77,.59),layerTone);
      stone=mix(stone,mineral,terrainRockReady*.78);
      float boundary=min(fract(bedding),1.-fract(bedding));
      float seam=1.-smoothstep(.008,.04,boundary);
      float along=abs(terrainNormal.x)>.5?q.z:q.x;
      float joints=fract(along*3.7+layer*.37+noiseTerrain(q*5.)*.22);
      float fracture=1.-smoothstep(.008,.035,min(joints,1.-joints));
      stone*=1.-max(seam*.38,fracture*.32);
      stone*=.87+.24*mottling;
      vec3 subsoil=mix(vec3(.19,.105,.05),vec3(.30,.205,.105),mottling);
      vec3 humus=mix(vec3(.045,.033,.019),vec3(.11,.075,.031),mottling);
      float soilBoundary=.13+.035*noiseTerrain(q*11.);
      vec3 cutaway=mix(subsoil,stone,smoothstep(soilBoundary-.04,soilBoundary+.06,depth));
      cutaway=mix(humus,cutaway,smoothstep(.012,.055,depth));
      diffuseColor.rgb *= cutaway*(.92+.16*fine);
      `
          : `
      float slope=1.-abs(normalize(terrainNormal).y);
      float exposed=smoothstep(.22,.60,slope+broad*.19)+smoothstep(1.7,2.7,q.y)*.4;
      vec3 grass=mix(vec3(.045,.080,.026),vec3(.17,.20,.072),broad);
      vec3 rock=mix(vec3(.11,.12,.12),vec3(.35,.32,.25),broad);
      rock=mix(rock,mix(rockScan,vec3(dot(rockScan,vec3(.2126,.7152,.0722))),.35)*1.12,terrainRockReady);
      diffuseColor.rgb *= mix(grass,rock,clamp(exposed,0.,1.))*(.77+.46*fine);
      if(terrainDisplayMode>0.5){
        vec3 faceNormal=normalize(cross(dFdx(q),dFdy(q)));
        float degrees=acos(clamp(abs(faceNormal.y),0.,1.))*57.295779513;
        diffuseColor.rgb=terrainDisplayMode<1.5?elevationColor(q.y*${TERRAIN_SCALE.toFixed(1)}):slopeColor(degrees);
      }
      `
      }
    `,
    );
    // Fine surface normals supply grazing-light rock detail without displacing
    // the scientific mesh (contours and sections stay exact).
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_maps>",
      `#include <normal_fragment_maps>
       float microRelief = ${wall ? "mix(grainTerrain(terrainPosition * 65.),dot(rockScan,vec3(.2126,.7152,.0722)),terrainRockReady)-max(seam,fracture)*.12" : "mix(grainTerrain(terrainPosition * 95.),dot(rockScan,vec3(.2126,.7152,.0722)),terrainRockReady)"};
       // Luminance supplies cosmetic micro-bump only; geometry is unchanged.
       vec3 dx = dFdx(vViewPosition), dy = dFdy(vViewPosition);
       vec3 rx = cross(dy, normal), ry = cross(normal, dx);
       float determinant = dot(dx, rx);
       normal = normalize(abs(determinant)*normal - sign(determinant)*${wall ? ".008" : ".012"}*(1.-step(.5,terrainDisplayMode))*(dFdx(microRelief)*rx + dFdy(microRelief)*ry));`,
    );
  };
  return material;
}

export function buildTerrainSurface(root) {
  const surface = new THREE.Mesh(terrainGeometry(), terrainMaterial());
  surface.name = "terrain-surface";
  surface.castShadow = surface.receiveShadow = true;
  const walls = new THREE.Mesh(terrainWallGeometry(), terrainMaterial(true));
  walls.name = "terrain-cutaway";
  walls.castShadow = walls.receiveShadow = true;
  root.add(surface, walls);
}
