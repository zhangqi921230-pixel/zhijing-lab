import React, { useMemo, useRef, useState } from "react";
import { rc } from "./advancedModels.mjs";
import RCVoltageBalance from "./RCVoltageBalance.jsx";
import RCEnergy from "./RCEnergy.jsx";
import "./RCControls.css";
import { rcProbeTime } from "./rcProbe.mjs";
export function rcPlot(p, current = false) {
  const q = rc(p, 0),
    peak = current ? (1000 * p.u) / p.r : p.u;
  return Array.from({ length: 151 }, (_, i) => {
    const t = (i / 150) * 5 * q.tau,
      s = rc(p, t),
      value = current ? 1000 * Math.abs(s.current) : s.voltage;
    return [46 + (i / 150) * 360, 180 - (value / peak) * 140];
  });
}
export default function RCGuide({ p, t, onChange, chapter = 0, onSeek }) {
  const dragging = useRef(false);
  const [current, setCurrent] = useState(false),
    q = rc(p, t),
    points = useMemo(
      () => (chapter >= 3 ? [] : rcPlot(p, current)),
      [
        chapter,
        current,
        p.u,
        p.r,
        p.c,
        p.mode,
        p.initialRatio,
        p.chargeInitialRatio,
      ],
    ),
    peak = current ? (1000 * p.u) / p.r : p.u,
    x = 46 + Math.min(1, t / (5 * q.tau)) * 360,
    value = current ? 1000 * Math.abs(q.current) : q.voltage,
    y = 180 - (value / peak) * 140;
  const seekPointer = (event) => {
    const time = rcProbeTime(
      event.clientX,
      event.currentTarget.getBoundingClientRect(),
      q.tau,
    );
    if (time !== null) onSeek?.(time);
  };
  return (
    <section className="rc-guide" aria-label="RC 电路与测量">
      <div className="rc-circuit">
        <span>回路观察 · {p.mode ? "电源已断开" : "电源经电阻给电容充电"}</span>
        <svg
          viewBox="0 0 380 250"
          role="group"
          aria-label={
            p.mode
              ? "电容通过电阻放电，电源不在回路中"
              : "电源、电阻和电容串联充电回路"
          }
        >
          <g fill="none" stroke="var(--ui-muted)" strokeWidth="3">
            <path d="M55 100V45H110M155 45H183M243 45H310V110M310 128V205H55V145" />
            <rect
              x="183"
              y="34"
              width="60"
              height="22"
              fill="var(--ui-paper)"
            />
            <path d="M288 110H332M288 128H332M39 112H71M45 134H65" />
            <path d="M55 100V112M55 134V145" />
            <path
              d="M310 205H138V84"
              stroke={p.mode ? "#b88634" : "#c4cbbf"}
              strokeDasharray={p.mode ? "" : "5 5"}
            />
          </g>
          <g fill="var(--ui-ink)" fontSize="16">
            <text x="196" y="25">
              R {p.r} Ω
            </text>
            <text x="330" y="147">
              C
            </text>
            <text x="280" y="170">
              {p.c} mF
            </text>
            <text x="17" y="165">
              {p.u} V
            </text>
            <text x="285" y="101">
              +
            </text>
            <text x="285" y="145">
              −
            </text>
            <text x="150" y="235">
              Uc = {q.voltage.toFixed(2)} V
            </text>
            <text x="102" y="28">
              充电
            </text>
            <text x="108" y="107">
              放电
            </text>
          </g>
          <circle cx="110" cy="45" r="5" fill="#b88634" />
          <circle cx="138" cy="84" r="5" fill="#b88634" />
          <circle cx="155" cy="45" r="5" fill="#b88634" />
          <g
            className="rc-diagram-switch"
            role="button"
            tabIndex={0}
            aria-label={`换向开关：当前${p.mode ? "放电，切换为充电" : "充电，切换为放电"}`}
            onClick={() => onChange("mode", p.mode ? 0 : 1)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!event.repeat) onChange("mode", p.mode ? 0 : 1);
              }
            }}
          >
            <rect
              className="rc-switch-target"
              x="94"
              y="12"
              width="76"
              height="106"
              rx="8"
              fill="transparent"
            />
            <path
              d={p.mode ? "M155 45L138 84" : "M155 45L112 45"}
              stroke="#b88634"
              strokeWidth="4"
            />
          </g>
        </svg>
        <p className="rc-switch-help">
          点击图中换向开关；键盘选中后按 Enter 或空格切换。
        </p>
        <div className="rc-mode-buttons">
          <button
            aria-pressed={!p.mode && (p.chargeInitialRatio ?? 0) === 0}
            onClick={() => onChange("prepareMode", 0)}
          >
            从零电压充电
          </button>
          <button
            aria-pressed={!!p.mode && (p.initialRatio ?? 100) === 100}
            onClick={() => onChange("prepareMode", 1)}
          >
            从满电压放电
          </button>
        </div>
        {
          <button
            className="btn"
            onClick={() =>
              onChange(p.mode ? "chargeCurrent" : "dischargeCurrent", 1)
            }
          >
            {p.mode ? "从当前电压继续充电" : "从当前电压放电"}
          </button>
        }
        <p>
          {`本次${p.mode ? "放电" : "充电"}初始电压 U₀ = ${q.initialVoltage.toFixed(3)} V；时间从切换时刻计起。`}
          开关和模式切换保留当前电压；“从零电压充电”和“从满电压放电”按钮重新准备初态。
        </p>
        <details className="rc-explanation">
          <summary>器材操作与模型说明</summary>
          <p>
            金色表示选通支路；电流不穿过极板间的电介质。三维极板为放大的结构示意，电容量由参数设定，不按可见板面积和间距计算。极板电荷标记仅为定性示意；导线上的金色箭头表示约定电流方向，金属中的电子漂移方向与之相反。
          </p>
          <p>
            开关近景可查看两个固定接点，点击绝缘手柄或金属刀片切换充放电。切换保留当前电压并暂停，点击播放继续；刀片转动为示意动画，不模拟触点开断瞬态，转动期间隐藏电流标记。
          </p>
          <p>
            电源近景中点击电压旋钮增加 0.5 V，按住 Shift
            点击减小；也可用右侧滑块。改变电压会回到该实验的初态。
          </p>
        </details>
      </div>
      {chapter === 4 ? (
        <RCVoltageBalance p={p} t={t} onSeek={onSeek} />
      ) : chapter === 3 ? (
        <RCEnergy p={p} t={t} onSeek={onSeek} />
      ) : (
        <div>
          <div className="rc-chart-heading">
            <span>连续响应 · τ = {q.tau.toFixed(2)} s</span>
            <div role="group" aria-label="曲线类型">
              <button aria-pressed={!current} onClick={() => setCurrent(false)}>
                电压
              </button>
              <button aria-pressed={current} onClick={() => setCurrent(true)}>
                电流大小
              </button>
            </div>
          </div>
          <svg
            viewBox="0 0 440 225"
            className="rc-curve-probe"
            role="slider"
            tabIndex={0}
            aria-label="RC 曲线观察时刻"
            aria-valuemin={0}
            aria-valuemax={5 * q.tau}
            aria-valuenow={t}
            aria-valuetext={`${t.toFixed(2)} 秒，${(t / q.tau).toFixed(2)} 个时间常数，${current ? `电流大小 ${value.toFixed(3)} 毫安` : `电容电压 ${value.toFixed(3)} 伏`}`}
            onKeyDown={(event) => {
              const steps = {
                ArrowRight: 1,
                ArrowUp: 1,
                ArrowLeft: -1,
                ArrowDown: -1,
              };
              if (
                event.key in steps ||
                event.key === "Home" ||
                event.key === "End"
              ) {
                event.preventDefault();
                const time =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? 5 * q.tau
                      : t +
                        steps[event.key] * q.tau * (event.shiftKey ? 0.5 : 0.1);
                onSeek?.(Math.max(0, Math.min(5 * q.tau, time)));
              }
            }}
            onPointerDown={(event) => {
              if (event.button !== 0 || event.isPrimary === false) return;
              dragging.current = true;
              event.currentTarget.setPointerCapture?.(event.pointerId);
              seekPointer(event);
            }}
            onPointerMove={(event) => {
              if (dragging.current) seekPointer(event);
            }}
            onPointerUp={() => {
              dragging.current = false;
            }}
            onPointerCancel={() => {
              dragging.current = false;
            }}
            onLostPointerCapture={() => {
              dragging.current = false;
            }}
          >
            {[0, 0.5, 1].map((f) => (
              <g key={f}>
                <path
                  d={`M46 ${180 - f * 140}H406`}
                  stroke="var(--ui-line)"
                  strokeDasharray="3 4"
                />
                <text
                  x="37"
                  y={185 - f * 140}
                  textAnchor="end"
                  fontSize="14"
                  fill="var(--ui-muted)"
                >
                  {(f * peak).toFixed(1)}
                </text>
              </g>
            ))}
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <g key={n}>
                <path d={`M${46 + n * 72} 40V180`} stroke="var(--ui-line)" />
                <text
                  x={46 + n * 72}
                  y="200"
                  textAnchor="middle"
                  fontSize="14"
                  fill="var(--ui-muted)"
                >
                  {(n * q.tau).toFixed(1)}
                </text>
              </g>
            ))}
            <path d="M46 30V180H416" stroke="var(--ui-muted)" fill="none" />
            <text x="14" y="19" fontSize="14" fill="var(--ui-muted)">
              {current ? "|I| / mA" : "Uc / V"}
            </text>
            <text x="389" y="221" fontSize="14" fill="var(--ui-muted)">
              t / s
            </text>
            <path
              d={points
                .map(([a, b], i) => `${i ? "L" : "M"}${a},${b}`)
                .join(" ")}
              fill="none"
              stroke="var(--ui-primary)"
              strokeWidth="3"
            />
            <path d={`M${x} 35V180`} stroke="#b28534" strokeDasharray="5 4" />
            <circle cx={x} cy={y} r="5" fill="#b28534" />
            <text x="180" y="20" fontSize="13" fill="var(--ui-muted)">
              t/τ = {(t / q.tau).toFixed(2)}
            </text>
          </svg>
          <div className="rc-probe-presets" aria-label="时间常数观察点">
            {[1, 3, 5].map((n) => (
              <button
                key={n}
                onClick={() => onSeek?.(n * q.tau)}
                aria-pressed={Math.abs(t - n * q.tau) < 1e-8}
              >
                观察 {n}τ
              </button>
            ))}
          </div>
          <p>
            点击或拖动曲线选择时刻；方向键微调，Shift 加快，Home/End 到两端。
          </p>
          <div className="rc-measurements">
            <strong>
              {((q.voltage / p.u) * 100).toFixed(1)}%
              <small>当前电压 / 电源设定电压</small>
            </strong>
            <strong>
              {(q.energy * 1000).toPrecision(3)}
              <small>储存能量 / mJ</small>
            </strong>
            <strong>
              {(q.charge * 1000).toFixed(2)}
              <small>单极板电荷量 / mC</small>
            </strong>
          </div>
          <p>
            {current
              ? "电流大小以正值显示；放电时常规电流方向与充电相反。"
              : p.mode
                ? "初始电压非零时，放电 1τ 后剩余初始值的约 36.8%；5τ 后约 0.67%。"
                : "充电 1τ 后完成初始电压到电源电压差值的约 63.2%；5τ 后约 99.33%，并非精确达到稳态。"}{" "}
            理想电压测量不改变回路。
          </p>
        </div>
      )}
    </section>
  );
}
