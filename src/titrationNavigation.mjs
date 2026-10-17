export const titrationViews = [
  "perspective",
  "front",
  "top",
  "meniscus",
  "stopcock",
  "clamps",
  "readout",
  "electrode",
  "surface",
];
export function titrationObservation(value) {
  return {
    chapter:
      Number.isInteger(value?.chapter) &&
      value.chapter >= 0 &&
      value.chapter < 6
        ? value.chapter
        : 0,
    view: titrationViews.includes(value?.view) ? value.view : "perspective",
    representation: value?.representation === "diagram" ? "diagram" : "3d",
  };
}
