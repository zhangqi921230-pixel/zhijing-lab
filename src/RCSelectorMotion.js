import * as T from "three";
import { createAngleTransition } from "./angleTransition.mjs";

export function createRCSelectorMotion(selector, grip, common, contacts, mode) {
  const origin = new T.Vector3(...common);
  const radius = origin.distanceTo(new T.Vector3(...contacts[0]));
  const angle = (value) =>
    Math.atan2(contacts[value][2] - common[2], contacts[value][0] - common[0]);
  const turn = createAngleTransition(angle(mode), 240);
  const end = new T.Vector3(),
    direction = new T.Vector3(),
    up = new T.Vector3(0, 1, 0),
    transverse = new T.Vector3(),
    basis = new T.Matrix4();
  const draw = (value) => {
    end.set(
      origin.x + radius * Math.cos(value),
      origin.y,
      origin.z + radius * Math.sin(value),
    );
    selector.position.copy(origin).add(end).multiplyScalar(0.5);
    direction.copy(end).sub(origin).normalize();
    transverse.crossVectors(up, direction).normalize();
    selector.quaternion.setFromRotationMatrix(
      basis.makeBasis(up, direction, transverse),
    );
    grip.position.copy(end);
  };
  draw(angle(mode));
  return {
    setMode(value, now) {
      turn.setTarget(angle(value), now);
    },
    sample(now, reducedMotion = false) {
      draw(turn.sample(now, reducedMotion));
      return turn.active;
    },
    get active() {
      return turn.active;
    },
  };
}
