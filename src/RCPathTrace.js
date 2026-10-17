import * as T from "three";

// Mark the connected branch, not current magnitude. The disconnected supply
// leads remain visible because the physical wires have not been removed.
export function rcPathTrace(entries) {
  const wires = entries.map(([object, modes]) => ({
    object,
    modes,
    color: object.material.color.clone(),
  }));
  const gold = new T.Color("#e2ba5a");
  let previous = "";
  return (mode, enabled) => {
    const key = `${mode}/${!!enabled}`;
    if (key === previous) return;
    previous = key;
    wires.forEach(({ object, modes, color }) => {
      const selected = !!enabled && modes.includes(mode);
      object.material.color.copy(selected ? gold : color);
      object.material.emissive.set(selected ? "#9b661c" : "#000000");
      object.material.emissiveIntensity = selected ? 0.28 : 0;
      object.userData.selectedBranch = selected;
    });
  };
}
