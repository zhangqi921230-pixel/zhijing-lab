import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { addStructureLabels } from "./ChloroplastLabels.js";
import { createMitochondrialMatrix } from "./MitochondrialMatrix.js";
import { cristaPoint } from "./mitochondrialSurface.mjs";
import { createMitochondrialSynthase } from "./MitochondrialSynthase.js";

// Reuse the existing membrane grain for colour and relief; no extra texture asset.
function membraneMaterial(color, surfaceTexture, bumpScale) {
  const material = new T.MeshStandardMaterial({
    color,
    roughness: 0.76,
    roughnessMap: surfaceTexture || null,
    bumpMap: surfaceTexture || null,
    bumpScale,
    side: T.DoubleSide,
  });
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      #ifdef USE_BUMPMAP
        float membraneTone=texture2D(bumpMap,vBumpMapUv).r;
        diffuseColor.rgb*=mix(.76,1.12,smoothstep(.3,.75,membraneTone));
        // Reuse the periodic, mipmapped membrane asset at a finer scale.
        // Derivative fading keeps this illustration grain quiet at cell scale.
        vec2 fineMembraneUV=vBumpMapUv*7.0+vec2(.17,.31);
        float membraneDetailFade=1.0-smoothstep(.012,.045,length(fwidth(fineMembraneUV)));
        float membraneFine=texture2D(bumpMap,fineMembraneUV).r;
        diffuseColor.rgb*=mix(1.0,mix(.86,1.10,smoothstep(.32,.70,membraneFine)),membraneDetailFade);
      #endif`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>
      #ifdef USE_BUMPMAP
        roughnessFactor=clamp(roughnessFactor+(membraneFine-.5)*.24*membraneDetailFade,.45,1.0);
      #endif`,
    );
  };
  material.customProgramCacheKey = () => "mitochondrial-membrane-grain-v2";
  return material;
}

// A cutaway teaching model: lamellar cristae fold inward from the inner membrane.
// Dimensions and colour are illustrative, not electron-micrograph measurements.
export function createMitochondrion(surfaceTexture) {
  const group = new T.Group();
  group.name = "mitochondrion-cutaway";
  group.userData = { action: "parameter", key: "part", value: 4 };
  const shell = new T.SphereGeometry(
    1,
    64,
    32,
    0,
    Math.PI * 2,
    Math.PI / 2,
    Math.PI / 2,
  );
  for (const [name, scale, color] of [
    ["mitochondrion-outer-membrane", [0.27, 0.115, 0.145], "#ad604b"],
    ["mitochondrion-inner-membrane", [0.252, 0.098, 0.127], "#bd8474"],
  ]) {
    const mesh = new T.Mesh(
      shell,
      membraneMaterial(color, surfaceTexture, 0.0014),
    );
    mesh.name = name;
    mesh.scale.set(...scale);
    group.add(mesh);
    const points = Array.from({ length: 96 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 96;
      return new T.Vector3(
        scale[0] * Math.cos(angle),
        0,
        scale[2] * Math.sin(angle),
      );
    });
    const rim = new T.Mesh(
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points, true),
        96,
        0.0016,
        6,
        true,
      ),
      new T.MeshStandardMaterial({
        color: name.includes("outer") ? "#e4ab89" : "#f0cca4",
        roughness: 0.62,
      }),
    );
    rim.name = `${name}-rim`;
    group.add(rim);
  }
  const cristae = new T.Mesh(
    createCristaeGeometry(),
    membraneMaterial("#bd8474", surfaceTexture, 0.0011),
  );
  cristae.name = "mitochondrion-cristae";
  group.add(cristae);
  group.add(createMitochondrialMatrix());
  group.add(createMitochondrialSynthase());
  return group;
}

export function createCristaeGeometry(across = 24, along = 32) {
  const folds = [];
  for (let n = 0; n < 7; n++) {
    const vertices = [],
      uvs = [],
      indices = [];
    for (let j = 0; j <= along; j++) {
      const v = -1 + (2 * j) / along;
      for (let i = 0; i <= across; i++) {
        const u = i / across;
        vertices.push(...cristaPoint(n, u, v));
        // Unroll each fold's two sides continuously; offset repeat phase so
        // neighbouring cristae do not carry identical surface markings.
        uvs.push(u * 0.4 + n * 0.17, (v + 1) * 0.75);
        if (i < across && j < along) {
          const a = j * (across + 1) + i,
            b = a + across + 1;
          indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute(
      "position",
      new T.Float32BufferAttribute(vertices, 3),
    );
    geometry.setIndex(indices);
    geometry.setAttribute("uv", new T.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    folds.push(geometry);
  }
  const geometry = mergeGeometries(folds);
  folds.forEach((geometry) => geometry.dispose());
  return geometry;
}

export function addMitochondrionLabels(group) {
  const ribosomes = group.getObjectByName("mitochondrion-matrix-ribosomes");
  const ribosomeMatrix = new T.Matrix4();
  ribosomes.getMatrixAt(0, ribosomeMatrix);
  const ribosomePoint = new T.Vector3()
    .setFromMatrixPosition(ribosomeMatrix)
    .toArray();
  addStructureLabels(
    group,
    "mitochondrion-labels",
    [
      ["外膜", [-0.27, 0, 0], [-0.34, 0.07, 0]],
      ["内膜", [0.24, -0.025, 0], [0.33, 0.09, 0]],
      ["嵴 · 内膜褶皱", [0, -0.02, 0], [0, 0.14, -0.12]],
      ["基质", [0.03, -0.06, 0.04], [0.2, -0.02, 0.2]],
      ["核糖体 · 放大示意", ribosomePoint, [-0.22, 0.1, -0.15]],
      ["线粒体 DNA", [-0.087, -0.027, 0.032], [-0.24, -0.03, 0.22]],
      ["ATP 合酶 · 放大示意", cristaPoint(5, 0.43, -0.48), [0.27, 0.12, -0.15]],
    ],
    0.04,
  );
}
