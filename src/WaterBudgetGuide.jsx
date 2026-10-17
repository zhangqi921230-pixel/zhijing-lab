import React, { useState } from "react";
import { calculate, format } from "./models.mjs";
import "./WaterBudgetGuide.css";

export default function WaterBudgetGuide({ p, onChange }) {
  const [reference, setReference] = useState(null);
  const current = calculate("water", p);
  const baseline = reference ? calculate("water", reference) : null;
  const parts = [
    ["地表径流", 100 - p.infil - p.evap, "#72c8d2"],
    ["下渗", p.infil, "#d9b95e"],
    ["蒸散", p.evap, "#c3c0a2"],
  ];
  return (
    <section className="water-budget-guide" aria-label="水量分配与显示">
      <header>
        <strong>这一场雨去了哪里</strong>
        <span>{format(p.rain)} mm 降水</span>
      </header>
      <div className="water-budget-bar" aria-hidden="true">
        {p.rain > 0 &&
          parts.map(([name, share, color]) => (
            <span
              key={name}
              style={{ width: `${share}%`, background: color }}
            />
          ))}
      </div>
      {p.rain === 0 && <p>无降水，本次事件的三项水量均为 0。</p>}
      <dl>
        {parts.map(([name, share, color]) => (
          <div key={name}>
            <dt>
              <i style={{ background: color }} />
              {name}
            </dt>
            <dd>
              {Number(((p.rain * share) / 100).toFixed(2))} mm{" "}
              <small>分配比例 {format(share)}%</small>
            </dd>
          </div>
        ))}
      </dl>
      <p>
        三项合计 = {format(p.rain)} mm。比例条表示水量分配，河道宽度不代表流量。
      </p>
      <div className="water-comparison" aria-label="前后水量对照">
        <button
          onClick={() =>
            setReference({ rain: p.rain, infil: p.infil, evap: p.evap })
          }
        >
          {reference ? "更新对照 A" : "保留当前为对照 A"}
        </button>
        {reference && (
          <button onClick={() => setReference(null)}>清除对照</button>
        )}
        {reference ? (
          <>
            <p>
              A：降水 {format(reference.rain)} mm · 下渗{" "}
              {format(reference.infil)}% · 蒸散 {format(reference.evap)}
              %。调整滑块可比较当前 B；切换情境或章节会清除对照。
            </p>
            <table>
              <caption>同一尺度下的水量比较（mm）</caption>
              <thead>
                <tr>
                  <th>分量</th>
                  <th>对照 A</th>
                  <th>当前 B</th>
                  <th>变化</th>
                </tr>
              </thead>
              <tbody>
                {current.map((row, i) => {
                  const delta = row.value - baseline[i].value;
                  return (
                    <tr key={i}>
                      <th>{parts[i][0]}</th>
                      <td>{format(baseline[i].value)}</td>
                      <td>{format(row.value)}</td>
                      <td>
                        {delta > 0 ? "+" : ""}
                        {format(delta)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {current.map((row, i) => (
              <div
                className="water-compare-pair"
                key={i}
                aria-label={`${parts[i][0]}水量条，满刻度200毫米`}
              >
                <span
                  style={{
                    width: `${baseline[i].value / 2}%`,
                    background: parts[i][2],
                    opacity: 0.4,
                  }}
                />
                <span
                  style={{
                    width: `${row.value / 2}%`,
                    background: parts[i][2],
                  }}
                />
              </div>
            ))}
            <p>
              各组上条为 A，下条为 B；统一满刻度 200
              mm。先固定降水与蒸散，只改变下渗，再判断径流减少了多少。
            </p>
          </>
        ) : (
          <p>
            先保留一组参数，再调滑块观察变化；扫描演示只改变本节参数，不代表真实降雨过程或时间尺度。
          </p>
        )}
      </div>
      <div
        className="water-budget-switches"
        role="group"
        aria-label="流域显示设置"
      >
        <button
          aria-pressed={p.vegetation !== 0}
          onClick={() => onChange("vegetation", p.vegetation === 0 ? 1 : 0)}
        >
          植被 · {p.vegetation === 0 ? "已隐藏" : "已显示"}
        </button>
        <button
          aria-pressed={p.pathways !== 0}
          onClick={() => onChange("pathways", p.pathways === 0 ? 1 : 0)}
        >
          路径 · {p.pathways === 0 ? "已隐藏" : "已显示"}
        </button>
      </div>
    </section>
  );
}
