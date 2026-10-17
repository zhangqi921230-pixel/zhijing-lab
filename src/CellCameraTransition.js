import * as T from "three";
export const reduceCellCameraMotion = (mode, systemReduced) =>
  mode === 2 || (mode !== 1 && systemReduced);

export const captureOrbit = (camera, controls) => ({
  position: camera.position.clone(),
  target: controls.target.clone(),
  fov: camera.fov,
  minDistance: controls.minDistance,
});

// Sampled by the existing demand renderer. No independent RAF or scene rebuild.
export function createCellCameraTransition(camera, controls) {
  let route = null;
  const offset = new T.Vector3(),
    rotation = new T.Quaternion();
  const apply = (u) => {
    const { from, to, direction, turn, r0, r1 } = route;
    controls.target.lerpVectors(from.target, to.target, u);
    rotation.identity().slerp(turn, u);
    offset
      .copy(direction)
      .applyQuaternion(rotation)
      .multiplyScalar(T.MathUtils.lerp(r0, r1, u));
    camera.position.copy(controls.target).add(offset);
    camera.fov = T.MathUtils.lerp(from.fov, to.fov, u);
    camera.updateProjectionMatrix();
  };
  return {
    begin(from, to, now, lifecycle = {}) {
      const a = from.position.clone().sub(from.target);
      const b = to.position.clone().sub(to.target);
      const r0 = a.length(),
        r1 = b.length();
      route = {
        from,
        to,
        now,
        started: null,
        r0,
        r1,
        lifecycle,
        direction: a.normalize(),
        turn: new T.Quaternion().setFromUnitVectors(a, b.normalize()),
      };
      controls.minDistance = Math.min(from.minDistance, to.minDistance, r0, r1);
      apply(0);
    },
    sample(now, reduced = false) {
      if (!route) return false;
      const t = reduced
        ? 1
        : route.started === null
          ? 0
          : T.MathUtils.clamp((now - route.started) / 420, 0, 1);
      apply(t * t * (3 - 2 * t));
      if (t === 1) {
        controls.minDistance = route.to.minDistance;
        const settle = route.lifecycle.settle;
        route = null;
        settle?.();
      }
      return !!route;
    },
    painted(now) {
      if (!route || route.started !== null) return null;
      route.started = now;
      return Math.max(0, now - route.now);
    },
    cancel() {
      const settle = route?.lifecycle.settle;
      if (route)
        controls.minDistance = Math.min(
          route.to.minDistance,
          camera.position.distanceTo(controls.target),
        );
      route = null;
      settle?.();
    },
    refit(fit, now) {
      if (!route) return fit();
      const from = captureOrbit(camera, controls);
      const minimum = route.to.minDistance;
      const lifecycle = route.lifecycle;
      apply(1);
      controls.minDistance = minimum;
      camera.lookAt(controls.target);
      camera.updateMatrixWorld();
      lifecycle.beforeFit?.();
      fit();
      lifecycle.afterFit?.();
      this.begin(from, captureOrbit(camera, controls), now, lifecycle);
    },
  };
}
