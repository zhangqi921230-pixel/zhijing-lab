import React, { useState } from "react";
import Button from "./LabButton.jsx";
import "./CellEnergyCompare.css";
export default function CellEnergyCompare({ part, onSelect }) {
  const [explain, setExplain] = useState(false);
  return (
    <section
      className="cell-energy-compare"
      aria-label="叶绿体与线粒体结构功能对照"
    >
      <h3>同一个叶肉细胞里，两种能量转换结构</h3>
      <p>
        先观察膜的形态，再比较功能。切换按钮会定位上方三维近景；镜头会分别适配结构大小，两幅近景不能直接用于比较真实尺寸。
      </p>
      <div className="cell-recognition-actions">
        <Button aria-pressed={part === 3} onClick={() => onSelect(3)}>
          对照叶绿体近景
        </Button>
        <Button aria-pressed={part === 4} onClick={() => onSelect(4)}>
          对照线粒体近景
        </Button>
      </div>
      <div
        className="cell-energy-table"
        tabIndex="0"
        role="region"
        aria-label="细胞器对照表，可横向滚动"
      >
        <table>
          <caption>观察线索 → 结构名称 → 功能联系</caption>
          <thead>
            <tr>
              <th scope="col">观察项目</th>
              <th scope="col">叶绿体</th>
              <th scope="col">线粒体</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">膜的形态</th>
              <td>内部类囊体堆叠成基粒，基粒之间有基质片层连接。</td>
              <td>内膜向内部折叠形成嵴；嵴是内膜的一部分。</td>
            </tr>
            <tr>
              <th scope="row">主要过程</th>
              <td>光合作用，把光能转为化学能，并合成有机物。</td>
              <td>有氧呼吸的多个过程，将有机物中的部分能量转移到ATP中。</td>
            </tr>
            <tr>
              <th scope="row">植物细胞中的分布</th>
              <td>叶肉细胞等光合细胞通常具有；并非所有植物细胞都有。</td>
              <td>植物和动物的许多真核细胞都有；植物细胞也需要呼吸作用。</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Button aria-expanded={explain} onClick={() => setExplain(!explain)}>
        {explain ? "收起解释" : "夜间没有光，植物还进行呼吸吗？"}
      </Button>
      {explain && (
        <p role="status">
          仍进行呼吸。在适宜条件下，植物细胞白天和夜间都进行呼吸；没有光时，光合作用的光反应不能持续进行。不能把“有叶绿体”理解为“不需要线粒体”。这里比较一般功能，未模拟气体交换、代谢速率或所有植物的特殊适应。
        </p>
      )}
    </section>
  );
}
