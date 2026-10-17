import React, { useState } from "react";
import Button from "./LabButton.jsx";
import { solubility } from "./models.mjs";
import "./CrystallizationBalance.css";
export function crystallizationBalance(p, initialTemp) {
  const initialDissolved = Math.min(
    p.mass,
    (solubility(initialTemp) * p.water) / 100,
  );
  const dissolved = Math.min(p.mass, (solubility(p.temp) * p.water) / 100);
  const initialSolid = p.mass - initialDissolved,
    solid = p.mass - dissolved;
  return {
    initialDissolved,
    dissolved,
    initialSolid,
    solid,
    change: solid - initialSolid,
  };
}
export default function CrystallizationBalance({ p, onChange }) {
  const [initialTemp, setInitialTemp] = useState(null);
  const q =
    initialTemp === null ? null : crystallizationBalance(p, initialTemp);
  const capture = () => {
    onChange("temp", p.temp);
    setInitialTemp(p.temp);
  };
  return (
    <section className="crystal-balance" aria-label="析晶前后质量对照">
      <header>
        <div>
          <span>BEFORE / AFTER</span>
          <h3>杯底固体，不一定都是新晶体</h3>
        </div>
        <Button onClick={capture}>
          {q ? "更新对照起点" : "保留当前为起点"}
        </Button>
      </header>
      <p>
        先保留起点，再用上方温度按钮或扫描动画改变温度；投料和水量保持不变。修改投料或水量会清除本次对照。
      </p>
      {q ? (
        <>
          <div className="crystal-balance-legend">
            <span>绿色：已溶解</span>
            <span>金色：固体</span>
          </div>
          {[
            [
              `起点 ${initialTemp.toFixed(1)}°C`,
              q.initialDissolved,
              q.initialSolid,
            ],
            [`当前 ${p.temp.toFixed(1)}°C`, q.dissolved, q.solid],
          ].map(([label, dissolved, solid]) => (
            <div className="crystal-balance-row" key={label}>
              <strong>{label}</strong>
              <div
                className="crystal-balance-bar"
                style={{ background: p.mass ? undefined : "var(--ui-line)" }}
                role="img"
                aria-label={`已溶解 ${dissolved.toFixed(2)} g，固体 ${solid.toFixed(2)} g`}
              >
                <span
                  style={{
                    width: `${p.mass ? (dissolved / p.mass) * 100 : 0}%`,
                    borderRightWidth: p.mass ? 2 : 0,
                  }}
                />
              </div>
              <small>
                已溶解 {dissolved.toFixed(2)} g · 固体 {solid.toFixed(2)} g
              </small>
            </div>
          ))}
          <div className="crystal-balance-values">
            <div>
              <span>起点原有固体</span>
              <b>{q.initialSolid.toFixed(2)} g</b>
            </div>
            <div>
              <span>{q.change >= 0 ? "新增晶体" : "重新溶解的固体"}</span>
              <b>{Math.abs(q.change).toFixed(2)} g</b>
            </div>
            <div>
              <span>当前全部固体</span>
              <b>{q.solid.toFixed(2)} g</b>
            </div>
          </div>
          <p className="crystal-balance-equation">
            固体核对：{q.initialSolid.toFixed(2)} {q.change >= 0 ? "+" : "−"}{" "}
            {Math.abs(q.change).toFixed(2)} = {q.solid.toFixed(2)} g。
          </p>
          <p>
            {q.change > 1e-8
              ? "液相减少的溶质质量，等于这次新增的固体质量。原有固体不重复计入新增晶体。"
              : q.change < -1e-8
                ? "原有固体的一部分重新进入溶液；固体减少不代表物质消失。"
                : "当前固体总量与起点相同；即使温度变化，也不一定发生析晶。"}{" "}
            {p.mass === 0 ? "没有加入溶质，因此两条质量条为空。" : ""}
          </p>
          <Button onClick={() => setInitialTemp(null)}>清除析晶对照</Button>
        </>
      ) : (
        <p className="crystal-balance-empty">
          尚未设置起点。建议先在 60°C 保留，再降到 20°C，比一比“新增”和“总量”。
        </p>
      )}
      <small>
        只比较两个平衡状态，不模拟晶体生长速率；条长表示溶质质量，不表示杯中体积。对照仅在当前页面保留。
      </small>
    </section>
  );
}
