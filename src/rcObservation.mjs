import { topicChapters } from "./topicChapters.mjs";

export function rcObservation(value, p) {
  const validChapter =
    Number.isInteger(value?.chapter) &&
    value.chapter >= 0 &&
    value.chapter < topicChapters.capacitor.length;
  return {
    // The first two chapters describe the selected physical circuit mode.
    chapter: validChapter && value.chapter >= 2 ? value.chapter : p.mode,
    view: [
      "perspective",
      "front",
      "top",
      "source",
      "selector",
      "plates",
    ].includes(value?.view)
      ? value.view
      : "perspective",
  };
}
