import React, { useRef, useState } from "react";
import ProjectileLauncher from "./ProjectileLauncher.jsx";
import ProjectileComparison from "./ProjectileComparison.jsx";
import { projectile, format, rad } from "./models.mjs";
export const projectileLanded = (flight, t) => flight > 0 && t >= flight - 1e-9;
export function projectileLayout(p) {
  const q = projectile(p, 0),
    scale = Math.min(
      580 / Math.max(10, q.range * 1.12),
      330 / Math.max(5, q.maxHeight * 1.15),
    );
  return {
    scale,
    point: (x, y) => [80 + x * scale, 430 - y * scale],
    samples: Array.from({ length: q.flight ? 13 : 1 }, (_, i) =>
      projectile(p, (q.flight * i) / 12),
    ),
    dt: q.flight / 12,
  };
}
export default function ProjectileScene({ p, t, onChange, onSeek }) {
  const svg = useRef(null),
    drag = useRef(false),
    [ghosts, setGhosts] = useState(true),
    [vectors, setVectors] = useState(true),
    [components, setComponents] = useState(true),
    q = projectile(p, t),
    layout = projectileLayout(p),
    point = layout.point,
    [x, y] = point(q.x, q.y),
    [sx, sy] = point(0, p.height),
    landed = projectileLanded(q.flight, t),
    scale = layout.scale,
    velocityScale = Math.min(3, 65 / Math.sqrt(p.speed ** 2 + 19.6 * p.height)),
    aim = [sx + 65 * Math.cos(rad(p.angle)), sy - 65 * Math.sin(rad(p.angle))];
  function move(e) {
    if (!drag.current) return;
    const m = svg.current.getScreenCTM();
    if (!m) return;
    const xy = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    onChange(
      "angle",
      Math.max(
        0,
        Math.min(
          75,
          Math.round((Math.atan2(sy - xy.y, xy.x - sx) * 180) / Math.PI),
        ),
      ),
    );
  }
  const path = Array.from({ length: 121 }, (_, i) => {
      const r = projectile(p, (q.flight * i) / 120);
      return `${i ? "L" : "M"}${point(r.x, r.y)}`;
    }).join(" "),
    step = scale > 25 ? 2 : scale > 12 ? 5 : 10;
  return (
    <div className="projectile-workspace">
      <svg
        ref={svg}
        viewBox="0 0 720 540"
        role="img"
        aria-label="同尺度坐标中的抛体轨迹、等时间标记与速度分解"
      >
        <defs>
          <linearGradient id="flight-wall" x2="0" y2="1">
            <stop stopColor="#f9faf2" />
            <stop offset="1" stopColor="#e7eee0" />
          </linearGradient>
          <linearGradient id="flight-metal">
            <stop stopColor="#2d4e47" />
            <stop offset=".5" stopColor="#9db1a1" />
            <stop offset="1" stopColor="#38584a" />
          </linearGradient>
          <radialGradient id="flight-ball" cx="30%" cy="25%">
            <stop stopColor="#fae9b6" />
            <stop offset=".6" stopColor="#d4ad5a" />
            <stop offset="1" stopColor="#997235" />
          </radialGradient>
          <marker
            id="flight-arrow"
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
        <rect
          x="40"
          y="38"
          width="650"
          height="432"
          rx="14"
          fill="url(#flight-wall)"
          stroke="#d9dfcf"
        />
        {Array.from({ length: Math.floor(580 / scale / step) + 1 }, (_, i) => (
          <g key={i}>
            <path
              d={`M${80 + i * step * scale} 68V430`}
              stroke="#cdd8c6"
              strokeDasharray="3 5"
            />
            <text
              x={80 + i * step * scale}
              y="453"
              textAnchor="middle"
              fontSize="13"
              fill="#607c64"
            >
              {i * step}
            </text>
          </g>
        ))}
        {Array.from({ length: Math.floor(350 / scale / step) + 1 }, (_, i) => (
          <g key={i}>
            <path
              d={`M80 ${430 - i * step * scale}H660`}
              stroke="#cdd8c6"
              strokeDasharray="3 5"
            />
            <text
              x="68"
              y={435 - i * step * scale}
              textAnchor="end"
              fontSize="13"
              fill="#607c64"
            >
              {i * step}
            </text>
          </g>
        ))}
        <path d="M80 60V430H678" fill="none" stroke="#79947e" strokeWidth="2" />
        <path d="M80 474H671" stroke="#afba9e" strokeWidth="7" />
        <text x="51" y="57" fill="#5a755f" fontSize="14">
          y / m
        </text>
        <text x="657" y="462" fill="#5a755f" fontSize="14">
          x / m
        </text>
        <path
          d={path}
          fill="none"
          stroke="#91a691"
          strokeDasharray="5 6"
          strokeWidth="2"
        />
        {ghosts &&
          layout.samples.map((r, i) => {
            const [a, b] = point(r.x, r.y);
            return (
              <circle
                key={i}
                cx={a}
                cy={b}
                r="4"
                fill={i * layout.dt <= t ? "#548b77" : "#c7d1bc"}
                stroke="#fff"
              />
            );
          })}
        {p.angle > 0 && (
          <g>
            <path
              d={`M${point((q.vx * p.speed * Math.sin(rad(p.angle))) / 9.8, q.maxHeight)}v20`}
              stroke="#b69547"
            />
            <text
              x={
                point(
                  (q.vx * p.speed * Math.sin(rad(p.angle))) / 9.8,
                  q.maxHeight,
                )[0]
              }
              y={point(0, q.maxHeight)[1] - 12}
              textAnchor="middle"
              fontSize="13"
              fill="#91753d"
            >
              最高点 {format(q.maxHeight)} m
            </text>
          </g>
        )}
        <ProjectileLauncher x={sx} y={sy} angle={p.angle} />
        {t === 0 && (
          <g
            role="slider"
            tabIndex="0"
            aria-label="拖动发射方向"
            aria-valuemin="0"
            aria-valuemax="75"
            aria-valuenow={p.angle}
            onPointerDown={(e) => {
              drag.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={move}
            onPointerUp={(e) => {
              drag.current = false;
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onPointerCancel={() => {
              drag.current = false;
            }}
            onLostPointerCapture={() => {
              drag.current = false;
            }}
            onKeyDown={(e) => {
              let val;
              if (e.key === "Home") val = 0;
              else if (e.key === "End") val = 75;
              else if (["ArrowLeft", "ArrowDown"].includes(e.key))
                val = Math.max(0, p.angle - 1);
              else if (["ArrowRight", "ArrowUp"].includes(e.key))
                val = Math.min(75, p.angle + 1);
              if (val !== undefined) {
                e.preventDefault();
                onChange("angle", val);
              }
            }}
          >
            <path
              d={`M${sx} ${sy}L${aim}`}
              stroke="#6c9075"
              strokeDasharray="3 4"
            />
            <circle
              cx={aim[0]}
              cy={aim[1]}
              r="13"
              fill="#edf4e5"
              stroke="#3f7d64"
              strokeWidth="2"
            />
            <path
              d={`M${aim[0] - 6} ${aim[1]}h12M${aim[0]} ${aim[1] - 6}v12`}
              stroke="#3f7d64"
            />
          </g>
        )}
        {components && (
          <g>
            <path
              d={`M80 ${y}H${x}V430`}
              fill="none"
              stroke="#73a8a1"
              strokeDasharray="3 5"
            />
            <circle cx="80" cy={y} r="6" fill="#60949c" opacity=".7" />
            <circle cx={x} cy="430" r="6" fill="#b39953" opacity=".7" />
          </g>
        )}
        {vectors && q.flight > 0 && (
          <g strokeDasharray={landed ? "4 3" : undefined}>
            <path
              d={`M${x} ${y}h${q.vx * velocityScale}`}
              stroke="#b28a35"
              strokeWidth="2.5"
              markerEnd="url(#flight-arrow)"
            />
            {Math.abs(q.vy) > 0.001 && (
              <path
                d={`M${x} ${y}v${-q.vy * velocityScale}`}
                stroke="#438797"
                strokeWidth="2.5"
                markerEnd="url(#flight-arrow)"
              />
            )}
          </g>
        )}
        <circle cx={x} cy={y} r="9" fill="url(#flight-ball)" stroke="#947238" />
        <text
          x="360"
          y="510"
          textAnchor="middle"
          fontSize="15"
          fill="var(--ui-ink)"
        >
          横纵轴采用相同比例 · 等时间间隔 Δt = {format(layout.dt)} s
        </text>
      </svg>
      <aside className="projectile-guide">
        <span>运动的合成</span>
        <h3>
          {q.flight === 0
            ? "地面水平初态"
            : landed
              ? "到达地面"
              : t === 0
                ? "准备发射"
                : Math.abs(q.vy) < 1e-8
                  ? "到达最高点"
                  : q.vy > 0
                    ? "上升阶段"
                    : "下降阶段"}
        </h3>
        <div className="flight-values">
          <strong>
            {format(Math.min(t, q.flight))}
            <small>时间 / s</small>
          </strong>
          <strong>
            {format(q.range)}
            <small>射程 / m</small>
          </strong>
        </div>
        <p>
          水平速度 vx = {format(q.vx)} m/s
          <br />
          {landed ? "落地前竖直速度" : "竖直速度"} vy = {format(q.vy)} m/s
          <br />
          重力加速度 g = 9.8 m/s²
        </p>
        <p className="flight-equation">
          x = v₀ cosθ · t<br />y = h + v₀ sinθ · t − ½gt²
        </p>
        <label>
          <input
            type="checkbox"
            checked={ghosts}
            onChange={(e) => setGhosts(e.target.checked)}
          />
          等时间位置标记
        </label>
        <label>
          <input
            type="checkbox"
            checked={vectors}
            onChange={(e) => setVectors(e.target.checked)}
          />
          速度分量（同一标尺）
        </label>
        <label>
          <input
            type="checkbox"
            checked={components}
            onChange={(e) => setComponents(e.target.checked)}
          />
          水平与竖直分运动
        </label>
        <button onClick={() => onChange("angle", 0)}>切换为平抛</button>
        <p>
          {q.flight === 0
            ? "理想质点位于地面且竖直初速度为零，无空中飞行阶段。提高发射高度后观察平抛。"
            : landed
              ? "地面接触后画面冻结；虚线箭头保留碰撞前速度，不代表碰撞后仍在运动。"
              : "观察同一时间内的水平间距，比较竖直位置变化。浅色完整轨迹用于预测，实色标记表示已走过。"}
        </p>
        <details>
          <summary>模型与显示比例</summary>
          <p>
            忽略空气阻力；球心为质点，不模拟落地碰撞与反弹。器材和球的外形为操作示意，不按坐标比例表达其真实尺寸；轨迹与坐标严格同尺度。金色为水平速度、蓝色为竖直速度。
          </p>
        </details>
      </aside>
      <ProjectileComparison
        p={{ ...p, gravity: 9.8 }}
        onSeek={onSeek}
        timelineDuration={q.flight}
        currentTime={Math.min(t, q.flight)}
      />
    </div>
  );
}
