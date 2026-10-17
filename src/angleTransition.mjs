export function createAngleTransition(initial, duration = 360) {
  let value = initial,
    from = initial,
    target = initial,
    started = 0,
    active = false;
  function sample(now, snap = false) {
    if (!active) return value;
    const fraction = snap
      ? 1
      : Math.max(0, Math.min(1, (now - started) / duration));
    const eased = fraction * fraction * (3 - 2 * fraction);
    value = from + (target - from) * eased;
    if (fraction === 1) active = false;
    return value;
  }
  return {
    sample,
    get active() {
      return active;
    },
    setTarget(angle, now, snap = false) {
      // Equivalent angles must not restart a transition during focus updates.
      if (
        Math.abs(
          Math.atan2(Math.sin(angle - target), Math.cos(angle - target)),
        ) < 1e-9
      ) {
        if (snap) sample(now, true);
        return;
      }
      from = sample(now);
      target =
        from + Math.atan2(Math.sin(angle - from), Math.cos(angle - from));
      started = now;
      active = true;
      if (snap) sample(now, true);
    },
  };
}
