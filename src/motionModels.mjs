export const MOTION_DURATION = 6;
export function rollingPoint(radius, ratio, angle) {
  return {
    x: radius * (angle - ratio * Math.sin(angle)),
    y: radius * (1 - ratio * Math.cos(angle)),
    centerX: radius * angle,
    distance: radius * angle,
  };
}
export function rollingVelocity(radius, ratio, angle) {
  const omega = (2 * Math.PI) / MOTION_DURATION;
  const clean = (n) => (Math.abs(n) < 1e-10 ? 0 : n);
  const translation = radius * omega;
  const rotationX = clean(-radius * ratio * omega * Math.cos(angle));
  const rotationY = clean(radius * ratio * omega * Math.sin(angle));
  const vx = clean(translation + rotationX),
    vy = rotationY;
  return {
    translation,
    rotationX,
    rotationY,
    vx,
    vy,
    speed: Math.hypot(vx, vy),
  };
}
export function dopplerState(mach, frequency, time) {
  const speed = 2,
    velocity = speed * mach;
  return {
    sourceX: velocity * time,
    rightFrequency: frequency / (1 - mach),
    leftFrequency: frequency / (1 + mach),
    rightWavelength: (speed - velocity) / frequency,
    leftWavelength: (speed + velocity) / frequency,
    fronts: Array.from(
      { length: Math.floor(time * frequency + 1e-9) + 1 },
      (_, i) => ({
        born: i / frequency,
        x: (velocity * i) / frequency,
        radius: Math.max(0, speed * (time - i / frequency)),
      }),
    ),
  };
}
export function dopplerArrivals(mach, frequency) {
  return Array.from({ length: 4 }, (_, i) => {
    const emitted = i / frequency,
      position = 2 * mach * emitted;
    return {
      emitted,
      position,
      left: emitted + (12 + position) / 2,
      right: emitted + (12 - position) / 2,
    };
  });
}
