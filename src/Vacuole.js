import * as T from "three";
import { addStructureLabels } from "./ChloroplastLabels.js";

// Same ellipsoid as the whole-cell model; section is an observation cut, not a free surface.
export const vacuoleRadii = [1.224, 0.7446, 1.02];
// View-dependent opacity clarifies the tonoplast silhouette in the overview.
// This is illustrative transparency, not a quantitative optical simulation.
export function detailVacuoleOverview(material) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `float tonoplastEdge = pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.0);
      diffuseColor.a *= 0.22 + 0.78 * tonoplastEdge;
      #include <opaque_fragment>`,
    );
  };
  material.customProgramCacheKey = () => "vacuole-overview-edge-v1";
  return material;
}
export function createVacuoleDetail(surfaceTexture = null) {
  const group = new T.Group();
  group.name = "vacuole-detail";
  group.position.set(0.55, -0.12, 0);
  const membrane = new T.MeshPhysicalMaterial({
    color: "#7db3b3",
    roughness: 0.7,
    metalness: 0,
    clearcoat: 0.08,
    bumpMap: surfaceTexture,
    roughnessMap: surfaceTexture,
    bumpScale: 0.002,
    side: T.DoubleSide,
  });
  const sap = new T.MeshPhysicalMaterial({
    color: "#39777e",
    roughness: 0.4,
    clearcoat: 0.3,
    side: T.DoubleSide,
  });
  const full = new T.Mesh(new T.SphereGeometry(1, 80, 48), membrane);
  full.name = "vacuole-intact";
  full.scale.set(...vacuoleRadii);
  group.add(full);
  const section = new T.Group();
  section.name = "vacuole-section";
  const shell = new T.Mesh(
    new T.SphereGeometry(1, 80, 32, 0, 2 * Math.PI, Math.PI / 2, Math.PI / 2),
    membrane,
  );
  shell.name = "vacuole-tonoplast";
  shell.scale.set(...vacuoleRadii);
  section.add(shell);
  const plane = new T.Mesh(new T.CircleGeometry(1, 80), sap);
  plane.name = "vacuole-sap-section";
  plane.rotation.x = -Math.PI / 2;
  plane.scale.set(vacuoleRadii[0] * 0.987, vacuoleRadii[2] * 0.987, 1);
  section.add(plane);
  const rim = new T.Mesh(new T.RingGeometry(0.987, 1, 80), membrane);
  rim.name = "vacuole-cut-rim";
  rim.rotation.x = -Math.PI / 2;
  rim.scale.set(vacuoleRadii[0], vacuoleRadii[2], 1);
  section.add(rim);
  addStructureLabels(
    section,
    "vacuole-labels",
    [
      ["液泡膜 · 单层生物膜", [-1.224, 0, 0], [-1.22, 0.5, 0]],
      ["细胞液 · 含溶解物质", [0.25, 0, 0.1], [0.88, 0.53, 0.1]],
      ["虚拟剖切面 · 非液面", [0.05, 0, 0.75], [0.05, 0.24, 1.17]],
    ],
    0.09,
  );
  group.add(section);
  group.userData.setSection = (open) => {
    full.visible = !open;
    section.visible = !!open;
  };
  group.userData.setSection(true);
  return group;
}
