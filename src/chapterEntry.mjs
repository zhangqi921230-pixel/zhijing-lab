import { defaults } from "./lessons.mjs";

// Chapter entry is a reproducible teaching state, independent of the preceding
// experiment. Display preferences survive; measured records are owned by the UI.
export const displayPreferences = {
  cell: ["labels", "cellAngle", "cellMotion"],
  precipitation: ["volumeGuide"],
  biodiversity: ["groundDetails"],
  water: ["vegetation", "pathways"],
  earthquake: ["vegetation"],
};
export function scenarioParameters(lesson, current, preset) {
  return {
    ...defaults(lesson),
    ...Object.fromEntries(
      (displayPreferences[lesson.id] ?? [])
        .filter((k) => current[k] !== undefined)
        .map((k) => [k, current[k]]),
    ),
    ...preset,
  };
}
const entries = {
  cell: { 7: { p: { cytoskeleton: 3 } } },
  fractions: { 1: { p: { n: 2, d: 4 } }, 2: { p: { n: 9, d: 8 } } },
  pythagoras: { 1: { p: { arrange: 65 } } },
  circle: {
    0: { p: { unroll: 65, rearrange: 0 } },
    1: { p: { unroll: 0, rearrange: 65 } },
    2: { p: { r: 4, unroll: 0, rearrange: 100 } },
  },
  functions: {
    1: { p: { shift: 2, b: 1 } },
    2: { p: { a: -1.5 } },
    6: { p: { k: 2 } },
    8: { p: { probe: Math.PI / 3 } },
  },
  solids: { 1: { p: { slice: 55 } } },
  refraction: { 2: { p: { angle: 50 } } },
  projectile: {
    0: { time: 0.5 },
    1: { time: 0.75 },
    2: { p: { angle: 45 }, time: 1 },
  },
  incline: { 0: { time: 0 }, 1: { time: 0.7 } },
  molecule: { 4: { view: "top" } },
  capacitor: {
    0: { time: 1 },
    1: { p: { mode: 1, initialRatio: 100 }, time: 1 },
    2: { time: 1 },
    3: { p: { mode: 1, fieldLines: 1 }, time: 2, view: "plates" },
  },
  inheritance: { 2: { p: { parent1: 1, parent2: 2 } } },
  biodiversity: { 2: { p: { birds: 0 } } },
  daynight: { 1: { p: { hour: 12 } } },
  plates: {
    0: { p: { progress: 45 } },
    1: { p: { progress: 55 } },
    2: { p: { progress: 60 } },
  },
  volcano: { 0: { time: 0 } },
  earthquake: {
    0: { time: 0 },
    1: { time: 4 },
    2: { time: 7 },
    3: { time: 14 },
    4: { time: 10 },
  },
};
export function topicEntry(lesson, chapters, index, current) {
  const chapter = chapters[index];
  const special = entries[lesson.id]?.[index] ?? {};
  const scenario =
    chapter.scenarios[lesson.id === "conics" && index === 1 ? 1 : 0];
  let p = scenarioParameters(lesson, current, { ...scenario.p, ...special.p });
  const cellViews = [
    "perspective",
    "nucleus",
    "vacuole",
    "chloroplast",
    "mitochondrion",
    "golgi",
    "reticulum",
  ];
  const view =
    lesson.id === "cell" ? cellViews[p.part] : (special.view ?? chapter.view);
  const time =
    lesson.id === "functions"
      ? (p.probe + 5) * 2
      : lesson.id === "solids"
        ? p.slice / 5
        : (special.time ?? scenario.time ?? 0);
  return { p, view, time };
}
const instrumentEntries = {
  ohm: {
    0: { p: { closed: 0, trace: 1 } },
    5: { p: { u: 9, r: 20, closed: 1 } },
    6: { p: { u: 4, r: 20, closed: 1 } },
  },
  microscope: {
    INSTRUMENT: { p: { power: 0, mag: 40 } },
    SPECIMENS: { p: { specimen: 2 } },
    EXPLORATION: { p: { specimen: 1, mag: 400 } },
    "CHECK YOUR UNDERSTANDING": {
      p: { specimen: 0, mag: 40, coarse: 40, focus: 35 },
    },
  },
  dilution: {
    2: { p: { add: 200 } },
    5: { p: { solute: 20, water: 80, add: 100 } },
  },
  solubility: {
    2: { p: { temp: 50 } },
    4: { p: { water: 50 } },
    5: { p: { temp: 40, mass: 80, water: 100 } },
  },
  acid: { 5: { p: { c: 0.2, base: 50 } } },
  lens: { 0: { p: { rays: 0 } }, 7: { p: { u: 25, screen: 15, rays: 1 } } },
};
export function instrumentEntry(lesson, chapters, index, current) {
  const chapter = chapters[index],
    special =
      instrumentEntries[lesson.id]?.[chapter.en] ??
      instrumentEntries[lesson.id]?.[index] ??
      {};
  return {
    p: scenarioParameters(lesson, current, { ...chapter.preset, ...special.p }),
    view: special.view ?? chapter.view ?? "perspective",
    time: 0,
  };
}
