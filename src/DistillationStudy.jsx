import React, { useMemo, useState } from "react";
import { distillationState } from "./chemistryTopics.mjs";
import "./DistillationStudy.css";
import { distillationEnergy } from "./distillationEnergy.mjs";
export const boilingTime = (power) => (200 * 4.18 * 80) / power;
export default function DistillationStudy({ p, time, onSeek }) {
  const [comparePower, setComparePower] = useState(false);
  const q = distillationState(p.power, time, p.cooling),
    boiling = boilingTime(p.power);
  const energy = distillationEnergy(p, time),
    tenGrams = (200 * 4.18 * 80 + 10 * 2257) / p.power;
  const path = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const t = i * 2,
          temperature = distillationState(p.power, t, p.cooling).temperature;
        return `${i ? "L" : "M"}${48 + t * 2} ${228 - temperature * 1.8}`;
      }).join(" "),
    [p.power],
  );
  const referencePath = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const t = i * 2;
        return `${i ? "L" : "M"}${48 + t * 2} ${228 - distillationState(400, t, p.cooling).temperature * 1.8}`;
      }).join(" "),
    [p.cooling],
  );
  return (
    <section className="distillation-study" aria-label="蒸馏阶段与水量守恒">
      <header>
        <div>
          <small>先升温，再汽化</small>
          <h3>
            {q.boiling ? "继续供热，水正在汽化" : "尚未到沸点，供热用于升温"}
          </h3>
        </div>
        <strong>预计开始沸腾：{boiling.toFixed(1)} s</strong>
      </header>
      <ol className="distillation-process" aria-label="当前蒸馏过程">
        <li>
          <span>01 · 原瓶</span>
          <strong>{q.temperature.toFixed(1)} °C</strong>
          <p>
            {q.boiling
              ? "已到近似沸点，继续供热用于汽化"
              : "正在升温，尚未开始汽化"}
          </p>
        </li>
        <li>
          <span>02 · 内管</span>
          <strong>汽化 {q.evaporated.toFixed(2)} g</strong>
          <p>
            {q.evaporated > 1e-9
              ? "水离开原瓶；不挥发盐留在瓶内"
              : "尚无累计汽化量"}
          </p>
        </li>
        <li>
          <span>03 · 接收</span>
          <strong>收集 {q.collected.toFixed(2)} g</strong>
          <p>
            {p.cooling
              ? "冷却已开：理想冷凝收集"
              : "冷却已关：蒸汽计入未收集量"}
          </p>
        </li>
      </ol>
      <p>
        先定位一个阶段，再比较温度、瓶内水与收集量。冷却水走夹套，蒸汽走内管，两路互不混合。
      </p>
      <div
        className="distillation-phases"
        role="group"
        aria-label="定位蒸馏阶段"
      >
        {[
          ["开始加热", 0],
          ["刚到沸点", boiling],
          ["汽化10克水", tenGrams],
          ["演示结束", 240],
        ].map(([label, t]) => (
          <button
            key={label}
            disabled={t > 240}
            onClick={() => onSeek(t)}
            aria-pressed={Math.abs(time - t) < 1e-8}
          >
            {label}
          </button>
        ))}
      </div>
      <details className="distillation-apparatus-notes">
        <summary>器材怎么读：流向、液面与温度计</summary>
        <p>
          三维装置中，内管箭头从蒸馏瓶指向接收杯；金色表示蒸汽路径，开启冷却时出口段以浅蓝色提示冷凝后的液体。夹套蓝色箭头反向流动，表示冷却水。内外两路不混合。
        </p>
        <p>
          颜色分界只帮助辨认过程，不是计算得到的冷凝位置；箭头不是分子、液滴数量或真实流速。液滴落到当前收集液面后显示接触波纹，滴落节奏与波纹是视觉示意，不用于计算产水速率。未开始汽化时，内管箭头不显示。
        </p>
        <p>
          瓶内液面保持水平，随剩余水量沿圆底内壁降低；圆底截面积随高度变化，因此液面高度与剩余质量不是简单的正比。瓶体采用理想球形示意，不模拟沸腾造成的液面起伏。
        </p>
        <p>
          温度计感温泡位于支管附近，观察蒸汽而非瓶底液体。下方曲线为瓶内液体温度；本模型未求解汽化前的蒸汽区温度，因此不显示确定液柱。开始汽化后，红色示意液柱指向常压近似100°C的位置，忽略蒸汽输运延迟；刻线从20到100°C等距排列，不作为真实仪器校准。
        </p>
      </details>
      <div className="distillation-phases">
        <button
          aria-pressed={comparePower}
          onClick={() => setComparePower(!comparePower)}
        >
          {comparePower ? "隐藏400 W参照曲线" : "对照400 W升温曲线"}
        </button>
      </div>
      {comparePower && (
        <p role="status">
          虚线：400 W参照，{boilingTime(400).toFixed(1)} s到达沸点；实线：当前
          {p.power} W，{boiling.toFixed(1)} s到达沸点。两组均从20°C开始、含200
          g水，近似沸点均为100°C。
          {p.power === 400
            ? "当前功率与参照相同，两线重合。"
            : "比较到达平台的时刻，不要把更快升温误认为沸点升高。"}
        </p>
      )}
      <div
        className="distillation-curve-scroll"
        role="region"
        aria-label="温度曲线，可横向滚动"
        tabIndex="0"
      >
        <svg
          viewBox="0 0 570 280"
          role="img"
          aria-label="温度随时间先升高后保持近似100摄氏度，圆点为当前时刻"
        >
          {[20, 60, 100].map((v) => (
            <g key={v}>
              <path d={`M48 ${228 - v * 1.8}H528`} stroke="var(--ui-line)" />
              <text x="38" y={233 - v * 1.8} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          {[0, 60, 120, 180, 240].map((t) => (
            <g key={t}>
              <path d={`M${48 + t * 2} 48V228`} stroke="var(--ui-line)" />
              <text x={48 + t * 2} y="248" textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
          <text x="48" y="26">
            温度 / °C
          </text>
          <text x="528" y="272" textAnchor="end">
            时间 / s
          </text>
          {comparePower && (
            <path
              data-testid="distillation-power-reference"
              d={referencePath}
              stroke="var(--ui-gold)"
              strokeWidth="3"
              strokeDasharray="7 5"
              fill="none"
            />
          )}
          <path
            d={path}
            stroke="var(--ui-primary)"
            strokeWidth="3"
            fill="none"
          />
          {boiling <= 240 && (
            <path
              d={`M${48 + boiling * 2} 48V228`}
              stroke="var(--ui-ink)"
              strokeDasharray="4 5"
            />
          )}
          <circle
            cx={48 + time * 2}
            cy={228 - q.temperature * 1.8}
            r="5"
            fill="var(--ui-surface)"
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
        </svg>
      </div>
      {boiling > 240 && (
        <p>
          当前功率下，240 s
          窗口内尚未沸腾，因此没有馏出水；可提高有效加热功率后重新对照。
        </p>
      )}
      <div
        className="distillation-water"
        role="img"
        aria-label={`瓶内水${q.remaining.toFixed(1)}克，收集水${q.collected.toFixed(1)}克，未收集蒸汽${q.lost.toFixed(1)}克`}
      >
        <i style={{ width: `${q.remaining / 2}%` }} />
        <i style={{ width: `${q.collected / 2}%` }} />
        <i style={{ width: `${q.lost / 2}%` }} />
      </div>
      <p>
        瓶内水 {q.remaining.toFixed(1)} g + 收集水 {q.collected.toFixed(1)} g +
        未收集蒸汽 {q.lost.toFixed(1)} g = 200 g。另有 2 g
        不挥发盐始终留在原瓶。
      </p>
      <section className="distillation-energy" aria-label="供热与相变能量">
        <h3>温度不再升高，热量去了哪里？</h3>
        <p>
          累计有效供热 {(energy.input / 1000).toFixed(2)}{" "}
          kJ。下面按同一能量比例显示；整个刻度对应192
          kJ（本演示最大功率运行240秒）。
        </p>
        <div
          className="distillation-energy-track"
          role="img"
          aria-label={`升温吸热${(energy.warming / 1000).toFixed(2)}千焦，汽化吸热${(energy.vaporizing / 1000).toFixed(2)}千焦`}
        >
          <span style={{ width: `${energy.warming / 1920}%` }} />
          <span style={{ width: `${energy.vaporizing / 1920}%` }} />
        </div>
        <dl>
          <div>
            <dt>升温吸热 · 浅蓝段</dt>
            <dd>{(energy.warming / 1000).toFixed(2)} kJ</dd>
          </div>
          <div>
            <dt>汽化吸热 · 金色段</dt>
            <dd>{(energy.vaporizing / 1000).toFixed(2)} kJ</dd>
          </div>
          <div>
            <dt>冷凝释放的潜热</dt>
            <dd>{(energy.condensing / 1000).toFixed(2)} kJ</dd>
          </div>
        </dl>
        <p>
          {q.boiling
            ? "到达近似100°C后，继续供热用于汽化，不能据此认为停止吸热。"
            : "目前供热用于把水从20°C升温；尚未计入汽化吸热。"}{" "}
          {p.cooling
            ? "蒸汽在冷凝器中放出汽化时吸收的潜热，变回液态水。"
            : "关闭冷却水时，本模型不收集液态水，也不计冷凝器释放的潜热。"}
        </p>
        <p>
          汽化10 g水需要22.57 kJ；潜热按2257
          J/g计算。冷凝热是同一份能量的转移，不应再次加到加热器供热中。本图只计算汽化/冷凝潜热，不计算馏出液继续降温的放热。
        </p>
        {tenGrams > 240 && (
          <p>当前功率在240秒内无法汽化10 g水；对应定位按钮暂不可用。</p>
        )}
      </section>
      <p>
        曲线全程为模型预测，圆点与器材动画共用时间；点击阶段会暂停。近似常压100°C，忽略散热、器壁热容和沸点升高，汽化仍需持续供热。冷却条件的改变会从头重做本次演示。
      </p>
    </section>
  );
}
