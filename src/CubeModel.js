import * as THREE from "three";
import { surfaceTexture } from "./SceneCraft.js";
import { addCubeStudy } from "./CubeStudyModel.js";
export const cubePairs = [
  [0, 5],
  [1, 3],
  [2, 4],
];
export function buildCube(root, p) {
  const colors = [
      "#86b9a2",
      "#e3bd73",
      "#88b4c6",
      "#d7a58b",
      "#99ac77",
      "#bac8bb",
    ],
    faces = [],
    hinges = [],
    creases = [];
  function face(parent, index, z = 0) {
    const paper = new THREE.MeshStandardMaterial({
      color: colors[index],
      map: surfaceTexture("paper", "ABCDEF"[index]),
      roughness: 0.94,
      metalness: 0,
    });
    const edge = new THREE.MeshStandardMaterial({
      color: "#c7bda3",
      roughness: 1,
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.025, 1.98), [
      edge,
      edge,
      paper,
      paper,
      edge,
      edge,
    ]);
    mesh.position.z = z;
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.name = `cube-face-${"ABCDEF"[index]}`;
    mesh.userData = {
      action: "parameter",
      key: "pair",
      value: cubePairs.findIndex((pair) => pair.includes(index)) + 1,
      faceIndex: index,
    };
    parent.add(mesh);
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: "#54725d" }),
    );
    mesh.add(outline);
    faces.push({ mesh, paper, outline });
    return mesh;
  }
  function crease(parent) {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1, 0.025, 0),
        new THREE.Vector3(1, 0.025, 0),
      ]),
      new THREE.LineDashedMaterial({
        color: "#997442",
        dashSize: 0.09,
        gapSize: 0.045,
      }),
    );
    line.computeLineDistances();
    parent.add(line);
    creases.push(line);
  }
  face(root, 0);
  for (let i = 0; i < 4; i++) {
    const orientation = new THREE.Group();
    orientation.rotation.y = (i * Math.PI) / 2;
    root.add(orientation);
    const hinge = new THREE.Group();
    hinge.position.z = 1;
    orientation.add(hinge);
    hinges.push(hinge);
    crease(hinge);
    face(hinge, i + 1, 1);
    if (i === 0) {
      const lid = new THREE.Group();
      lid.position.z = 2;
      hinge.add(lid);
      hinges.push(lid);
      crease(lid);
      face(lid, 5, 1);
    }
  }
  root.position.y = -0.7;
  const updateStudy = addCubeStudy(root, faces, creases);
  root.userData.update = (next) => {
    updateStudy(next);
    const angle = (Math.max(0, Math.min(100, next.fold)) * Math.PI) / 200;
    for (const hinge of hinges) hinge.rotation.x = -angle;
    for (const { mesh, paper, outline } of faces) {
      const selected =
        cubePairs[(next.pair ?? 0) - 1]?.includes(mesh.userData.faceIndex) ??
        false;
      paper.emissive.set(selected ? "#b18a3b" : "#000000");
      paper.emissiveIntensity = selected ? 0.2 : 0;
      outline.material.color.set(selected ? "#d99222" : "#54725d");
    }
    return true;
  };
  root.userData.update(p);
}
