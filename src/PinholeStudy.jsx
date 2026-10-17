import React from "react";
import Button from "./LabButton.jsx";
import { pinholeState } from "./opticalGeometryModels.mjs";
export default function PinholeStudy({ p, selected, onSelect, chapter }) {
  const q = pinholeState(p);
  return (
    <section className="motion-task" aria-label="逐点观察成像">
      <h3>从一个点，看懂整幅像</h3>
      <div className="motion-shortcuts">
        {[
          ["全部光路", -1],
          ["下端 A", 0],
          ["中点 B", 1],
          ["上端 C", 2],
        ].map(([label, value]) => (
          <Button
            key={value}
            aria-pressed={selected === value}
            onClick={() => onSelect(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <p>
        {selected < 0
          ? "选择一个物点，主图会突出它穿过小孔到达光屏的路径。字母与带撇字母一一对应。"
          : `${["下端 A", "中点 B", "上端 C"][selected]} 的光落在 ${["A′", "B′", "C′"][selected]}；该点距轴线的物高为 ${((p.height * selected) / 2).toFixed(2)} cm，像上距轴线的距离为 ${((q.imageHeight * selected) / 2).toFixed(2)} cm。`}
      </p>
      {chapter === 4 && (
        <p>
          两侧直角三角形共享小孔处的一对对顶角，因此相似。对应边之比：
          {q.imageHeight.toFixed(2)} / {p.height.toFixed(2)} = {p.screen} /{" "}
          {p.object} = {q.magnification.toFixed(2)}
          。图上面积填色用于辨认三角形，不表示光束亮度。
        </p>
      )}
    </section>
  );
}
