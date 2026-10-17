export function setPlateVisibility(root, state) {
  for (const name of ["plate-forest", "plate-trunks"]) {
    const object = root.getObjectByName(name);
    if (object) object.visible = state.vegetation;
  }
  for (const side of [-1, 1]) {
    const marker = root.getObjectByName(`plate-marker-${side}`);
    const arrow = root.getObjectByName(`plate-arrow-${side}`);
    if (marker) marker.visible = state.markers;
    if (arrow) arrow.visible = state.arrows;
  }
}
