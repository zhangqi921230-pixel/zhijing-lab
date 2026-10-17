export const dilutionTarget = [0, 0.9, 0];
export const dilutionCloseViews = {
  originalBalance: { target: [-1.65, -0.5, 1.2], position: [-1.4, 0.25, 4.4] },
  balance: { target: [1.65, -0.5, 1.2], position: [1.9, 0.25, 4.4] },
  valve: { target: [2.4, 2.25, -0.5], position: [3.5, 2.8, 2.5] },
};
export const dilutionViews = {
  perspective: [5.94, 4.97, 13.2],
  front: [0, 0.9, 14.3],
  top: [0, 16.5, 0.01],
};
export function dilutionObservation(value) {
  const views = [
    ...Object.keys(dilutionViews),
    ...Object.keys(dilutionCloseViews),
  ];
  return {
    chapter:
      Number.isInteger(value?.chapter) &&
      value.chapter >= 0 &&
      value.chapter < 6
        ? value.chapter
        : 0,
    view: views.includes(value?.view) ? value.view : "perspective",
    representation: value?.representation === "diagram" ? "diagram" : "3d",
  };
}
