import LeverWorkStudy from "./LeverWorkStudy.jsx";
import LeverForceAngle from "./LeverForceAngle.jsx";
import React, { useRef } from "react";
import { leverState, leverPoint } from "./leverModel.mjs";
import { format } from "./models.mjs";
import LeverBalanceStudy from "./LeverBalanceStudy.jsx";
export default function LeverScene({ p, t, onChange, chapter = 0 }) {
  const svg = useRef(null),
    drag = useRef(null),
    q = leverState(p, t),
    balanced = Math.abs(q.leftTorque - q.rightTorque) < 1e-8;
  function move(e) {
    if (!drag.current) return;
    const matrix = svg.current.getScreenCTM();
    if (!matrix) return;
    const xy = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      matrix.inverse(),
    );
    const dist = Math.max(
      0.2,
      Math.min(2, Math.round((Math.abs(xy.x - 360) / 140) * 10) / 10),
    );
    onChange(drag.current, dist);
  }
  const target = (p.f1 * p.l1) / p.l2;
  function handle(side) {
    const key = side ? "l2" : "l1";
    return {
      role: "slider",
      tabIndex: 0,
      "aria-label": side ? "拖动右侧载荷位置" : "拖动左侧载荷位置",
      "aria-valuemin": 0.2,
      "aria-valuemax": 2,
      "aria-valuenow": p[key],
      onPointerDown: (e) => {
        drag.current = key;
        e.currentTarget.setPointerCapture(e.pointerId);
        onChange(key, p[key]);
      },
      onPointerMove: move,
      onPointerUp: (e) => {
        drag.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
      },
      onPointerCancel: () => {
        drag.current = null;
      },
      onLostPointerCapture: () => {
        drag.current = null;
      },
      onKeyDown: (e) => {
        let value;
        if (e.key === "Home") value = 0.2;
        else if (e.key === "End") value = 2;
        else if (["ArrowLeft", "ArrowDown"].includes(e.key))
          value = Math.max(0.2, p[key] - 0.1);
        else if (["ArrowRight", "ArrowUp"].includes(e.key))
          value = Math.min(2, p[key] + 0.1);
        if (value !== undefined) {
          e.preventDefault();
          onChange(key, Math.round(value * 10) / 10);
        }
      },
    };
  }
  return (
    <div className="lever-workspace">
      <svg
        ref={svg}
        viewBox="0 0 720 560"
        role="img"
        aria-label="带固定载荷与机械限位的杠杆实验台"
      >
        <defs>
          <linearGradient id="lever-steel">
            <stop stopColor="#50675d" />
            <stop offset=".35" stopColor="#dce4d8" />
            <stop offset=".65" stopColor="#819788" />
            <stop offset="1" stopColor="#344f43" />
          </linearGradient>
          <linearGradient id="lever-brass" x2="0" y2="1">
            <stop stopColor="#e6d4a1" />
            <stop offset=".4" stopColor="#b69357" />
            <stop offset="1" stopColor="#836733" />
          </linearGradient>
          <marker
            id="lever-force"
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
        <ellipse cx="360" cy="490" rx="230" ry="25" fill="#29473816" />
        <path
          d="M190 465L240 438H480L530 465V481H190Z"
          fill="url(#lever-steel)"
          stroke="#5f7867"
        />
        <rect
          x="345"
          y="276"
          width="30"
          height="170"
          rx="4"
          fill="url(#lever-steel)"
        />
        <circle
          cx="360"
          cy="270"
          r="66"
          fill="#d5dcce"
          stroke="#829684"
          strokeWidth="2"
        />
        <path
          d="M305 250A58 58 0 0 0 305 290M415 250A58 58 0 0 1 415 290"
          stroke="#6a7d6b"
          strokeWidth="5"
          fill="none"
        />
        {[-1, 1].map((sign) => (
          <circle
            key={sign}
            cx={360 + 55 * Math.cos(Math.PI / 9) - 18 * Math.sin(Math.PI / 9)}
            cy={
              270 +
              sign * (55 * Math.sin(Math.PI / 9) + 18 * Math.cos(Math.PI / 9))
            }
            r="6"
            fill="#354f43"
          />
        ))}
        <path d="M60 270H660" stroke="#bbc6b5" strokeDasharray="5 6" />
        <g transform={`rotate(${-q.angle} 360 270)`}>
          <rect
            x="63"
            y="258"
            width="594"
            height="24"
            rx="5"
            fill="url(#lever-brass)"
            stroke="#8e713f"
          />
          {Array.from({ length: 41 }, (_, i) => (
            <g key={i}>
              <line
                x1={80 + i * 14}
                y1="258"
                x2={80 + i * 14}
                y2={i % 5 ? 264 : 270}
                stroke="#6a572f"
              />
              {i % 5 === 0 && (
                <text
                  x={80 + i * 14}
                  y="249"
                  textAnchor="middle"
                  fontSize="13"
                  fill="#6c754f"
                >
                  {Math.abs(i - 20) / 10}
                </text>
              )}
            </g>
          ))}
          {[0, 1].map((side) => {
            const force = side ? p.f2 : p.f1,
              x = 360 + (side ? 1 : -1) * (side ? p.l2 : p.l1) * 140;
            return (
              <g key={side} transform={`translate(${x} 270)`} {...handle(side)}>
                <rect
                  x="-19"
                  y="-31"
                  width="38"
                  height="62"
                  rx="7"
                  fill={side ? "#c5a566" : "#4b8584"}
                  stroke={side ? "#967333" : "#2c6364"}
                  strokeWidth="3"
                />
                <circle cy="-21" r="5" fill="#e5e4d2" stroke="#556d5b" />
                <path d="M-3-21H3M0-24V-18" stroke="#56665b" />
                <text
                  y="7"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="16"
                  fontWeight="600"
                >
                  {format(force)}
                </text>
                <text y="23" textAnchor="middle" fill="#fff" fontSize="10">
                  N
                </text>
              </g>
            );
          })}
        </g>
        <circle
          cx="360"
          cy="270"
          r="12"
          fill="url(#lever-steel)"
          stroke="#4d6c59"
        />
        <circle cx="360" cy="270" r="4" fill="#293f34" />
        {[0, 1].map((side) => {
          const [x, y] = leverPoint(
              (side ? 1 : -1) * (side ? p.l2 : p.l1),
              q.theta,
            ),
            force = side ? p.f2 : p.f1,
            color = side ? "#9d782f" : "#287c7c";
          return (
            <g key={side}>
              <path
                d={`M${x} ${y + 34}v${force * 4}`}
                stroke={color}
                strokeWidth="3"
                markerEnd="url(#lever-force)"
              />
              <path
                d={`M${x} ${y - 36}V${side ? 120 : 150}H360`}
                fill="none"
                stroke={color}
                strokeDasharray="4 4"
              />
              <text
                x={(x + 360) / 2}
                y={side ? 107 : 137}
                textAnchor="middle"
                fill={color}
                fontSize="16"
              >
                力臂 {format(side ? q.rightArm : q.leftArm)} m
              </text>
            </g>
          );
        })}
        <text x="360" y="45" textAnchor="middle" fill="#5d7765" fontSize="16">
          可调固定载荷 · 水平参考线 · ±20° 机械限位
        </text>
        <text x="360" y="523" textAnchor="middle" fill="#5d7765" fontSize="16">
          拖动载荷调整距离；播放观察释放后的运动
        </text>
      </svg>
      <aside className="lever-guide">
        <span>力矩与运动</span>
        <h3>
          {balanced
            ? "力矩平衡"
            : q.stopped
              ? "抵达机械限位"
              : t === 0
                ? "水平释放起点"
                : q.angle > 0
                  ? "左侧下降"
                  : "右侧下降"}
        </h3>
        <div className="lever-torques">
          <div>
            <span>左侧 · 逆时针</span>
            <strong>
              {format(q.leftTorque)}
              <small>N·m</small>
            </strong>
            <i style={{ width: `${(q.leftTorque / 40) * 100}%` }} />
          </div>
          <div>
            <span>右侧 · 顺时针</span>
            <strong>
              {format(q.rightTorque)}
              <small>N·m</small>
            </strong>
            <i style={{ width: `${(q.rightTorque / 40) * 100}%` }} />
          </div>
        </div>
        <p>
          转角 {format(q.angle)}°<br />
          角速度 {format(q.omega)} rad/s
          <br />
          当前角加速度 {format(q.alpha)} rad/s²
        </p>
        <p>
          {balanced
            ? "两侧重力矩相等，从静止释放后保持水平。"
            : q.stopped
              ? `限位约束力矩 ${format(Math.abs(q.stopTorque))} N·m（${q.stopTorque < 0 ? "顺时针" : "逆时针"}），阻止继续转动。`
              : `释放时${p.f1 * p.l1 > p.f2 * p.l2 ? "左" : "右"}侧重力矩更大，向该侧下降。`}
        </p>
        <button
          disabled={target < 1 || target > 20}
          onClick={() => onChange("f2", target)}
        >
          令右侧作用力为 {format(target)} N，达到平衡
        </button>
        <p>倾斜时力臂 = 支点距离 × cosθ，不能直接把杆上距离当力臂。</p>
        <details>
          <summary>动力学模型与边界</summary>
          <p>
            载荷刚性固定，以载荷中心的集中质量 F/g
            建模；忽略杆重、载荷自身转动惯量和轴摩擦。转动惯量 I = m₁d₁² +
            m₂d₂²，Iα =
            (F₁d₁−F₂d₂)cosθ。限位碰撞采用瞬时非弹性停止，不求解冲击峰值。调整参数或拖动载荷会回到水平释放起点。
          </p>
        </details>
      </aside>
      {chapter === 0 ? (
        <LeverForceAngle p={p} />
      ) : chapter === 2 ? (
        <LeverWorkStudy p={p} onChange={onChange} />
      ) : (
        <LeverBalanceStudy p={p} q={q} onChange={onChange} />
      )}
    </div>
  );
}
