import { readFile, writeFile } from "node:fs/promises";
import { allExperiments, workbenches } from "../src/courseCatalog.mjs";
import {
  levelFor,
  compareLevels,
  curriculumNote,
} from "../src/curriculumLevels.mjs";
const file = new URL("../public/curriculum.html", import.meta.url);
let html = await readFile(file, "utf8");
const names = {
  math: "数学",
  physics: "物理",
  chemistry: "化学",
  biology: "生物",
  geography: "地理",
};
const sorted = Object.keys(names).flatMap((subject) =>
  allExperiments.filter((x) => x.subject === subject).sort(compareLevels),
);
const section = `<section><h2 id="grade-review">全主题学段与推荐年级</h2><p>${curriculumNote}</p><p>综合工作台按所含单元的最高推荐年级排序。基础筛选会排除跨学段或含拓展的工作台；进入后可分别选择基础单元。此表是对当前完整演示内容的教学分层建议，不是国家统一教学进度或逐条课标认证。</p><p>义务教育依据2022年课程标准。高中内容参考2017年版2020年修订的学科框架；已注意到2025年日常修订版发布，尚未完成新版逐条复核，因此不宣称已覆盖最新版全部要求。极坐标、摆线、RC定量过程等只列为拓展。</p><table><thead><tr><th>科目</th><th>主题 / 学习单元</th><th>推荐年级</th><th>内容层次</th></tr></thead><tbody>${sorted.map((x) => `<tr><td>${names[x.subject]}</td><td><a href="./#${x.id}">${x.title}</a></td><td>${levelFor(x.id).label}</td><td>${levelFor(x.id).scope}</td></tr>`).join("")}</tbody></table><p>本轮补充蒸发结晶、铁生锈、蒸腾、传粉与受精、地形雨、岩石循环。此前新增主题：燃烧条件、过滤分离、呼吸运动、种子萌发、海陆风、流水搬运沉积。各5节，均有连续演示、条件选择、观察任务和模型边界。</p></section>`;
const block = /<!-- grade-review:start -->[\s\S]*?<!-- grade-review:end -->/;
const wrapped = `<!-- grade-review:start -->${section}<!-- grade-review:end -->`;
html = block.test(html)
  ? html.replace(block, wrapped)
  : html.replace("</body>", `${wrapped}</body>`);
await writeFile(
  new URL("../docs/学段与年级核对.md", import.meta.url),
  `# 当前主题学段核对\n\n${curriculumNote}\n\n这是对完整演示的保守教学分层，不是逐条课标认证。综合主题按最高年级归类，单元单独标注。义务教育采用2022课标；高中2025日常修订版逐条复核尚未完成。\n\n依据：\n- https://www.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html\n- https://www.moe.gov.cn/srcsite/A26/s8001/202006/t20200603_462199.html\n- https://www.ictr.edu.cn/Uploads/File/2025/12/01/2025%E5%B9%B412%E6%9C%88%E7%9B%AE%E5%BD%95.20251201190727.pdf\n\n|科目|单元|推荐年级|内容层次|\n|---|---|---|---|\n${sorted.map((x) => `|${names[x.subject]}|${x.title}|${levelFor(x.id).label}|${levelFor(x.id).scope}|`).join("\n")}\n\n重点调整：\n- 分子构型、酸碱pH定量、电解定量、全反射定量、二项分布按高中内容归类。\n- 细胞器细节、光合作用限制因素按高中生物处理；食物链定量能量传递为高中。\n- 地球运动的天文定量和地震台站定位不再作为初中基础内容。\n- 函数工作台包含导数和积分拓展，圆锥工作台包含Dandelin双球，故完整工作台标拓展。\n- 高一/高二为推荐顺序，选择性必修内容也需与学生实际选课对齐。\n`,
);
const headings = [
  ...html.matchAll(/<h2\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g),
];
if (!headings.length) throw new Error("No curriculum headings found");
const ids = headings.map((m) => m[1]);
if (new Set(ids).size !== ids.length)
  throw new Error("Duplicate curriculum heading ids");
const entries = headings
  .map(
    (m) =>
      `<li><a href="#${m[1]}">${m[2].replace(/\s+/g, " ").trim()}</a></li>`,
  )
  .join("\n");
const pattern =
  /(<nav aria-label="课程目录">\s*<ol>)[\s\S]*?(<\/ol>\s*<\/nav>)/;
if (!pattern.test(html)) throw new Error("Curriculum directory missing");
html = html.replace(
  pattern,
  (_, start, end) => start + "\n" + entries + "\n" + end,
);
html = html.replace(
  /当前共\s*\d+\s*个主题工作台、\s*\d+\s*个学习单元/,
  `当前共 ${workbenches.length} 个主题工作台、${allExperiments.length} 个学习单元`,
);
await writeFile(file, html);
console.log(
  `Curriculum index: ${headings.length} sections, ${workbenches.length} workbenches, ${allExperiments.length} units`,
);
