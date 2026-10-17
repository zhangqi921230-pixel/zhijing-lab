export function moleculeChapter(p, selected) {
  if (p.ensemble) return 3;
  if (selected === 2 || selected === 4) return selected;
  return p.type === 0 ? 0 : 1;
}

export function prepareMoleculeChapter(p, chapter) {
  return {
    ...p,
    ensemble: chapter === 3 ? 1 : 0,
    lonePairs: chapter === 2 ? 1 : p.lonePairs,
    type:
      chapter === 0
        ? 0
        : chapter === 1 && ![1, 2].includes(p.type)
          ? 1
          : chapter === 2 && p.type === 1
            ? 2
            : p.type,
  };
}
