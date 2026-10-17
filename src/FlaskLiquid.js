import * as T from "three";
import { sphericalLiquidLevel } from "./sphericalLiquid.mjs";
export function buildFlaskLiquid(material, registerGeometry, radius = 0.565) {
  const group = new T.Group();
  group.name = "distillation-flask-liquid";
  // Start with a hemisphere so the open top has a full band of triangles.
  const geometry = registerGeometry(
    new T.SphereGeometry(
      radius,
      28,
      12,
      0,
      Math.PI * 2,
      Math.PI / 2,
      Math.PI / 2,
    ),
  );
  const curved = new T.Mesh(geometry, material);
  curved.name = "distillation-liquid-curved-wall";
  const surface = new T.Mesh(
    registerGeometry(new T.CircleGeometry(1, 28)),
    material,
  );
  surface.name = "distillation-liquid-horizontal-surface";
  surface.rotation.x = -Math.PI / 2;
  group.add(curved, surface);
  const positions = geometry.attributes.position,
    normals = geometry.attributes.normal,
    uv = geometry.attributes.uv;
  positions.setUsage(T.DynamicDrawUsage);
  normals.setUsage(T.DynamicDrawUsage);
  geometry.boundingSphere = new T.Sphere(new T.Vector3(), radius);
  let previous;
  function update(mass) {
    if (mass === previous) return;
    previous = mass;
    // 200 g occupies half the illustrated spherical bulb, without glass thickness.
    const fraction = Math.max(0, Math.min(1, mass / 400));
    const level = sphericalLiquidLevel(radius, fraction);
    const start = Math.acos(Math.max(-1, Math.min(1, level.y / radius)));
    for (let i = 0; i < positions.count; i++) {
      const theta = start + (Math.PI - start) * (1 - uv.getY(i)),
        phi = uv.getX(i) * Math.PI * 2;
      const x = -Math.cos(phi) * Math.sin(theta),
        y = Math.cos(theta),
        z = Math.sin(phi) * Math.sin(theta);
      positions.setXYZ(i, x * radius, y * radius, z * radius);
      normals.setXYZ(i, x, y, z);
    }
    positions.needsUpdate = true;
    normals.needsUpdate = true;
    surface.position.y = level.y;
    surface.scale.set(level.surfaceRadius, level.surfaceRadius, 1);
    group.visible = mass > 0;
    group.userData.remainingMass = mass;
    group.userData.surfaceHeight = level.y;
  }
  update(200);
  return { group, update };
}
