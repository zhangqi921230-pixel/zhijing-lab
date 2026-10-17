import React, { useId } from "react";
import { areaCutState, hydraulicState } from "./discoveryModels.mjs";
import { hydraulicGeometry } from "./hydraulicGeometry.mjs";
export default function DiscoveryScene({ id, p, time, guides = true }) {
  const uid = useId().replace(/:/g, "");
  const ink = "var(--ui-ink)",
    muted = "var(--ui-muted)",
    accent = "var(--ui-primary)",
    line = "var(--ui-line)";
  const math = id === "area-cut",
    q = math ? areaCutState(p, time) : hydraulicState(p, time);
  const scale = 55,
    b = p.base * scale,
    h = p.height * scale,
    d = p.shear * scale;
  const geometry = math ? null : hydraulicGeometry(p, time);
  const sy = geometry?.inputY,
    oy = geometry?.outputY,
    w = geometry?.outputWidth;
  return (
    <svg
      className="motion-diagram"
      viewBox={math ? "0 0 900 680" : "0 0 900 600"}
      role="img"
      aria-label={
        math
          ? "平行四边形剪拼成矩形，底和高保持不变"
          : "密闭液压机的活塞、液体与力和位移"
      }
      style={{
        width: "100%",
        display: "block",
        fill: ink,
        fontSize: 18,
        fontFamily: "Microsoft YaHei, sans-serif",
      }}
    >
      <defs>
        <linearGradient id={`fluid-${uid}`} x2="0" y2="1">
          <stop stopColor="#5dbbcb" stopOpacity=".65" />
          <stop offset="1" stopColor="#19748e" stopOpacity=".85" />
        </linearGradient>
        <linearGradient id={`piston-${uid}`}>
          <stop stopColor="#738b94" />
          <stop offset=".5" stopColor="#d8e4e4" />
          <stop offset="1" stopColor="#738b94" />
        </linearGradient>
        <pattern
          id={`swept-${uid}`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-2 2L2-2M0 8L8 0M6 10L10 6"
            stroke="var(--ui-gold)"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      {math ? (
        <>
          <text x="40" y="48">
            剪开 · 平移 · 补齐
          </text>
          <text x="40" y="82" fill={muted}>
            先移出，再向右平移，最后归位；每一步都保持形状与面积
          </text>
          <g transform="translate(180 300)">
            {Array.from({ length: 10 }, (_, i) => (
              <path key={i} d={`M${i * scale} 20V-175`} stroke={line} />
            ))}
            <polygon
              points={`0,0 ${b},0 ${b + d},${-h} ${d},${-h}`}
              fill="none"
              stroke={muted}
              strokeDasharray="7 6"
              strokeWidth="2"
            />
            <polygon
              points={`${d},0 ${b},0 ${b + d},${-h} ${d},${-h}`}
              fill={accent}
              fillOpacity=".24"
              stroke={accent}
              strokeWidth="3"
            />
            <polygon
              data-piece="triangle"
              points={`0,0 ${d},0 ${d},${-h}`}
              transform={`translate(${q.shift * scale} ${q.drop * scale})`}
              fill="#d8a345"
              fillOpacity=".65"
              stroke="#a66d1c"
              strokeWidth="3"
            />
            {guides && (
              <>
                <path
                  d={`M${d} 0V${-h}M${d} -16h16v16M0 230H${b}`}
                  fill="none"
                  stroke={ink}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <text x={d + 22} y={-h / 2}>
                  高 {p.height}
                </text>
                <text x={b / 2} y="258" textAnchor="middle">
                  底 {p.base}
                </text>
              </>
            )}
          </g>
          <g transform="translate(670 180)">
            <rect
              width="190"
              height="160"
              rx="8"
              fill="var(--ui-surface)"
              stroke={line}
            />
            <text x="16" y="32" fill={muted}>
              当前步骤
            </text>
            <text x="16" y="68">
              {q.stage}
            </text>
            <text x="16" y="108" fill={muted}>
              两块面积之和
            </text>
            <text x="16" y="140" fontSize="26">
              {q.area.toFixed(2)}
            </text>
          </g>
          <text x="40" y="605">
            {time >= 6
              ? "矩形已拼成：面积 = 底 × 高"
              : time === 0
                ? "从左上顶点向底边作垂线，确定剪切位置"
                : "追踪金色块：先移出原图形，再平移到右侧，最后补齐"}
          </text>
          <text x="40" y="650" fill={muted}>
            两块面积之和：{q.triangle.toFixed(2)} +{" "}
            {(q.area - q.triangle).toFixed(2)} = {q.area.toFixed(2)}
          </text>
        </>
      ) : (
        <>
          <text x="40" y="48">
            输入端 ↓　密闭液体　↑ 输出端
          </text>
          <text x="40" y="82" fill={muted}>
            同一压强增量 · 体积守恒 · 理想准静态运动
          </text>
          <path
            d={`M190 ${sy}H222V380H490V${oy}H${490 + w}V430H190Z`}
            fill={`url(#fluid-${uid})`}
          />
          <path
            d={`M182 126V438H${498 + w}V126M230 126V372H482V126`}
            fill="none"
            stroke={line}
            strokeWidth="9"
          />
          <rect
            x="170"
            y="439"
            width={344 + w}
            height="13"
            rx="3"
            fill={`url(#piston-${uid})`}
            stroke={muted}
          />
          {[178, 234, 478, 502 + w].map((x, i) => (
            <g key={i}>
              <rect
                x={x - 8}
                y="115"
                width="16"
                height="14"
                rx="2"
                fill={`url(#piston-${uid})`}
                stroke={muted}
              />
              <path d={`M${x - 3} 122h6`} stroke={ink} />
            </g>
          ))}
          {guides && (
            <g aria-label="两端活塞扫过的等体积区域">
              <rect
                data-testid="hydraulic-input-sweep"
                x="190"
                y={geometry.start}
                width="32"
                height={geometry.inputHeight}
                fill={`url(#swept-${uid})`}
                stroke="var(--ui-gold)"
              />
              <rect
                data-testid="hydraulic-output-sweep"
                x="490"
                y={oy}
                width={w}
                height={geometry.outputHeight}
                fill={`url(#swept-${uid})`}
                stroke="var(--ui-gold)"
              />
            </g>
          )}
          <path
            d={`M190 120V430H${490 + w}V120M222 120V380H490V120`}
            stroke={muted}
            strokeWidth="5"
            fill="none"
          />
          <rect
            x="188"
            y={sy - 14}
            width="36"
            height="14"
            rx="2"
            fill={`url(#piston-${uid})`}
            stroke={ink}
          />
          <rect
            x="488"
            y={oy - 14}
            width={w + 4}
            height="14"
            rx="2"
            fill={`url(#piston-${uid})`}
            stroke={ink}
          />
          <path
            d={`M206 ${sy - 14}v-50M${490 + w / 2} ${oy - 14}v-25`}
            stroke={muted}
            strokeWidth="12"
          />
          <rect
            x={490 + w / 2 - 34}
            y={oy - 60}
            width="68"
            height="26"
            rx="3"
            fill="var(--ui-selected)"
            stroke={ink}
          />
          <path
            d={`M190 ${sy - 5}H222M490 ${oy - 5}H${490 + w}`}
            stroke={ink}
            strokeWidth="3"
          />
          <text x="55" y="160">
            F₁ = {p.force} N
          </text>
          <text x="780" y="160">
            F₂ = {q.outputForce} N
          </text>
          <text x="55" y="330">
            下压 {q.distance.toFixed(2)} cm
          </text>
          <text x={490 + w / 2} y="330" textAnchor="middle">
            上升 {q.outputDistance.toFixed(2)} cm
          </text>
          {guides && (
            <>
              <path
                d={`M175 ${geometry.start}H240M480 ${geometry.start}H${500 + w}`}
                stroke={muted}
                strokeDasharray="6 5"
              />
              <path
                d={`M160 ${sy - 65}v40l-6 -9m6 9l6 -9M${510 + w} ${oy}v-40l-6 9m6 -9l6 9`}
                stroke={accent}
                strokeWidth="3"
                fill="none"
              />
              <path
                d={`M240 ${geometry.start}L258 ${geometry.start - 10}`}
                stroke={muted}
                fill="none"
              />
              <text x="265" y={geometry.start - 10} fontSize="16">
                虚线：起始位置
              </text>
              <path
                d={`M248 ${geometry.start}v${geometry.inputHeight}m-4 0h8M${510 + w} ${oy}v${geometry.outputHeight}m-4 0h8`}
                stroke="var(--ui-gold)"
                fill="none"
              />
            </>
          )}
          <text x="40" y="480">
            A₁ = 10 cm²　　A₂ = {10 * p.ratio} cm²　　转移体积{" "}
            {q.volume.toFixed(1)} cm³
          </text>
          <text x="40" y="522" fill={muted}>
            输入功 {q.work.toFixed(2)} J = 输出功 {q.work.toFixed(2)} J
          </text>
          {guides && (
            <text x="40" y="565" fontSize="16" fill={muted}>
              斜线区域比较活塞扫过的体积，不是染色液滴；小缸排出量 =
              大缸新增量。
            </text>
          )}
        </>
      )}
    </svg>
  );
}
