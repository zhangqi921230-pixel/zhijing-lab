import React, { useEffect, useState } from "react";
import Button from "../LabButton.jsx";
import ScenePlayer from "./ScenePlayer.jsx";
import PhotoCompare from "./PhotoCompare.jsx";
const tx = (x, y, t) => (
  <text x={x} y={y} fill="#edf3ed" fontSize="22">
    {t}
  </text>
);
const ln = (d, c = "#a8c7be", w = 5) => (
  <path
    d={d}
    fill="none"
    stroke={c}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);
export const polygonPerimeter = (n, area = 1) =>
  Math.sqrt(4 * area * n * Math.tan(Math.PI / n));
export const echoMilliseconds = (distance, speed = 343) =>
  (2000 * distance) / speed;
export function AnimalDiagram({ id, value = 35, variant = 0, time = 0 }) {
  const p = value / 100;
  let body;
  switch (id) {
    case "moths":
      body = (
        <>
          {[230, 565].map((x, i) => (
            <g key={x}>
              <ellipse
                cx={x - 55}
                cy="240"
                rx="65"
                ry="100"
                fill={i ? "#a7c399" : "#d7a365"}
              />
              <ellipse
                cx={x + 55}
                cy="240"
                rx="65"
                ry="100"
                fill={i ? "#a7c399" : "#d7a365"}
              />
              <ellipse
                cx={x}
                cy="260"
                rx={i ? 24 : 12}
                ry="90"
                fill="#a29a72"
              />
              {ln(`M${x - 5} 185l-25-65m35 65l25-65`)}
              {i ? (
                Array.from({ length: 5 }, (_, j) =>
                  ln(
                    `M${x - 12 - j * 4} ${168 - j * 10}l-13-6m${38 + j * 8} 6l13-6`,
                  ),
                )
              ) : (
                <>
                  <circle cx={x - 30} cy="120" r="8" fill="#c7d4bd" />
                  <circle cx={x + 30} cy="120" r="8" fill="#c7d4bd" />
                </>
              )}
              {tx(x - 65, 420, i ? "羽状触角示意" : "棒状触角示意")}
            </g>
          ))}
          {tx(180, 475, "先看触角，再结合更多特征；实拍在下方")}
        </>
      );
      break;
    case "honeycomb": {
      const n = [6, 4, 3][variant],
        A = 2400 + 1200 * p,
        r = Math.sqrt((2 * A) / (n * Math.sin((2 * Math.PI) / n))),
        side = Math.sqrt((4 * A * Math.tan(Math.PI / n)) / n),
        h = (side * Math.sqrt(3)) / 2;
      const cells = [];
      for (let i = 0; i < 9; i++)
        for (let j = 0; j < 6; j++) {
          if (n === 6) {
            const x = 80 + i * 1.5 * r,
              y = 100 + j * Math.sqrt(3) * r + ((i % 2) * Math.sqrt(3) * r) / 2;
            if (x < 735 && y < 400)
              cells.push(
                Array.from(
                  { length: 6 },
                  (_, k) =>
                    `${x + r * Math.cos((k * Math.PI) / 3)},${y + r * Math.sin((k * Math.PI) / 3)}`,
                ).join(" "),
              );
          }
          if (n === 4) {
            const x = 90 + i * side,
              y = 100 + j * side;
            if (x + side < 735 && y + side < 400)
              cells.push(
                `${x},${y} ${x + side},${y} ${x + side},${y + side} ${x},${y + side}`,
              );
          }
          if (n === 3) {
            const x = 85 + i * side + ((j % 2) * side) / 2,
              y = 105 + j * h;
            if (x + side * 1.5 < 735 && y + h < 400) {
              cells.push(`${x},${y} ${x + side},${y} ${x + side / 2},${y + h}`);
              cells.push(
                `${x + side},${y} ${x + side * 1.5},${y + h} ${x + side / 2},${y + h}`,
              );
            }
          }
        }
      body = (
        <>
          {cells.map((pts, i) => (
            <polygon
              key={i}
              points={pts}
              fill="#b68e47"
              stroke="#f1d18a"
              strokeWidth="4"
            />
          ))}
          {tx(
            140,
            455,
            `相同单位面积：${n} 边形周长 ${polygonPerimeter(n).toFixed(3)}`,
          )}
          {tx(140, 490, "仅比较二维理想单元，实际巢壁可共享")}
        </>
      );
      break;
    }
    case "bat-echo": {
      const d = 1 + p * 11,
        target = 220 + p * 460,
        t = (75 * time) / 100,
        tau = echoMilliseconds(d),
        fraction = Math.min(2, (t / tau) * 2),
        x =
          fraction < 1
            ? 140 + (target - 140) * fraction
            : target - (target - 140) * (fraction - 1);
      body = (
        <>
          <path
            d="M145 220l-95-75 20 80 35-5 40 50 40-50 35 5 20-80Z"
            fill="#9c8b85"
          />
          <circle cx="145" cy="230" r="24" fill="#b3a08e" />
          <rect x={target} y="140" width="18" height="220" fill="#83aa97" />
          {ln(`M165 235H${target}`, "#426570", 2)}
          {t < tau && (
            <circle
              cx={x}
              cy="235"
              r="12"
              fill={fraction < 1 ? "#e5b45d" : "#8cc8d5"}
            />
          )}
          {tx(90, 405, `距离 ${d.toFixed(1)} m · 往返 ${tau.toFixed(1)} ms`)}
          {tx(
            90,
            450,
            t >= tau
              ? "已收到回声"
              : fraction < 1
                ? "声音传向目标"
                : "回声返回蝙蝠",
          )}
        </>
      );
      break;
    }
    case "cat-eyes":
      body = (
        <>
          {variant ? (
            <>
              <ellipse
                cx="410"
                cy="250"
                rx="185"
                ry="150"
                fill="#243d48"
                stroke="#c7ad8f"
                strokeWidth="14"
              />
              {ln("M510 135Q640 250 510 365", "#c4aa60", 12)}
              {ln("M495 140Q615 250 495 360", "#b58272", 6)}
              <ellipse cx="270" cy="250" rx="19" ry="60" fill="#8dbdc5" />
              {p > 0 && (
                <>
                  {ln("M100 240H560L300 260", "#e7c477", 3)}
                  {tx(80, 110, "入射光 → 反光层 → 再经过视网膜")}
                </>
              )}
              {tx(425, 425, "反光层位于视网膜后方")}
            </>
          ) : (
            <>
              <path
                d="M130 250Q400 15 670 250Q400 485 130 250"
                fill="#d1bc7a"
                stroke="#778a70"
                strokeWidth="8"
              />
              <ellipse
                cx="400"
                cy="250"
                rx={15 + (1 - p) * 90}
                ry="140"
                fill="#152731"
              />
              {tx(
                145,
                445,
                p === 0
                  ? "没有入射光，不能凭空形成视觉"
                  : "较暗时瞳孔较大；亮时较窄",
              )}
            </>
          )}
        </>
      );
      break;
    case "bird-flight": {
      const a = variant ? 0 : Math.sin(p * Math.PI * 2) * 55;
      body = (
        <>
          <ellipse cx="420" cy="270" rx="100" ry="38" fill="#bac6b1" />
          <circle cx="525" cy="250" r="27" fill="#cdd3bb" />
          <path d="M545 250l45 8-45 8" fill="#d6aa6e" />
          {[1, -1].map((side, i) => (
            <path
              key={side}
              d={`M400 260Q${400 + side * 140} ${190 + a} ${400 + side * 245} ${150 + a}L${400 + side * 175} ${260 + a / 2}L410 295Z`}
              fill={i ? "#99aaa2" : "#d8d5bc"}
              stroke="#6c8d8b"
              strokeWidth="4"
            />
          ))}
          {[0, 1, 2].map((i) =>
            ln(
              `M80 ${100 + i * 35}Q400 ${130 + i * 35} 690 ${200 + i * 35}`,
              "#6698a7",
              3,
            ),
          )}
          {ln("M420 340v80", "#cda167", 7)}
          {tx(455, 385, "重力")}
          {tx(
            120,
            455,
            variant ? "滑翔：相对气流仍存在" : "扑翼：位置与姿态随周期变化",
          )}
        </>
      );
      break;
    }
    case "fish-gills":
      body = (
        <>
          <path
            d="M80 200Q250 90 420 215L470 155V295L420 235Q250 350 80 250Z"
            fill="#82aaa7"
            stroke="#b7d1c0"
            strokeWidth="5"
          />
          {[0, 1, 2, 3].map((i) =>
            ln(`M${175 + i * 20} 170q55 55 0 110`, "#cb8f81", 8),
          )}
          {ln("M90 235H270", "#83c8d9", 5)}
          <rect
            x="515"
            y="130"
            width="210"
            height="230"
            rx="10"
            fill="#294b56"
          />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              {ln(`M535 ${160 + i * 50}H705`, i % 2 ? "#c98677" : "#7ebacd", 9)}
              <circle
                cx={i % 2 ? 700 - p * 160 : 540 + p * 160}
                cy={160 + i * 50}
                r="7"
                fill="#f4d796"
              />
            </g>
          ))}
          {tx(520, 100, "交换薄片放大")}
          {tx(90, 410, "水流经过鳃；氧跨界面进入血液")}
          {tx(520, 400, "水与血反向流动")}
        </>
      );
      break;
    case "whales":
      body = (
        <>
          <path
            d="M100 210Q210 125 350 235l50-45v95l-50-40Q210 325 100 250Z"
            fill="#77a7ab"
          />
          <path
            d="M470 250Q590 135 720 220l35-20-15 35Q620 330 485 280L450 310Z"
            fill="#a6b7b7"
          />
          {variant ? (
            <>
              {tx(125, 365, "鱼类：繁殖方式多样")}
              {tx(475, 365, "鲸类：乳汁哺育幼崽")}
            </>
          ) : (
            <>
              {ln("M170 200q40 35 0 70", "#ddaa9b", 10)}
              <ellipse cx="605" cy="250" rx="52" ry="27" fill="#c9988a" />
              {ln("M605 250V195", "#dacbb0", 8)}
              {tx(165, 365, "鳃：水中溶解氧")}
              {tx(510, 365, "肺：呼吸空气")}
            </>
          )}
          {tx(180, 440, "比较相同功能的结构，不能只看外形")}
        </>
      );
      break;
    case "penguins": {
      const count = variant ? 5 : 1;
      body = (
        <>
          {Array.from({ length: count }, (_, i) => {
            const x = count === 1 ? 400 : 230 + i * 85,
              y = count === 1 ? 260 : 275 - Math.sin(i) * 20;
            return (
              <g key={i}>
                <ellipse
                  cx={x}
                  cy={y}
                  rx="65"
                  ry="130"
                  fill="#263c45"
                  stroke="#86968b"
                  strokeWidth="9"
                />
                <ellipse cx={x} cy={y + 20} rx="43" ry="98" fill="#e8e2ce" />
                <circle cx={x} cy={y - 110} r="37" fill="#23313b" />
                {!variant && (
                  <>
                    <path
                      d={`M${x + 15} ${y - 55}Q${x + 105} ${y + 15} ${x + 20} ${y + 108}`}
                      fill="#cfb28a"
                    />
                    <path
                      d={`M${x + 38} ${y - 45}Q${x + 109} ${y + 15} ${x + 40} ${y + 90}`}
                      fill="none"
                      stroke="#aeb69f"
                      strokeWidth="12"
                    />
                  </>
                )}
              </g>
            );
          })}
          {tx(
            80,
            85,
            variant ? "帝企鹅聚集情境：减少部分外露" : "羽毛 → 皮肤 → 皮下脂肪",
          )}
          {!variant &&
            [0, 1, 2].map((i) =>
              ln(`M520 ${200 + i * 60}h${60 - 30 * p}`, "#d7a968", 4),
            )}
          {tx(175, 465, "保温减缓热量散失，不会凭空产热")}
        </>
      );
      break;
    }
    case "ants": {
      const pts =
          variant === 1
            ? [
                [120, 350],
                [270, 350],
                [310, 180],
                [520, 180],
                [640, 270],
              ]
            : [
                [120, 350],
                [320, 280],
                [480, 330],
                [640, 270],
              ],
        q = p * (pts.length - 1),
        k = Math.min(pts.length - 2, Math.floor(q)),
        f = q - k,
        x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f,
        y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f;
      body = (
        <>
          <ellipse cx="120" cy="350" rx="45" ry="25" fill="#95846b" />
          <circle cx="640" cy="270" r="33" fill="#d8b470" />
          <polyline
            points={pts.map((a) => a.join(",")).join(" ")}
            fill="none"
            stroke={variant === 2 ? "#78968b" : "#a9b56c"}
            strokeWidth="10"
            strokeDasharray="6 12"
          />
          {variant === 1 && (
            <rect x="340" y="250" width="100" height="130" fill="#778b80" />
          )}
          <g transform={`translate(${x},${y})`}>
            <ellipse rx="13" ry="8" fill="#312e28" />
            <circle cx="17" r="7" fill="#312e28" />
            {ln("M-5-5l-8-12m10 13l8-12m-10 20l-8 12m10-11l8 12", "#c8b49a", 3)}
          </g>
          {variant === 2 && (
            <>
              <path d="M330 170l50-95 50 95Z" fill="#688f79" />
              {tx(460, 130, "地标与行走信息")}
            </>
          )}
          {tx(95, 430, "巢穴")}
          {tx(610, 350, "食物")}
        </>
      );
      break;
    }
    case "gecko": {
      const scale = Math.min(2, Math.floor(p * 3));
      body = (
        <>
          {scale === 0 ? (
            <>
              <path
                d="M290 385V260l-90-110m90 110l-25-150m25 150l75-155m-75 155l140-100"
                stroke="#9bbfa7"
                fill="none"
                strokeWidth="35"
                strokeLinecap="round"
              />
              {tx(460, 260, "脚趾与趾垫")}
            </>
          ) : (
            Array.from({ length: 8 }, (_, i) => {
              const x = 170 + i * 65,
                detach = variant ? p : 0;
              return (
                <g key={i}>
                  {ln(`M${x} 370l${detach * 25} -100`, "#a8c4a4", 9)}
                  {[0, 1, 2].map((j) =>
                    ln(
                      `M${x + detach * 25} 270l${(j - 1) * 20} ${-65 + detach * i * 7}`,
                      "#b9d1af",
                      4,
                    ),
                  )}
                </g>
              );
            })
          )}
          {scale > 0 && (
            <>
              <rect x="100" y="160" width="600" height="15" fill="#e1d2b0" />
              {tx(
                170,
                110,
                scale === 1
                  ? "大量刚毛：提高有效接触"
                  : "分支末端：近距离的分子间作用",
              )}
              {tx(
                160,
                445,
                variant
                  ? "改变角度，可使接触依次解除"
                  : "尺寸经过放大，不与脚趾图共用比例",
              )}
            </>
          )}
        </>
      );
      break;
    }
    default:
      body = null;
  }
  return (
    <svg
      viewBox="0 0 800 520"
      className="science-diagram"
      role="img"
      aria-label={`${id} 动物结构与观察示意`}
    >
      <rect width="800" height="520" rx="18" fill="#173541" />
      {body}
    </svg>
  );
}
function BatScene({ chapter }) {
  const [distance, setDistance] = useState(30),
    [time, setTime] = useState(0),
    [playing, setPlaying] = useState(false);
  useEffect(() => setPlaying(false), [chapter]);
  useEffect(() => {
    const stop = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", stop);
    return () => document.removeEventListener("visibilitychange", stop);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () =>
        setTime((v) => {
          if (v >= 100) {
            setPlaying(false);
            return 100;
          }
          return v + 1;
        }),
      60,
    );
    return () => clearInterval(t);
  }, [playing]);
  return (
    <>
      <AnimalDiagram id="bat-echo" value={distance} time={time} />
      <div className="science-controls">
        <label>
          目标距离<output>{(1 + distance * 0.11).toFixed(1)} m</output>
          <input
            type="range"
            min="0"
            max="100"
            value={distance}
            onChange={(e) => {
              setPlaying(false);
              setTime(0);
              setDistance(+e.target.value);
            }}
          />
        </label>
        <label>
          往返观察时间<output>{(time * 0.75).toFixed(1)} ms</output>
          <input
            type="range"
            min="0"
            max="100"
            value={time}
            onChange={(e) => {
              setPlaying(false);
              setTime(+e.target.value);
            }}
          />
        </label>
        <Button
          onClick={() => {
            if (time === 100) setTime(0);
            setPlaying(!playing);
          }}
        >
          {playing ? "暂停" : "发出一声"}
        </Button>
        <Button
          onClick={() => {
            setPlaying(false);
            setTime(Math.min(100, time + 10));
          }}
        >
          下一步
        </Button>
        <Button
          onClick={() => {
            setPlaying(false);
            setDistance(30);
            setTime(0);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      <p className="science-caption" role="status">
        教学声速取 343 m/s，距离等于声速 × 往返时间 ÷ 2。预计{" "}
        {echoMilliseconds(1 + distance * 0.11).toFixed(1)} ms
        收到回声；动画已放慢。
      </p>
    </>
  );
}
export default function AnimalScene(props) {
  const id = props.topic.id;
  if (id === "bat-echo") return <BatScene chapter={props.chapter} />;
  if (id === "moths") return <PhotoCompare topic="moths" />;
  const variants =
    {
      honeycomb: ["正六边形", "正方形", "等边三角形"],
      "cat-eyes": ["瞳孔", "反光层"],
      "bird-flight": ["扑翼", "滑翔"],
      whales: ["比较呼吸", "比较哺育"],
      penguins: ["保温剖面", "帝企鹅聚集"],
      ants: ["化学路径", "道路受阻", "更多线索"],
      gecko: ["放大结构", "接触与剥离"],
    }[id] || [];
  return (
    <ScenePlayer
      {...props}
      Diagram={AnimalDiagram}
      variants={variants}
      motion={["bird-flight", "fish-gills", "ants"].includes(id)}
      range={!["whales"].includes(id)}
    />
  );
}
