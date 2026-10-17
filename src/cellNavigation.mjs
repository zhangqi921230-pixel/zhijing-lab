export const cellViews = [
  "perspective",
  "nucleus",
  "vacuole",
  "chloroplast",
  "mitochondrion",
  "golgi",
  "reticulum",
];
export const cellChapterForPart = (part) =>
  part >= 3 ? part - 1 : part ? 1 : 0;

export function cellControlKeys(view) {
  const detail = {
    nucleus: "nucleusMode",
    vacuole: "vacuoleSection",
    chloroplast: "chloroplastMode",
    mitochondrion: "mitochondrionMode",
    golgi: "golgiMode",
    reticulum: "erMode",
  }[view];
  return ["part", detail ?? "cut"];
}

export function isCellReturnKey(event) {
  return (
    event.key === "Escape" &&
    !event.defaultPrevented &&
    !event.isComposing &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey &&
    !event.target?.closest?.(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"]',
    )
  );
}
export function cellObservation(value, part) {
  const fallback = { chapter: cellChapterForPart(part), view: "perspective" };
  if (
    !value ||
    !Number.isInteger(value.chapter) ||
    value.chapter < 0 ||
    value.chapter > 7
  )
    return fallback;
  if (![...cellViews, "front", "top"].includes(value.view)) return fallback;
  const inspectedPart = cellViews.indexOf(value.view);
  if (inspectedPart > 0 && inspectedPart !== part) return fallback;
  if (value.chapter >= 6 && (part !== 0 || inspectedPart > 0)) return fallback;
  return { chapter: value.chapter, view: value.view };
}
