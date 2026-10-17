export const solubilityViews = {
  crystals: {
    label: "观察晶体",
    target: [0, -0.31, 0],
    position: [0.9, 1.7, 2],
    minDistance: 1.9,
  },
  thermometer: {
    label: "读取温度",
    target: [-1.65, 1.37, -0.55],
    position: [-1.65, 1.37, 2.35],
    minDistance: 1.5,
  },
};

export function solubilityObservation(value) {
  return {
    chapter:
      Number.isInteger(value?.chapter) &&
      value.chapter >= 0 &&
      value.chapter < 6
        ? value.chapter
        : 0,
    view: [
      "perspective",
      "front",
      "top",
      ...Object.keys(solubilityViews),
    ].includes(value?.view)
      ? value.view
      : "perspective",
    representation: value?.representation === "diagram" ? "diagram" : "3d",
  };
}
