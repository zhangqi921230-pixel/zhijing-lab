import ApparentDepth from "./ApparentDepth.jsx";
import React, { useRef, useState } from "react";
import { refraction, rad, format } from "./models.mjs";
import RefractionPlot from "./RefractionPlot.jsx";
export function opticalRays(p) {
  const q = refraction(p.angle, p.n1, p.n2),
    a = rad(p.angle),
    r = rad(q.angle ?? 0);
  return {
    ...q,
    incident: [320 - 220 * Math.sin(a), 300 - 220 * Math.cos(a)],
    reflected: [320 + 220 * Math.sin(a), 300 - 220 * Math.cos(a)],
    transmitted: q.tir
      ? null
      : [320 + 220 * Math.sin(r), 300 + 220 * Math.cos(r)],
  };
}
export function incidentAngle(x, y) {
  return Math.max(
    0,
    Math.min(
      89.9,
      Math.round(((Math.atan2(320 - x, 300 - y) * 180) / Math.PI) * 10) / 10,
    ),
  );
}
const arc = (angle, r, bottom = false) => {
  const a = rad(angle);
  return `M320 ${300 + (bottom ? r : -r)} A${r} ${r} 0 0 0 ${320 + (bottom ? 1 : -1) * r * Math.sin(a)} ${300 + (bottom ? 1 : -1) * r * Math.cos(a)}`;
};
export default function RefractionScene({ p, onChange, chapter = 0 }) {
  const svg = useRef(null),
    drag = useRef(false),
    [reflected, setReflected] = useState(true),
    q = opticalRays(p),
    critical = q.critical !== null && Math.abs(p.angle - q.critical) < 1e-8;
  function move(e) {
    if (!drag.current) return;
    const m = svg.current.getScreenCTM();
    if (m) {
      const xy = new DOMPoint(e.clientX, e.clientY).matrixTransform(
        m.inverse(),
      );
      onChange("angle", incidentAngle(xy.x, xy.y));
    }
  }
  const source = [
    320 - 252 * Math.sin(rad(p.angle)),
    300 - 252 * Math.cos(rad(p.angle)),
  ];
  return (
    <div className="refraction-workspace">
      <svg
        ref={svg}
        viewBox="0 0 640 610"
        role="img"
        aria-label="可拖动光源的折射与全反射光学台"
      >
        <defs>
          <radialGradient id="optics-metal">
            <stop stopColor="#fcfbef" />
            <stop offset=".9" stopColor="#e5e5d7" />
            <stop offset="1" stopColor="#acb9ae" />
          </radialGradient>
          <linearGradient id="optics-glass" x2="0" y2="1">
            <stop stopColor="#b8d9d6" stopOpacity=".65" />
            <stop offset="1" stopColor="#d7e6dc" stopOpacity=".4" />
          </linearGradient>
          <linearGradient id="optics-laser">
            <stop stopColor="#263d3a" />
            <stop offset=".5" stopColor="#627f76" />
            <stop offset="1" stopColor="#253e36" />
          </linearGradient>
          <marker
            id="optics-head"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
          </marker>
        </defs>
        <ellipse cx="320" cy="321" rx="277" ry="277" fill="#25493716" />
        <circle
          cx="320"
          cy="300"
          r="273"
          fill="url(#optics-metal)"
          stroke="#bbc3b6"
          strokeWidth="2"
        />
        <circle cx="320" cy="300" r="248" fill="#faf9ef" stroke="#b9c4b7" />
        <path d="M72 300A248 248 0 0 0 568 300Z" fill="url(#optics-glass)" />
        <path d="M70 300H570" stroke="#62928b" strokeWidth="2" />
        <path d="M320 49V553" stroke="#82978a" strokeDasharray="6 6" />
        <text x="329" y="75" fill="#5b7569" fontSize="14">
          法线
        </text>
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * 5 * Math.PI) / 180,
            r = i % 6 === 0 ? 226 : i % 2 === 0 ? 234 : 240;
          return (
            <line
              key={i}
              x1={320 + Math.sin(a) * r}
              y1={300 - Math.cos(a) * r}
              x2={320 + Math.sin(a) * 246}
              y2={300 - Math.cos(a) * 246}
              stroke="#778d7d"
              strokeWidth={i % 6 ? 1 : 2}
            />
          );
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const d = i * 30;
          return (
            <text
              key={d}
              x={320 + 208 * Math.sin(rad(d))}
              y={305 - 208 * Math.cos(rad(d))}
              textAnchor="middle"
              fontSize="12"
              fill="#587364"
            >
              {Math.min(d % 180, 180 - (d % 180))}°
            </text>
          );
        })}{" "}
        <text x="122" y="269" fontSize="14" fill="#567566">
          介质 1 · n₁ = {format(p.n1)}
        </text>
        <text x="118" y="337" fontSize="14" fill="#397c79">
          介质 2 · n₂ = {format(p.n2)}
        </text>
        <path
          d={`M${q.incident}L320 300`}
          stroke="#d1a142"
          strokeWidth="12"
          opacity=".14"
        />
        <path
          d={`M${q.incident}L320 300`}
          stroke="#b58426"
          strokeWidth="3"
          markerEnd="url(#optics-head)"
        />
        {reflected && p.n1 !== p.n2 && (
          <>
            <path
              d={`M320 300L${q.reflected}`}
              stroke="#c17b65"
              strokeWidth="10"
              opacity=".13"
            />
            <path
              d={`M320 300L${q.reflected}`}
              stroke="#b5664e"
              strokeWidth="2.5"
              markerEnd="url(#optics-head)"
            />
          </>
        )}
        {q.transmitted && (
          <>
            <path
              d={`M320 300L${q.transmitted}`}
              stroke="#449c9f"
              strokeWidth="12"
              opacity=".18"
            />
            <path
              d={`M320 300L${q.transmitted}`}
              stroke="#297f86"
              strokeWidth="3"
              markerEnd="url(#optics-head)"
            />
          </>
        )}
        <path
          d={arc(p.angle, 66)}
          stroke="#b58426"
          strokeWidth="2"
          fill="none"
        />
        {q.transmitted && (
          <path
            d={arc(q.angle, 78, true)}
            stroke="#297f86"
            strokeWidth="2"
            fill="none"
          />
        )}
        <circle cx="320" cy="300" r="4" fill="#fdfbee" stroke="#577462" />
        <g
          transform={`translate(${source}) rotate(${90 - p.angle})`}
          role="slider"
          tabIndex="0"
          aria-label="拖动光源调节入射角"
          aria-valuemin="0"
          aria-valuemax="89.9"
          aria-valuenow={p.angle}
          aria-valuetext={`${format(p.angle)}度`}
          onPointerDown={(e) => {
            drag.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={move}
          onPointerUp={(e) => {
            drag.current = false;
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={() => (drag.current = false)}
          onLostPointerCapture={() => (drag.current = false)}
          onKeyDown={(e) => {
            let val;
            if (e.key === "Home") val = 0;
            else if (e.key === "End") val = 89.9;
            else if (["ArrowLeft", "ArrowDown"].includes(e.key))
              val = Math.max(0, p.angle - 1);
            else if (["ArrowRight", "ArrowUp"].includes(e.key))
              val = Math.min(89.9, p.angle + 1);
            if (val !== undefined) {
              e.preventDefault();
              onChange("angle", val);
            }
          }}
        >
          <rect
            x="-38"
            y="-18"
            width="76"
            height="36"
            rx="8"
            fill="url(#optics-laser)"
            stroke="#304c40"
            strokeWidth="2"
          />
          <rect x="26" y="-13" width="16" height="26" rx="3" fill="#bdbca8" />
          <circle cx="4" cy="0" r="5" fill="#d4ae51" />
          <path d="M-25-10V10M-18-10V10" stroke="#a8b7a0" strokeWidth="2" />
        </g>
        <text x="320" y="590" textAnchor="middle" fill="#5b7263" fontSize="15">
          拖动光源转动光路 · 角度始终从法线量起
        </text>
      </svg>
      <aside className="refraction-guide">
        <span>光学观察台</span>
        <h3>
          {q.tir
            ? "全反射"
            : critical
              ? "临界掠射状态"
              : p.n1 === p.n2
                ? "同折射率 · 方向不变"
                : "折射与反射"}
        </h3>
        <div className="optics-readings">
          <strong>
            {format(p.angle)}°<small>入射角 i</small>
          </strong>
          <strong>
            {q.tir ? "—" : `${format(q.angle)}°`}
            <small>折射角 r</small>
          </strong>
        </div>
        <p className="optics-equation">n₁ sin i = n₂ sin r</p>
        <p>
          {q.tir
            ? "入射角大于临界角，没有传播到介质 2 的折射光线。"
            : critical
              ? "折射角为 90°，图示为沿界面的掠射极限；继续增加入射角进入全反射。"
              : p.n2 > p.n1
                ? "进入折射率更大的介质，折射光靠近法线。"
                : p.n2 < p.n1
                  ? "进入折射率更小的介质，折射光远离法线。"
                  : "两侧折射率相同，模型中不出现界面反射。"}
        </p>
        <div className="optics-scenarios">
          <button
            onClick={() => {
              onChange("n1", 1);
              onChange("n2", 1.33);
            }}
          >
            空气 → 水
          </button>
          <button
            onClick={() => {
              onChange("n1", 1.5);
              onChange("n2", 1);
            }}
          >
            玻璃 → 空气
          </button>
          <button
            disabled={q.critical === null}
            onClick={() => onChange("angle", q.critical)}
          >
            定位临界角
          </button>
        </div>
        <p>
          {q.critical === null
            ? "此方向不满足全反射的介质条件。"
            : `临界角 θc ≈ ${q.critical.toFixed(2)}°；sin θc = n₂/n₁。`}
        </p>
        <div className="refraction-reverse-study">
          <button
            disabled={q.tir || q.angle > 89.9}
            onClick={() => onChange("reverseRay", 1)}
          >
            沿折射光反向验证
          </button>
          <p>
            {q.tir
              ? "没有传播折射光，不能从该路径反向验证。"
              : q.angle > 89.9
                ? "掠射对应90°，超出本台89.9°入射范围；先略微减小入射角。"
                : "交换两侧介质，同时让原折射角成为入射角；新的折射角应等于原入射角。"}
          </p>
          <p>
            图形会按统一入射方向重新排布，观察角度互换；这不是保持入射角不变的介质切换。
          </p>
        </div>
        <label className="optics-checkbox">
          <input
            type="checkbox"
            checked={reflected}
            onChange={(e) => setReflected(e.target.checked)}
          />
          显示反射光路
        </label>
        <p className="optics-legend">金色：入射　赭色：反射　青色：折射</p>
        <details>
          <summary>模型与真实实验的区别</summary>
          <p>
            光线颜色仅用于区分路径，不表示波长改变。介质折射率为常数；忽略色散、吸收和偏振，未计算反射/透射能量比例，线宽不表示光强。圆盘为量角辅助，外围不再计算额外界面折射。
          </p>
        </details>
      </aside>
      <RefractionPlot p={p} onChange={onChange} />
      {chapter === 5 && <ApparentDepth p={p} onChange={onChange} />}
    </div>
  );
}
