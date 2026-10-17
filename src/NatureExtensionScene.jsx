import React, { useId } from "react";
import { extensionState, extensionTopics } from "./natureExtension.mjs";
const ink = "var(--ui-ink)",
  green = "var(--ui-primary)",
  gold = "var(--ui-gold)",
  blue = "#4c9fbd";
const text = (x, y, s, size = 18) => (
  <text x={x} y={y} fill={ink} fontSize={size}>
    {s}
  </text>
);
const dots = (n, fn) =>
  Array.from({ length: n }, (_, i) => (
    <React.Fragment key={i}>{fn(i)}</React.Fragment>
  ));
export default function NatureExtensionScene({
  id,
  p,
  time = 0,
  guides = true,
}) {
  const uid = useId().replace(/:/g, "");
  const q = extensionState(id, p, time);
  const title = extensionTopics.find((x) => x.id === id).title;
  const cloud = (x, y) => (
    <g fill={blue} opacity=".28">
      <ellipse cx={x} cy={y} rx="56" ry="21" />
      <ellipse cx={x - 23} cy={y - 13} rx="24" ry="25" />
      <ellipse cx={x + 16} cy={y - 18} rx="29" ry="28" />
    </g>
  );
  const leaf = (x, y, a = 0) => (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <path
        d="M0 0Q-55 -60 -100 -15Q-55 25 0 0"
        fill={`url(#${uid}leaf)`}
        stroke={green}
      />
      <path
        d="M0 0L-85 -14M-35 -6L-47 -25M-55 -10L-65 0"
        fill="none"
        stroke={green}
      />
    </g>
  );
  return (
    <svg
      className="nature-scene"
      viewBox="0 0 900 560"
      role="img"
      aria-label={`${title}：动态教学示意`}
    >
      <defs>
        <linearGradient id={`${uid}glass`}>
          <stop stopColor={blue} stopOpacity=".2" />
          <stop offset=".45" stopColor={blue} stopOpacity=".03" />
          <stop offset="1" stopColor={blue} stopOpacity=".25" />
        </linearGradient>
        <linearGradient id={`${uid}leaf`} x2="0" y2="1">
          <stop stopColor="#9fbc65" />
          <stop offset="1" stopColor="#3c8065" />
        </linearGradient>
        <linearGradient id={`${uid}metal`}>
          <stop stopColor="#667b80" />
          <stop offset=".4" stopColor="#d1d9d7" />
          <stop offset="1" stopColor="#647477" />
        </linearGradient>
        <linearGradient id={`${uid}earth`} x2="0" y2="1">
          <stop stopColor="#89a373" />
          <stop offset="1" stopColor="#a18a65" />
        </linearGradient>
      </defs>
      {text(32, 42, title, 25)}
      {text(32, 73, "观察 · 对照 · 解释", 14)}
      {id === "crystallization" && (
        <>
          <path
            d="M130 170V420Q130 450 170 450H420Q460 450 460 420V170"
            fill={`url(#${uid}glass)`}
            stroke={blue}
            strokeWidth="3"
          />
          <path
            d={`M134 ${440 - q.water * 2}H456V420Q456 446 420 446H170Q134 446 134 420Z`}
            fill={blue}
            opacity=".25"
          />
          <ellipse
            cx="295"
            cy={440 - q.water * 2}
            rx="160"
            ry="12"
            fill={blue}
            opacity=".2"
          />
          {dots(9, (i) => (
            <g>
              <path
                d={`M135 ${240 + i * 20}h${i % 2 ? 12 : 22}`}
                stroke={ink}
              />
              {i % 2 === 0 && text(98, 245 + i * 20, 100 - i * 10, 12)}
            </g>
          ))}
          {dots(Math.round(q.dissolved), (i) => (
            <circle
              cx={165 + ((i * 71) % 260)}
              cy={435 - ((i * 37 + time * 8) % Math.max(10, q.water * 1.8))}
              r="3"
              fill={blue}
            />
          ))}
          {dots(Math.ceil(q.crystal), (i) => (
            <g
              transform={`translate(${170 + ((i * 37) % 250)} ${428 - Math.floor(i / 7) * 13}) rotate(${i * 29})`}
            >
              <rect width="12" height="12" fill="#d2b16b" stroke={gold} />
              <path d="M0 0L12 12M0 12L12 0" stroke={gold} opacity=".4" />
            </g>
          ))}
          {p.evaporation > 0 &&
            dots(12, (i) => {
              const z = (time / 4 + i / 12) % 1;
              return (
                <circle
                  cx={170 + i * 23 + Math.sin(z * 6) * 8}
                  cy={430 - q.water * 2 - z * 130}
                  r="3"
                  fill={blue}
                  opacity={1 - z}
                />
              );
            })}
          {text(565, 160, "溶质质量收支", 22)}
          {text(565, 200, `初始盐：${p.salt.toFixed(0)} g`)}
          <rect
            x="565"
            y="235"
            width="280"
            height="38"
            fill={gold}
            opacity=".2"
          />
          <rect
            x="565"
            y="235"
            width={(280 * q.dissolved) / p.salt}
            height="38"
            fill={blue}
          />
          <rect
            x={565 + (280 * q.dissolved) / p.salt}
            y="235"
            width={(280 * q.crystal) / p.salt}
            height="38"
            fill={gold}
          />
          {text(565, 310, `溶解 ${q.dissolved.toFixed(1)} g`)}
          {text(565, 345, `结晶 ${q.crystal.toFixed(1)} g`)}
          {text(565, 390, "蓝色：溶液中 · 金色：晶体", 16)}
          {guides && text(160, 490, "蒸发只移走水分；晶体留在容器内", 18)}
          {guides &&
            text(160, 520, "圆点示意溶解的溶质；底部方块示意析出的晶体", 15)}
        </>
      )}
      {id === "rusting" &&
        [0, 1].map((j) => {
          const x = 200 + j * 420,
            rust = j ? q.rust : q.progress,
            wet = j ? p.water : 1;
          return (
            <g key={j}>
              <path
                d={`M${x - 85} 160V405Q${x - 85} 470 ${x} 470Q${x + 85} 470 ${x + 85} 405V160`}
                fill={`url(#${uid}glass)`}
                stroke={blue}
                strokeWidth="3"
              />
              {wet === 1 && (
                <path
                  d={`M${x - 81} 345H${x + 81}V405Q${x + 81} 465 ${x} 465Q${x - 81} 465 ${x - 81} 405Z`}
                  fill={blue}
                  opacity=".18"
                />
              )}
              <path
                d={`M${x - 20} 220h40v13h-13v178l-7 18-7-18V233h-13Z`}
                fill={j && p.coating ? green : `url(#${uid}metal)`}
                stroke={ink}
              />
              {dots(45, (i) => (
                <ellipse
                  cx={x - 5 + ((i * 13) % 11)}
                  cy={240 + ((i * 31) % 175)}
                  rx={2 + (i % 3)}
                  ry="4"
                  fill="#b46b39"
                  opacity={rust * (((i % 4) + 1) / 4)}
                />
              ))}
              {text(
                x - 115,
                120,
                j ? "实验组：改变条件" : "对照组：水 + 氧气",
                20,
              )}
              {guides &&
                text(
                  x - 105,
                  510,
                  j
                    ? p.coating
                      ? "完整涂层阻断接触"
                      : !p.water
                        ? "干燥条件"
                        : !p.oxygen
                          ? "理想隔氧条件"
                          : "裸露铁接触水与氧气"
                    : "固定条件，提供比较依据",
                  16,
                )}
              {!wet && (
                <g>
                  {dots(12, (i) => (
                    <circle
                      cx={x - 55 + (i % 6) * 20}
                      cy={435 + Math.floor(i / 6) * 14}
                      r="6"
                      fill={gold}
                      opacity=".5"
                    />
                  ))}
                  {text(x - 38, 390, "干燥", 16)}
                </g>
              )}
              {j === 1 && !p.oxygen && (
                <rect
                  x={x - 90}
                  y="150"
                  width="180"
                  height="16"
                  rx="4"
                  fill={gold}
                />
              )}
            </g>
          );
        })}
      {id === "transpiration" && (
        <>
          <path
            d="M75 425H500V500H75Z"
            fill={`url(#${uid}earth)`}
            opacity=".4"
          />
          <path d="M270 425V180" stroke={green} strokeWidth="18" />
          <path d="M270 425V180" stroke={blue} strokeWidth="3" />
          {[240, 305, 370].map((y, i) => (
            <g key={y}>
              {leaf(270, y, -10)}
              {leaf(270, y + 10, 180)}
            </g>
          ))}
          {dots(9, (i) => (
            <path
              d={`M270 420Q${180 + i * 23} 460 ${130 + i * 36} ${470 + (i % 3) * 9}`}
              stroke={gold}
              strokeWidth="2"
              fill="none"
            />
          ))}
          {q.flux > 0 &&
            dots(18, (i) => (
              <circle
                cx="270"
                cy={425 - ((time * q.flux * 60 + i * 18) % 245)}
                r="4"
                fill={blue}
              />
            ))}
          {q.flux > 0 &&
            dots(16, (i) => {
              const z = (time * q.flux * 0.7 + i / 16) % 1;
              return (
                <circle
                  cx={180 + (i % 5) * 42 + z * 35}
                  cy={220 - z * 110}
                  r="3"
                  fill={blue}
                  opacity={1 - z}
                />
              );
            })}
          <path d="M375 260L550 215" stroke={gold} strokeDasharray="5 5" />
          <circle
            cx="690"
            cy="270"
            r="120"
            fill={`url(#${uid}glass)`}
            stroke={blue}
          />
          <path
            d={`M675 190Q${610 - p.opening * 0.1} 270 675 350Q${705 - p.opening * 0.5} 270 675 190`}
            fill={green}
            opacity=".6"
          />
          <path
            d={`M705 190Q${770 + p.opening * 0.1} 270 705 350Q${675 + p.opening * 0.5} 270 705 190`}
            fill={green}
            opacity=".6"
          />
          {q.flux > 0 &&
            dots(10, (i) => {
              const z = (time * q.flux + i / 10) % 1;
              return (
                <circle
                  cx={686 + (i % 3) * 5}
                  cy={330 - z * 120}
                  r="3"
                  fill={blue}
                />
              );
            })}
          {text(590, 130, "叶片气孔 · 放大示意", 20)}
          {text(600, 435, `蒸腾相对指数 ${q.flux.toFixed(2)}`, 20)}
          {guides && (
            <>
              {text(80, 525, "根吸水 → 茎中导管 → 叶片散失", 18)}
              {text(615, 478, "蓝点表示水分路径", 16)}
            </>
          )}
        </>
      )}
      {id === "pollination" && (
        <>
          <path d="M310 485V350" stroke={green} strokeWidth="14" />
          {leaf(310, 450)}
          {[-60, -30, 30, 60].map((a) => (
            <ellipse
              key={a}
              cx="310"
              cy="230"
              rx="60"
              ry="125"
              transform={`rotate(${a} 310 330)`}
              fill="#cd8295"
              fillOpacity={0.32 * (1 - q.fruitGrowth)}
              stroke="#bc7287"
            />
          ))}
          <ellipse
            cx="310"
            cy="345"
            rx={42 + 30 * q.fruitGrowth}
            ry={53 + 27 * q.fruitGrowth}
            fill={q.fruit ? "#d8ab52" : green}
            fillOpacity=".5"
            stroke={green}
            strokeWidth="2"
          />
          <path
            d="M299 305V184Q275 180 286 166Q310 152 334 166Q346 180 321 184V305"
            fill={green}
            opacity=".55"
          />
          {[210, 245, 375, 410].map((x, i) => (
            <g key={x}>
              <path
                d={`M310 360Q${x} 290 ${x} ${200 + (i % 2) * 25}`}
                fill="none"
                stroke={gold}
                strokeWidth="3"
              />
              <ellipse
                cx={x}
                cy={200 + (i % 2) * 25}
                rx="13"
                ry="7"
                fill={gold}
              />
            </g>
          ))}
          <ellipse
            cx="310"
            cy="350"
            rx={11 + 4 * q.fruitGrowth}
            ry="17"
            fill={q.fruit ? "#785b34" : "#e3c98e"}
          />
          {p.pollen === 1 &&
            dots(7, (i) => (
              <circle
                cx={290 + i * 6}
                cy={162 - (i % 2) * 6}
                r="3"
                fill={gold}
              />
            ))}
          <path
            d="M310 172V317Q330 345 310 350"
            fill="none"
            stroke={gold}
            strokeWidth="4"
            pathLength="1"
            strokeDasharray={`${q.tube} 1`}
          />
          <path d="M380 345H535" stroke={gold} strokeDasharray="5 5" />
          {text(555, 175, q.fruit ? "果实与种子的来源" : "花的纵剖面", 23)}
          {text(555, 225, "柱头：接受花粉")}
          {text(555, 265, "花柱：花粉管经过")}
          {text(555, 305, "子房：包含胚珠")}
          {text(555, 375, q.fruit ? "子房 → 果实" : "胚珠内发生受精", 22)}
          {text(
            555,
            415,
            q.fruit
              ? "胚珠 → 种子"
              : q.tube > 0
                ? "金线：正在生长的花粉管"
                : p.pollen && p.compatible
                  ? "花粉准备萌发"
                  : "等待相容花粉",
            18,
          )}
          {guides && text(105, 525, "花粉到达柱头，不等于已经完成受精。", 18)}
        </>
      )}
      {id === "rain-shadow" &&
        (() => {
          const peak = 440 - p.height * 0.1,
            base = 440 - p.cloudbase * 0.1;
          return (
            <>
              <path
                d={`M60 440L220 400L450 ${peak}L650 390L840 440V485H60Z`}
                fill={`url(#${uid}earth)`}
              />
              <path
                d={`M450 ${peak}L485 360L650 390Z`}
                fill="#46594a"
                opacity=".25"
              />
              <path
                d={`M450 ${peak}L335 375L220 400Z`}
                fill="#bec69a"
                opacity=".35"
              />
              {dots(7, (i) => (
                <path
                  d={`M${270 + i * 24} ${410 - i * 12}Q440 ${430 - i * 22} ${620 - i * 12} ${415 - i * 8}`}
                  fill="none"
                  stroke={gold}
                  opacity=".2"
                />
              ))}
              <path
                d={`M450 ${peak}L510 ${peak + 85}L475 ${peak + 60}L450 ${peak + 83}L425 ${peak + 60}L389 ${peak + 88}Z`}
                fill="#e5e5d4"
                opacity=".7"
              />
              <path d={`M60 ${base}H840`} stroke={blue} strokeDasharray="6 6" />
              {text(65, base - 12, `凝结高度 ${p.cloudbase} m`, 16)}
              {dots(24, (i) => {
                const a = (time / 7 + i / 24) % 1;
                const x = 80 + 740 * (p.wind ? a : 1 - a);
                const y =
                  405 -
                  (440 - peak) * Math.sin((Math.PI * (x - 80)) / 740) -
                  55;
                return (
                  <path
                    d={`M${x} ${y}l${p.wind ? -12 : 12} -5m${p.wind ? 12 : -12} 5l${p.wind ? -12 : 12} 5`}
                    stroke={blue}
                    fill="none"
                    strokeWidth="2"
                  />
                );
              })}
              {q.rain > 0 && (
                <>
                  {cloud(p.wind ? 355 : 545, peak - 5)}
                  {dots(Math.ceil(q.rain * 35), (i) => {
                    const x = (p.wind ? 305 : 505) + ((i * 19) % 85),
                      y = peak + 25 + ((time * 90 + i * 17) % 105);
                    return (
                      <path d={`M${x} ${y}l-4 10`} stroke={blue} opacity=".7" />
                    );
                  })}
                </>
              )}
              {dots(15, (i) => {
                const x = (p.wind ? 110 : 620) + i * 11;
                return (
                  <g>
                    <path d={`M${x} 425v20`} stroke={gold} />
                    <path
                      d={`M${x - 6} 431l6-20 6 20Z`}
                      fill={green}
                      opacity=".65"
                    />
                  </g>
                );
              })}
              {text(
                95,
                510,
                p.wind ? "迎风坡 · 抬升冷却" : "背风坡 · 下沉增温",
                20,
              )}
              {text(
                565,
                510,
                p.wind ? "背风坡 · 下沉增温" : "迎风坡 · 抬升冷却",
                20,
              )}
              {guides &&
                text(
                  575,
                  120,
                  q.rain > 0 ? "迎风坡形成云雨" : "未达到凝结高度",
                  20,
                )}
            </>
          );
        })()}
      {id === "rock-cycle" &&
        (() => {
          const nodes = [
            [115, 270, "岩浆"],
            [285, 145, "岩浆岩"],
            [580, 145, "沉积物"],
            [765, 270, "沉积岩"],
            [480, 420, "变质岩"],
          ];
          const edges = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 0],
          ];
          return (
            <>
              {edges.map(([a, b], i) => {
                const A = nodes[a],
                  B = nodes[b],
                  active = i + 1 === p.process,
                  z = q.progress;
                return (
                  <g key={i}>
                    <path
                      d={`M${A[0]} ${A[1]}L${B[0]} ${B[1]}`}
                      stroke={active ? gold : ink}
                      strokeOpacity={active ? 1 : 0.2}
                      strokeWidth={active ? 5 : 2}
                    />
                    {active && (
                      <circle
                        cx={A[0] + (B[0] - A[0]) * z}
                        cy={A[1] + (B[1] - A[1]) * z}
                        r="9"
                        fill={gold}
                      />
                    )}
                  </g>
                );
              })}
              {nodes.map(([x, y, label], i) => (
                <g key={label}>
                  <path
                    d={`M${x - 66} ${y + 25}L${x - 59} ${y - 26}L${x - 25} ${y - 42}L${x + 43} ${y - 34}L${x + 66} ${y - 10}L${x + 57} ${y + 36}L${x - 39} ${y + 40}Z`}
                    fill={
                      i === 0
                        ? "#af6646"
                        : i === 2
                          ? "#a99570"
                          : i === 4
                            ? "#82938a"
                            : "#9b9c89"
                    }
                    stroke={ink}
                    strokeWidth="2"
                  />
                  <path
                    d={`M${x - 59} ${y - 26}L${x - 30} ${y - 10}L${x + 43} ${y - 34}L${x - 25} ${y - 42}Z`}
                    fill="#f4ecd9"
                    opacity=".25"
                  />
                  {dots(16, (j) =>
                    i === 2 ? (
                      <circle
                        cx={x - 52 + (j % 6) * 19}
                        cy={y - 25 + Math.floor(j / 6) * 22}
                        r="5"
                        fill={gold}
                      />
                    ) : i >= 3 ? (
                      <path
                        d={`M${x - 58} ${y - 29 + j * 4}q35 ${i === 4 ? 10 * Math.sin(j) : 0} 116 0`}
                        stroke={ink}
                        opacity=".25"
                        fill="none"
                      />
                    ) : (
                      <circle
                        cx={x - 50 + (j % 5) * 24}
                        cy={y - 25 + Math.floor(j / 5) * 17}
                        r={i === 0 ? 4 : 2}
                        fill={i === 0 ? "#e8a75c" : ink}
                        opacity=".5"
                      />
                    ),
                  )}
                  <rect
                    x={x - 60}
                    y={y + 48}
                    width="120"
                    height="29"
                    rx="5"
                    fill="var(--ui-paper)"
                  />
                  {text(x - 36, y + 69, label, 20)}
                </g>
              ))}
              {text(
                325,
                270,
                [
                  "",
                  "冷却凝固",
                  "风化 · 搬运 · 沉积",
                  "压实 · 胶结",
                  "未熔融条件下变质",
                  "熔融",
                ][p.process],
                22,
              )}
              <g transform="translate(335 295)">
                <rect
                  width="260"
                  height="67"
                  rx="8"
                  fill="var(--ui-paper)"
                  stroke={gold}
                  strokeOpacity=".3"
                />
                {p.process === 1 && (
                  <>
                    <rect
                      x="12"
                      y="10"
                      width="236"
                      height="47"
                      rx="12"
                      fill="#ab7357"
                    />
                    {dots(24, (i) => (
                      <rect
                        x={20 + (i % 12) * 19}
                        y={18 + Math.floor(i / 12) * 24}
                        width={3 + q.progress * 11}
                        height={3 + q.progress * 11}
                        rx="1"
                        fill="#c5bdae"
                        opacity={0.2 + q.progress * 0.8}
                      />
                    ))}
                  </>
                )}
                {p.process === 2 &&
                  dots(18, (i) => (
                    <path
                      d={`M${25 + (i % 9) * (19 + q.progress * 6)} ${15 + Math.floor(i / 9) * 23 + q.progress * (i % 3) * 5}l12 -3 5 12-13 4Z`}
                      fill="#9b9c89"
                      stroke={gold}
                      strokeWidth=".6"
                    />
                  ))}
                {p.process === 3 && (
                  <>
                    <rect
                      x="10"
                      y={10 + q.progress * 17}
                      width="240"
                      height={48 - q.progress * 17}
                      fill={gold}
                      opacity={q.progress * 0.4}
                    />
                    {dots(36, (i) => (
                      <circle
                        cx={17 + (i % 18) * 13}
                        cy={
                          17 +
                          Math.floor(i / 18) * (30 - q.progress * 18) +
                          q.progress * 12
                        }
                        r="5"
                        fill="#a99570"
                      />
                    ))}
                  </>
                )}
                {p.process === 4 &&
                  dots(7, (i) => (
                    <path
                      d={`M12 ${12 + i * 7}q50 ${q.progress * 18} 116 0t120 0`}
                      stroke={i % 2 ? gold : green}
                      strokeWidth="4"
                      fill="none"
                    />
                  ))}
                {p.process === 5 && (
                  <>
                    <ellipse
                      cx="130"
                      cy="44"
                      rx={20 + q.progress * 99}
                      ry={8 + q.progress * 9}
                      fill="#b86c47"
                    />
                    {dots(7, (i) => (
                      <rect
                        x={30 + i * 30}
                        y={16 + q.progress * 17}
                        width={20 * (1 - q.progress)}
                        height={24 * (1 - q.progress)}
                        rx="4"
                        fill="#9b9c89"
                      />
                    ))}
                  </>
                )}
              </g>
              {guides &&
                text(
                  145,
                  535,
                  "这里只突出一条代表路径；各类岩石可以走向不同的转化。",
                  17,
                )}
            </>
          );
        })()}
    </svg>
  );
}
