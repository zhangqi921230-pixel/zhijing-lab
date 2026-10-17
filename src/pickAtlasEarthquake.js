import * as THREE from "three";
import { globePoint } from "./plateGlobeGeometry.mjs";

// Match screen-space dots, rejecting points occluded by the solid globe.
export function pickAtlasEarthquake(events, threshold, camera, viewport, x, y) {
  const point = new THREE.Vector3(),
    direction = new THREE.Vector3();
  const ray = new THREE.Ray(),
    sphere = new THREE.Sphere(new THREE.Vector3(), 1.8);
  const intersection = new THREE.Vector3();
  let nearest = 10 * 10,
    selected = null;
  camera.updateMatrixWorld();
  for (const event of events) {
    if (event.magnitude < threshold) continue;
    point.set(...globePoint(event.longitude, event.latitude, 1.822));
    const distance = camera.position.distanceTo(point);
    direction.copy(point).sub(camera.position).normalize();
    ray.set(camera.position, direction);
    if (
      ray.intersectSphere(sphere, intersection) &&
      camera.position.distanceTo(intersection) < distance - 0.001
    )
      continue;
    point.project(camera);
    if (point.z < -1 || point.z > 1) continue;
    const dx = ((point.x + 1) * viewport.width) / 2 - x;
    const dy = ((1 - point.y) * viewport.height) / 2 - y;
    const squared = dx * dx + dy * dy;
    if (squared < nearest) {
      nearest = squared;
      selected = event;
    }
  }
  return selected;
}
