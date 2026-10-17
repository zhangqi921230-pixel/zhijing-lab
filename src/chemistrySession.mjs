export const chemistryDuration = (id) =>
  id === "electrolysis" ? 600 : id === "distillation" ? 240 : 60;
const key = (id) => `zhijing:chemistry:v1:${id}`;
export function normalizeChemistrySession(lesson, data) {
  const chapter =
    Number.isInteger(data?.chapter) &&
    data.chapter >= 0 &&
    data.chapter < lesson.chapters.length
      ? data.chapter
      : 0;
  const p = { ...lesson.chapters[chapter].preset },
    v = data?.p || {};
  const numeric = (name, min, max) => {
    if (Number.isFinite(v[name]))
      p[name] = Math.max(min, Math.min(max, v[name]));
  };
  if (lesson.id === "flame") {
    if (["sodium", "lithium", "potassium", "copper"].includes(v.sample))
      p.sample = v.sample;
    numeric("contamination", 0, 1);
  } else if (lesson.id === "displacement") {
    if (["iron", "zinc", "copper"].includes(v.metal)) p.metal = v.metal;
    numeric("mass", 0.1, 1);
  } else if (lesson.id === "electrolysis") numeric("current", 0.2, 2);
  else if (lesson.id === "distillation") {
    numeric("power", 200, 800);
    if (typeof v.cooling === "boolean") p.cooling = v.cooling;
  }
  return {
    chapter,
    p,
    time: Number.isFinite(data?.time)
      ? Math.max(0, Math.min(chemistryDuration(lesson.id), data.time))
      : (lesson.chapters[chapter].time ?? 0),
    view: data?.view === "diagram" ? "diagram" : "3d",
    labels: data?.labels !== false,
  };
}
export function loadChemistrySession(lesson) {
  try {
    const raw = localStorage.getItem(key(lesson.id));
    return {
      ...normalizeChemistrySession(lesson, raw ? JSON.parse(raw) : null),
      available: true,
    };
  } catch {
    return { ...normalizeChemistrySession(lesson, null), available: false };
  }
}
export function saveChemistrySession(lesson, state) {
  try {
    localStorage.setItem(
      key(lesson.id),
      JSON.stringify(normalizeChemistrySession(lesson, state)),
    );
    return true;
  } catch {
    return false;
  }
}
