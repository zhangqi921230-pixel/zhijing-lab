import React from "react";
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
export function PlantDiagram({ id, value = 35, variant = 0 }) {
  const p = value / 100;
  let body;
  switch (id) {
    case "autumn-leaves": {
      const leaf = "M330 105Q485 120 455 295Q410 385 245 370Q170 235 330 105";
      body = (
        <>
          <path d={leaf} fill="#d4b055" />
          <path d={leaf} fill="#63946a" opacity={1 - p} />
          {!!variant && <path d={leaf} fill="#bd6655" opacity={p * 0.85} />}
          {ln(
            "M245 420L355 180M280 325l-50-30m70-17l95-20m-80-30l-50-25",
            "#9bb288",
            5,
          )}
          {[
            ["叶绿素", 1 - p, "#78a377"],
            ["黄橙色素", 0.65, "#d9bb62"],
            ["花青素", variant ? p : 0, "#c57673"],
          ].map(([name, v, c], i) => (
            <g key={name}>
              {tx(525, 180 + i * 95, name)}
              <rect
                x="525"
                y={195 + i * 95}
                width={160 * v}
                height="16"
                fill={c}
              />
            </g>
          ))}
          {tx(140, 470, "相对变化示意，不表示实测色素含量")}
        </>
      );
      break;
    }
    case "lotus-leaf": {
      const x = 185 + p * 420;
      body = (
        <>
          <rect x="90" y="340" width="620" height="70" fill="#719779" />
          {!variant &&
            Array.from({ length: 15 }, (_, i) => (
              <path
                key={i}
                d={`M${90 + i * 41} 340q20-65 40 0`}
                fill="#89b384"
              />
            ))}
          <ellipse
            cx={x}
            cy={variant ? 305 : 250}
            rx={variant ? 96 : 58}
            ry={variant ? 35 : 58}
            fill="#87bdcd"
            opacity=".9"
            stroke="#b9d9dc"
            strokeWidth="3"
          />
          {[280, 400, 520, 640].map((d, i) => {
            const collected = !variant && x > d;
            return (
              <circle
                key={d}
                cx={collected ? x - 25 + i * 13 : d}
                cy={collected ? 260 : 306}
                r="5"
                fill="#bdad8a"
              />
            );
          })}
          {tx(
            120,
            115,
            variant ? "易润湿表面：水更易铺展开" : "微结构与蜡质：减少有效接触",
          )}
          {tx(120, 465, "水滴、表面与颗粒均为放大示意")}
        </>
      );
      break;
    }
    case "seed-travel": {
      const x = 130 + p * 530,
        y =
          variant === 0
            ? 140 + p * 160 + Math.sin(p * 12) * 25
            : variant === 1
              ? 315 + Math.sin(p * 12) * 6
              : variant === 2
                ? 260
                : 340 - 180 * Math.sin(p * Math.PI);
      body = (
        <>
          {variant === 1 ? (
            <>
              <path
                d="M70 330Q160 310 250 330T430 330T610 330T760 330V430H70Z"
                fill="#4f8b9c"
              />
            </>
          ) : (
            <rect x="70" y="400" width="680" height="30" fill="#496c58" />
          )}
          {variant === 2 && (
            <ellipse cx={x} cy="300" rx="70" ry="42" fill="#b7a086" />
          )}
          <g transform={`translate(${x},${y})`}>
            {variant === 0 ? (
              <>
                {ln("M0 30V-30", "#dad4ae", 3)}
                {[-45, -25, 0, 25, 45].map((z) =>
                  ln(`M0-30L${z}-60`, "#dad4ae", 2),
                )}
                <ellipse cy="35" rx="6" ry="14" fill="#ba9b6e" />
              </>
            ) : variant === 1 ? (
              <ellipse
                rx="30"
                ry="20"
                fill="#b09869"
                stroke="#d4bd8b"
                strokeWidth="7"
              />
            ) : variant === 2 ? (
              <>
                <circle r="18" fill="#aab57a" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <path
                    key={i}
                    d="M0-14v-12q10-7 9 2"
                    transform={`rotate(${i * 60})`}
                    stroke="#c9ca94"
                    fill="none"
                    strokeWidth="3"
                  />
                ))}
              </>
            ) : (
              <ellipse rx="10" ry="15" fill="#c6aa73" />
            )}
          </g>
          {variant === 3 && (
            <path
              d="M100 350q-65-60-25-140q-5 90 35 110q40-50 25-110q45 100-30 140"
              fill="#86a46f"
            />
          )}
          {tx(
            100,
            90,
            [
              "风传播：毛或翅帮助受风",
              "水传播：适合漂浮的果实",
              "动物传播：钩挂在毛发上",
              "弹射传播：结构释放储存的能量",
            ][variant],
          )}
          {tx(140, 475, "到达新地点后，还要满足萌发生长条件")}
        </>
      );
      break;
    }
    case "germination": {
      const g = variant ? 0 : p,
        lift = Math.max(0, g - 0.35) * 160;
      body = (
        <>
          <rect x="100" y="345" width="600" height="125" fill="#776d54" />
          {g > 0.1 &&
            ln(`M400 ${330 - lift}Q420 360 400 ${355 + g * 100}`, "#d9d2ad", 9)}
          {[0, 1, 2].map(
            (i) =>
              g > 0.4 &&
              ln(
                `M405 ${370 + i * 20}l${i % 2 ? 35 : -35} ${20 * g}`,
                "#d9d2ad",
                4,
              ),
          )}
          <ellipse
            cx={370 - g * 22}
            cy={310 - lift}
            rx="40"
            ry="65"
            fill="#c6ab77"
            stroke="#958263"
            strokeWidth={g > 0.4 ? 2 : 7}
          />
          <ellipse
            cx={430 + g * 22}
            cy={310 - lift}
            rx="40"
            ry="65"
            fill="#c6ab77"
            stroke="#958263"
            strokeWidth={g > 0.4 ? 2 : 7}
          />
          {ln(`M400 ${330 - lift}V${300 - lift - g * 95}`, "#8aac79", 9)}
          {g > 0.5 && (
            <>
              <path
                d={`M400 ${260 - lift}q-100-90-105-30q25 60 105 30`}
                fill="#85a96f"
              />
              <path
                d={`M400 ${260 - lift}q100-90 105-30q-25 60-105 30`}
                fill="#9ab780"
              />
            </>
          )}
          {tx(
            115,
            110,
            variant
              ? "缺水：本次过程不能正常推进"
              : "典型豆类：种皮 → 胚根 → 子叶与幼叶",
          )}
          {tx(550, 300, "子叶储备")}
          {ln(`M540 294L${445 + g * 22} ${310 - lift}`, "#c6ab77", 2)}
          {tx(530, 430, "根向下生长")}
        </>
      );
      break;
    }
    case "flower-fruit": {
      const mature = Math.max(0, (p - 0.6) / 0.4),
        ovary = 55 + mature * 65;
      body = (
        <>
          {ln("M400 440V325", "#9fbc84", 16)}
          <g opacity={1 - mature}>
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={i}
                cx="400"
                cy="200"
                rx="45"
                ry="95"
                fill="#c99aa0"
                transform={`rotate(${i * 72},400,250)`}
              />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                {ln(`M400 325L${290 + i * 72} 230`, "#b8ba86", 6)}
                <ellipse
                  cx={290 + i * 72}
                  cy="230"
                  rx="12"
                  ry="19"
                  fill="#dfb65c"
                />
              </g>
            ))}
          </g>
          <ellipse
            cx="400"
            cy="320"
            rx={ovary}
            ry={45 + mature * 45}
            fill="#99b580"
            stroke="#c7ce96"
            strokeWidth="5"
          />
          {!mature && (
            <>
              {ln("M400 295V165", "#bdd29d", 18)}
              <ellipse cx="400" cy="165" rx="30" ry="12" fill="#d0d9a7" />
            </>
          )}
          {[-1, 1].map((i) => (
            <ellipse
              key={i}
              cx={400 + i * (22 + mature * 20)}
              cy="320"
              rx={12 + mature * 6}
              ry={18 + mature * 8}
              fill={mature ? "#9a7754" : "#e2d4a1"}
            />
          ))}
          {p > 0.22 && p < 0.65 && (
            <circle cx="399" cy="153" r="8" fill="#e6b95e" />
          )}
          {p > 0.35 &&
            p < 0.65 &&
            ln(
              `M400 165V${165 + Math.min(1, (p - 0.35) / 0.2) * 140}l-22 15`,
              "#e8bd60",
              4,
            )}
          {tx(
            110,
            95,
            p < 0.22
              ? "花部结构"
              : p < 0.35
                ? "花粉到达柱头"
                : p < 0.6
                  ? "花粉管生长与受精过程"
                  : "胚珠 → 种子；子房等 → 果实",
          )}
          {tx(555, 185, mature ? "花部逐渐萎缩" : "柱头与花柱")}
          {ln("M540 190H440", "#a8c7be", 2)}
          {tx(580, 330, mature ? "果实与种子" : "子房与胚珠")}
          {ln(`M560 325H${410 + ovary}`, "#a8c7be", 2)}
        </>
      );
      break;
    }
    case "cactus": {
      const r = 70 + p * 25;
      body = (
        <>
          <path
            d={`M${400 - r} 400V180a${r} ${r} 0 0 1 ${2 * r} 0V400Z`}
            fill="#94b086"
            stroke="#c4cf9c"
            strokeWidth="9"
          />
          <path
            d={`M400 130Q${400 + r} 140 ${400 + r} 190V400H400Z`}
            fill="#b7c3a0"
          />
          {[0, 1, 2, 3, 4].map((i) =>
            ln(
              `M${400 - r} ${200 + i * 38}l-30-15m${2 * r + 30} 15l30-15`,
              "#d9d2ae",
              3,
            ),
          )}
          {ln("M400 400v30m0-5l-100 35m100-35l100 35", "#b39f72", 9)}
          {variant ? (
            <>
              <circle cx="170" cy="130" r="38" fill="#d3d4bc" />
              <circle cx="185" cy="117" r="34" fill="#173541" />
              {ln("M645 230h-95", "#9ebea8", 7)}
              {tx(530, 195, "夜间吸收 CO₂")}
            </>
          ) : (
            <>
              <circle cx="170" cy="130" r="38" fill="#e2bd69" />
              {tx(520, 195, "白天气孔多关闭")}
            </>
          )}
          {tx(110, 350, "刺与表皮")}
          {tx(520, 340, "含水活组织")}
          {tx(180, 485, "典型耐旱仙人掌；并非所有种类环境相同")}
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
      aria-label={`${id} 植物结构与过程示意`}
    >
      <rect width="800" height="520" rx="18" fill="#173541" />
      {body}
    </svg>
  );
}
export default function PlantScene(props) {
  const id = props.topic.id;
  if (["roses", "yellow-flowers", "conifers"].includes(id))
    return <PhotoCompare topic={id} />;
  const variants =
    {
      "autumn-leaves": ["黄橙色显露", "形成红色色素"],
      "lotus-leaf": ["荷叶型表面", "易润湿表面"],
      "seed-travel": ["风", "水", "动物附着", "弹射"],
      germination: ["适宜条件", "缺少水分"],
      cactus: ["白天", "夜间"],
    }[id] || [];
  return (
    <ScenePlayer
      {...props}
      Diagram={PlantDiagram}
      variants={variants}
      motion={["seed-travel", "germination", "flower-fruit"].includes(id)}
      caption={
        id === "germination"
          ? (v, variant) =>
              variant
                ? "缺水情境：推进时间不会自动补上缺少的水。先恢复适宜条件，再比较胚根和幼叶出现的顺序。"
                : v <= 10
                  ? "吸水起始：种子内部恢复活跃，尚未显示伸出的根。两片子叶供早期生长使用。"
                  : v <= 35
                    ? "胚根先伸出：先建立向下生长的根，幼叶还未展开。"
                    : v <= 50
                      ? "胚轴伸长：本例菜豆的子叶被带向地面上方，根继续伸长。"
                      : "幼叶展开：根和叶继续发育，光合作用逐步参与供应。进度不是实际天数，子叶仍可能提供储备。"
          : undefined
      }
    />
  );
}
