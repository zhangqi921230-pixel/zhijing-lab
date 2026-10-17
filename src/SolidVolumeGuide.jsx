import React from "react";
import {
  accumulatedVolumes,
  solidsState,
  coneHeightForVolume,
} from "./advancedModels.mjs";
import SolidVolumeCurve from "./SolidVolumeCurve.jsx";
import SolidLayerStudy from "./SolidLayerStudy.jsx";
import "./SolidVolumeTargets.css";

export default function SolidVolumeGuide({ p, t, onChange }) {
  const q = solidsState(p, t),
    volumes = accumulatedVolumes(p.radius, p.height, q.fraction);
  return (
    <div className="solids-guide">
      <div>
        <span>从底面累积至 z = {q.z.toFixed(2)} cm</span>
        <svg
          viewBox="0 0 360 180"
          role="img"
          aria-label={`相同高度下圆柱累计体积 ${volumes.cylinder.toFixed(3)} 立方厘米，圆锥累计体积 ${volumes.cone.toFixed(3)} 立方厘米`}
        >
          <text x="12" y="25" fill="#376956" fontSize="14">
            圆柱 · {volumes.cylinder.toFixed(3)} cm³
          </text>
          <rect x="12" y="39" width="330" height="27" fill="#e2e5d9" />
          <rect
            x="12"
            y="39"
            width={330 * q.fraction}
            height="27"
            fill="#328477"
          />
          <text x="12" y="105" fill="#876a32" fontSize="14">
            圆锥 · {volumes.cone.toFixed(3)} cm³
          </text>
          <rect x="12" y="119" width="330" height="27" fill="#e2e5d9" />
          <rect
            x="12"
            y="119"
            width={110 * volumes.coneFraction}
            height="27"
            fill="#b78b39"
          />
          <text x="12" y="173" fill="#52675d" fontSize="12">
            共同刻度：完整圆柱体积 = 100%
          </text>
        </svg>
      </div>
      <div>
        <span>半高不等于半体积</span>
        <strong>圆锥已累积 {(volumes.coneFraction * 100).toFixed(1)}%</strong>
        <p>
          这里的百分比以完整圆锥为基准。底部更宽，所以半高处已包含圆锥总体积的
          7/8；剩下的上部小圆锥只有 1/8。
        </p>
        <div className="cube-pairs">
          {[
            [0, "从底面开始"],
            [50, "观察半高"],
            [100, "完整体积"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={Math.abs(q.fraction * 100 - value) < 0.001}
              onClick={() => onChange("slice", value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p>
          令
          f=z/h，V圆柱下部=πr²hf；V圆锥下部=⅓πr²h[1−(1−f)³]。实体中的颜色表示累计几何体积，不模拟倒水、流速或表面张力。
        </p>
      </div>
      <SolidVolumeCurve
        fraction={q.fraction}
        onSelect={(value) => onChange("slice", value)}
      />
      <section className="solid-volume-targets" aria-label="按体积定位截面">
        <h3>反过来找：要留下多少体积？</h3>
        <p>
          以下目标以完整圆锥为100%。选定后，三维切面、着色体积和曲线会同步到对应高度，并暂停演示。
        </p>
        <div className="cube-pairs" role="group" aria-label="圆锥下部目标体积">
          {[
            [0.25, "四分之一"],
            [0.5, "二分之一"],
            [0.75, "四分之三"],
          ].map(([target, label]) => (
            <button
              key={target}
              aria-pressed={Math.abs(volumes.coneFraction - target) < 1e-8}
              onClick={() =>
                onChange("slice", 100 * coneHeightForVolume(target))
              }
            >
              圆锥{label}体积
            </button>
          ))}
          <button onClick={() => onChange("slice", 50)}>对照圆柱半体积</button>
        </div>
        <p>
          当前切面高度占总高 <strong>{(q.fraction * 100).toFixed(3)}%</strong>
          ；圆锥下部占自身总体积{" "}
          <strong>{(volumes.coneFraction * 100).toFixed(3)}%</strong>
          ，圆柱下部占自身总体积{" "}
          <strong>{(q.fraction * 100).toFixed(3)}%</strong>。
        </p>
        <p>
          若目标体积比例为 v，则 z/h = 1 −
          ∛(1−v)。圆锥半体积切面约在总高的20.630%，并非半高；按钮使用未舍入的高度，显示值仅便于阅读。
        </p>
      </section>
      <SolidLayerStudy
        radius={p.radius}
        height={p.height}
        fraction={q.fraction}
      />
    </div>
  );
}
