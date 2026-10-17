export const CONTOUR_DEFAULTS = {
  surfaceMode: "realistic",
  projection: true,
  projectionGap: 0.6,
  flow: false,
  measure: false,
  probes: [],
  level: 600,
  interval: 100,
  section: 50,
  sectionAngle: 0,
  trees: true,
  water: true,
  rocks: true,
  labels: true,
  contours: true,
  slice: false,
  profile: false,
  quality: "fluent",
};
export const CONTOUR_SESSION_KEY = "zhijing:contour-workspace:v1";
export const freshContourSession = () => ({
  chapter: 0,
  p: { ...CONTOUR_DEFAULTS, probes: [] },
  view: "perspective",
  map: true,
  speed: 200,
  restored: false,
});
function clean(data) {
  const state = freshContourSession();
  if (data?.version !== 1 || !data.p || typeof data.p !== "object")
    return state;
  const enums = {
    surfaceMode: ["realistic", "height", "slope"],
    quality: ["fluent", "detail"],
    interval: [50, 100, 200],
  };
  const ranges = {
    level: [100, 2400, 10],
    section: [0, 100, 1],
    sectionAngle: [0, 90, 5],
    projectionGap: [0.2, 1.6, 0.1],
  };
  for (const key of Object.keys(CONTOUR_DEFAULTS)) {
    const value = data.p[key];
    if (enums[key]?.includes(value)) state.p[key] = value;
    else if (
      ranges[key] &&
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      const [min, max, step] = ranges[key];
      if (value >= min && value <= max)
        state.p[key] = Math.round(value / step) * step;
    } else if (
      typeof CONTOUR_DEFAULTS[key] === "boolean" &&
      typeof value === "boolean"
    )
      state.p[key] = value;
  }
  state.p.flow = false;
  state.p.measure = false;
  state.p.probes = [];
  if (Number.isInteger(data.chapter) && data.chapter >= 0 && data.chapter <= 8)
    state.chapter = data.chapter;
  if (["perspective", "top", "front", "basin"].includes(data.view))
    state.view = data.view;
  if (typeof data.map === "boolean") state.map = data.map;
  if ([100, 200, 400].includes(data.speed)) state.speed = data.speed;
  state.restored = true;
  return state;
}
export function readContourSession(storage) {
  try {
    return clean(JSON.parse(storage.getItem(CONTOUR_SESSION_KEY)));
  } catch {
    return freshContourSession();
  }
}
export function saveContourSession(state, storage) {
  try {
    const safe = clean({ ...state, version: 1 });
    storage.setItem(
      CONTOUR_SESSION_KEY,
      JSON.stringify({
        version: 1,
        chapter: safe.chapter,
        p: safe.p,
        view: safe.view,
        map: safe.map,
        speed: safe.speed,
      }),
    );
    return true;
  } catch {
    return false;
  }
}
