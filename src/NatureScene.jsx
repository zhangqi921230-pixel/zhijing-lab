import NatureExtensionScene from "./NatureExtensionScene.jsx";
import { isExtension } from "./natureExtension.mjs";
import React, { useId } from "react";
import { natureState } from "./natureModels.mjs";
import "./NatureScene.css";
const green = "var(--ui-primary)",
  ink = "var(--ui-ink)",
  gold = "var(--ui-gold)",
  line = "var(--ui-line)";
export default function NatureScene(props) {
  return isExtension(props.id) ? (
    <NatureExtensionScene {...props} />
  ) : (
    <OriginalNatureScene {...props} />
  );
}
function OriginalNatureScene({ id, p, time, guides = true }) {
  const uid = useId().replace(/:/g, "");
  const q = natureState(id, p, time);
  const arrow = (x, y, ex, ey, color = green) => {
    const a = Math.atan2(ey - y, ex - x);
    return (
      <g stroke={color} strokeWidth="3" fill={color}>
        <path fill="none" d={`M${x} ${y}L${ex} ${ey}`} />
        <path
          d={`M${ex} ${ey}l${-10 * Math.cos(a - 0.5)} ${-10 * Math.sin(a - 0.5)}M${ex} ${ey}l${-10 * Math.cos(a + 0.5)} ${-10 * Math.sin(a + 0.5)}`}
        />
      </g>
    );
  };
  const txt = (x, y, s, size = 18) => (
    <text x={x} y={y} fontSize={size} fill={ink}>
      {s}
    </text>
  );
  const title = {
    combustion: "三个条件，决定火焰能否维持",
    filtration: "留下泥沙，盐仍随水通过",
    breathing: "膈肌、胸廓与气流的协同",
    germination: "对照组与实验组：只改变一个条件",
    "sea-breeze": "沿着一圈空气，理解海陆风",
    "river-deposition": "从奔流到沉积，追踪一粒砂",
  }[id];
  return (
    <svg
      className="nature-scene"
      viewBox="0 0 900 560"
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${uid}glass`} x1="0" x2="1">
          <stop stopColor="#70b9c5" stopOpacity=".12" />
          <stop offset=".5" stopColor="#d6f0ef" stopOpacity=".4" />
          <stop offset="1" stopColor="#568da1" stopOpacity=".25" />
        </linearGradient>
        <linearGradient id={`${uid}flame`} x2="0" y2="1">
          <stop stopColor="#f5d278" />
          <stop offset="1" stopColor="#d75d36" />
        </linearGradient>
        <linearGradient id={`${uid}land`} x2="0" y2="1">
          <stop stopColor="#94ac65" />
          <stop offset="1" stopColor="#516b4c" />
        </linearGradient>
      </defs>
      <text x="32" y="38" fill={ink} fontSize="24" fontWeight="600">
        {title}
      </text>
      <path d="M32 60H868" stroke={line} />
      {id === "combustion" && (
        <>
          <ellipse
            cx="310"
            cy="438"
            rx="160"
            ry="22"
            fill={ink}
            opacity=".08"
          />
          <path d="M170 422H450L430 446H190Z" fill="#707d7c" />
          {p.fuel === 1 && (
            <g>
              <rect
                x="277"
                y="305"
                width="66"
                height="117"
                rx="7"
                fill="#dfcbaa"
              />
              <ellipse cx="310" cy="307" rx="33" ry="10" fill="#f1e7ce" />
              <path d="M310 306V280" stroke="#393d3b" strokeWidth="5" />
              {[290, 318, 331].map((x, i) => (
                <path
                  key={x}
                  d={`M${x} 315v${25 + i * 10}`}
                  stroke="#eee3ce"
                  strokeWidth="5"
                />
              ))}
            </g>
          )}
          {q.burning && (
            <g
              transform={`translate(310 283) scale(${1 + 0.04 * Math.sin(time * 13)} ${1 + 0.07 * Math.cos(time * 11)})`}
            >
              <ellipse cy="-45" rx="65" ry="100" fill="#e9b657" opacity=".08" />
              <path
                d="M0 0C-65-30-34-83 0-150C-8-85 61-52 26-13Q12 4 0 0"
                fill={`url(#${uid}flame)`}
              />
              <path d="M0-4Q-23-20 1-67Q35-22 0-4" fill="#fff0b4" />
            </g>
          )}
          {p.oxygen === 0 && (
            <g>
              <path
                d="M200 423V180Q200 140 240 140H380Q420 140 420 180V423"
                fill={`url(#${uid}glass)`}
                stroke="#6c9da4"
                strokeWidth="3"
              />
              <ellipse
                cx="310"
                cy="140"
                rx="70"
                ry="9"
                fill="#a4c6c9"
                opacity=".5"
              />
            </g>
          )}
          {[
            ["可燃物", p.fuel],
            ["氧气接触", p.oxygen],
            ["达到着火点", p.heat],
          ].map(([s, on], i) => (
            <g key={s}>
              <rect
                x="540"
                y={155 + i * 78}
                width="280"
                height="55"
                rx="10"
                fill={on ? green : line}
                opacity=".15"
              />
              {txt(560, 190 + i * 78, `${on ? "✓" : "—"} ${s}`)}
            </g>
          ))}
          {txt(
            540,
            430,
            q.burning ? "现象：持续燃烧" : "现象：不能持续燃烧",
            22,
          )}
        </>
      )}
      {id === "filtration" && (
        <>
          <path
            d="M120 150L280 150L280 295Q200 315 120 295Z"
            fill={`url(#${uid}glass)`}
            stroke="#6997a0"
            strokeWidth="3"
          />
          <path
            d={`M125 ${295 - 110 * (1 - q.passed)}H275V292Q200 310 125 292Z`}
            fill="#89ac9c"
            opacity=".5"
          />
          {Array.from({ length: p.salt }, (_, i) => (
            <circle
              key={`salt-${i}`}
              cx={143 + ((i * 27) % 120)}
              cy={280 - ((i * 17) % 75)}
              r="3"
              fill={gold}
              opacity={1 - q.passed}
            />
          ))}
          {Array.from({ length: p.sand }, (_, i) => (
            <circle
              key={i}
              cx={137 + ((i * 31) % 120)}
              cy={270 - ((i * 13) % 65)}
              r="4"
              fill="#9c764e"
              opacity={1 - q.passed}
            />
          ))}
          <path
            d="M360 145H580L495 300V355H445V300Z"
            fill={`url(#${uid}glass)`}
            stroke="#68949e"
            strokeWidth="3"
          />
          <path
            d="M375 157L470 280L565 157"
            fill="#f1e4c7"
            stroke="#b59e73"
            strokeWidth="3"
          />
          {Array.from({ length: p.sand }, (_, i) => (
            <circle
              key={i}
              cx={440 + ((i * 13) % 60)}
              cy={248 - (i % 4) * 7}
              r="4"
              fill="#97744a"
              opacity={q.passed}
            />
          ))}
          <path
            d="M385 367V478Q470 498 555 478V367"
            fill={`url(#${uid}glass)`}
            stroke="#68949e"
            strokeWidth="3"
          />
          <path
            d={`M390 ${478 - 85 * q.passed}H550V475Q470 493 390 475Z`}
            fill="#72b9ce"
            opacity=".45"
          />
          {q.passed > 0 &&
            q.passed < 1 &&
            [0, 1, 2].map((i) => (
              <ellipse
                key={i}
                cx="470"
                cy={335 + ((time * 80 + i * 20) % 55)}
                rx="4"
                ry="7"
                fill="#6fb7c9"
              />
            ))}
          {Array.from({ length: p.salt }, (_, i) => (
            <circle
              key={i}
              cx={405 + ((i * 23) % 130)}
              cy={468 - ((i * 11) % Math.max(1, 70 * q.passed))}
              r="3"
              fill={gold}
              opacity={q.passed}
            />
          ))}
          {guides && (
            <>
              {arrow(285, 205, 375, 175)}
              {txt(110, 123, "混合液")}
              {txt(610, 193, "滤纸截留泥沙")}
              {txt(610, 230, `滤渣：${q.sandHeld.toFixed(1)} 份`)}
              {txt(610, 390, "滤液仍含溶解盐")}
              {txt(610, 427, `盐：${q.saltOut.toFixed(1)} 份`)}
              <path d="M570 190H600M550 420H600" stroke={line} />
            </>
          )}
        </>
      )}
      {id === "breathing" && (
        <>
          <path
            d="M300 116Q205 130 185 290L205 440Q355 490 505 440L525 290Q505 130 410 116"
            fill={`url(#${uid}glass)`}
            stroke="#839e9b"
            strokeWidth="3"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M210 ${190 + i * 44}Q355 ${145 + i * 44} 500 ${190 + i * 44}`}
              fill="none"
              stroke={ink}
              opacity=".12"
              strokeWidth="5"
            />
          ))}
          <g
            transform={`translate(355 290) scale(${0.84 + (0.16 * q.cycle * p.depth) / 100}) translate(-355 -290)`}
          >
            <path
              d="M337 180Q250 140 234 240Q209 320 245 378Q282 416 337 367Z"
              fill="#d5948f"
              opacity=".8"
              stroke="#b46d70"
              strokeWidth="2"
            />
            <path
              d="M373 180Q460 140 476 240Q501 320 465 378Q428 416 373 367Z"
              fill="#d5948f"
              opacity=".8"
              stroke="#b46d70"
              strokeWidth="2"
            />
            {[0, 1, 2].map((i) => (
              <g key={i} stroke="#f0cac1" strokeWidth={6 - i} fill="none">
                <path
                  d={`M355 215L${300 - i * 15} ${265 + i * 38}l-28 28M355 215L${410 + i * 15} ${265 + i * 38}l28 28`}
                />
              </g>
            ))}
          </g>
          <path
            d="M355 95V220M355 210L300 270M355 210L410 270"
            stroke="#71999e"
            strokeWidth="17"
            fill="none"
          />
          {[110, 125, 140, 155, 170, 185].map((y) => (
            <path key={y} d={`M346 ${y}h18`} stroke="#b6caca" strokeWidth="3" />
          ))}
          <path
            d={`M210 420Q355 ${345 + (100 * q.cycle * p.depth) / 100} 500 420`}
            stroke="#c09562"
            strokeWidth="11"
            fill="none"
          />
          {q.inhale
            ? arrow(355, 112, 355, 190, gold)
            : arrow(355, 190, 355, 112, gold)}
          {txt(580, 180, q.inhale ? "吸气" : "呼气", 32)}
          {txt(580, 225, q.inhale ? "膈肌收缩 · 下降" : "膈肌舒张 · 上升")}
          {txt(
            580,
            265,
            q.inhale ? "胸廓扩大 · 空气进入" : "胸廓回缩 · 空气排出",
          )}
          {guides && (
            <>
              {txt(580, 365, "气流只经气管进出肺")}
              {txt(580, 400, "肺随胸廓被动扩张与回缩", 16)}
            </>
          )}
        </>
      )}
      {id === "germination" &&
        [q.growth, q.experiment].map((growth, i) => {
          const x = 235 + i * 420;
          return (
            <g key={i}>
              <ellipse
                cx={x}
                cy="409"
                rx="160"
                ry="55"
                fill={`url(#${uid}glass)`}
                stroke="#83a6a3"
                strokeWidth="2"
              />
              <ellipse
                cx={x}
                cy="398"
                rx="148"
                ry="44"
                fill="#c9bca0"
                opacity=".45"
              />
              <path
                d={`M${x} 395q${30 * growth} ${35 * growth} ${-35 * growth} ${68 * growth}`}
                fill="none"
                stroke="#ede0ba"
                strokeWidth="7"
              />
              {[0.3, 0.6, 0.9].map((v) => (
                <path
                  key={v}
                  d={`M${x - 25 * growth * v} ${400 + 60 * growth * v}l${-18 * growth} ${8 * growth}`}
                  stroke="#d2bf9c"
                  strokeWidth="2"
                />
              ))}
              <path
                d={`M${x} 390Q${x - 30 * growth} ${360 - 80 * growth} ${x} ${370 - 160 * growth}`}
                fill="none"
                stroke="#52895b"
                strokeWidth="8"
              />
              {growth > 0.15 && (
                <g
                  transform={`translate(${x} ${370 - 140 * growth}) scale(${growth})`}
                >
                  <path
                    d="M0 0Q-80-85-95-30Q-50 12 0 0M0 0Q80-85 95-30Q50 12 0 0"
                    fill="#77a66a"
                  />
                  <path d="M-85-30L0 0L85-30" fill="none" stroke="#dae4ae" />
                </g>
              )}
              <ellipse
                cx={x}
                cy="390"
                rx="28"
                ry="18"
                transform={`rotate(-20 ${x} 390)`}
                fill="#b78c57"
                stroke="#8c6945"
                strokeWidth="2"
              />
              {txt(x - 100, 125, i ? "实验组" : "对照组", 25)}
              {txt(
                x - 145,
                165,
                i
                  ? `${p.water ? "适量水" : "干燥"} · ${p.air ? "空气充足" : "缺少空气"} · ${p.temperature}°C`
                  : "适量水 · 空气充足 · 25°C",
                17,
              )}
              {txt(
                x - 95,
                490,
                growth > 0 ? "幼根先出，幼芽生长" : "尚未出现萌发现象",
                17,
              )}
            </g>
          );
        })}
      {id === "sea-breeze" && (
        <>
          <path d="M30 375H450V478H30Z" fill="#619dad" opacity=".45" />
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M35 ${395 + i * 20}q35-10 70 0t70 0t70 0t70 0t70 0t70 0`}
              fill="none"
              stroke="#8fc3cf"
              opacity=".65"
            />
          ))}
          <path
            d="M450 375Q520 350 575 360L660 335L868 365V478H450Z"
            fill={`url(#${uid}land)`}
          />
          {[590, 640, 750, 810].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 360v-25`} stroke="#715a41" strokeWidth="4" />
              <path
                d={`M${x - 17} 344l17-45 17 45Z`}
                fill={i % 2 ? "#547750" : "#738b55"}
              />
            </g>
          ))}
          <circle
            cx="786"
            cy="123"
            r="29"
            fill={q.day ? "#e8bc65" : "#bac9d4"}
          />
          {txt(105, 462, "海洋", 22)}
          {txt(710, 462, "陆地", 22)}
          <path
            d="M220 330L670 330L670 190L220 190Z"
            stroke={line}
            strokeDasharray="6 8"
            fill="none"
          />
          {p.contrast > 0 && (
            <>
              {q.day ? (
                <>
                  {arrow(300, 330, 550, 330)}
                  {arrow(670, 305, 670, 210, gold)}
                  {arrow(550, 190, 300, 190)}
                  {arrow(220, 210, 220, 305)}
                </>
              ) : (
                <>
                  {arrow(550, 330, 300, 330)}
                  {arrow(220, 305, 220, 210, gold)}
                  {arrow(300, 190, 550, 190)}
                  {arrow(670, 210, 670, 305)}
                </>
              )}
              {Array.from({ length: 10 }, (_, i) => {
                let a = ((q.phase * q.strength + i / 10) % 1) * 1180;
                if (!q.day) a = 1180 - a;
                const x =
                  a < 450
                    ? 220 + a
                    : a < 590
                      ? 670
                      : a < 1040
                        ? 670 - (a - 590)
                        : 220;
                const y =
                  a < 450
                    ? 330
                    : a < 590
                      ? 330 - (a - 450)
                      : a < 1040
                        ? 190
                        : 190 + (a - 1040);
                return <circle key={i} cx={x} cy={y} r="5" fill={gold} />;
              })}
            </>
          )}
          {guides && (
            <>
              {txt(
                290,
                300,
                p.contrast === 0
                  ? "无热力差异驱动"
                  : q.day
                    ? "近地面：海风 →"
                    : "近地面：← 陆风",
                20,
              )}
              {txt(
                265,
                150,
                q.day ? "高空回流：陆 → 海" : "高空回流：海 → 陆",
                18,
              )}
            </>
          )}
        </>
      )}
      {id === "river-deposition" && (
        <>
          <path
            d="M40 220L180 155L320 210L450 285L640 330L860 340V470H40Z"
            fill={`url(#${uid}land)`}
          />
          <path
            d="M55 235Q190 200 325 270T600 350T855 370"
            stroke="#619fb6"
            strokeWidth="58"
            fill="none"
          />
          <path
            d="M55 235Q190 200 325 270T600 350T855 370"
            stroke="#b5d8d7"
            strokeWidth="2"
            strokeDasharray="15 10"
            strokeDashoffset={-time * p.flow}
            fill="none"
          />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M40 ${425 + i * 14}H860`}
              stroke="#b1a17e"
              strokeWidth="5"
              opacity=".35"
            />
          ))}
          {Array.from({ length: 16 }, (_, i) => {
            const u = q.transport
              ? (q.phase + i / 16) % 1
              : Math.min(0.62, time / 6 + i / 40);
            const x = 80 + 750 * u;
            const y =
              225 +
              145 * Math.sin((u * Math.PI) / 2) +
              (q.transport ? 0 : 15 * Math.min(1, time / 3));
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={2 + p.grain}
                fill="#cfb382"
                stroke="#8a7452"
                strokeWidth="1"
              />
            );
          })}
          {[110, 230, 350, 705, 795].map((x) => (
            <g key={x}>
              <path d={`M${x} 205v-40`} stroke="#6f674c" strokeWidth="4" />
              <path d={`M${x - 15} 183l15-45 15 45Z`} fill="#6d8758" />
            </g>
          ))}
          {txt(70, 125, "上游 · 较陡", 22)}
          {txt(620, 280, "下游 · 较缓", 22)}
          {guides && (
            <>
              {txt(
                80,
                505,
                q.transport
                  ? "颗粒沿河道继续搬运"
                  : "搬运能力不足，颗粒停留在河床",
                21,
              )}
              {txt(
                80,
                98,
                `坡度 ${p.slope} · 水量 ${p.flow} · 粒径 ${p.grain}（均为示意指数）`,
                16,
              )}
            </>
          )}
        </>
      )}
    </svg>
  );
}
