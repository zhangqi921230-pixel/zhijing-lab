import React, { useState, useEffect, useId, lazy, Suspense } from "react";
import Button from "../LabButton.jsx";
import { LaboratoryBoundary } from "../LaboratoryLoader.jsx";
const Spatial = lazy(() => import("./ScienceSpatial.jsx"));
const tx = (x, y, t) => (
  <text x={x} y={y} fill="#edf3ed" fontSize="22">
    {t}
  </text>
);
export function MaterialsDiagram({ id, value = 40, alternate = false }) {
  const uid = useId().replaceAll(":", ""),
    p = value / 100;
  let body;
  switch (id) {
    case "rust":
      body = (
        <>
          <rect x="80" y="245" width="640" height="140" fill="#a2b5bc" />
          {Array.from(
            { length: Math.floor(p * (alternate ? 7 : 48)) },
            (_, i) => (
              <ellipse
                key={i}
                cx={alternate ? 380 + i * 6 : 100 + ((i * 83) % 590)}
                cy={245 + ((i * 19) % 45)}
                rx={14 + p * 12}
                ry={8 + p * 8}
                fill={i % 2 ? "#b17e5a" : "#8d654d"}
              />
            ),
          )}
          {alternate && (
            <>
              <path
                d="M80 237H375M425 237H720"
                stroke="#8fc2aa"
                strokeWidth="13"
              />
              {tx(320, 410, "划伤处仍可暴露")}
            </>
          )}
          {[180, 400, 620].map((x) => (
            <g key={x}>
              <path d={`M${x} 100q-25 40 0 45q25-5 0-45`} fill="#8fc4d7" />
              <path
                d={`M${x} 160v60`}
                stroke="#c8d5d7"
                strokeWidth="3"
                strokeDasharray="7 7"
              />
            </g>
          ))}
          {tx(
            45,
            45,
            alternate
              ? "隔离涂层与局部破损"
              : "含水、氧等条件下，暴露表面可能腐蚀",
          )}
          {tx(45, 435, "观察进度不是实际生锈时间")}
        </>
      );
      break;
    case "stainless-steel": {
      const damaged = p > 0.33 && (alternate || p < 0.67);
      body = (
        <>
          <rect x="85" y="250" width="630" height="150" fill="#a8bac1" />
          {Array.from({ length: 75 }, (_, i) => (
            <circle
              key={i}
              cx={105 + (i % 15) * 40}
              cy={275 + Math.floor(i / 15) * 26}
              r="8"
              fill={i % 4 ? "#7d969f" : "#d1bb83"}
            />
          ))}
          <path
            d={damaged ? "M85 243H350M450 243H715" : "M85 243H715"}
            stroke="#8cc9b1"
            strokeWidth="15"
          />
          {damaged && (
            <path
              d="M400 145v87l-10-15m10 15 10-15"
              stroke="#e4b475"
              strokeWidth="5"
            />
          )}
          {tx(
            50,
            50,
            damaged ? "薄膜受损，局部重新暴露" : "连续富铬钝化膜，减慢腐蚀",
          )}
          {tx(90, 120, "保护膜被大幅放大")}
          {tx(
            90,
            440,
            alternate
              ? "不利环境可能妨碍恢复"
              : "在适当环境中，受损表面可重新钝化",
          )}
        </>
      );
      break;
    }
    case "tempered-glass":
      body = (
        <>
          <rect x="100" y="120" width="600" height="235" fill="#a5c2cc" />
          {alternate ? (
            <>
              {Array.from({ length: 11 }, (_, i) => (
                <path
                  key={i}
                  d={`M${115 + i * 55} 120l${i % 2 ? 15 : -15} 55 13 55-17 65 12 60`}
                  stroke="#334f60"
                  strokeWidth="2"
                />
              ))}
              {Array.from({ length: 5 }, (_, i) => (
                <path
                  key={i}
                  d={`M100 ${135 + i * 45}l80 12 75-17 100 8 75-5 110 8 160-6`}
                  stroke="#334f60"
                  strokeWidth="2"
                />
              ))}
            </>
          ) : (
            <>
              <rect x="100" y="120" width="600" height="40" fill="#7897a5" />
              <rect x="100" y="315" width="600" height="40" fill="#7897a5" />
              {[140, 335].map((y) => (
                <g key={y}>
                  <path
                    d={`M135 ${y}h180l-12-7m12 7-12 7M665 ${y}H485l12-7m-12 7 12 7`}
                    stroke="#dbe9e1"
                    strokeWidth="4"
                    fill="none"
                  />
                </g>
              ))}
              <path
                d="M350 240H150l15-8m-15 8 15 8M450 240H650l-15-8m15 8-15 8"
                stroke="#e4bc80"
                strokeWidth="4"
                fill="none"
              />
              {tx(340, 205, "内部受拉")}
            </>
          )}
          {tx(
            50,
            45,
            alternate
              ? "破坏后：裂纹分支，形成许多碎块"
              : "热钢化：表面受压、内部受拉",
          )}
          {tx(70, 425, "示意不预测真实碎片形状；仅在屏幕观察")}
        </>
      );
      break;
    case "eraser": {
      const ex = 130 + p * 490;
      body = (
        <>
          <rect x="60" y="250" width="680" height="95" fill="#dedcc8" />
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={i}
              d={`M70 ${265 + i * 10}q70-14 140 0t140 0t140 0t140 0t100 0`}
              stroke="#acae9e"
              strokeWidth="3"
              fill="none"
            />
          ))}
          {Array.from({ length: 42 }, (_, i) => {
            const erased = 150 + i * 12 < ex;
            const x = erased ? 90 + i * 14 : 150 + i * 12,
              y = erased ? 375 + (i % 3) * 15 : 253 + (i % 3) * 5;
            return (
              <g key={i}>
                {erased && (
                  <ellipse cx={x} cy={y} rx="8" ry="5" fill="#c4afa0" />
                )}
                <circle cx={x} cy={y} r="3" fill="#344b4d" />
              </g>
            );
          })}
          <rect
            x={ex - 50}
            y="165"
            width="100"
            height="88"
            rx="8"
            fill="#cdb2a0"
          />
          {tx(40, 45, "石墨从纸面转移到橡皮和碎屑")}
          {tx(80, 440, "颗粒仍然存在，位置发生变化")}
        </>
      );
      break;
    }
    case "hook-loop": {
      const top = 80 + p * 100;
      const front = 705 - p * 610;
      const topAt = (x) =>
        alternate ? 180 - Math.min(100, Math.max(0, x - front) * 0.4) : top;
      body = (
        <>
          <path
            d={`M95 ${topAt(95)} ${Array.from({ length: 31 }, (_, i) => {
              const x = 95 + (i * 610) / 30;
              return `L${x} ${topAt(x)}`;
            }).join(" ")}`}
            fill="none"
            stroke="#bfbda1"
            strokeWidth="25"
          />
          <rect x="95" y="350" width="610" height="25" fill="#7cabb4" />
          {Array.from({ length: 7 }, (_, i) => {
            const x = 145 + i * 80;
            const hookTop = topAt(x);
            return (
              <g key={i}>
                <path
                  d={`M${x} ${hookTop + 12}v80q0 30 25 30t20-35`}
                  stroke="#d3bf8b"
                  strokeWidth="9"
                  fill="none"
                />
                <path
                  d={`M${x} 350q-12-75 25-75t25 75`}
                  stroke="#9cc9cb"
                  strokeWidth="7"
                  fill="none"
                />
              </g>
            );
          })}
          {alternate && (
            <path
              d={`M${front} 220V380`}
              stroke="#e0bc84"
              strokeWidth="3"
              strokeDasharray="7 5"
            />
          )}
          {tx(
            45,
            45,
            alternate
              ? "边缘剥离：虚线标出移动的分离前沿"
              : p < 0.6
                ? "钩与环分开"
                : "压合后部分小钩进入纤维环",
          )}
          {tx(70, 430, "钩环配合被放大；真实接触并非全部同时成功")}
        </>
      );
      break;
    }
    case "plastics":
      body = (
        <>
          {[150, 220, 290].map((y, i) => (
            <path
              key={y}
              d={`M${100 + (alternate ? 0 : p * 65 * (i - 1))} ${y}q60-45 120 0t120 0t120 0t120 0t120 0`}
              fill="none"
              stroke={["#9cbebd", "#e0bc84", "#91b8d0"][i]}
              strokeWidth="9"
            />
          ))}
          {alternate &&
            [180, 300, 420, 540, 660].map((x, i) => (
              <g key={x}>
                <path
                  d={`M${x} ${i % 2 ? 135 : 165}V${i % 2 ? 205 : 235}M${x} ${i % 2 ? 205 : 235}V${i % 2 ? 275 : 305}`}
                  stroke="#d6ded1"
                  strokeWidth="5"
                />
              </g>
            ))}
          {tx(
            45,
            45,
            alternate
              ? "交联网络：链段相对运动受到更多约束"
              : "链结构示意：可以发生一定相对移动",
          )}
          {tx(60, 420, "不同塑料还受到配方、结晶与加工状态影响")}
        </>
      );
      break;
    case "battery": {
      const q = alternate ? 1 - p : p,
        ionX = 220 + q * 360,
        wire =
          q < 0.25
            ? [180, 250 - q * 640]
            : q < 0.75
              ? [180 + (q - 0.25) * 880, 90]
              : [620, 90 + (q - 0.75) * 640];
      body = (
        <>
          <rect
            x="140"
            y="175"
            width="520"
            height="220"
            rx="18"
            fill="#5a7f87"
          />
          <rect x="175" y="190" width="70" height="190" fill="#7b9eb1" />
          <rect x="555" y="190" width="70" height="190" fill="#c39d71" />
          <rect x="390" y="180" width="20" height="205" fill="#c7d7d0" />
          <path
            d="M180 250V90H620V250"
            fill="none"
            stroke="#c2d1d0"
            strokeWidth="6"
          />
          <rect
            x="355"
            y="62"
            width="95"
            height="55"
            rx="8"
            fill={alternate ? "#7499a7" : "#cfb779"}
          />
          <circle cx={ionX} cy="290" r="13" fill="#e8c68c" />
          <text
            x={ionX}
            y="296"
            textAnchor="middle"
            fill="#274854"
            fontSize="15"
          >
            +
          </text>
          <circle cx={wire[0]} cy={wire[1]} r="9" fill="#a3e0de" />
          {tx(
            60,
            40,
            alternate
              ? "充电：外部电源驱动储能变化"
              : "放电：电子经过外部负载供能",
          )}
          {tx(166, 425, "负极")}
          {tx(375, 425, "隔膜")}
          {tx(560, 425, "正极")}
          {tx(285, 345, "离子走电解质")}
        </>
      );
      break;
    }
    case "solar-cell":
      body = (
        <>
          <rect x="150" y="190" width="500" height="65" fill="#7098b0" />
          <rect x="150" y="255" width="500" height="65" fill="#bba078" />
          <path
            d="M160 220H90V375H710V290H640"
            fill="none"
            stroke="#bcd2cd"
            strokeWidth="6"
          />
          <rect
            x="355"
            y="350"
            width="100"
            height="50"
            rx="8"
            fill={p > 0.1 ? "#d5c090" : "#657d87"}
          />
          {Array.from({ length: Math.round(p * 9) }, (_, i) => (
            <g key={i}>
              <path
                d={`M${180 + i * 50} 75l-20 40 17-4-20 43`}
                fill="none"
                stroke="#ead297"
                strokeWidth="4"
              />
              <circle cx={180 + i * 50} cy="225" r="7" fill="#9edbdc" />
              <circle cx={180 + i * 50} cy="282" r="7" fill="#ecd3a3" />
            </g>
          ))}
          {tx(45, 40, "吸收光 → 产生、分离并收集载流子")}
          {tx(70, 435, "典型半导体结原理；层厚与电荷速度不按比例")}
        </>
      );
      break;
    case "wind-turbine": {
      const a = p * 720;
      body = (
        <>
          <path d="M225 245L210 420H250L235 245Z" fill="#b9cdd2" />
          <rect
            x="240"
            y="180"
            width="430"
            height="110"
            rx="30"
            fill="#728f99"
          />
          <path d="M230 235H620" stroke="#c7d5d3" strokeWidth="16" />
          {!alternate && (
            <>
              <rect
                x="340"
                y="195"
                width="110"
                height="80"
                rx="9"
                fill="#acaaa0"
              />
              {[365, 425].map((x, i) => (
                <g key={x} transform={`rotate(${i ? -a * 2 : a} ${x} 235)`}>
                  <circle cx={x} cy="235" r={i ? 18 : 31} fill="#d1bb89" />
                  <path
                    d={`M${x} ${i ? 217 : 204}v${i ? 36 : 62}`}
                    stroke="#516f7c"
                    strokeWidth="5"
                  />
                </g>
              ))}
            </>
          )}
          <rect
            x={alternate ? 330 : 510}
            y="195"
            width={alternate ? 180 : 100}
            height="80"
            rx="15"
            fill="#b99c6f"
          />
          <g transform={`rotate(${a} 230 235)`}>
            {[0, 120, 240].map((r) => (
              <path
                key={r}
                d="M230 235Q205 130 236 65Q260 170 230 235"
                fill="#dce6e3"
                transform={`rotate(${r} 230 235)`}
              />
            ))}
          </g>
          <circle cx="230" cy="235" r="18" fill="#b6c9cb" />
          <path
            d="M610 275V385H710"
            stroke="#e0bc7c"
            strokeWidth="5"
            fill="none"
          />
          {tx(
            45,
            45,
            alternate
              ? "直驱：风轮直接连接匹配的发电机"
              : "齿轮传动：经升速齿轮箱驱动发电机",
          )}
          {tx(50, 435, "转速用于观察传动，不表示真实功率或机型参数")}
        </>
      );
      break;
    }
    case "tap-water": {
      const nodes = alternate
        ? ["家庭污水", "初步分离", "生物处理", "后续处理", "排放 / 再用"]
        : ["水源", "混凝沉淀", "过滤消毒", "管网输送", "用户"];
      const index = Math.min(4, Math.floor(p * 5));
      body = (
        <>
          <path d="M80 235H720" stroke="#8fbaca" strokeWidth="9" />
          {nodes.map((t, i) => (
            <g key={t}>
              <rect
                x={35 + i * 153}
                y="175"
                width="120"
                height="120"
                rx="15"
                fill={i === index ? "#bea777" : "#5d8796"}
                stroke={i === index ? "#f5e2ae" : "#9ebabe"}
                strokeWidth="3"
              />
              <text
                x={95 + i * 153}
                y="240"
                fill="white"
                textAnchor="middle"
                fontSize="21"
              >
                {t}
              </text>
              <text
                x={95 + i * 153}
                y="155"
                fill="#b8d0d1"
                textAnchor="middle"
                fontSize="22"
              >
                {i + 1}
              </text>
            </g>
          ))}
          {alternate && (
            <>
              <path
                d="M250 295V370H490V295"
                stroke="#b4a17e"
                strokeWidth="5"
                fill="none"
              />
              {tx(255, 405, "分离出的污泥还需处理")}
            </>
          )}
          {tx(
            40,
            45,
            alternate
              ? "污水处理：不是透明就自动达到饮用要求"
              : "供水系统：工艺随原水条件和当地要求变化",
          )}
        </>
      );
      break;
    }
    default:
      return null;
  }
  return (
    <svg
      viewBox="0 0 800 460"
      role="img"
      aria-label={`${id} 材料结构与过程示意`}
    >
      <rect width="800" height="460" fill="#274854" />
      {body}
    </svg>
  );
}
const toggle = {
  "hook-loop": ["比较边缘剥离", "返回按合过程"],
  rust: ["加上带划伤的涂层", "比较裸露金属"],
  "stainless-steel": ["比较不利于恢复的环境", "恢复适宜环境"],
  "tempered-glass": ["看破裂后的分支", "看破裂前的应力"],
  plastics: ["比较交联网络", "比较链的相对移动"],
  battery: ["切换充电", "切换放电"],
  "wind-turbine": ["切换直驱结构", "切换齿轮传动"],
  "tap-water": ["追踪污水去向", "追踪自来水供给"],
};
export default function MaterialsScene({ topic, scene, chapter }) {
  const [value, setValue] = useState(0),
    [alternate, setAlternate] = useState(false),
    [playing, setPlaying] = useState(false),
    [view, setView] = useState(false),
    [loaded, setLoaded] = useState(false);
  const hasProgress = topic.id !== "tempered-glass",
    process = [
      "battery",
      "wind-turbine",
      "eraser",
      "hook-loop",
      "tap-water",
    ].includes(topic.id);
  useEffect(() => setPlaying(false), [chapter, view]);
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
      90,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const set = (v) => {
    setValue(v);
    setPlaying(false);
  };
  return (
    <div>
      {topic.spatial && (
        <div className="science-controls">
          <Button aria-pressed={!view} onClick={() => setView(false)}>
            查看传动路径
          </Button>
          <Button
            aria-pressed={view}
            onClick={() => {
              setLoaded(true);
              setView(true);
            }}
          >
            查看三维结构
          </Button>
        </div>
      )}
      <div hidden={view}>
        <MaterialsDiagram id={topic.id} value={value} alternate={alternate} />
      </div>
      {loaded && (
        <div hidden={!view}>
          <LaboratoryBoundary
            fallback={
              <MaterialsDiagram
                id={topic.id}
                value={value}
                alternate={alternate}
              />
            }
          >
            <Suspense
              fallback={
                <p className="science-caption" role="status">
                  正在准备结构模型…
                </p>
              }
            >
              <Spatial
                topic={topic}
                chapter={chapter}
                active={view}
                variant={alternate ? "direct" : "geared"}
                progress={value}
                fallback={
                  <MaterialsDiagram
                    id={topic.id}
                    value={value}
                    alternate={alternate}
                  />
                }
              />
            </Suspense>
          </LaboratoryBoundary>
        </div>
      )}
      <div className="science-controls">
        {toggle[topic.id] && (
          <Button
            aria-pressed={alternate}
            onClick={() => {
              setAlternate((v) => !v);
              set(0);
            }}
          >
            {toggle[topic.id][alternate ? 1 : 0]}
          </Button>
        )}
        {hasProgress && (
          <label>
            {["rust", "stainless-steel"].includes(topic.id)
              ? "观察阶段"
              : scene.control}
            <output>{value} / 100</output>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => set(Number(e.target.value))}
            />
          </label>
        )}
        {process && (
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
            set(0);
            setAlternate(false);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      <p className="science-caption" role="status">
        {topic.id === "stainless-steel"
          ? value <= 33
            ? "起始：连续的富铬钝化膜有助于减慢腐蚀。将进度移到中段，观察表面受损。"
            : value < 67
              ? "中段：表面划伤，局部金属暴露。继续推进，比较不同环境下能否重新钝化。"
              : alternate
                ? "后段：不利环境可能妨碍重新钝化，局部腐蚀风险增加；不锈钢并非永不生锈。"
                : "后段：适宜环境下，暴露表面重新形成保护膜。阶段为定性示意，不代表固定修复时间。"
          : topic.id === "hook-loop"
            ? alternate
              ? "从右边逐步剥起，分离前沿向左推进；相邻钩环依次释放，未剥开的区域仍保持接触。形变与间距是教学简化。"
              : "推进按合量，看小钩进入纤维环；再切换边缘剥离，比较连接如何依次解除。"
            : scene.states[alternate ? 1 : 0]}
      </p>
    </div>
  );
}
