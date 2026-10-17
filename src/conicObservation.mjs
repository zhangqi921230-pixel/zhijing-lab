import { conicState } from "./conicGeometry.mjs";
import { topicChapters } from "./topicChapters.mjs";
export function conicObservation(value, p) {
  const state = conicState(p);
  const fallback = state.degenerate
    ? 4
    : p.showSpheres === 1
      ? 6
      : state.kind === "抛物线"
        ? 1
        : state.kind === "双曲线"
          ? 2
          : 0;
  return {
    chapter:
      Number.isInteger(value?.chapter) &&
      value.chapter >= 0 &&
      value.chapter < topicChapters.conics.length
        ? value.chapter
        : fallback,
    view: ["perspective", "front", "top", "conicUpper"].includes(value?.view)
      ? value.view
      : "perspective",
  };
}
export function prepareConicChapter(base, index) {
  const chapter = topicChapters.conics[index];
  if (!chapter) return base;
  return { ...base, ...chapter.scenarios[index === 1 ? 1 : 0].p };
}
