import React, { useId, useRef } from "react";
import { unitCircleState, circleProbe } from "./unitCircle.mjs";
import { unitCircleAngle } from "./unitCircleAngle.mjs";

export default function UnitCircle({ p, onChange, onObserve }) {
  const arrowId = useId();
  const dragging = useRef(false),
    q = unitCircleState(p),
    angle = unitCircleAngle(q.theta),
    px = 120 + q.cosine * 80,
    py = 120 - q.sine * 80;
  const move = (e) => {
    const box = e.currentTarget.getBoundingClientRect(),
      scale = Math.min(box.width, box.height) / 240;
    if (!(scale > 0)) return;
    const x = (e.clientX - box.left - box.width / 2) / scale,
      y = -(e.clientY - box.top - box.height / 2) / scale;
    if (Math.hypot(x, y) < 12) return;
    const probe = circleProbe(p, Math.atan2(y, x));
    if (probe !== null) onChange("probe", probe);
  };
  if (p.type !== 1)
    return (
      <aside className="unit-circle">
        <h3>单位圆与正弦</h3>
        <p>选择正弦函数，把圆周点的纵坐标与曲线联系起来。</p>
        <button onClick={() => onChange("type", 1)}>切换为正弦</button>
      </aside>
    );
  return (
    <aside className="unit-circle" aria-label="单位圆联动">
      <span>GEOMETRY · 单位圆</span>
      <h3>圆周上的高度</h3>
      <svg
        viewBox="0 0 240 240"
        role="slider"
        tabIndex="0"
        aria-label="单位圆探针横坐标"
        aria-valuemin={-5}
        aria-valuemax={5}
        aria-valuenow={p.probe}
        aria-valuetext={`x=${p.probe.toFixed(3)}，角度 ${q.theta.toFixed(3)} 弧度，sin θ=${q.sine.toFixed(3)}`}
        aria-disabled={p.k === 0}
        onKeyDown={(e) => {
          if (
            p.k === 0 ||
            ![
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
            ].includes(e.key)
          )
            return;
          e.preventDefault();
          const step = e.shiftKey ? 0.5 : 0.1;
          const next =
            e.key === "Home"
              ? -5
              : e.key === "End"
                ? 5
                : p.probe +
                  (["ArrowRight", "ArrowUp"].includes(e.key) ? step : -step);
          onChange("probe", Math.max(-5, Math.min(5, next)));
        }}
        onPointerDown={(e) => {
          if (p.k === 0 || e.button !== 0 || e.isPrimary === false) return;
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e);
        }}
        onPointerMove={(e) => {
          if (dragging.current) move(e);
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
        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0L8 4L0 8Z" fill="#a46a12" />
          </marker>
        </defs>
        <path d="M20 120H220M120 20V220" stroke="#acb3a9" />
        <circle
          cx="120"
          cy="120"
          r="80"
          fill="none"
          stroke="#8a988e"
          strokeWidth="1.5"
        />
        <path
          d={`M120 120L${px} ${py}V120Z`}
          fill="#c98a1b18"
          stroke="#cc8a22"
          strokeWidth="1.5"
        />
        <path d={`M${px} ${py}H120`} stroke="#287bb1" strokeDasharray="4 3" />
        <path
          aria-label="余弦水平投影"
          d={`M120 120H${px}`}
          stroke="#398272"
          strokeWidth="4"
        />
        <path
          d={`M${px} ${py}V120`}
          stroke="#398272"
          strokeDasharray="4 3"
          fill="none"
        />
        {angle.path && (
          <path
            aria-label="输入角方向弧"
            d={angle.path}
            fill="none"
            stroke="#a46a12"
            strokeWidth="1.8"
            markerEnd={`url(#${arrowId})`}
          />
        )}
        <path
          aria-label="正弦竖直投影"
          d={`M120 120V${py}`}
          stroke="#287bb1"
          strokeWidth="4"
        />
        <circle
          cx={px}
          cy="120"
          r="3"
          fill="#fffdf7"
          stroke="#398272"
          strokeWidth="1.5"
        />
        <circle
          cx="120"
          cy={py}
          r="3"
          fill="#fffdf7"
          stroke="#287bb1"
          strokeWidth="1.5"
        />
        <circle cx={px} cy={py} r="6" fill="#b97913" />
        <g fill="#657468" fontSize="12">
          <path
            d="M40 117V123M200 117V123M117 40H123M117 200H123"
            stroke="#8a988e"
          />
          <text x="32" y="137">
            −1
          </text>
          <text x="126" y="204">
            −1
          </text>
          <text x="202" y="137">
            1
          </text>
          <text x="126" y="38">
            1
          </text>
          <text x="124" y="136">
            O
          </text>
          <text x="211" y="114">
            x
          </text>
          <text x="128" y="22">
            y
          </text>
        </g>
      </svg>
      <div className="unit-circle-values">
        <div>
          θ = k(x−h)<b>{q.theta.toFixed(3)} rad</b>
        </div>
        <div className="unit-circle-cosine">
          横坐标 cos θ<b>{q.cosine.toFixed(3)}</b>
        </div>
        <div className="unit-circle-sine">
          纵坐标 sin θ<b>{q.sine.toFixed(3)}</b>
        </div>
        <div>
          图像 y = a sin θ + b<b>{q.y.toFixed(3)}</b>
        </div>
      </div>
      {angle.turns !== 0 && (
        <p className="unit-circle-turns">
          已{angle.turns > 0 ? "逆时针" : "顺时针"}转过 {Math.abs(angle.turns)}{" "}
          整圈；角弧显示余角 {angle.remainder.toFixed(3)} rad。
        </p>
      )}
      <div className="unit-circle-presets" aria-label="单位圆关键角">
        {[
          [0, "0"],
          [Math.PI / 6, "π/6"],
          [Math.PI / 4, "π/4"],
          [Math.PI / 3, "π/3"],
          [Math.PI / 2, "π/2"],
          [Math.PI, "π"],
          [-Math.PI / 2, "−π/2"],
        ].map(([angle, label]) => {
          const x = p.k ? p.shift + angle / p.k : NaN;
          return (
            <button
              key={label}
              disabled={!Number.isFinite(x) || x < -5 || x > 5}
              aria-pressed={Math.abs(q.theta - angle) < 1e-9}
              onClick={() => (onObserve ? onObserve(x) : onChange("probe", x))}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p>
        {p.k === 0
          ? "k=0，输入角恒为 0，圆周点固定，图像为 y=b。"
          : "拖动圆周点或选择关键角；选中单位圆也可用方向键调节 x，Shift 加快，Home/End 到两端。探针限于 −5 ≤ x ≤ 5。"}{" "}
        θ 为弧度，逆时针为正；纵向变换只影响函数图像，不改变单位圆。
      </p>
    </aside>
  );
}
