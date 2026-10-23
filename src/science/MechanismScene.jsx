import React, { useEffect, useId, useState } from "react";
import Button from "../LabButton.jsx";
import FaucetPorts from "./FaucetPorts.jsx";

const C = {
  steel: "#a9bbc1",
  dark: "#405c65",
  gold: "#d7af67",
  water: "#58b6d0",
  paper: "#f1eee5",
};
const label = (x, y, text) => (
  <text x={x} y={y} fill="#f2f4ef" fontSize="23">
    {text}
  </text>
);
const line = (x1, y1, x2, y2, stroke = C.steel, width = 8) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
  />
);
const spiral = (cx, cy, radius, turns = 4) =>
  Array.from({ length: 141 }, (_, i) => {
    const a = (i / 140) * turns * Math.PI * 2,
      r = 10 + (i / 140) * radius;
    return `${i ? "L" : "M"}${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
function Gear({ x, y, r, angle }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <circle r={r} fill={C.gold} stroke={C.dark} strokeWidth="3" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect
          key={i}
          x={-5}
          y={-r - 7}
          width="10"
          height="17"
          fill={C.gold}
          transform={`rotate(${i * 22.5})`}
        />
      ))}
      <circle r={r * 0.65} fill={C.dark} />
      {[0, 90, 180, 270].map((a) => (
        <path
          key={a}
          d={`M0 0 L${r - 5} 0`}
          stroke={C.gold}
          strokeWidth="7"
          transform={`rotate(${a})`}
        />
      ))}
      <circle r="6" fill={C.steel} />
    </g>
  );
}

export function MechanismDiagram({
  id,
  value = 40,
  alternate = false,
  locked = false,
}) {
  const uid = useId().replaceAll(":", ""),
    p = value / 100;
  let body;
  switch (id) {
    case "tape-measure": {
      const end = 380 + p * 330;
      body = (
        <>
          <rect x="100" y="90" width="310" height="280" rx="55" fill={C.gold} />
          <circle cx="250" cy="230" r="118" fill={C.dark} />
          <path
            d={spiral(250, 230, 90 - p * 30, 4 + p * 2)}
            fill="none"
            stroke={C.steel}
            strokeWidth="5"
          />
          <circle cx="250" cy="230" r="12" fill={C.paper} />
          <rect x="250" y="340" width={end - 250} height="23" fill="#f5d365" />
          {Array.from({ length: Math.floor((end - 260) / 20) }, (_, i) => (
            <path
              key={i}
              d={`M${270 + i * 20} 342v${i % 5 ? 9 : 16}`}
              stroke={C.dark}
              strokeWidth="2"
            />
          ))}
          <path
            d={`M${end} 337v40h-15`}
            fill="none"
            stroke={C.steel}
            strokeWidth="9"
          />
          <rect
            x="356"
            y={locked ? 322 : 302}
            width="38"
            height="24"
            rx="5"
            fill={locked ? "#de8e5c" : C.steel}
          />
          {label(80, 50, "卷簧与尺带分工：储能 / 测量")}
          {label(450, 230, locked ? "锁止已压住尺带" : "卷簧可以驱动回收")}
          {line(180, 275, 95, 300, C.paper, 2)}
          {label(40, 330, "卷簧")}
        </>
      );
      break;
    }
    case "zipper": {
      const sy = 320 - p * 230;
      const gap = (y) => (y < sy ? Math.min(120, (sy - y) * 0.5) : 0);
      body = (
        <>
          {[-1, 1].map((side) => (
            <g key={side}>
              <path
                d={Array.from(
                  { length: 35 },
                  (_, i) =>
                    `${i ? "L" : "M"}${400 + side * (35 + gap(55 + i * 10))} ${55 + i * 10}`,
                ).join(" ")}
                fill="none"
                stroke={side < 0 ? "#6f9699" : "#91b0b0"}
                strokeWidth="48"
              />
              {Array.from({ length: 21 }, (_, i) => {
                const y = 60 + i * 15 + (side < 0 ? 0 : 7.5),
                  x = 400 + side * (9 + gap(y));
                return (
                  <path
                    key={i}
                    d={`M${x} ${y}h${side * 28}v7h${-side * 23}v5h${-side * 7}z`}
                    fill={C.gold}
                    stroke={C.dark}
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          ))}
          <path
            d={`M340 ${sy - 38} Q400 ${sy - 5} 460 ${sy - 38} L435 ${sy + 38} H365Z`}
            fill={C.steel}
            fillOpacity=".83"
            stroke={C.paper}
            strokeWidth="3"
          />
          <path d={`M400 ${sy - 28}v30`} stroke={C.dark} strokeWidth="15" />
          <rect
            x="387"
            y={sy - 5}
            width="26"
            height="62"
            rx="10"
            fill={C.paper}
            stroke={C.dark}
            strokeWidth="3"
          />
          {label(45, 55, "宽端：两排链齿分开")}
          {label(480, 390, "窄端：交错扣合")}
          {label(45, 425, "滑块内腔与链齿为放大示意")}
        </>
      );
      break;
    }
    case "ballpoint": {
      const x = 200 + p * 360;
      body = (
        <>
          <rect x="80" y="340" width="650" height="40" fill={C.paper} />
          <path d={`M200 340H${x}`} stroke="#254e8c" strokeWidth="5" />
          <g transform={`translate(${x},290)`}>
            <path d="M-45 -220H45L38 -35L20 15H-20L-38 -35Z" fill={C.steel} />
            <path d="M-26 -220H26V-38L13 -14H-13L-26 -38Z" fill="#3769a0" />
            <circle r="48" fill="#b8c5cb" stroke={C.dark} strokeWidth="8" />
            <path
              d="M-42 0A42 42 0 0 1 42 0"
              fill="none"
              stroke="#2a548e"
              strokeWidth="9"
            />
            <g transform={`rotate(${(((p * 360) / 48) * 180) / Math.PI})`}>
              <circle cx="0" cy="-29" r="7" fill="white" />
            </g>
          </g>
          {label(45, 45, "放大笔尖：内侧接墨，外侧接触纸面")}
          {label(90, 420, "白点用于追踪滚动，不是实际零件")}
        </>
      );
      break;
    }
    case "scissors": {
      const d = 55 + p * 230,
        angle = alternate ? 7 : 20;
      body = (
        <>
          <rect x={350 + d} y="120" width="22" height="240" fill="#e7d5ab" />
          {[-1, 1].map((side) => (
            <g key={side} transform={`rotate(${side * angle} 350 230)`}>
              <path
                d="M235 218L660 220L687 230L235 242Z"
                fill={C.steel}
                stroke={C.dark}
                strokeWidth="3"
              />
              <ellipse
                cx="195"
                cy="230"
                rx="65"
                ry="37"
                fill="none"
                stroke={side < 0 ? "#82a7a6" : "#d0a361"}
                strokeWidth="20"
              />
            </g>
          ))}
          <circle
            cx="350"
            cy="230"
            r="13"
            fill={C.dark}
            stroke={C.paper}
            strokeWidth="4"
          />
          {line(350, 370, 350 + d, 370, C.gold, 3)}
          {label(380, 407, `切割位置距支点：${Math.round(d)} 相对单位`)}
          {label(40, 52, `简化杠杆比例：${(155 / d).toFixed(2)} 倍`)}
          {label(60, 330, "手作用于手柄")}
        </>
      );
      break;
    }
    case "umbrella": {
      const a = ((12 + p * 63) * Math.PI) / 180,
        dx = 270 * Math.sin(a),
        dy = 270 * Math.cos(a),
        runner = 55 + 270 * Math.cos(a);
      body = (
        <>
          {line(400, 45, 400, 370, C.steel, 10)}
          <path
            d="M400 360v35q0 28-30 28t-30-28"
            fill="none"
            stroke={C.gold}
            strokeWidth="15"
          />
          <path
            d={`M${400 - dx} ${55 + dy}Q400 -10 ${400 + dx} ${55 + dy}Q400 ${90 + dy * 0.6} ${400 - dx} ${55 + dy}`}
            fill="#799c9e"
            fillOpacity=".8"
          />
          {[-1, 1].map((side) => (
            <g key={side}>
              {line(400, 55, 400 + side * dx, 55 + dy, C.paper, 5)}
              {line(400, runner, 400 + (side * dx) / 2, 55 + dy / 2, C.gold, 7)}
              <circle
                cx={400 + (side * dx) / 2}
                cy={55 + dy / 2}
                r="7"
                fill={C.dark}
              />
            </g>
          ))}
          <rect
            x="386"
            y={runner - 12}
            width="28"
            height="24"
            rx="5"
            fill={C.gold}
          />
          {label(40, 45, "直杆手动伞 · 两组连杆剖面")}
          {label(480, 350, "杆长不变，夹角改变")}
        </>
      );
      break;
    }
    case "lock": {
      const lengths = [50, 75, 35, 65, 45],
        gaps = alternate ? [0, 0, 0, 0, 0] : [-25, 18, -13, 28, 0];
      body = (
        <>
          <rect
            x="100"
            y="85"
            width="600"
            height="265"
            rx="35"
            fill={C.steel}
          />
          <rect
            x="105"
            y="210"
            width="590"
            height="135"
            rx="20"
            fill={C.dark}
          />
          {lengths.map((len, i) => {
            const x = 180 + i * 105,
              gap = gaps[i];
            return (
              <g key={i}>
                <path
                  d={`M${x} 90l-8 8 16 8-16 8 16 8-16 8 16 8-8 8`}
                  stroke={C.dark}
                  fill="none"
                  strokeWidth="3"
                />
                <rect
                  x={x - 14}
                  y={150 + gap}
                  width="28"
                  height="60"
                  fill="#c6d3d8"
                  stroke={C.dark}
                />
                <rect
                  x={x - 14}
                  y={210 + gap}
                  width="28"
                  height={len}
                  fill={C.gold}
                  stroke={C.dark}
                />
                <path
                  d={`M${x - 32} ${250 + len + gap}L${x} ${210 + len + gap}L${x + 32} ${250 + len + gap}`}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth="8"
                />
              </g>
            );
          })}
          <path
            d="M100 210H700"
            stroke={alternate ? "#91e3c8" : "#edac7f"}
            strokeDasharray="10 7"
            strokeWidth="3"
          />
          {label(
            60,
            47,
            alternate
              ? "匹配钥匙：接缝同时对齐"
              : "不匹配钥匙：部分弹子跨过分界",
          )}
          {label(150, 408, "虚线是锁芯与壳体的转动分界")}
        </>
      );
      break;
    }
    case "watch":
      body = (
        <>
          <circle
            cx="160"
            cy="220"
            r="80"
            fill={C.dark}
            stroke={C.steel}
            strokeWidth="10"
          />
          <path
            d={spiral(160, 220, 55)}
            fill="none"
            stroke={C.gold}
            strokeWidth="4"
          />
          <Gear x={320} y={220} r={65} angle={p * 360} />
          <Gear x={430} y={220} r={45} angle={-p * 520} />
          <Gear x={500} y={220} r={25} angle={p * 936} />
          <g transform={`rotate(${Math.sin(p * Math.PI * 8) * 60} 650 220)`}>
            <circle
              cx="650"
              cy="220"
              r="65"
              fill="none"
              stroke={C.gold}
              strokeWidth="10"
            />
            {line(650, 155, 650, 285, C.steel, 5)}
            {line(585, 220, 715, 220, C.steel, 5)}
          </g>
          <path
            d={`M550 200L${570 + Math.sin(p * Math.PI * 8) * 12} 220L550 240`}
            fill="none"
            stroke={C.paper}
            strokeWidth="6"
          />
          {label(50, 60, "发条 → 轮系 → 擒纵与摆轮")}
          {label(85, 345, "储存能量")}
          {label(290, 345, "传递运动")}
          {label(570, 345, "控制节奏")}
          {label(55, 420, "传动关系示意；齿数、布局和节奏不对应特定机芯")}
        </>
      );
      break;
    case "faucet": {
      body = <FaucetPorts value={value} />;
      break;
    }
    case "lighter": {
      const stage = Math.round(p * 2);
      body = (
        <>
          <rect
            x="210"
            y="165"
            width="200"
            height="230"
            rx="25"
            fill={C.steel}
          />
          <rect
            x="230"
            y="260"
            width="160"
            height="115"
            rx="15"
            fill="#adc7b5"
          />
          <path
            d="M325 280V160H360V130"
            fill="none"
            stroke={stage ? C.gold : C.dark}
            strokeWidth="12"
          />
          <rect
            x="307"
            y="168"
            width="36"
            height="20"
            fill={stage ? C.gold : C.dark}
          />
          {alternate ? (
            <>
              <rect x="250" y="210" width="30" height="45" fill={C.gold} />
              <path
                d="M265 210V140H335"
                fill="none"
                stroke={C.paper}
                strokeWidth="3"
              />
            </>
          ) : (
            <>
              <circle
                cx="285"
                cy="145"
                r="28"
                fill={C.dark}
                stroke={C.gold}
                strokeWidth="6"
              />
              <rect x="279" y="170" width="12" height="40" fill={C.paper} />
            </>
          )}
          {stage === 1 && (
            <path
              d="M310 140l20-18-3 17 18-7"
              stroke="#ffe89b"
              fill="none"
              strokeWidth="5"
            />
          )}
          {stage === 2 && (
            <path d="M360 130Q325 105 360 42Q399 100 360 130" fill="#f2b366" />
          )}
          {label(50, 45, alternate ? "压电式点火模块" : "砂轮火石式点火模块")}
          {label(460, 210, ["关闭", "短暂点火", "供气维持火焰"][stage])}
          {label(465, 280, "燃料 → 阀 → 喷口")}
          {label(70, 430, "两种点火结构分别显示，仅作屏幕观察")}
        </>
      );
      break;
    }
    case "toilet": {
      const stage = Math.min(3, Math.floor(value / 26)),
        waterHeight = [100, 65, 25, 100][stage],
        bowl = [285, 245, 320, 285][stage];
      body = (
        <>
          <rect
            x="100"
            y="85"
            width="155"
            height="180"
            rx="10"
            fill={C.paper}
            stroke={C.steel}
            strokeWidth="7"
          />
          <rect
            x="112"
            y={250 - waterHeight}
            width="131"
            height={waterHeight}
            fill={C.water}
          />
          <path
            d="M220 250V290H330"
            fill="none"
            stroke={C.paper}
            strokeWidth="30"
          />
          <path
            d="M290 230H580Q565 345 420 345Q320 340 290 230Z"
            fill={C.paper}
            stroke={C.steel}
            strokeWidth="6"
          />
          <path
            d={`M325 ${bowl}H550Q540 330 420 330Q345 325 325 ${bowl}Z`}
            fill={C.water}
          />
          <path
            d="M420 325Q490 370 545 260Q590 175 630 270V390"
            fill="none"
            stroke={C.steel}
            strokeWidth="39"
          />
          <path
            d="M420 325Q490 370 545 260Q590 175 630 270V390"
            fill="none"
            stroke={stage === 1 ? C.water : C.dark}
            strokeWidth="24"
          />
          {(stage === 0 || stage === 3) && (
            <path
              d="M420 325Q478 360 513 306"
              stroke={C.water}
              strokeWidth="24"
              fill="none"
            />
          )}
          {stage === 1 && (
            <path
              d="M220 250V290H330"
              fill="none"
              stroke={C.water}
              strokeWidth="15"
            />
          )}
          {label(
            70,
            45,
            [
              "静止：水封隔气",
              "冲水：弯道形成连续流动",
              "进气：虹吸结束",
              "补水：恢复水箱与水封",
            ][stage],
          )}
          {label(70, 420, "典型虹吸式通道概念；补水和排水实际可重叠")}
        </>
      );
      break;
    }
    default:
      return null;
  }
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label={`${id} 结构与运动示意`}>
      <defs>
        <linearGradient id={`${uid}bg`} x2="0" y2="1">
          <stop stopColor="#24474f" />
          <stop offset="1" stopColor="#12323b" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${uid}bg)`} />
      {body}
    </svg>
  );
}

const start = {
  "tape-measure": 20,
  zipper: 20,
  ballpoint: 0,
  scissors: 45,
  umbrella: 20,
  lock: 0,
  watch: 0,
  faucet: 0,
  lighter: 0,
  toilet: 0,
};
export default function MechanismScene({
  topic,
  scene,
  chapter,
  active = true,
}) {
  const [value, setValue] = useState(start[topic.id] ?? 0),
    [alternate, setAlternate] = useState(false),
    [locked, setLocked] = useState(false),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    setPlaying(false);
  }, [chapter, active]);
  useEffect(() => {
    const stop = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", stop);
    return () => document.removeEventListener("visibilitychange", stop);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setValue((v) => {
          if (v >= 100) {
            setPlaying(false);
            return 100;
          }
          return Math.min(100, v + 2);
        }),
      90,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const set = (v) => {
    setPlaying(false);
    setValue(v);
  };
  const discrete = topic.id === "toilet" || topic.id === "lighter";
  const stateText =
    topic.id === "lock"
      ? alternate
        ? scene.states[1]
        : scene.states[0]
      : topic.id === "scissors"
        ? `离支点越${value < 50 ? "近，力臂越短，同样手力下越省力" : "远，力臂越长，尖端运动范围较大"}`
        : topic.id === "faucet"
          ? value <= 6
            ? "关闭：活动片水道与固定口没有连通；工作时两片陶瓷紧贴，不靠悬空分离开关水。"
            : "活动片水道把固定口连通，水可以从进水口经水道到出水口。透明层只为观察，开度不是实际流量；本图省略混水阀的另一路进水。"
          : scene.states[value < 50 ? 0 : 1];
  return (
    <div>
      <MechanismDiagram
        id={topic.id}
        value={value}
        alternate={alternate}
        locked={locked}
      />
      <div className="science-controls">
        {topic.id !== "lock" && !discrete && (
          <label>
            {scene.control} <output>{value} / 100</output>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={value}
              disabled={locked}
              onChange={(e) => set(Number(e.target.value))}
            />
          </label>
        )}
        {topic.id === "tape-measure" && (
          <>
            <Button aria-pressed={locked} onClick={() => setLocked((v) => !v)}>
              {locked ? "解除锁止" : "锁住尺带"}
            </Button>
            <Button
              disabled={locked || value === 0}
              onClick={() => set(Math.max(0, value - 20))}
            >
              回收一段
            </Button>
          </>
        )}
        {topic.id === "lock" && (
          <Button
            aria-pressed={alternate}
            onClick={() => setAlternate((v) => !v)}
          >
            {alternate ? "换成不匹配钥匙" : "换成匹配钥匙"}
          </Button>
        )}
        {topic.id === "scissors" && (
          <Button
            aria-pressed={alternate}
            onClick={() => setAlternate((v) => !v)}
          >
            {alternate ? "张开刀片" : "合拢刀片"}
          </Button>
        )}
        {topic.id === "lighter" && (
          <Button
            aria-pressed={alternate}
            onClick={() => {
              setAlternate((v) => !v);
              set(0);
            }}
          >
            {alternate ? "看砂轮火石式" : "看压电式"}
          </Button>
        )}
        {discrete &&
          (topic.id === "toilet"
            ? ["静止", "冲水", "进气", "补水"]
            : ["关闭", "点火", "燃烧"]
          ).map((name, i, all) => (
            <Button
              key={name}
              aria-pressed={Math.round(value / (100 / (all.length - 1))) === i}
              onClick={() => set(Math.round((i * 100) / (all.length - 1)))}
            >
              {name}
            </Button>
          ))}
        {["zipper", "watch", "ballpoint"].includes(topic.id) && (
          <>
            <Button
              onClick={() => {
                if (value >= 100) setValue(0);
                setPlaying((v) => !v);
              }}
            >
              {playing ? "暂停" : "播放过程"}
            </Button>
            <Button
              disabled={value >= 100}
              onClick={() => set(Math.min(100, value + 10))}
            >
              下一步
            </Button>
          </>
        )}
        <Button
          onClick={() => {
            set(start[topic.id] ?? 0);
            setLocked(false);
            setAlternate(false);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      <p className="science-caption" role="status">
        {stateText}
      </p>
    </div>
  );
}
