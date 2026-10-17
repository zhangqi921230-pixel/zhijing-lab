import React from "react";
import Button from "./LabButton.jsx";
import {
  perviousShare,
  surfaceInfiltration,
  surfaceBudget,
  surfaceTarget,
} from "./surfaceWater.mjs";
import "./SurfaceWaterStudy.css";

const number = (value) => Number(value.toFixed(1));
function Plot({ share, title }) {
  return (
    <div className="surface-water-plot">
      <svg
        viewBox="0 0 300 240"
        role="img"
        aria-label={`${title}：透水地表占${number(share)}%`}
      >
        <path d="M30 50H270V205L245 225H30Z" fill="#705744" />
        <path d="M30 185H270V205L245 225H30Z" fill="#917253" />
        {Array.from({ length: 100 }, (_, i) => {
          const x = 30 + (i % 10) * 24,
            y = 25 + Math.floor(i / 10) * 16;
          const fraction = Math.max(0, Math.min(1, share - i));
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width="24"
                height="16"
                fill="#8b9496"
                stroke="#555f63"
                strokeWidth=".5"
              />
              {fraction > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={24 * fraction}
                  height="16"
                  fill="#597c48"
                  stroke="#355b3c"
                  strokeWidth=".5"
                />
              )}
              {fraction > 0.8 && i % 3 === 0 && (
                <path
                  d={`M${x + 10} ${y + 12}v-7m0 3l-4-3m4 4l4-3`}
                  fill="none"
                  stroke="#c7d394"
                  strokeWidth="1.3"
                />
              )}
            </g>
          );
        })}
        <path
          d="M30 25V185H270M30 190L245 211L270 190"
          fill="none"
          stroke="#c0ac83"
          strokeWidth="1"
        />
      </svg>
      <strong>{title}</strong>
      <span>
        透水 {number(share)}% · 铺装 {number(100 - share)}%
      </span>
    </div>
  );
}

export default function SurfaceWaterStudy({ p, chapter, onChange }) {
  const raw = perviousShare(p.infil),
    valid = raw >= -1e-8 && raw <= 100 + 1e-8;
  const share = Math.max(0, Math.min(100, raw)),
    target = surfaceTarget(p.rain, p.evap);
  const current = surfaceBudget(p.rain, p.evap, share);
  const challenge = chapter === 7;
  const rows = [
    ["全部铺装", surfaceBudget(p.rain, p.evap, 0)],
    ["当前方案", current],
    ["全部透水", surfaceBudget(p.rain, p.evap, 100)],
  ];
  const changeShare = (value) => onChange("infil", surfaceInfiltration(value));
  return (
    <section className="surface-water-study" aria-label="地表改造与径流">
      <header>
        <span>地理 · 地表与水量</span>
        <h2>
          {challenge
            ? "一场雨的径流挑战"
            : chapter === 5
              ? "同一场雨，不同的地表"
              : "改造一块校园地表"}
        </h2>
        <p>
          相同降水 {number(p.rain)} mm，蒸散比例 {number(p.evap)}
          %。先看地表，再比较水的去向。
        </p>
      </header>
      <div
        className="surface-water-actions"
        role="group"
        aria-label="选择透水地表面积"
      >
        {(chapter === 5
          ? [
              [0, "全部铺装"],
              [100, "全部透水"],
            ]
          : [
              [0, "全部铺装"],
              [25, "透水 25%"],
              [50, "透水 50%"],
              [75, "透水 75%"],
              [100, "全部透水"],
            ]
        ).map(([v, label]) => (
          <Button
            key={v}
            aria-pressed={valid && Math.abs(share - v) < 1e-8}
            onClick={() => changeShare(v)}
          >
            {label}
          </Button>
        ))}
      </div>
      {!valid ? (
        <p role="status">
          当前下渗比例不在本小节的 10%—70%
          教学范围内。请选择一种地表方案，开始比较。
        </p>
      ) : (
        <>
          {chapter !== 5 && (
            <label className="surface-water-slider">
              透水地表面积 <strong>{number(share)}%</strong>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={share}
                aria-label="透水地表面积比例"
                aria-valuetext={`${number(share)}%`}
                onChange={(e) => changeShare(Number(e.target.value))}
              />
            </label>
          )}
          <div className="surface-water-layout">
            <Plot share={share} title="当前地表方案" />
            <div
              className="surface-water-bars"
              role="img"
              aria-label={`同尺度径流对照：全部铺装${number(rows[0][1].runoff)}毫米，当前方案${number(current.runoff)}毫米，全部透水${number(rows[2][1].runoff)}毫米`}
            >
              <h3>地表径流 / mm</h3>
              {rows.map(([title, q]) => (
                <div key={title}>
                  <span>{title}</span>
                  <strong>{number(q.runoff)} mm</strong>
                  <div className="surface-water-track">
                    <i style={{ width: `${q.runoff / 2}%` }} />
                  </div>
                </div>
              ))}
              <small>三条共用 0—200 mm 量程；面积与降水条件相同。</small>
            </div>
          </div>
          <dl className="surface-water-readouts">
            <div>
              <dt>下渗</dt>
              <dd>{number(current.infil)} mm</dd>
            </div>
            <div>
              <dt>蒸散</dt>
              <dd>{number(current.evap)} mm</dd>
            </div>
            <div>
              <dt>地表径流</dt>
              <dd>{number(current.runoff)} mm</dd>
            </div>
          </dl>
          {challenge && (
            <div className="surface-water-challenge" aria-label="径流目标反馈">
              <h3>目标：径流不超过 30 mm</h3>
              <p role="status">
                {p.rain === 0
                  ? "无降水输入，径流为 0；这时无需改造也满足目标。"
                  : !target.possible
                    ? "仅靠本模型中的地表替换无法达标：即使全部透水，径流仍超过 30 mm。"
                    : current.runoff <= 30 + 1e-8
                      ? "当前方案已达到目标。试着减少透水面积，找出刚好达标的边界。"
                      : "当前方案尚未达标。增加透水面积，观察径流条接近目标。"}
              </p>
              {target.possible && p.rain > 0 && (
                <>
                  <p>
                    计算边界：至少 {number(target.required)}%
                    透水面积（显示值四舍五入）。
                  </p>
                  <Button
                    onClick={() => changeShare(Math.min(100, target.required))}
                  >
                    查看刚好达标的方案
                  </Button>
                </>
              )}
              <p>
                再用右侧情境切换 50、100、200 mm
                降水，判断同一个目标是否总能达到。
              </p>
            </div>
          )}
          <p className="surface-water-equation">
            面积加权下渗比例 = {number(share)}% × 70% + {number(100 - share)}% ×
            10% = {number(p.infil)}%
          </p>
        </>
      )}
      <p>
        教学假设：透水地表下渗 70%、铺装地表下渗
        10%，两者蒸散比例相同；不计储水变化、地块间汇流和土壤饱和。这些数值用于控制变量，不是实际材料的固定参数。
      </p>
      <p>
        每小格表示总面积的
        1%，碎格按比例填充。此图是独立的校园地表示意，上方流域同步显示加权后的水量分配，不改变其地形或植被分布；径流量不等同于积水深度或洪峰。
      </p>
    </section>
  );
}
