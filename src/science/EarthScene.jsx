import React, { useState, useId } from "react";
import Button from "../LabButton.jsx";
export function EarthDiagram({ id, value = 30 }) {
  const uid = useId().replaceAll(":", ""),
    p = value / 100;
  let body;
  const text = (x, y, s) => (
    <text x={x} y={y} fill="#e6eff0">
      {s}
    </text>
  );
  if (id === "salty-sea")
    body = (
      <>
        <path d="M0 250L130 80 280 250V450H0Z" fill="#6f7c73" />
        <path
          d="M120 160Q80 290 310 300T800 280V450H310Q160 340 120 160"
          fill="#6da8bd"
        />
        {Array.from({ length: 16 }, (_, i) => (
          <circle
            key={i}
            cx={330 + i * 25}
            cy={350 + Math.sin(i) * 30}
            r="5"
            fill="#f5d59c"
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            d={`M${390 + i * 40} 270q-15 -40 0 -${40 + p * 100}`}
            fill="none"
            stroke="#b4dce8"
            strokeWidth="3"
          />
        ))}
        {text(30, 40, "河流送来溶解物质")}
        {text(410, 120, "蒸发主要带走水")}
        {text(390, 410, "大多数溶解盐留在水中")}
      </>
    );
  else if (id === "tides") {
    const a = p * Math.PI * 2,
      mx = 400 + 240 * Math.cos(a),
      my = 220 + 145 * Math.sin(a);
    body = (
      <>
        <ellipse
          cx="400"
          cy="220"
          rx="115"
          ry="84"
          fill="#5ea7bc"
          transform={`rotate(${p * 360} 400 220)`}
        />
        <circle cx="400" cy="220" r="78" fill="#6d9174" />
        <circle cx={mx} cy={my} r="23" fill="#d8d4c6" />
        <path
          d={`M400 220L${mx} ${my}`}
          stroke="#d3bd85"
          strokeDasharray="8 8"
        />
        {text(35, 42, "简化的潮汐作用方向")}
        {text(35, 405, "真实海盆有惯性、摩擦与复杂地形；本图不计算当地潮位")}
      </>
    );
  } else if (id === "waves") {
    const phase = p * Math.PI * 2;
    const curve = Array.from(
      { length: 161 },
      (_, i) => `${i * 5},${210 + 35 * Math.sin((i * 5) / 65 - phase)}`,
    ).join(" ");
    body = (
      <>
        <path
          d={`M0 450V210L${curve.replaceAll(" ", " L")}V450Z`}
          fill="#427f9e"
        />
        <polyline points={curve} fill="none" stroke="#b2dae6" strokeWidth="4" />
        <ellipse
          cx="400"
          cy="270"
          rx="35"
          ry="35"
          fill="none"
          stroke="#abc8d0"
          strokeDasharray="4 5"
        />
        <circle
          cx={400 + 35 * Math.cos(phase)}
          cy={270 + 35 * Math.sin(phase)}
          r="9"
          fill="#e8be6c"
        />
        <path
          d="M500 100H680L665 90M680 100L665 110"
          stroke="#e9c883"
          fill="none"
          strokeWidth="3"
        />
        {text(480, 75, "波形传播方向")}
        {text(35, 405, "金色点：局部水体的理想化轨迹；非同一波峰")}
      </>
    );
  } else if (id === "meanders") {
    const a = 40 + p * 75;
    const d = `M70 220C130 ${220 - a * 1.6} 200 ${220 - a * 1.6} 250 220S390 ${220 + a * 1.6} 450 220S590 ${220 - a * 1.6} 650 220L750 255`;
    body = (
      <>
        <path d={d} fill="none" stroke="#c8bc98" strokeWidth="105" />
        <path d={d} fill="none" stroke="#68a6ba" strokeWidth="70" />
        {text(125, 70, "外弯：侵蚀")}
        {text(320, 385, "内弯：沉积")}
        {text(35, 425, "典型弯道迁移示意；不同岸材和洪水条件会改变结果")}
      </>
    );
  } else if (id === "pebbles") {
    body = (
      <>
        {[0, 1, 2].map((n) => {
          const r = 75 - n * 15;
          const pts = Array.from({ length: 10 }, (_, i) => {
            const a = (i * Math.PI) / 5,
              rad = r * (1 - (1 - p) * (i % 2) * 0.3);
            return `${170 + n * 235 + Math.cos(a) * rad},${230 + Math.sin(a) * rad}`;
          }).join(" ");
          return (
            <g key={n}>
              <polygon
                points={pts}
                fill={["#a89782", "#c0ae8f", "#c4b58f"][n]}
                stroke="#e0d3b8"
                strokeWidth="3"
              />
              {text(
                130 + n * 235,
                355,
                ["较大碎屑", "磨蚀颗粒", "较细颗粒"][n],
              )}
            </g>
          );
        })}
        {text(35, 42, "搬运与磨蚀：棱角通常逐渐减少")}
        {text(35, 420, "粒度与圆度不直接表示唯一的来源和年龄")}
      </>
    );
  } else if (id === "groundwater") {
    body = (
      <>
        <rect
          x="60"
          y="110"
          width="680"
          height="270"
          fill={p > 0.5 ? "#599bb4" : "#475c66"}
        />
        {Array.from({ length: 42 }, (_, i) => (
          <circle
            key={i}
            cx={95 + (i % 9) * 75}
            cy={145 + Math.floor(i / 9) * 52}
            r="24"
            fill="#b7ad96"
            stroke="#d8cfb5"
            strokeWidth="3"
          />
        ))}
        {p > 0.5 ? (
          <path
            d="M75 190H720M75 295H720"
            stroke="#a9dfe8"
            strokeWidth="3"
            strokeDasharray="7 9"
          />
        ) : (
          Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={120 + i * 110} cy="235" r="11" fill="#81bccc" />
          ))
        )}
        {text(
          35,
          50,
          p > 0.5 ? "相连的空隙可让水通过" : "孤立孔隙不形成贯通水路",
        )}
        {text(35, 420, "灰色：颗粒骨架 · 蓝色：储水空间（结构示意）")}
      </>
    );
  } else if (id === "caves") {
    body = (
      <>
        <path
          d="M0 0H800V120L650 80 570 130 420 95 260 120 100 70 0 130Z"
          fill="#99866d"
        />
        <path d="M0 450V380Q400 355 800 380V450Z" fill="#99866d" />
        <path
          d={`M345 105L400 ${130 + p * 100}L430 105 M350 375L390 ${350 - p * 100}L440 375`}
          fill="#cbb38b"
          stroke="#ded0b7"
          strokeWidth="2"
        />
        <circle cx="398" cy={230 + ((p * 110) % 100)} r="6" fill="#94cce2" />
        {text(70, 190, "洞顶：钟乳石向下生长")}
        {text(470, 320, "洞底：石笋向上生长")}
        {text(35, 425, "生长时间被压缩；高度不代表真实年数")}
      </>
    );
  } else if (id === "earthquakes") {
    body = (
      <>
        <path d={`M0 160H430L330 410H0Z`} fill="#8d7a65" />
        <path d={`M430 ${160 - p * 30}H800V410H330Z`} fill="#a69073" />
        {[80, 130, 180].map((r) => (
          <circle
            key={r}
            cx="390"
            cy="250"
            r={r * (0.2 + p * 0.8)}
            fill="none"
            stroke="#efd296"
            opacity={p}
            strokeWidth="3"
          />
        ))}
        <path d="M430 160L330 410" stroke="#e7bd78" strokeWidth="4" />
        {text(
          35,
          55,
          p < 0.3 ? "断层受约束，周围积累形变" : "局部突然滑动，扰动向周围传播",
        )}
        {text(35, 425, "规则波圈只表示传播；不对应真实地震的波速或影响范围")}
      </>
    );
  } else
    body = (
      <>
        <path d="M100 400L400 90 700 400Z" fill="#8c7967" />
        <path d="M400 100V390" stroke="#e3814a" strokeWidth="16" />
        <path
          d={`M400 375V${375 - Math.min(1, p / 0.65) * 275}`}
          stroke="#f2ae53"
          strokeWidth="12"
        />
        <ellipse cx="400" cy="375" rx="80" ry="30" fill="#cf7043" />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={400 + Math.sin(i) * 3}
            cy={365 - ((p * 210 + i * 38) % 240)}
            r={2 + p * 5}
            fill="#f7d998"
            opacity={p}
          />
        ))}
        {p > 0.65 &&
          [-1, 0, 1].map((d, i) => (
            <path
              key={d}
              d={`M400 100Q${400 + d * 60} ${100 - (p - 0.65) * 200} ${400 + d * 120} ${110 + (p - 0.65) * 100}`}
              stroke="#f2ae53"
              strokeWidth="5"
              fill="none"
            />
          ))}
        {text(55, 45, "火山的地下通道与储存区示意")}
        {text(
          60,
          425,
          p < 0.65
            ? "岩浆沿通道上升，气体状态改变"
            : "喷出物向外运动；非真实喷发预测",
        )}
      </>
    );
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label={`${id} 的地球科学图解`}>
      <defs>
        <linearGradient id={uid} x2="0" y2="1">
          <stop stopColor="#234252" />
          <stop offset="1" stopColor="#3b5e66" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${uid})`} />
      {body}
    </svg>
  );
}
export default function EarthScene({ topic, scene }) {
  const [value, setValue] = useState(30);
  return (
    <div>
      <EarthDiagram id={topic.id} value={value} />
      <div className="science-controls">
        <label>
          {scene?.control || "观察进度"}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </label>
        <Button onClick={() => setValue(0)}>观察开始</Button>
        <Button onClick={() => setValue(100)}>观察末态</Button>
        <Button onClick={() => setValue(30)}>恢复初始状态</Button>
      </div>
      <p className="science-caption">{scene?.states?.[value < 50 ? 0 : 1]}</p>
    </div>
  );
}
