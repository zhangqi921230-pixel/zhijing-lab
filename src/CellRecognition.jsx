import React, { useEffect, useState } from "react";
import Button from "./LabButton.jsx";
import "./CellRecognition.css";
export const cellRecognitionTasks = [
  {
    part: 3,
    prompt: "寻找具有基粒堆叠、在叶肉细胞中参与光合作用的结构。",
    explanation:
      "叶绿体内的类囊体可堆叠成基粒。它参与光合作用；不是所有植物细胞都含叶绿体。",
  },
  {
    part: 4,
    prompt: "寻找内膜折叠形成嵴、参与有氧呼吸的结构。",
    explanation:
      "线粒体的嵴来自内膜褶皱。有氧呼吸的多个过程发生在其基质与内膜上；植物细胞也有线粒体。",
  },
  {
    part: 2,
    prompt: "寻找由一层膜包围细胞液、在成熟植物细胞中常占较大空间的结构。",
    explanation:
      "中央液泡由液泡膜包围，参与储存和渗透平衡。图上的剖面不是自然状态下敞开的水面。",
  },
  {
    part: 1,
    prompt: "寻找包含染色质与核仁、与遗传信息储存和表达有关的结构。",
    explanation:
      "细胞核内可辨认染色质和核仁，核膜上具有核孔。图中颜色与尺寸为教学强调。",
  },
  {
    part: 5,
    prompt: "寻找堆叠的扁平膜囊，周围有出芽和囊泡，参与蛋白质加工与分选。",
    explanation:
      "高尔基体由扁平膜囊与周围囊泡组成。顺面接收来自内质网的物质，反面参与分选输出。",
  },
  {
    part: 6,
    prompt: "寻找相连的膜囊和管道网络，其中一部分表面附着核糖体。",
    explanation:
      "内质网的粗面区域附着核糖体，光面区域缺少这些附着颗粒。两部分可组成连续膜系统。",
  },
];
const names = [
  "全景",
  "细胞核",
  "液泡",
  "叶绿体",
  "线粒体",
  "高尔基体",
  "内质网",
];
export default function CellRecognition({ part, onSelect }) {
  const [index, setIndex] = useState(0),
    [checked, setChecked] = useState(false);
  const task = cellRecognitionTasks[index];
  useEffect(() => setChecked(false), [part]);
  const go = (i) => {
    setIndex(i);
    setChecked(false);
    onSelect(0);
  };
  return (
    <details className="cell-recognition">
      <summary>结构与功能辨认 · 6 个观察任务</summary>
      <section aria-label="细胞结构辨认练习">
        <h3>任务 {index + 1} / 6</h3>
        <p>{task.prompt}</p>
        <p>
          先选结构并观察上方三维近景，再核对。也可以直接点击三维结构；本练习不计分。
        </p>
        <div
          className="cell-recognition-actions"
          role="group"
          aria-label="选择待辨认结构"
        >
          {names.slice(1).map((name, i) => (
            <Button
              key={name}
              aria-pressed={part === i + 1}
              onClick={() => onSelect(i + 1)}
            >
              选择{name}
            </Button>
          ))}
        </div>
        <p>当前观察：{names[part] ?? names[0]}</p>
        <Button primary disabled={!part} onClick={() => setChecked(true)}>
          核对选择
        </Button>
        {checked && (
          <div role="status" className="cell-recognition-feedback">
            <strong>{part === task.part ? "辨认正确" : "再观察一下"}</strong>
            <p>
              {part === task.part
                ? task.explanation
                : `你选的是${names[part]}。请重新对照题目中的形态和功能线索，切换近景后再核对。`}
            </p>
          </div>
        )}
        <div className="cell-recognition-actions">
          <Button disabled={index === 0} onClick={() => go(index - 1)}>
            上一任务
          </Button>
          <Button disabled={index === 5} onClick={() => go(index + 1)}>
            下一任务
          </Button>
          <Button onClick={() => go(0)}>重新辨认</Button>
        </div>
      </section>
    </details>
  );
}
