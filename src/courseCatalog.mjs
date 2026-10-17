import { gradeFor, compareLevels, levelFor } from "./curriculumLevels.mjs";
import { lessons } from "./topicMetadata.mjs";
import { explorations } from "./topicMetadata.mjs";
import { chemistryCatalog as chemistryTopics } from "./chemistryCatalog.mjs";
import { motionTopics } from "./motionTopics.mjs";
export const allExperiments = [
  ...lessons,
  ...explorations,
  ...chemistryTopics,
  ...motionTopics,
].map((l) => ({ ...l, grade: gradeFor(l.id) }));
export const courseGroups = [
  {
    id: "projectile",
    title: "抛体运动与轨迹",
    members: ["projectile", "ballistics"],
    description: "从平抛斜抛到互余角轨迹、速度分解与重力对照。",
  },
  {
    id: "ohm",
    title: "电路与电容实验室",
    members: ["ohm", "resistor-network", "capacitor"],
    description: "从电路连接、欧姆定律到电容储能与 RC 充放电。",
  },
  {
    id: "linear",
    title: "函数与图像实验室",
    members: ["linear", "functions"],
    description: "从一次函数的斜率与截距，走向函数变换、三角函数和变化率。",
  },
  {
    id: "circle",
    title: "平面几何与面积",
    members: ["circle", "pythagoras", "pythagoras-proof"],
    description: "用圆周展开、扇形重排、勾股拼合与面积证明，理解长度与面积。",
  },
  {
    id: "cube",
    title: "立体几何与截面",
    members: ["cube", "solids"],
    description: "从正方体展开到圆柱圆锥，在展开、切片与体积之间建立联系。",
  },
  {
    id: "dilution",
    title: "溶液、浓度与结晶",
    members: ["dilution", "solubility"],
    description: "连续探究稀释、饱和、温度与晶体析出。",
  },
  {
    id: "acid",
    title: "溶液中的化学反应",
    members: ["acid", "precipitation"],
    description: "从酸碱中和到沉淀反应，对照宏观现象与定量关系。",
  },
  {
    id: "molecule",
    title: "分子结构与化学变化",
    members: ["molecule", "conservation"],
    description: "观察空间结构，再追踪反应前后的原子重组与守恒。",
  },
  {
    id: "seasons",
    title: "地球运动与月相",
    members: ["seasons", "daynight", "moon"],
    description: "将四季、昼夜与月相放在同一条天文学习路径中。",
  },
  {
    id: "plates",
    title: "板块、火山与地震",
    members: ["plates", "volcano", "earthquake"],
    description: "从板块运动到火山剖面与地震波，区分相关但不同的过程。",
  },
];
export const groupFor = (id) =>
  courseGroups.find((g) => g.members.includes(id));
export const workbenches = allExperiments
  .filter((l) => !groupFor(l.id) || groupFor(l.id).id === l.id)
  .map((l) => {
    const group = groupFor(l.id);
    const members = group?.members ?? [l.id];
    const highest = members.reduce(
      (a, id) => (levelFor(id).year > levelFor(a).year ? id : a),
      l.id,
    );
    const curriculum = {
      ...levelFor(highest),
      scope: members.some(
        (id) =>
          levelFor(id).scope !== "基础" ||
          levelFor(id).stage !== levelFor(l.id).stage,
      )
        ? "含拓展"
        : levelFor(highest).scope,
    };
    const grade = group
      ? `${curriculum.label} · 综合工作台（单元分级）`
      : gradeFor(l.id);
    return group
      ? {
          ...l,
          ...group,
          curriculum,
          grade,
          searchText: group.members
            .map((id) => allExperiments.find((x) => x.id === id)?.title)
            .join(" "),
        }
      : { ...l, curriculum, grade, members: [l.id], searchText: l.title };
  })
  .sort(compareLevels);
