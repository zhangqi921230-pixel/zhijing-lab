import {
  createMitochondrion,
  addMitochondrionLabels,
  createCristaeGeometry,
} from "./Mitochondrion.js";
import * as THREE from "three";
import { cellLabelLayout } from "./CellLabelLayout.js";
import { createCellCytoskeleton } from "./CellCytoskeleton.js";
import { buildNuclearChromatin, nucleolusCenter } from "./NuclearChromatin.js";
import { addCellFocus } from "./CellFocus.js";
import {
  addChloroplastLabels,
  addStructureLabels,
} from "./ChloroplastLabels.js";
import { addNuclearPores, createNuclearPoreRim } from "./NuclearPores.js";
import { addNuclearEnvelope } from "./NuclearEnvelope.js";
import {
  createChloroplastTemplate,
  addCellParticles,
} from "./CellOrganelles.js";
import { addCellEnvelope } from "./CellEnvelope.js";
import { createGolgiApparatus } from "./GolgiApparatus.js";
import {
  createEndoplasmicReticulum,
  erCenter,
  erSurface,
} from "./EndoplasmicReticulum.js";
import { createVacuoleDetail, detailVacuoleOverview } from "./Vacuole.js";
import { addCytoplasmParticles } from "./CytoplasmParticles.js";
import { createSecretoryPathway } from "./SecretoryPathway.js";
import {
  mitochondrionSites,
  mitochondrionPoses,
  nucleusAnchor,
} from "./cellLayout.mjs";

export function buildCell(root, p) {
  const add = (geo, color, pos, extra = {}) => {
    const obj = new THREE.Mesh(
      geo,
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.36, ...extra }),
    );
    obj.position.set(...pos);
    obj.castShadow = true;
    obj.receiveShadow = true;
    root.add(obj);
    return obj;
  };
  const bead = (pos, r, color, scale = [1, 1, 1], extra = {}) => {
    const obj = add(new THREE.SphereGeometry(r, 40, 28), color, pos, extra);
    obj.scale.set(...scale);
    return obj;
  };
  const { front: frontWall, top: topWall } = addCellEnvelope(root);
  const membraneTexture = root.children.find((o) => o.userData.ownedTexture)
    ?.userData.ownedTexture;
  const vacuole = bead([0.55, -0.12, 0], 1.02, "#a5d1e4", [1.2, 0.73, 1], {
    transparent: true,
    opacity: 0.62,
    roughness: 0.28,
    clearcoat: 0.25,
    metalness: 0,
    bumpMap: membraneTexture || null,
    bumpScale: 0.002,
    roughnessMap: membraneTexture || null,
    depthWrite: false,
  });
  detailVacuoleOverview(vacuole.material);
  const nucleus = bead(
    [-1.36, -0.25, 0.55],
    0.55,
    p.part === 1 ? "#8e719c" : "#74658b",
    [1, 0.92, 1],
    { clearcoat: 0.15, roughness: 0.7 },
  );
  root.add(createVacuoleDetail(membraneTexture));
  nucleus.userData = { action: "parameter", key: "part", value: 1 };
  nucleus.name = "cell-nucleus";
  vacuole.userData = { action: "parameter", key: "part", value: 2 };
  nucleus.geometry.dispose();
  nucleus.geometry = new THREE.SphereGeometry(
    0.55,
    128,
    64,
    0,
    Math.PI * 2,
    Math.PI / 2,
    Math.PI / 2,
  );
  nucleus.material.side = THREE.DoubleSide;
  // The teaching cutaway is a zero-thickness shell. Its two-sided shadow map
  // self-intersects at grazing angles; retain shadows from internal structures.
  nucleus.castShadow = false;
  nucleus.material.bumpMap = membraneTexture || null;
  nucleus.material.bumpScale = 0.0012;
  nucleus.material.roughnessMap = membraneTexture || null;
  root.add(buildNuclearChromatin());
  const nucleolus = bead(
    nucleolusCenter.toArray(),
    0.12,
    "#b586bb",
    [1, 0.93, 1.04],
    { roughness: 0.76, clearcoat: 0 },
  );
  nucleolus.name = "cell-nucleolus";
  const nucleolusPositions = nucleolus.geometry.attributes.position;
  for (let i = 0; i < nucleolusPositions.count; i++) {
    const x = nucleolusPositions.getX(i),
      y = nucleolusPositions.getY(i),
      z = nucleolusPositions.getZ(i);
    const grain = 1 + 0.028 * Math.sin(x * 170 + y * 210) * Math.cos(z * 190);
    nucleolusPositions.setXYZ(i, x * grain, y * grain, z * grain);
  }
  nucleolus.geometry.computeVertexNormals();
  const pores = [];
  for (let i = 0; i < 28; i++) {
    const a = i * 2.39996,
      y = -0.05 - (i / 28) * 0.9,
      s = Math.sqrt(Math.max(0, 1 - y * y));
    pores.push([
      -1.36 + 0.554 * Math.cos(a) * s,
      -0.25 + 0.51 * y,
      0.55 + 0.554 * Math.sin(a) * s,
    ]);
  }
  const nuclearPores = addNuclearPores(root, nucleus, pores);
  addNuclearEnvelope(nucleus, nuclearPores);
  const poreDetailGeometry = nuclearPores.geometry;
  const poreOverviewGeometry = createNuclearPoreRim(false);
  const innerPoreRims = nucleus.getObjectByName("nuclear-inner-pore-rims");
  for (const object of [
    nucleolus,
    root.getObjectByName("cell-chromatin"),
    root.getObjectByName("nuclear-pores"),
  ])
    Object.assign(object.userData, {
      action: "parameter",
      key: "part",
      value: 1,
    });
  const chromatinPoint = new THREE.Vector3().fromBufferAttribute(
    root.getObjectByName("cell-chromatin").geometry.attributes.position,
    0,
  );
  addStructureLabels(
    root,
    "nucleus-labels",
    [
      ["核膜", [-1.9, -0.25, 0.55], [-2.08, 0.12, 0.55]],
      [
        "核孔",
        pores.reduce((front, point) => (point[2] > front[2] ? point : front)),
        [-0.75, -0.5, 1.12],
      ],
      ["染色质", chromatinPoint.toArray(), [-0.68, 0.16, 0.4]],
      ["核仁", nucleolusCenter.toArray(), [-1.96, -0.4, 1.02]],
    ],
    0.065,
  );
  const chloroplasts = [];
  const template = createChloroplastTemplate(
    root.children.find((o) => o.userData.ownedTexture)?.userData.ownedTexture,
  );
  const chloroplastCutShell = template.getObjectByName(
    "chloroplast-envelope",
  ).geometry;
  const chloroplastClosedShell = new THREE.SphereGeometry(1, 32, 16);
  const sites = [
    [1.75, 1.05],
    [0.75, 1.2],
    [-0.25, 1.2],
    [-1.8, -0.65],
    [-1, -1.16],
    [0.1, -1.2],
    [1.65, -1.1],
  ];
  // Illustrative variation; keep the labelled specimen fixed for close-up views.
  const chloroplastScales = [1, 0.68, 0.72, 0.7, 0.66, 0.65, 0.72];
  const chloroplastYaw = [0, 0.3, -0.2, -0.6, 0.45, -0.15, 0.65];
  const chloroplastColors = [
    "#648f49",
    "#638b48",
    "#6a914e",
    "#587e43",
    "#62864a",
    "#709553",
    "#5c8447",
  ];
  for (let i = 0; i < sites.length; i++) {
    const chlor = template.clone(true);
    chlor.userData = { action: "parameter", key: "part", value: 3 };
    chlor.position.set(sites[i][0], i === 0 ? -0.51 : -0.55, sites[i][1]);
    chlor.scale.setScalar(chloroplastScales[i]);
    chlor.rotation.y = chloroplastYaw[i];
    const envelope = chlor.getObjectByName("chloroplast-envelope");
    if (i > 0) envelope.material = envelope.material.clone();
    if (i === 0) addChloroplastLabels(chlor);
    root.add(chlor);
    chloroplasts.push(chlor.getObjectByName("chloroplast-envelope"));
  }
  root.add(createGolgiApparatus());
  const secretoryPathway = createSecretoryPathway();
  root.add(secretoryPathway);
  root.add(createEndoplasmicReticulum());
  const mitochondrionTemplate = createMitochondrion(
    root.children.find((o) => o.userData.ownedTexture)?.userData.ownedTexture,
  );
  const mitochondrialGeometry = {
    fineShell: mitochondrionTemplate.getObjectByName(
      "mitochondrion-outer-membrane",
    ).geometry,
    fineCristae: mitochondrionTemplate.getObjectByName("mitochondrion-cristae")
      .geometry,
    overviewShell: new THREE.SphereGeometry(
      1,
      24,
      12,
      0,
      Math.PI * 2,
      Math.PI / 2,
      Math.PI / 2,
    ),
    overviewCristae: createCristaeGeometry(8, 12),
    overviewClosedShell: new THREE.SphereGeometry(1, 24, 16),
  };
  // Both levels remain owned while inactive and are shared by all four instances.
  root.userData.ownedGeometries = [
    poreDetailGeometry,
    poreOverviewGeometry,
    ...Object.values(mitochondrialGeometry),
    chloroplastClosedShell,
  ];
  for (let i = 0; i < 4; i++) {
    const mitochondrion = mitochondrionTemplate.clone(true);
    mitochondrion.position.set(...mitochondrionSites[i]);
    mitochondrion.scale.setScalar(mitochondrionPoses[i].scale);
    mitochondrion.rotation.y = mitochondrionPoses[i].yaw;
    if (i === 0) addMitochondrionLabels(mitochondrion);
    root.add(mitochondrion);
  }
  addCytoplasmParticles(root);
  const cytoskeleton = createCellCytoskeleton();
  root.add(cytoskeleton);
  const overviewLabels = addStructureLabels(
    root,
    "cell-overview-labels",
    [
      ["细胞核", nucleusAnchor, [-2.65, 0.25, 0.8]],
      ["中央液泡", [0.55, 0.62, 0], [2.6, 0.65, -0.4]],
      ["叶绿体", [1.75, -0.48, 1.05], [2.65, 0.1, 1.5]],
      ["线粒体", mitochondrionSites[0], [-0.8, 0.4, -2.65]],
      ["高尔基体", [-1.6, 0.08, -0.5], [-2.65, 0.5, -1.3]],
      [
        "内质网",
        [erCenter[0], erCenter[1] + erSurface(0, 0, 2), erCenter[2]],
        [-2.75, 0.35, -0.2],
      ],
    ],
    0.23,
  );
  const overviewParts = {
    细胞核: 1,
    中央液泡: 2,
    叶绿体: 3,
    线粒体: 4,
    高尔基体: 5,
    内质网: 6,
  };
  for (const label of overviewLabels.children)
    if (label.isSprite)
      Object.assign(label.userData, {
        action: "parameter",
        key: "part",
        value: overviewParts[label.name],
      });
  const focus = addCellFocus(root);
  const labelLayout = cellLabelLayout(root, {
    minPixelHeight: 30,
    maxPixelHeight: 38,
  });
  root.userData.beforeRender = labelLayout.update;
  root.userData.restoreLabelLayout = labelLayout.restore;
  let inspection = 0,
    current = p;
  const visibility = (q) => {
    const poreGeometry =
      inspection === 1 ? poreDetailGeometry : poreOverviewGeometry;
    if (nuclearPores.geometry !== poreGeometry) {
      nuclearPores.geometry = innerPoreRims.geometry = poreGeometry;
      nuclearPores.boundingSphere = innerPoreRims.boundingSphere = null;
    }
    labelLayout.restore();
    chloroplasts.forEach((shell) => {
      shell.parent.children.forEach((child) => {
        child.visible = true;
      });
    });
    root
      .getObjectByName("golgi-apparatus")
      .userData.setDetail(inspection === 5 ? (q.golgiMode ?? 0) : 0);
    root
      .getObjectByName("vacuole-detail")
      .userData.setSection(q.vacuoleSection !== 0);
    root
      .getObjectByName("endoplasmic-reticulum")
      .userData.setDetail(inspection === 6 ? (q.erMode ?? 0) : 0);
    const firstChloroplast = root.getObjectByName("chloroplast-cutaway");
    const mitochondria = root.children.filter(
      (o) => o.name === "mitochondrion-cutaway",
    );
    mitochondria.forEach((mitochondrion, index) => {
      const opened =
        index === 0 &&
        (inspection === 4 ||
          (inspection === 0 && (q.part === 4 || q.organelleCutaway === 1)));
      const mode =
        inspection === 4 && index === 0 ? (q.mitochondrionMode ?? 0) : 0;
      for (const child of mitochondrion.children) {
        const detailed = inspection === 4 && index === 0;
        if (
          [
            "mitochondrion-outer-membrane",
            "mitochondrion-inner-membrane",
          ].includes(child.name)
        )
          child.geometry = detailed
            ? mitochondrialGeometry.fineShell
            : child.name === "mitochondrion-outer-membrane" && !opened
              ? mitochondrialGeometry.overviewClosedShell
              : mitochondrialGeometry.overviewShell;
        if (child.name === "mitochondrion-cristae")
          child.geometry = detailed
            ? mitochondrialGeometry.fineCristae
            : mitochondrialGeometry.overviewCristae;
        if (child.name.startsWith("mitochondrion-outer-membrane"))
          child.visible = mode !== 1 && mode !== 3;
        if (child.name === "mitochondrion-inner-membrane")
          child.visible = opened;
        if (child.name === "mitochondrion-cristae")
          child.visible = opened && mode !== 2 && mode !== 3;
        if (child.name === "mitochondrion-matrix-detail")
          child.visible = detailed && mode !== 2;
        if (child.name === "mitochondrion-atp-synthase")
          child.visible = detailed && mode !== 2 && mode !== 3;
        if (child.name.endsWith("-rim"))
          child.visible =
            inspection === 4 &&
            ((mode !== 1 && mode !== 3) || !child.name.includes("outer"));
      }
      mitochondrion
        .getObjectByName("mitochondrion-labels")
        ?.children.forEach((label) => {
          label.visible =
            mode === 3
              ? ["内膜", "基质", "线粒体 DNA", "核糖体 · 放大示意"].includes(
                  label.name,
                )
              : label.name !== "核糖体 · 放大示意" &&
                (mode === 0 ||
                  (mode === 1
                    ? label.name !== "外膜"
                    : ["外膜", "内膜"].includes(label.name)));
        });
    });
    root.traverse((object) => {
      if (object.name === "er-labels") object.visible = inspection === 6;
      if (object.name === "golgi-labels") object.visible = inspection === 5;
      if (object.name === "mitochondrion-labels")
        object.visible = inspection === 4;
      if (
        [
          "chloroplast-inner-envelope",
          "chloroplast-cut-rim",
          "chloroplast-disc-rims",
          "chloroplast-stroma-particles",
          "chloroplast-starch",
          "chloroplast-dna",
          "chloroplast-labels",
        ].includes(object.name)
      )
        object.visible = inspection === 3;
    });
    const chloroplastMode = inspection === 3 ? (q.chloroplastMode ?? 0) : 0;
    for (const object of firstChloroplast.children) {
      const membraneSystem = [
        "chloroplast-thylakoids",
        "chloroplast-disc-rims",
        "chloroplast-lamella",
      ].includes(object.name);
      if (membraneSystem)
        object.visible =
          chloroplastMode !== 2 &&
          (object.name !== "chloroplast-disc-rims" || inspection === 3);
      else if (
        [
          "chloroplast-envelope",
          "chloroplast-inner-envelope",
          "chloroplast-cut-rim",
          "chloroplast-stroma",
          "chloroplast-stroma-particles",
          "chloroplast-starch",
          "chloroplast-dna",
        ].includes(object.name)
      ) {
        const overviewVisible = [
          "chloroplast-envelope",
          "chloroplast-stroma",
        ].includes(object.name);
        object.visible =
          chloroplastMode !== 1 && (inspection === 3 || overviewVisible);
      }
    }
    chloroplasts.forEach((shell, index) => {
      const opened =
        index === 0 &&
        (inspection === 3 ||
          (inspection === 0 && (q.part === 3 || q.organelleCutaway === 1)));
      shell.geometry = opened ? chloroplastCutShell : chloroplastClosedShell;
      if (!opened)
        shell.parent.children.forEach((child) => {
          child.visible = child === shell;
        });
    });
    firstChloroplast
      .getObjectByName("chloroplast-labels")
      .children.forEach((label, i) => {
        const membraneLabel = i === 1 || i === 4;
        label.visible =
          chloroplastMode === 0 ||
          (chloroplastMode === 1 ? membraneLabel : !membraneLabel);
      });
    for (const child of root.children) {
      child.visible =
        inspection === 6
          ? child.name === "endoplasmic-reticulum"
          : inspection === 5
            ? child.name === "golgi-apparatus"
            : inspection === 4
              ? child === root.getObjectByName("mitochondrion-cutaway")
              : inspection === 3
                ? child === firstChloroplast
                : inspection === 2
                  ? child.name === "vacuole-detail"
                  : inspection === 1
                    ? [
                        "cell-nucleus",
                        "cell-nucleolus",
                        "cell-chromatin",
                        "nuclear-pores",
                        "nucleus-labels",
                      ].includes(child.name)
                    : !["nucleus-labels", "vacuole-detail"].includes(
                        child.name,
                      );
    }
    const nucleusMode = inspection === 1 ? (q.nucleusMode ?? 0) : 0;
    cytoskeleton.visible = !inspection && q.cytoskeleton > 0;
    cytoskeleton.userData.update(q.cytoskeleton ?? 0);
    if (inspection === 1) {
      for (const name of ["cell-nucleus", "nuclear-pores"])
        root.getObjectByName(name).visible = nucleusMode !== 2;
      for (const name of ["cell-nucleolus", "cell-chromatin"])
        root.getObjectByName(name).visible = nucleusMode !== 1;
    }
    root.getObjectByName("nucleus-labels").children.forEach((label) => {
      const membrane = ["核膜", "核孔"].includes(label.name);
      label.visible =
        nucleusMode === 0 || (nucleusMode === 1 ? membrane : !membrane);
    });
    if (!inspection) {
      root.getObjectByName("cell-boundary-layers").visible =
        q.cut >= 50 && q.part === 0;
      frontWall.visible = topWall.visible = q.cut < 100;
      focus(q.part);
      root.getObjectByName("cell-focus").visible = q.part !== 0;
    }
    const labelVisibility = {
      "cell-focus": !inspection && q.part !== 0,
      "cell-overview-labels": !inspection && q.part === 0 && q.cut >= 50,
      "cell-boundary-labels": !inspection,
      "nucleus-labels": inspection === 1,
      "vacuole-labels": inspection === 2,
      "chloroplast-labels": inspection === 3,
      "mitochondrion-labels": inspection === 4,
      "golgi-labels": inspection === 5,
      "er-labels": inspection === 6,
    };
    root.traverse((object) => {
      object.userData.setViewAngle?.(inspection ? (q.cellAngle ?? 0) : 0);
      if (object.name in labelVisibility)
        object.visible = q.labels !== 0 && labelVisibility[object.name];
    });
    secretoryPathway.visible = inspection === 0 && q.secretoryMode === 1;
  };
  root.userData.setInspection = (part) => {
    inspection = part;
    visibility(current);
  };
  root.userData.getInspection = () => inspection;
  // The tracing overlay does not cast shadows or change cell geometry.
  // Compare all other fields so future structure controls cannot accidentally
  // reuse a stale shadow map or skip a necessary visibility update.
  root.userData.updateOverlay = (q) => {
    if (!current) return false;
    const keys = new Set([...Object.keys(current), ...Object.keys(q)]);
    for (const key of keys) {
      if (
        key !== "secretoryMode" &&
        key !== "secretoryProgress" &&
        !Object.is(current[key], q[key])
      )
        return false;
    }
    current = q;
    secretoryPathway.visible = inspection === 0 && q.secretoryMode === 1;
    secretoryPathway.userData.update(q.secretoryProgress ?? 0);
    return true;
  };
  root.userData.update = (q) => {
    current = q;
    focus(q.part);
    // Fade the removed envelope more quickly in the open inspection range;
    // otherwise its two transparent sides veil every organelle underneath.
    const envelopeOpacity = Math.pow(
      1 - THREE.MathUtils.clamp(q.cut, 0, 100) / 100,
      2,
    );
    frontWall.visible = q.cut < 100;
    frontWall.material.opacity = 0.7 * envelopeOpacity;
    topWall.visible = q.cut < 100;
    topWall.material.opacity = 0.9 * envelopeOpacity;
    vacuole.material.color.set("#a5d1e4");
    nucleus.material.color.set(q.part === 1 ? "#8e719c" : "#74658b");
    chloroplasts.forEach((chlor, index) =>
      chlor.material.color.set(
        q.part === 3 && index === 0 ? "#408b39" : chloroplastColors[index],
      ),
    );
    visibility(q);
    secretoryPathway.visible = inspection === 0 && q.secretoryMode === 1;
    secretoryPathway.userData.update(q.secretoryProgress ?? 0);
  };
  root.userData.update(p);
}
