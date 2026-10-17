import * as T from "three";

export function createMoleculeEnsemble(root, templates) {
  const group = new T.Group();
  group.name = "molecule-ensemble";
  root.add(group);
  const meshes = templates.map((template, index) => {
    template.updateMatrix();
    const mesh = new T.InstancedMesh(template.geometry, template.material, 7);
    mesh.name = `molecule-ensemble-part-${index}`;
    mesh.castShadow = template.castShadow;
    mesh.receiveShadow = template.receiveShadow;
    mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    group.add(mesh);
    return mesh;
  });
  const pose = new T.Object3D();
  pose.scale.setScalar(0.3);
  const matrix = new T.Matrix4();
  let lastTime;
  return (visible, time = 0) => {
    group.visible = visible;
    if (!visible || time === lastTime) return;
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.39996 + time * 0.15;
      pose.position.set(
        Math.cos(angle) * 2.2,
        Math.sin(i * 1.7 + time * 0.35) * 0.9 + 0.35,
        Math.sin(angle) * 1.7,
      );
      pose.rotation.set(i + time * 0.5, i * 0.7 + time * 0.3, i * 0.2);
      pose.updateMatrix();
      meshes.forEach((mesh, index) => {
        matrix.multiplyMatrices(pose.matrix, templates[index].matrix);
        mesh.setMatrixAt(i, matrix);
      });
    }
    meshes.forEach((mesh) => {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
    lastTime = time;
  };
}
