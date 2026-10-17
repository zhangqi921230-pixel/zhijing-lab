// Three raycasting does not exclude objects hidden by an ancestor.
export function firstVisibleHit(intersections) {
  return intersections.find(({ object }) => {
    for (let node = object; node; node = node.parent)
      if (!node.visible) return false;
    return true;
  });
}
