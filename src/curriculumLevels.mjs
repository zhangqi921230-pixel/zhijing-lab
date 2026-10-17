// Recommendation by common six-three school sequence, not a nationwide timetable.
const buckets = [
  [9, "初中 9 年级", "基础", "crystallization rusting"],
  [7, "初中 7 年级", "基础", "transpiration pollination"],
  [10, "高中 高一", "基础", "rain-shadow"],
  [11, "高中 高二", "基础", "rock-cycle"],
  [5, "小学 5 年级", "基础", "fractions cube"],
  [5, "小学 5 年级", "基础", "area-cut"],
  [6, "小学 6 年级", "基础", "circle cylinder-net solid-volume circle-area"],
  [7, "初中 7 年级", "基础", "microscope contour plates germination breathing"],
  [
    8,
    "初中 8 年级",
    "基础",
    "square-difference triangle-angles pythagoras linear buoyancy buoyancy-lift additive-light water-pressure pinhole plane-mirror communicating pulley polygon-turn pythagoras-proof",
  ],
  [
    9,
    "初中 9 年级",
    "基础",
    "ohm conservation dilution solubility filtration combustion similar-area shadow-height resistor-network inscribed-angle symmetry",
  ],
  [9, "初中 9 年级", "拓展", "fence-area hydraulic distillation"],
  [8, "初中 8 年级", "拓展", "gear-drive moon volcano"],
  [
    10,
    "高中 高一",
    "基础",
    "projectile incline vector-sum circular-motion ballistics flame sea-breeze river-deposition radian-arc inheritance",
  ],
  [
    10,
    "高中 高一",
    "含拓展",
    "cell photosynthesis water biodiversity lever displacement",
  ],
  [11, "高中 高二", "基础", "polarization ripple-interference doppler"],
  [
    11,
    "高中 高二",
    "含拓展",
    "molecule acid precipitation electrolysis refraction prism probability foodweb earthquake seasons daynight waves",
  ],
  [
    11,
    "高中 高二",
    "拓展",
    "capacitor gas beat-frequency polar cycloid lissajous standing functions conics thermal-length lens solids",
  ],
];
export const curriculumLevels = Object.fromEntries(
  buckets.flatMap(([year, label, scope, ids]) =>
    ids.split(" ").map((id) => [
      id,
      {
        year,
        label,
        scope,
        stage: year < 7 ? "primary" : year < 10 ? "middle" : "high",
      },
    ]),
  ),
);
export const curriculumNote =
  "年级按六三学制、人教版常见顺序推荐，具体以本校教材为准。包含高中推导的完整单元按较高学段归类；“拓展”不作为该年级基础要求。";
export const levelFor = (id) => curriculumLevels[id];
export const gradeFor = (id) => {
  const x = levelFor(id);
  return x
    ? `${x.label}${x.scope === "基础" ? "" : ` · ${x.scope}`}`
    : "待核定";
};
export const compareLevels = (a, b) =>
  (a.curriculum ?? levelFor(a.id)).year -
    (b.curriculum ?? levelFor(b.id)).year ||
  Number((a.curriculum ?? levelFor(a.id)).scope !== "基础") -
    Number((b.curriculum ?? levelFor(b.id)).scope !== "基础");
