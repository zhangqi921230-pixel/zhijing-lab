import React, { useState, useEffect, useMemo, useId } from "react";
import Button from "../LabButton.jsx";
import { orbitPath, planets, illuminatedFraction } from "./spaceModels.mjs";
const tx = (x, y, text) => (
  <text x={x} y={y} fill="#e8eff0" fontSize="22">
    {text}
  </text>
);
function Earth({ x = 400, y = 250, r = 75 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#5484a5" />
      <path
        d={`M${x - r * 0.7} ${y - r * 0.3}q${r * 0.7} ${-r * 0.9} ${r * 1.2} 0l${-r * 0.3} ${r * 0.9}-${r * 0.45}-${r * 0.15}z`}
        fill="#7f9f8a"
      />
    </g>
  );
}
export function SpaceDiagram({
  id,
  value = 35,
  alternate = false,
  option = 1,
}) {
  const uid = useId().replaceAll(":", ""),
    p = value / 100,
    theta = p * Math.PI * 2;
  const orbit = useMemo(
    () => (id === "satellite" ? orbitPath(option) : null),
    [id, option],
  );
  let body;
  switch (id) {
    case "satellite": {
      const scale = Math.min(
          95,
          300 / Math.max(...orbit.points.map(([x, y]) => Math.hypot(x, y))),
        ),
        n = Math.min(
          orbit.points.length - 1,
          Math.floor(p * (orbit.points.length - 1)),
        ),
        [sx, sy] = orbit.points[n];
      const path = (points) =>
        points
          .map(
            ([x, y], i) =>
              `${i ? "L" : "M"}${400 + x * scale} ${240 - y * scale}`,
          )
          .join(" ");
      body = (
        <>
          <Earth x={400} y={240} r={scale} />
          <path
            d={path(orbit.points)}
            fill="none"
            stroke="#77939b"
            strokeDasharray="4 6"
          />
          <path
            d={path(orbit.points.slice(0, n + 1))}
            fill="none"
            stroke="#edcb8a"
            strokeWidth="3"
          />
          <path
            d={`M${400 + sx * scale} ${240 - sy * scale}L400 240`}
            stroke="#a4c7d6"
            strokeDasharray="6 6"
          />
          <g transform={`translate(${400 + sx * scale} ${240 - sy * scale})`}>
            <rect x="-6" y="-6" width="12" height="12" fill="#efe4be" />
            <path d="M-22 -9h14v18h-14zM8 -9h14v18H8z" fill="#6fa2bd" />
          </g>
          {tx(40, 40, `初速度 / 当地圆轨道速度 = ${option}`)}
          {tx(
            45,
            420,
            orbit.ending === "surface"
              ? "轨迹与表面相交，计算在碰撞处停止"
              : orbit.ending === "outside"
                ? "轨迹离开显示范围；不是所有速度都形成闭合轨道"
                : "卫星受引力作用，轨迹持续弯曲",
          )}
        </>
      );
      break;
    }
    case "weightlessness": {
      const y = alternate ? 80 + p * 100 : 170;
      body = (
        <>
          <path d="M70 390H730" stroke="#7f9b8b" strokeWidth="25" />
          <g transform={`translate(0 ${y})`}>
            <rect
              x="250"
              y="0"
              width="300"
              height="200"
              rx="20"
              fill="none"
              stroke="#a8c0c9"
              strokeWidth="7"
            />
            <circle cx="400" cy="52" r="22" fill="#e7d7b6" />
            <path
              d="M400 75v65m-40-35 40-20 40 20m-40 35-30 55m30-55 30 55"
              stroke="#e7d7b6"
              strokeWidth="16"
              fill="none"
            />
            <path
              d="M470 65v65l-8-12m8 12 8-12"
              stroke="#e7b76f"
              strokeWidth="5"
            />
            {!alternate && (
              <path
                d="M400 200v-40l-10 12m10-12 10 12"
                stroke="#8ee0c6"
                strokeWidth="6"
              />
            )}
          </g>
          {tx(
            40,
            45,
            alternate
              ? "共同下落：地板不再持续托住人"
              : "地面静止：支撑与引力同时存在",
          )}
          {tx(70, 430, "黄色表示引力；绿色表示地板的支撑")}
        </>
      );
      break;
    }
    case "spacesuit": {
      const i = Math.min(2, Math.floor(value / 34)),
        colors = ["#d7dede", "#a3ced3", "#efc884"];
      body = (
        <>
          <g transform="translate(240 60)">
            <rect
              x="115"
              y="90"
              width="105"
              height="170"
              rx="20"
              fill="#677e8b"
            />
            <circle
              cx="100"
              cy="55"
              r="47"
              fill="#bcc9cf"
              stroke={colors[i]}
              strokeWidth="9"
            />
            <ellipse cx="100" cy="56" rx="29" ry="30" fill="#3e5367" />
            <path
              d="M55 110Q30 115 0 200M145 110q25 5 55 90M72 250l-15 80M125 250l15 80"
              stroke={colors[i]}
              strokeWidth="34"
              fill="none"
              strokeLinecap="round"
            />
            <rect
              x="48"
              y="98"
              width="103"
              height="166"
              rx="26"
              fill="#d7dede"
              stroke={colors[i]}
              strokeWidth="9"
            />
            {i === 1 ? (
              <path
                d="M65 120h65v25H65v25h65v25H65v25h65"
                fill="none"
                stroke="#3c9bb6"
                strokeWidth="7"
              />
            ) : i === 0 ? (
              <path
                d="M120 75Q210 80 190 160"
                fill="none"
                stroke="#8ad3c2"
                strokeWidth="7"
              />
            ) : (
              <path
                d="M55 110h89v143H55Z"
                fill="none"
                stroke="#f1cb7e"
                strokeDasharray="5 5"
                strokeWidth="7"
              />
            )}
          </g>
          {tx(
            40,
            40,
            [
              "气体循环与压力维持",
              "冷却水带走人体热量",
              "外层参与隔热与颗粒防护",
            ][i],
          )}
          {tx(520, 240, ["生命保障背包", "冷却服管路", "环境防护层"][i])}
          {tx(40, 425, "功能示意，不对应某一型号的完整层数")}
        </>
      );
      break;
    }
    case "reentry": {
      const heat = Math.sin(p * Math.PI);
      body = (
        <>
          <path d="M0 430Q400 330 800 430" fill="#638d91" />
          <path
            d="M270 285Q400 130 530 285Q400 330 270 285"
            fill="#b5bfc3"
            stroke="#eff1e9"
            strokeWidth="5"
          />
          <path
            d="M270 285Q400 330 530 285"
            fill="none"
            stroke="#584743"
            strokeWidth="20"
          />
          <path
            d="M225 310Q400 400 575 310"
            fill="none"
            stroke="#f3a65b"
            strokeWidth={5 + heat * 24}
            opacity={0.1 + 0.9 * heat}
          />
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M${120 + i * 70} 410v-45`}
              stroke="#bad6df"
              strokeWidth="3"
            />
          ))}
          {tx(40, 45, "来流受压缩并形成激波，高温气体向表面传热")}
          {tx(285, 220, "受保护的舱内")}
          {tx(555, 280, "防热大底")}
          {tx(
            40,
            430,
            heat > 0.7
              ? "示意强加热阶段"
              : "示意加热较弱阶段；不是实测热流曲线",
          )}
        </>
      );
      break;
    }
    case "moon-phases": {
      const mx = 290 - 140 * Math.cos(theta),
        my = 220 + 140 * Math.sin(theta),
        c = Math.cos(theta),
        sin = Math.sin(theta);
      body = (
        <>
          <path d="M45 70V370" stroke="#e7be70" strokeWidth="8" />
          {[110, 220, 330].map((y) => (
            <path
              key={y}
              d={`M55 ${y}h75l-12-7m12 7-12 7`}
              stroke="#e7be70"
              fill="none"
              strokeWidth="3"
            />
          ))}
          <circle
            cx="290"
            cy="220"
            r="140"
            fill="none"
            stroke="#7895a0"
            strokeDasharray="6 7"
          />
          <Earth x={290} y={220} r={38} />
          <circle cx={mx} cy={my} r="22" fill="#596976" />
          <path d={`M${mx} ${my - 22}a22 22 0 0 0 0 44Z`} fill="#e4dfc9" />
          <path
            d={`M${mx} ${my}L290 220`}
            stroke="#aabcca"
            strokeDasharray="4 5"
          />
          <circle cx="650" cy="225" r="82" fill="#485965" />
          <path
            fill="#e7e3d3"
            d={(() => {
              const rows = Array.from({ length: 165 }, (_, i) => ({
                y: i - 82,
                w: Math.sqrt(Math.max(0, 82 ** 2 - (i - 82) ** 2)),
              }));
              const side = sin >= 0 ? 1 : -1;
              return (
                rows
                  .map(
                    ({ y, w }, i) =>
                      `${i ? "L" : "M"}${650 + side * w} ${225 + y}`,
                  )
                  .join(" ") +
                rows
                  .reverse()
                  .map(({ y, w }) => `L${650 + side * c * w} ${225 + y}`)
                  .join(" ") +
                "Z"
              );
            })()}
          />
          {tx(45, 40, "太阳方向固定，月球绕地球运动")}
          {tx(560, 350, "地面所见")}
          {tx(
            485,
            400,
            `可见受光比例约 ${Math.round(illuminatedFraction(theta) * 100)}%`,
          )}
        </>
      );
      break;
    }
    case "eclipses": {
      const offset = value * 1.1,
        blockX = alternate ? 345 : 340,
        blockR = alternate ? 55 : 30,
        targetX = alternate ? 620 : 610,
        targetR = alternate ? 25 : 55,
        sunR = alternate ? 80 : 44,
        shadowEnd = Math.min(
          750,
          blockX + (blockR * (blockX - 80)) / (sunR - blockR),
        ),
        endRadius = Math.max(
          0,
          blockR - ((shadowEnd - blockX) * (sunR - blockR)) / (blockX - 80),
        );
      body = (
        <>
          <circle cx="80" cy="230" r={sunR} fill="#e6bf75" />
          <path d={`M80 186L740 70V390L80 274Z`} fill="#e3c075" opacity=".08" />
          <path
            d={`M${blockX} ${230 - blockR}L${shadowEnd} ${230 - endRadius}V${230 + endRadius}L${blockX} ${230 + blockR}Z`}
            fill="#091d2a"
          />
          {alternate ? (
            <Earth x={blockX} y={230} r={blockR} />
          ) : (
            <circle cx={blockX} cy="230" r={blockR} fill="#c2c0b3" />
          )}
          {alternate ? (
            <circle
              cx={targetX}
              cy={230 + offset}
              r={targetR}
              fill={offset < 55 ? "#967a6d" : "#c2c0b3"}
            />
          ) : (
            <Earth x={targetX} y={230 + offset} r={targetR} />
          )}
          {tx(
            40,
            45,
            alternate ? "月食：太阳 → 地球 → 月球" : "日食：太阳 → 月球 → 地球",
          )}
          {tx(55, 425, "仅表示对齐与错开；大小、锥角与轨道倾角未按比例")}
        </>
      );
      break;
    }
    case "seasons": {
      const ex = 400 + 240 * Math.cos(theta),
        ey = 240 + 90 * Math.sin(theta),
        northFacing = -Math.cos(theta),
        hem = alternate ? -1 : 1;
      body = (
        <>
          <ellipse
            cx="400"
            cy="240"
            rx="240"
            ry="90"
            fill="none"
            stroke="#7796a0"
          />
          <circle cx="400" cy="240" r="35" fill="#e3be70" />
          <path
            d={`M400 240L${ex} ${ey}`}
            stroke="#e3be70"
            strokeDasharray="7 8"
          />
          <Earth x={ex} y={ey} r={55} />
          <path
            d={`M${ex - 32} ${ey + 75}L${ex + 32} ${ey - 75}`}
            stroke="#ecdfb9"
            strokeWidth="4"
          />
          {tx(ex + 36, ey - 67, "N")}
          {tx(45, 45, "地轴在公转中保持近似相同的指向")}
          {tx(
            70,
            390,
            `${alternate ? "南" : "北"}半球：${hem * northFacing > 0.3 ? "较朝向太阳，夏季情境" : hem * northFacing < -0.3 ? "较背向太阳，冬季情境" : "日照接近春分或秋分情境"}`,
          )}
          {tx(70, 430, "地轴倾斜示意；二维投影与比例经过简化")}
        </>
      );
      break;
    }
    case "meteors": {
      const x = 130 + p * 530,
        y = 80 + p * 280;
      body = (
        <>
          <path d="M0 240Q400 180 800 240V450H0Z" fill="#31576b" />
          <path d="M0 400Q400 345 800 400V450H0Z" fill="#5b7873" />
          {p > 0.4 && p < 0.9 && (
            <path d={`M${x} ${y}l-90-85 45 77Z`} fill="#eab06c" />
          )}
          {(p < 0.92 || alternate) && (
            <path
              d={`M${x - 12} ${y - 8}l19-4 10 14-21 12-14-12Z`}
              fill="#a59a87"
            />
          )}
          {tx(
            40,
            45,
            p < 0.4
              ? "大气外：流星体"
              : p < 0.9
                ? "进入大气后的发光现象：流星"
                : alternate
                  ? "到达地面的残留：陨石"
                  : "物质未留下地面残留：没有陨石",
          )}
          {tx(45, 430, "名称跟随对象或现象变化；轨迹和尺寸为示意")}
        </>
      );
      break;
    }
    case "solar-system": {
      body = (
        <>
          {alternate ? (
            <>
              <path d="M70 200H740" stroke="#7897a6" />
              <circle cx="70" cy="200" r="16" fill="#edc47e" />
              {planets.map(([name, d, a, color], i) => (
                <g key={name}>
                  <circle
                    cx={70 + (a / 30.05) * 650}
                    cy="200"
                    r="5"
                    fill={color}
                  />
                  <path
                    d={`M${70 + (a / 30.05) * 650} 205V${230 + (i % 4) * 38}`}
                    stroke={color}
                  />
                  <text
                    x={70 + (a / 30.05) * 650}
                    y={250 + (i % 4) * 38}
                    fontSize="18"
                    fill={color}
                    transform={`rotate(35 ${70 + (a / 30.05) * 650} ${250 + (i % 4) * 38})`}
                  >
                    {name}
                  </text>
                </g>
              ))}
              {tx(45, 390, "距离按同一比例；位置标记不按大小比例")}
            </>
          ) : (
            <>
              {planets.map(([name, d, a, color], i) => {
                const x = [70, 140, 210, 280, 410, 575, 675, 750][i];
                return (
                  <g key={name}>
                    <circle cx={x} cy="220" r={d * 6} fill={color} />
                    <text
                      x={x}
                      y="330"
                      textAnchor="middle"
                      fontSize="21"
                      fill="#e9edef"
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
              {tx(50, 390, "圆的直径按同一比例；间距只为排版")}
            </>
          )}
          {tx(
            45,
            45,
            alternate
              ? "行星轨道尺度：海王星约为地球的 30 倍"
              : "行星大小：地球直径 = 1",
          )}
          {tx(50, 430, "仅展示八颗行星；太阳系的结构还延伸得更远")}
        </>
      );
      break;
    }
    default:
      return null;
  }
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label={`${id} 天文关系示意`}>
      <defs>
        <linearGradient id={`${uid}space`} x2="0" y2="1">
          <stop stopColor="#172c40" />
          <stop offset="1" stopColor="#294452" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${uid}space)`} />
      {body}
    </svg>
  );
}
export default function SpaceScene({ topic, scene, chapter }) {
  const [value, setValue] = useState(0),
    [alternate, setAlternate] = useState(false),
    [option, setOption] = useState(1),
    [playing, setPlaying] = useState(false);
  const animation = [
    "satellite",
    "moon-phases",
    "seasons",
    "reentry",
    "meteors",
  ].includes(topic.id);
  const range =
    !["spacesuit", "solar-system", "weightlessness"].includes(topic.id) ||
    (topic.id === "weightlessness" && alternate);
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
    const timer = setInterval(
      () =>
        setValue((v) => {
          if (v >= 100) {
            setPlaying(false);
            return 100;
          }
          return v + 1;
        }),
      100,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const change = (v) => {
    setPlaying(false);
    setValue(v);
  };
  const toggles = {
    weightlessness: ["看共同下落", "看地面静止"],
    eclipses: ["看月食", "看日食"],
    seasons: ["比较南半球", "比较北半球"],
    meteors: ["保留落地碎块", "不留下落地碎块"],
    "solar-system": ["比较轨道距离", "比较行星直径"],
  };
  return (
    <div>
      <SpaceDiagram
        id={topic.id}
        value={value}
        alternate={alternate}
        option={option}
      />
      <div className="science-controls">
        {topic.id === "satellite" && (
          <label>
            初始切向速度
            <select
              value={option}
              onChange={(e) => {
                setOption(Number(e.target.value));
                change(0);
              }}
            >
              {[
                [0.65, "较低速度"],
                [1, "圆轨道速度"],
                [1.2, "较高速度"],
                [1.6, "超过逃逸速度"],
              ].map(([v, t]) => (
                <option key={v} value={v}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        )}
        {range && (
          <label>
            {scene.control}
            <output>{value} / 100</output>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => change(Number(e.target.value))}
            />
          </label>
        )}
        {topic.id === "spacesuit" &&
          ["压力与气体", "冷却管路", "外部防护"].map((name, i) => (
            <Button
              key={name}
              aria-pressed={Math.floor(value / 34) === i}
              onClick={() => change(i * 34)}
            >
              {name}
            </Button>
          ))}
        {toggles[topic.id] && (
          <Button
            aria-pressed={alternate}
            onClick={() => {
              setAlternate((v) => !v);
              change(0);
            }}
          >
            {toggles[topic.id][alternate ? 1 : 0]}
          </Button>
        )}
        {animation && (
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
              onClick={() => change(Math.min(100, value + 10))}
            >
              下一步
            </Button>
          </>
        )}
        <Button
          onClick={() => {
            change(0);
            setAlternate(false);
            setOption(1);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      {topic.id === "solar-system" && (
        <div className="science-scale-data">
          <p>
            大小与距离分开比较：地球赤道直径取 1，日地平均距离取 1
            AU。轨道标记为便于看清而放大。
          </p>
          <dl>
            {planets.map(([name, diameter, distance]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>
                  {alternate
                    ? `${distance} AU`
                    : `直径约为地球的 ${diameter} 倍`}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <p className="science-caption" role="status">
        {topic.id === "solar-system"
          ? alternate
            ? "距离视图：以日地平均距离为 1 AU，比较各行星到太阳的平均距离。"
            : "直径视图：以地球直径为 1，比较各行星大小；间隔仅用于排版。"
          : scene.states[value < 50 ? 0 : 1]}
      </p>
    </div>
  );
}
