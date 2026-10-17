import React, { useState } from "react";
import "./OhmDataPlot.css";

export function groupOhmRecords(records) {
  const groups = new Map();
  let excluded = 0;
  for (const record of records) {
    const { u, r, closed } = record.parameters;
    const current = record.values.find((v) => v.label === "电流")?.value;
    if (
      !closed ||
      !Number.isFinite(u) ||
      !Number.isFinite(r) ||
      r <= 0 ||
      !Number.isFinite(current)
    ) {
      excluded++;
      continue;
    }
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push({ voltage: u, current, number: record.number });
  }
  return { groups: [...groups].sort(([a], [b]) => a - b), excluded };
}

export function OhmDataPlot({ records }) {
  const [selected, setSelected] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const { groups, excluded } = groupOhmRecords(records);
  const group =
    groups.find(([resistance]) => String(resistance) === selected) ?? groups[0];
  if (!group)
    return (
      <section className="ohm-plot">
        <h3>电流—电压图</h3>
        <p>
          闭合回路，保持电阻不变，记录至少三组不同电压的数据后比较。断路记录保留在表格中，不纳入此图。
        </p>
      </section>
    );
  const [resistance, points] = group;
  const inspected =
    points.find((point) => point.number === selectedNumber) ?? points.at(-1);
  const inferredResistance =
    inspected.current > 0 ? inspected.voltage / inspected.current : null;
  const xMax = Math.max(
    1,
    Math.ceil(Math.max(...points.map((p) => p.voltage))),
  );
  const yMax = Math.max(
    0.1,
    Math.ceil(
      Math.max(xMax / resistance, ...points.map((p) => p.current)) * 10,
    ) / 10,
  );
  const x = (voltage) => 64 + (voltage / xMax) * 556;
  const y = (current) => 280 - (current / yMax) * 228;
  const unique = new Set(points.map((p) => p.voltage)).size;
  return (
    <section className="ohm-plot" aria-label="已记录数据的电流电压图">
      <div className="ohm-plot-heading">
        <div>
          <small>DATA · 控制变量</small>
          <h3>电流—电压图</h3>
        </div>
        <label>
          保持电阻
          <select
            value={String(resistance)}
            onChange={(event) => setSelected(event.target.value)}
          >
            {groups.map(([r]) => (
              <option key={r} value={r}>
                {r} Ω
              </option>
            ))}
          </select>
        </label>
      </div>
      <svg
        viewBox="0 0 660 330"
        role="group"
        aria-label={`电阻 ${resistance} 欧姆，${points.length} 个记录点；横轴电压，纵轴电流。点的具体数值见下方记录表。`}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <path
              d={`M64 ${y((yMax * i) / 5)}H620 M${x((xMax * i) / 5)} 52V280`}
              className="ohm-plot-grid"
            />
            <text x="54" y={y((yMax * i) / 5) + 4} textAnchor="end">
              {Number(((yMax * i) / 5).toFixed(3))}
            </text>
            <text x={x((xMax * i) / 5)} y="301" textAnchor="middle">
              {Number(((xMax * i) / 5).toFixed(2))}
            </text>
          </g>
        ))}
        <path d="M64 42V280H632" className="ohm-plot-axis" />
        <text x="20" y="26">
          I / A
        </text>
        <text x="605" y="322">
          U / V
        </text>
        <path
          d={`M${x(0)} ${y(0)}L${x(xMax)} ${y(xMax / resistance)}`}
          className="ohm-plot-theory"
        />
        {points.map((point) => (
          <circle
            key={point.number}
            cx={x(point.voltage)}
            cy={y(point.current)}
            r="5"
            className="ohm-plot-point"
            data-selected={point.number === inspected.number}
            tabIndex={0}
            role="button"
            aria-label={`检查第 ${point.number} 组：${point.voltage} V，${point.current.toFixed(3)} A`}
            aria-pressed={point.number === inspected.number}
            onClick={() => setSelectedNumber(point.number)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedNumber(point.number);
              }
            }}
          >
            <title>{`第 ${point.number} 组：${point.voltage} V，${point.current.toFixed(3)} A`}</title>
          </circle>
        ))}
      </svg>
      <div className="ohm-record-inspection" aria-label="选中记录核对">
        <label>
          检查记录
          <select
            value={inspected.number}
            onChange={(event) => setSelectedNumber(Number(event.target.value))}
          >
            {points.map((point) => (
              <option key={point.number} value={point.number}>
                第 {point.number} 组 · {point.voltage} V
              </option>
            ))}
          </select>
        </label>
        <p aria-live="polite">
          第 {inspected.number} 组：电阻两端 {inspected.voltage} V，电流{" "}
          {inspected.current.toFixed(3)} A。
          {inferredResistance === null
            ? "电流为零，不能用 U/I 计算电阻。"
            : `由记录值计算 U/I = ${Number(inferredResistance.toFixed(3))} Ω；实验设定为 ${resistance} Ω。`}
        </p>
        <p>
          可点击图中数据点核对；重合记录可在列表中分别选择。这里使用已保存的数值，不读取当前旋钮设置。
        </p>
      </div>
      <p>
        <span className="ohm-plot-dot">●</span> 实验记录　
        <span className="ohm-plot-dash">┄</span> 理想关系 I = U / R
      </p>
      <p>
        {unique < 3
          ? `当前只有 ${unique} 个不同电压，请继续记录；重复记录会重叠。`
          : `已记录 ${unique} 个不同电压，可比较电压加倍时电流是否加倍。`}{" "}
        虚线是模型参考线，不是数据拟合。
      </p>
      {groups.length > 1 && (
        <p>
          检测到不同电阻的数据，已分组显示；不要把它们当作同一次控制变量实验。
        </p>
      )}
      {excluded > 0 && (
        <p>{excluded} 组断路或无效记录未绘入此图，原始记录仍保留。</p>
      )}
    </section>
  );
}
