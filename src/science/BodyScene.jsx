import React from "react";
import ScenePlayer from "./ScenePlayer.jsx";
const tx = (x, y, t) => (
  <text x={x} y={y} fill="#edf3ed" fontSize="22">
    {t}
  </text>
);
const line = (d, color = "#a8ced0", width = 6) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);
export function BodyDiagram({ id, value = 35, variant = 0 }) {
  const p = value / 100;
  let body;
  switch (id) {
    case "eye": {
      const objectX = 50 + 180 * p,
        focus = variant === 1 ? 690 + 110 * p : 690;
      body = (
        <>
          <ellipse
            cx="530"
            cy="245"
            rx="180"
            ry="157"
            fill="#f2e6d1"
            stroke="#baa6a0"
            strokeWidth="12"
          />
          <ellipse cx="530" cy="245" rx="163" ry="141" fill="#293d4e" />
          {line("M639 137Q750 245 639 353", "#e89a81", 10)}
          <path
            d="M371 180Q319 245 371 310"
            stroke="#8bc1d4"
            fill="none"
            strokeWidth="8"
          />
          <ellipse
            cx="410"
            cy="245"
            rx={variant === 1 ? 14 : 14 + 13 * p}
            ry="61"
            fill="#98cdd5"
          />
          {line("M384 178v40M384 272v40", "#90af8b", 9)}
          {line("M705 245L755 270", "#dabd82", 17)}
          {variant === 2 ? (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <circle
                  key={i}
                  cx={655 + ((p * 100 + i * 22) % 100)}
                  cy={245 + Math.max(0, ((p * 100 + i * 22) % 100) - 50) * 0.5}
                  r="7"
                  fill="#e9b65c"
                />
              ))}
              {tx(470, 390, "光刺激 → 神经信号")}
            </>
          ) : (
            <>
              {line(`M${objectX} 245v-70`, "#e5b45d", 8)}
              {[205, 245, 285].map((y, i) => (
                <path
                  key={i}
                  d={`M${objectX} 175L410 ${y}L${focus} 275`}
                  fill="none"
                  stroke="#e5b45d"
                  strokeWidth="3"
                />
              ))}
              {line("M690 245v30", "#b3d592", 6)}
              {tx(
                80,
                390,
                variant === 1
                  ? "固定会聚条件：焦点偏离视网膜"
                  : "调节晶状体：像保持在视网膜附近",
              )}
            </>
          )}
          {tx(275, 105, "角膜")}
          {line("M325 115l25 80", "#a8ced0", 2)}
          {tx(385, 125, "晶状体")}
          {line("M425 132l-10 50", "#a8ced0", 2)}
          {tx(570, 85, "视网膜")}
          {tx(654, 330, "视神经")}
        </>
      );
      break;
    }
    case "ear": {
      const stage = Math.min(4, Math.floor(p * 5));
      body = (
        <>
          <path
            d="M150 105C35 75 70 360 140 345L160 290Q110 270 140 215L185 215"
            fill="#d4ac99"
            stroke="#efcfba"
            strokeWidth="8"
          />
          {line("M170 220H290M170 285H290", "#e7d2bb", 9)}
          {line(
            `M300 200Q${305 + Math.sin(p * 40) * 8} 250 300 300`,
            stage === 1 ? "#e9b65c" : "#c28674",
            9,
          )}
          {line(
            "M310 230l35-50 33 36 30-15 27 38",
            stage === 2 ? "#e9b65c" : "#c8c8a7",
            10,
          )}
          <path
            d="M450 240C440 145 620 130 625 240C630 335 470 345 488 245C500 180 590 185 585 250C580 285 530 290 530 250"
            fill="none"
            stroke={stage === 3 ? "#e9b65c" : "#d8aa9a"}
            strokeWidth="20"
          />
          {line("M617 255L730 220", stage === 4 ? "#e9b65c" : "#d1bd78", 12)}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${185 + i * 30} 233q12 18 0 37`}
              stroke={stage === 0 ? "#e9b65c" : "#6e929b"}
              fill="none"
              strokeWidth="4"
            />
          ))}
          {tx(83, 390, "耳廓")}
          {tx(215, 330, "耳道")}
          {tx(290, 360, "鼓膜")}
          {tx(328, 140, "听小骨")}
          {tx(510, 120, "耳蜗")}
          {tx(640, 185, "听觉神经")}
          {line("M430 410H735", "#66858a", 14)}
          <circle cx={variant ? 470 : 690} cy="410" r="13" fill="#e5b45d" />
          {tx(435, 385, variant ? "基部：高频更敏感" : "顶端：低频更敏感")}
        </>
      );
      break;
    }
    case "flavour":
      body = (
        <>
          <path
            d="M280 90Q475 60 490 210l60 45-55 15 10 40-25 65H270Z"
            fill="#c5a78f"
            stroke="#ecd6b9"
            strokeWidth="7"
          />
          <path
            d="M365 145H475V235H385V290H470"
            fill="none"
            stroke="#334d59"
            strokeWidth="37"
          />
          {line("M355 320Q410 285 475 310", "#cf7e7c", 20)}
          {line("M395 294V198H455", variant ? "#6b7a76" : "#e5b45d", 7)}
          {!variant &&
            [0, 1, 2, 3].map((i) => (
              <circle
                key={i}
                cx="395"
                cy={292 - ((p * 170 + i * 28) % 100)}
                r="6"
                fill="#f4ce80"
              />
            ))}
          {variant && line("M380 220l30 25m-30 0l30-25", "#c47767", 10)}
          {tx(115, 160, "嗅觉区域")}
          {line("M225 165H360", "#a8ced0", 2)}
          {tx(535, 325, "舌与味觉")}
          {tx(100, 400, "味觉信息")}
          {tx(450, 400, "气味信息")}
          <rect x="100" y="415" width="220" height="15" fill="#91b8a0" />
          <rect
            x="450"
            y="415"
            width={variant ? 35 : 220}
            height="15"
            fill="#e5b45d"
          />
        </>
      );
      break;
    case "sweat":
      body = (
        <>
          <rect x="100" y="300" width="600" height="100" fill="#c2927e" />
          <path d="M100 300H700" stroke="#e2b9a0" strokeWidth="10" />
          <path
            d="M390 300v65c-45-45-55 35-10 20s55-35 20-30"
            stroke="#eee0b9"
            fill="none"
            strokeWidth="10"
          />
          {Array.from({ length: 9 }, (_, i) => {
            const gone = p > (i + 1) / (variant ? 2 : 10);
            return (
              <g key={i}>
                {gone ? (
                  <circle
                    cx={150 + i * 60 + Math.sin(i) * p * 25}
                    cy={290 - p * 180}
                    r="6"
                    fill="#a9d2dc"
                  />
                ) : (
                  <ellipse
                    cx={150 + i * 60}
                    cy="285"
                    rx="15"
                    ry={16 - p * (variant ? 5 : 10)}
                    fill="#76afc2"
                  />
                )}
              </g>
            );
          })}
          {tx(
            135,
            100,
            variant ? "较湿空气：蒸发较慢" : "较干空气：水汽离开表面",
          )}
          {tx(500, 350, "皮肤")}
          {tx(245, 390, "汗腺与导管")}
          {line(`M400 260v-${30 + p * (variant ? 30 : 100)}`, "#e4b259", 6)}
          {tx(435, 210, "蒸发吸收能量")}
        </>
      );
      break;
    case "hiccups":
    case "lungs": {
      const hic = id === "hiccups",
        phase = hic ? (p > 0.28 && p < 0.7 ? 1 : 0) : variant ? 1 - p : p,
        closed = hic && p > 0.43 && p < 0.7;
      body = (
        <>
          <path
            d="M200 100Q400 25 600 100L650 370H150Z"
            fill="#243e4a"
            stroke="#92ada8"
            strokeWidth="8"
          />
          {line("M400 65v115m0 0l-70 65m70-65l70 65", "#d6c5b0", 20)}
          <ellipse
            cx="285"
            cy={239 + phase * 12}
            rx={72 + phase * 18}
            ry={88 + phase * 25}
            fill="#bb8e85"
          />
          <ellipse
            cx="515"
            cy={239 + phase * 12}
            rx={72 + phase * 18}
            ry={88 + phase * 25}
            fill="#bb8e85"
          />
          <path
            d={`M170 370Q400 ${250 + phase * 105} 630 370`}
            fill="none"
            stroke="#e5b45d"
            strokeWidth="17"
          />
          {line("M400 195l-70 55m70-55l70 55", "#d6c5b0", 8)}
          {closed && line("M385 105h30", "#c65352", 12)}
          {!closed &&
            [0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M390 ${95 + i * 25}l10 ${variant ? -8 : 8} 10 ${variant ? 8 : -8}`}
                stroke="#a8d6df"
                fill="none"
                strokeWidth="4"
              />
            ))}
          {tx(
            80,
            80,
            hic
              ? closed
                ? "声门关闭"
                : "喉部与气道"
              : variant
                ? "呼气：空气流出"
                : "吸气：空气流入",
          )}
          {tx(505, 135, "肺")}
          {tx(335, 425, "膈肌")}
          {!hic && tx(135, 465, "容积变化 → 瞬时压力差 → 空气流动")}
        </>
      );
      break;
    }
    case "muscles": {
      const a = (variant ? 1 - p : p) * 1.7,
        ex = 440 + 165 * Math.sin(a),
        ey = 335 + 165 * Math.cos(a);
      body = (
        <>
          {line("M440 90V335", "#e7debf", 27)}
          {line(`M440 335L${ex} ${ey}`, "#e7debf", 24)}
          <circle cx="440" cy="335" r="25" fill="#d7c7aa" />
          <path
            d={`M420 130Q${320 - 35 * p} 245 ${440 + Math.sin(a) * 50} ${335 + Math.cos(a) * 50}`}
            fill="none"
            stroke={variant ? "#9c7b78" : "#d48475"}
            strokeWidth={32 + 20 * (variant ? 1 - p : p)}
          />
          <path
            d={`M463 130Q${520 + 25 * p} 240 465 340`}
            fill="none"
            stroke={variant ? "#d48475" : "#9c7b78"}
            strokeWidth={32 + 20 * (variant ? p : 1 - p)}
          />
          {line(
            `M${440 + Math.sin(a) * 50} ${335 + Math.cos(a) * 50}L${440 + Math.sin(a) * 80} ${335 + Math.cos(a) * 80}`,
            "#f3e8d0",
            12,
          )}
          {tx(170, 180, "屈肌群")}
          {line("M280 185l75 45", "#a8ced0", 2)}
          {tx(550, 180, "伸肌群")}
          {tx(210, 350, "肘关节")}
          {line("M305 345h105", "#a8ced0", 2)}
          {tx(575, 420, "肌腱传递拉力")}
        </>
      );
      break;
    }
    case "circulation": {
      const nodes = [
          [210, 280, "右心"],
          [400, 110, "肺"],
          [590, 280, "左心"],
          [400, 425, "全身"],
        ],
        q = p * 4,
        k = Math.min(3, Math.floor(q)),
        f = q === 4 ? 1 : q - k,
        from = nodes[k],
        to = nodes[(k + 1) % 4];
      body = (
        <>
          {nodes.map((n, i) => {
            const next = nodes[(i + 1) % 4];
            return (
              <g key={i}>
                {line(
                  `M${n[0]} ${n[1]}L${next[0]} ${next[1]}`,
                  i < 1 || i > 2 ? "#7daabb" : "#c37c70",
                  16,
                )}
                <path
                  d={`M${(n[0] + next[0]) / 2 - 5} ${(n[1] + next[1]) / 2 - 8}l15 8-15 8`}
                  transform={`rotate(${(Math.atan2(next[1] - n[1], next[0] - n[0]) * 180) / Math.PI},${(n[0] + next[0]) / 2},${(n[1] + next[1]) / 2})`}
                  fill="#e7e6ce"
                />
              </g>
            );
          })}
          {nodes.map((n, i) => (
            <g key={n[2]}>
              <rect
                x={n[0] - 55}
                y={n[1] - 28}
                width="110"
                height="56"
                rx="18"
                fill="#35515b"
                stroke="#b3c4ba"
                strokeWidth="3"
              />
              {tx(n[0] - 32, n[1] + 8, n[2])}
            </g>
          ))}
          <circle
            cx={from[0] + (to[0] - from[0]) * f}
            cy={from[1] + (to[1] - from[1]) * f}
            r="13"
            fill="#f3cc78"
          />
          {tx(130, 145, "肺动脉")}
          {tx(565, 145, "肺静脉")}
          {tx(110, 400, "静脉回流")}
          {tx(575, 400, "动脉送出")}
          {tx(245, 55, "红蓝表示相对含氧状态，血液不是蓝色")}
        </>
      );
      break;
    }
    case "digestion": {
      const nodes = [
          [150, 110, "口腔"],
          [250, 200, "食道"],
          [380, 250, "胃"],
          [500, 340, "小肠"],
          [660, 420, "大肠"],
        ],
        k = Math.min(4, Math.floor(p * 5));
      body = (
        <>
          {line(
            "M150 110L250 200Q270 280 380 250Q410 240 440 295Q395 365 480 375Q580 400 500 340L660 420",
            "#c59c85",
            30,
          )}
          {nodes.map((n, i) => (
            <g key={n[2]}>
              <circle
                cx={n[0]}
                cy={n[1]}
                r={i === 2 ? 35 : 15}
                fill={i === k ? "#f3ce79" : "#ab7d70"}
              />
              {tx(n[0] - 30, n[1] - 40, n[2])}
            </g>
          ))}
          {line("M500 330L610 220H715", "#93c7ac", 8)}
          {tx(560, 190, "吸收 → 运输")}
          {k >= 3 &&
            [0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={520 + ((p * 150 + i * 45) % 150)}
                cy={310 - Math.min(90, (p * 150 + i * 45) % 150)}
                r="6"
                fill="#efc26e"
              />
            ))}
          {tx(100, 430, "消化道内的残余继续前行")}
        </>
      );
      break;
    }
    case "healing": {
      const stage = Math.min(3, Math.floor(p * 4)),
        gap = stage < 2 ? 120 : 120 * (1 - (p - 0.5) * 2);
      body = (
        <>
          <rect x="100" y="200" width="600" height="230" fill="#b88776" />
          <rect x="100" y="190" width="600" height="35" fill="#dbb598" />
          <path
            d={`M${400 - gap / 2} 185L380 330H420L${400 + gap / 2} 185Z`}
            fill={stage === 3 ? "#c39c8b" : "#304752"}
          />
          {stage < 3 && (
            <ellipse
              cx="400"
              cy="197"
              rx={gap / 2 + 10}
              ry="16"
              fill="#795650"
            />
          )}
          {stage === 1 &&
            [0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx={367 + i * 16}
                cy={230 + (i % 2) * 35}
                r="10"
                fill="#c1bfa1"
              />
            ))}
          {stage >= 2 &&
            Array.from({ length: 8 }, (_, i) =>
              line(
                `M350 ${245 + i * 16}q50 ${stage === 3 ? 0 : -15} 100 0`,
                "#d9b6a2",
                3,
              ),
            )}
          {tx(
            130,
            120,
            [
              "暂时封堵：血块",
              "清理与调节：多种细胞参与",
              "增殖：填补与覆盖",
              "重塑：组织仍在调整",
            ][stage],
          )}
          {tx(540, 175, "表皮")}
          {tx(550, 310, "下方组织")}
          {tx(170, 465, "阶段彼此交叠；滑杆不是实际天数")}
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
      aria-label={`${id} 人体结构与过程示意`}
    >
      <rect width="800" height="520" rx="18" fill="#173541" />
      {body}
    </svg>
  );
}
export default function BodyScene(props) {
  const id = props.topic.id,
    variants =
      {
        eye: ["自动调节", "固定调焦", "视觉信号"],
        ear: ["低频声音", "高频声音"],
        flavour: ["气味通路通畅", "气味通路受阻"],
        sweat: ["较干空气", "较湿空气"],
        muscles: ["屈肘", "伸肘"],
        lungs: ["吸气", "呼气"],
      }[id] || [];
  return (
    <ScenePlayer
      {...props}
      Diagram={BodyDiagram}
      variants={variants}
      motion={!["eye", "muscles", "flavour"].includes(id)}
      caption={(v, c) =>
        id === "hiccups"
          ? v <= 28
            ? "起始：膈肌尚未突然收缩。推进到中间阶段，观察膈肌和声门的先后变化。"
            : v <= 43
              ? "膈肌突然收缩，胸腔容积增大，空气快速进入。"
              : v < 70
                ? "声门迅速关闭，气流被打断，产生典型的呃逆声。"
                : "本次呃逆结束，结构回到示意起始状态；慢放进度不代表真实持续时间。"
          : props.scene.states[Math.min(c, props.scene.states.length - 1)]
      }
    />
  );
}
