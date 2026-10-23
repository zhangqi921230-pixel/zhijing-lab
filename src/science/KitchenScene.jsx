import React from "react";
import ScenePlayer from "./ScenePlayer.jsx";
const tx = (x, y, t) => (
  <text x={x} y={y} fill="#edf3ed" fontSize="22">
    {t}
  </text>
);
export function KitchenDiagram({ id, value = 40, variant = 0 }) {
  const p = value / 100;
  let body;
  switch (id) {
    case "popcorn": {
      const burst = !variant && p > 0.6,
        expand = burst ? (p - 0.6) * 2.5 : 0;
      body = (
        <>
          {burst ? (
            Array.from({ length: 9 }, (_, i) => {
              const a = (i * Math.PI * 2) / 9;
              return (
                <ellipse
                  key={i}
                  cx={400 + Math.cos(a) * expand * 100}
                  cy={245 + Math.sin(a) * expand * 70}
                  rx={50 + expand * 32}
                  ry={40 + expand * 27}
                  fill="#f3e7c6"
                  stroke="#d1bc88"
                  strokeWidth="3"
                />
              );
            })
          ) : (
            <>
              <ellipse
                cx="400"
                cy="245"
                rx="105"
                ry="125"
                fill="#d5b36d"
                stroke="#9a7750"
                strokeWidth="13"
              />
              <ellipse cx="400" cy="245" rx="85" ry="106" fill="#e9d4a0" />
              {Array.from({ length: 25 }, (_, i) => (
                <circle
                  key={i}
                  cx={350 + (i % 5) * 24 + Math.sin(i + p * 10) * p * 7}
                  cy={165 + Math.floor(i / 5) * 37}
                  r="5"
                  fill="#73a9bc"
                />
              ))}
              {variant && (
                <path
                  d="M475 155l-20 30 28 25-25 20"
                  stroke="#274854"
                  strokeWidth="12"
                />
              )}
            </>
          )}
          {burst && (
            <path
              d="M300 340l30 18 25-12M500 340l-25 20-30-10"
              stroke="#a67d45"
              strokeWidth="10"
              fill="none"
            />
          )}
          {[250, 400, 550].map((x) => (
            <path
              key={x}
              d={`M${x} 425q-20-20 0-40t0-40`}
              stroke="#d7a77d"
              strokeWidth="4"
              fill="none"
            />
          ))}
          {tx(
            35,
            45,
            variant
              ? "外壳泄漏：难以建立同样内部条件"
              : p < 0.6
                ? "受热：壳内水分和淀粉状态改变"
                : "外壳破裂，内部迅速膨胀成多孔结构",
          )}
          {tx(35, 460, "过程被放慢；相位不对应可操作的温度和时间")}
        </>
      );
      break;
    }
    case "bread": {
      const growth = variant ? p * 0.18 : p,
        rx = 230 + growth * 45,
        ry = 65 + growth * 65;
      body = (
        <>
          <ellipse
            cx="400"
            cy={330 - ry}
            rx={rx}
            ry={ry}
            fill={p > 0.8 ? "#d1ad77" : "#e6d5ae"}
            stroke="#b2946f"
            strokeWidth="7"
          />
          {Array.from({ length: 13 }, (_, i) => {
            const a = i * 2.4,
              r = 35 + growth * 50;
            return (
              <ellipse
                key={i}
                cx={400 + Math.cos(a) * ((i % 3) + 1) * 45}
                cy={330 - ry + (Math.sin(a) * ((i % 3) + 1) * r) / 5}
                rx={8 + growth * 18}
                ry={7 + growth * 13}
                fill="#879595"
                stroke="#c3a77f"
                strokeWidth="2"
              />
            );
          })}
          {variant &&
            Array.from({ length: 6 }, (_, i) => (
              <circle
                key={i}
                cx={280 + i * 50}
                cy={135 - p * 55 + (i % 2) * 20}
                r="6"
                fill="#b5ced0"
              />
            ))}
          <path d="M110 335H690" stroke="#d4d8c7" strokeWidth="10" />
          {tx(
            35,
            45,
            variant
              ? "气体形成，但更容易逸出"
              : "气体扩大气室，受热后周围组织逐渐定形",
          )}
          {tx(35, 430, "孔洞表示气体空间，不是放大的酵母细胞")}
        </>
      );
      break;
    }
    case "egg":
      body = (
        <>
          <ellipse
            cx="220"
            cy="250"
            rx="120"
            ry="150"
            fill={p > 0.45 ? "#eee6cf" : "#b4c7be"}
            stroke="#d0cdb5"
            strokeWidth="7"
          />
          <circle cx="220" cy="285" r="59" fill="#d7ad57" />
          <rect
            x="415"
            y="115"
            width="330"
            height="260"
            rx="15"
            fill="#416471"
          />
          {Array.from({ length: 8 }, (_, i) => {
            const x = 445 + (i % 4) * 78,
              y = 160 + Math.floor(i / 4) * 125;
            return (
              <path
                key={i}
                d={
                  p < 0.4
                    ? `M${x} ${y}q-25-20 5-25t18 30q-35 30-35-5t42-10`
                    : `M${x - 25} ${y}l20-${15 + p * 10} 20 ${25 + p * 15} 30-25`
                }
                stroke={i % 2 ? "#e8cba3" : "#a8cbd0"}
                strokeWidth="5"
                fill="none"
              />
            );
          })}
          {p > 0.6 &&
            [0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${465 + i * 80} 180L${500 + i * 70} 260`}
                stroke="#e5d2af"
                strokeWidth="3"
              />
            ))}
          {tx(35, 45, "宏观凝固 ↔ 蛋白质结构改变与网络形成")}
          {tx(420, 420, "网络中仍保留许多水")}
        </>
      );
      break;
    case "apple": {
      const shade = p * (variant ? 0.25 : 1);
      body = (
        <>
          <path
            d="M400 140C270 60 140 170 210 340Q260 430 400 390Q540 430 590 340C660 170 530 60 400 140Z"
            fill="#b57558"
          />
          <path
            d="M400 155C295 85 165 190 230 335Q275 405 400 370Q525 405 570 335C635 190 505 85 400 155Z"
            fill={`rgb(${232 - shade * 65},${222 - shade * 90},${180 - shade * 65})`}
          />
          <path d="M400 140q-15-50 25-70" stroke="#847454" strokeWidth="14" />
          <ellipse cx="375" cy="260" rx="12" ry="23" fill="#8f7353" />
          <ellipse cx="425" cy="260" rx="12" ry="23" fill="#8f7353" />
          {tx(
            35,
            45,
            variant
              ? "减少氧接触：同阶段褐变较慢的定性示意"
              : "切面暴露：细胞分隔受损后发生酶促褐变",
          )}
          {tx(35, 450, "颜色不是食品安全判断，也不是实测反应速率")}
        </>
      );
      break;
    }
    case "milk-foam": {
      const count = variant
        ? Math.max(4, 18 - Math.floor(p * 14))
        : Math.max(12, 18 - Math.floor(p * 6));
      body = (
        <>
          <path
            d="M150 130V390H650V130"
            fill="#bccbc2"
            stroke="#e1e8db"
            strokeWidth="9"
          />
          <rect x="157" y="280" width="486" height="103" fill="#e9e6d4" />
          {Array.from({ length: count }, (_, i) => {
            const x = 205 + (i % 6) * 78,
              y = 185 + Math.floor(i / 6) * 45,
              r = variant ? 22 + p * 16 : 24 + p * 4;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="#8eb1b7"
                  stroke="#ebe5cf"
                  strokeWidth="5"
                />
                {!variant &&
                  [0, 60, 120, 180, 240, 300].map((a) => (
                    <circle
                      key={a}
                      cx={x + Math.cos((a * Math.PI) / 180) * r}
                      cy={y + Math.sin((a * Math.PI) / 180) * r}
                      r="3"
                      fill="#c6a981"
                    />
                  ))}
              </g>
            );
          })}
          {tx(
            35,
            45,
            variant
              ? "较弱稳定作用：气泡更容易合并、破裂"
              : "界面成分帮助气泡暂时稳定",
          )}
          {tx(35, 440, "静置时泡沫继续变化；小点代表界面成分")}
        </>
      );
      break;
    }
    case "detergent": {
      const split = !variant && p > 0.35,
        k = split ? 3 : 1,
        r = split ? 80 / Math.sqrt(3) : 80;
      body = (
        <>
          <rect x="0" y="90" width="800" height="330" fill="#356777" />
          <path d="M55 365H745" stroke="#a4b5ab" strokeWidth="13" />
          {Array.from({ length: k }, (_, i) => {
            const x = split ? 400 + (i - 1) * (70 + p * 110) : 400,
              y = split ? 285 - p * 110 + (i % 2) * 30 : 285;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={r} fill="#d4b579" />
                {!variant &&
                  Array.from({ length: 12 }, (_, j) => {
                    const a = (j * Math.PI) / 6;
                    return (
                      <g key={j}>
                        <path
                          d={`M${x + Math.cos(a) * (r - 9)} ${y + Math.sin(a) * (r - 9)}L${x + Math.cos(a) * (r + 13)} ${y + Math.sin(a) * (r + 13)}`}
                          stroke="#c3a6ca"
                          strokeWidth="5"
                        />
                        <circle
                          cx={x + Math.cos(a) * (r + 15)}
                          cy={y + Math.sin(a) * (r + 15)}
                          r="6"
                          fill="#bce0df"
                        />
                      </g>
                    );
                  })}
              </g>
            );
          })}
          {tx(
            35,
            45,
            variant
              ? "只有水：油滴仍容易聚在一起"
              : "亲油尾朝向油，亲水头朝向水",
          )}
          {tx(35, 455, "油仍存在：脱离表面、分散并随水带走")}
        </>
      );
      break;
    }
    case "pressure-cooker":
      body = (
        <>
          <rect
            x="180"
            y="145"
            width="440"
            height="230"
            rx="45"
            fill="#9bb2b7"
          />
          <rect x="207" y="245" width="386" height="100" fill="#78aebc" />
          <path d="M170 145H630" stroke="#d2ded6" strokeWidth="18" />
          <rect x="365" y="110" width="70" height="25" rx="8" fill="#b9c9c3" />
          {variant && (
            <path d="M530 145V100h25" stroke="#d4bd8a" strokeWidth="10" />
          )}
          {Array.from({ length: 8 }, (_, i) => (
            <circle
              key={i}
              cx={245 + i * 43}
              cy={320 - ((p * 180 + i * 19) % 110)}
              r={4 + p * 5}
              fill="#bed8d5"
            />
          ))}
          <ellipse cx="400" cy="292" rx="70" ry="30" fill="#d1b991" />
          {tx(
            35,
            45,
            variant
              ? "加压情境：液态水可达到较高沸腾温度"
              : "常压情境：外压决定相应沸腾条件",
          )}
          {tx(35, 435, "锅体仅表示功能关系，不是操作或维修图")}
        </>
      );
      break;
    case "floating-ice":
      body = variant ? (
        <>
          {[0, 1].map((side) => (
            <g key={side}>
              {Array.from({ length: 24 }, (_, i) => {
                const x =
                    105 +
                    side * 395 +
                    (i % 6) * (side ? 48 : 39) +
                    (side ? (Math.floor(i / 6) % 2) * 18 : Math.sin(i) * 8),
                  y =
                    150 +
                    Math.floor(i / 6) * (side ? 57 : 43) +
                    (side ? 0 : Math.cos(i) * 8);
                return <circle key={i} cx={x} cy={y} r="9" fill="#a3ced4" />;
              })}
              {tx(
                130 + side * 395,
                395,
                side ? "普通冰：较开放" : "液态水：无固定晶格",
              )}
            </g>
          ))}
          {tx(35, 45, "相同点数只表达同质量；二维间距不用于计算密度")}
        </>
      ) : (
        <>
          <rect y="200" width="800" height="260" fill="#38778a" />
          <path d="M285 160H515V345H285Z" fill="#b8d9d8" opacity=".85" />
          <path d="M0 200H800" stroke="#b2d6d8" strokeWidth="4" />
          {tx(35, 45, "浮力平衡总重时，冰块仍有一部分露出水面")}
          {tx(40, 430, "露出部分被略作增强，非精确比例")}
        </>
      );
      break;
    case "soda": {
      const open = variant === 1;
      body = (
        <>
          <path d="M255 105H545V390H255Z" fill="#a2c4c5" opacity=".7" />
          <rect x="265" y="195" width="270" height="185" fill="#b79968" />
          {!open && <path d="M247 100H553" stroke="#d5d9c3" strokeWidth="16" />}
          {Array.from({ length: 26 }, (_, i) => (
            <circle
              key={i}
              cx={280 + ((i * 43) % 240)}
              cy={215 + ((i * 29) % 145)}
              r="3"
              fill="#f2e4c4"
              opacity={open ? 1 - p * 0.6 : 1}
            />
          ))}
          {open &&
            [0, 1, 2].map((i) => (
              <g key={i}>
                {[0, 1, 2, 3].map((j) => (
                  <circle
                    key={j}
                    cx={290 + i * 110}
                    cy={360 - ((p * 280 + j * 56) % 270)}
                    r={4 + j * 1.7}
                    fill="none"
                    stroke="#eadfc2"
                    strokeWidth="2"
                  />
                ))}
              </g>
            ))}
          {tx(
            35,
            45,
            open
              ? "开盖：压力条件改变，溶解气体逐渐逸出"
              : "密闭：小点代表已溶解的二氧化碳",
          )}
          {tx(35, 445, "成核位置放大显示；气泡上升不是水在沸腾")}
        </>
      );
      break;
    }
    case "straw": {
      const rise = p * 170 * (variant ? 0.25 : 1);
      body = (
        <>
          <path
            d="M150 160V400H640V160"
            stroke="#bacfc9"
            strokeWidth="9"
            fill="none"
          />
          <rect x="157" y="295" width="476" height="97" fill="#81b4c4" />
          <path
            d="M480 370V90H640"
            fill="none"
            stroke="#c7dcd6"
            strokeWidth="35"
          />
          <path
            d={`M480 370V${295 - rise}`}
            stroke="#6da5b7"
            strokeWidth="21"
          />
          {variant && (
            <path d="M463 145h35" stroke="#274854" strokeWidth="18" />
          )}
          <path
            d="M250 195v80l-10-15m10 15 10-15"
            fill="none"
            stroke="#e2c18c"
            strokeWidth="4"
          />
          <path
            d={`M480 85v${35 * (1 - p * (variant ? 0.25 : 1))}`}
            stroke="#e2c18c"
            strokeWidth="4"
          />
          {tx(180, 175, "外部气压")}
          {tx(535, 140, "管内气压")}
          {tx(
            35,
            45,
            variant
              ? "上端漏气：难以建立同样压差"
              : "降低管内上方压力，外压推动水柱",
          )}
          {tx(35, 445, "压差与水柱高度为定性比例示意")}
        </>
      );
      break;
    }
    default:
      return null;
  }
  return (
    <svg
      viewBox="0 0 800 480"
      role="img"
      aria-label={`${id} 宏观与内部过程示意`}
    >
      <rect width="800" height="480" fill="#274854" />
      {body}
    </svg>
  );
}
const variants = {
  popcorn: ["完整外壳", "外壳泄漏"],
  bread: ["保留气体", "较易漏气"],
  apple: ["暴露空气", "减少氧接触"],
  "milk-foam": ["界面较稳定", "较弱稳定作用"],
  detergent: ["加入洗洁精", "只有水"],
  "pressure-cooker": ["常压情境", "加压情境"],
  "floating-ice": ["宏观漂浮", "微观排列"],
  soda: ["密闭情境", "打开瓶盖"],
  straw: ["完整吸管", "上端漏气"],
};
export default function KitchenScene(props) {
  return (
    <ScenePlayer
      {...props}
      Diagram={KitchenDiagram}
      variants={variants[props.topic.id]}
      range={props.topic.id !== "floating-ice"}
      motion={[
        "popcorn",
        "bread",
        "egg",
        "apple",
        "milk-foam",
        "detergent",
        "soda",
      ].includes(props.topic.id)}
    />
  );
}
