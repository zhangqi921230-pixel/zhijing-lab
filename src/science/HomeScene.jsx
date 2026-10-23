import React, { useState, useEffect, useId } from "react";
import HomePaths, { pathLessons } from "./HomePaths.jsx";
import Button from "../LabButton.jsx";
const text = (x, y, t) => (
  <text x={x} y={y} fill="#edf3ef" fontSize="22">
    {t}
  </text>
);
export function HomeDiagram({
  id,
  value = 0,
  alternate = false,
  layer = true,
}) {
  const uid = useId().replaceAll(":", ""),
    p = value / 100;
  const arrow = (d, color = "#eec779") => (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="5"
      markerEnd={`url(#${uid}arrow)`}
    />
  );
  let body;
  switch (id) {
    case "air-conditioner": {
      const distance = p * 1240;
      const dot =
        distance < 420
          ? [200 + distance, 125]
          : distance < 620
            ? [620, 125 + distance - 420]
            : distance < 1040
              ? [620 - (distance - 620), 325]
              : [200, 325 - (distance - 1040)];
      body = (
        <>
          <path
            d="M200 125H620V325H200Z"
            fill="none"
            stroke="#91bfcc"
            strokeWidth="9"
          />
          {[
            [200, 125, "蒸发器", "#5c9cad"],
            [620, 125, "压缩机", "#bc9c6b"],
            [620, 325, "冷凝器", "#bd8066"],
            [200, 325, "节流部件", "#7da3a5"],
          ].map(([x, y, t, c]) => (
            <g key={t}>
              <rect
                x={x - 68}
                y={y - 37}
                width="136"
                height="74"
                rx="14"
                fill={c}
              />
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                fill="white"
                fontSize="23"
              >
                {t}
              </text>
            </g>
          ))}
          <circle
            cx={dot[0]}
            cy={dot[1]}
            r="10"
            fill="#fff3bb"
            stroke="#163b43"
            strokeWidth="3"
          />
          {arrow("M55 125H120", "#80c9de")}
          {arrow("M700 325H760")}
          {arrow("M620 55V78")}
          {text(35, 75, "室内热量")}
          {text(665, 275, "向室外放热")}
          {text(510, 40, "电能输入")}
          {text(300, 100, "低压蒸气 →")}
          {text(655, 220, "高压侧")}
          {text(315, 365, "← 液态为主")}
          {text(40, 230, "低压侧")}
          {text(45, 425, "闭合循环：压缩 → 冷凝放热 → 节流 → 蒸发吸热")}
        </>
      );
      break;
    }
    case "fridge":
      body = (
        <>
          <rect
            x="200"
            y="65"
            width="300"
            height="330"
            rx="25"
            fill="#c8d4d5"
          />
          <rect
            x="225"
            y="90"
            width="245"
            height="275"
            rx="10"
            fill="#749da9"
          />
          {[170, 250, 330].map((y) => (
            <path
              key={y}
              d={`M230 ${y}H465`}
              stroke="#d2e0dc"
              strokeWidth="7"
            />
          ))}
          <path
            d="M520 100h55v45h-45v45h45v45h-45v45h45v45h-45"
            fill="none"
            stroke="#d39e73"
            strokeWidth="13"
          />
          <path
            d={
              alternate ? "M200 65L95 100V420L200 395Z" : "M200 65H490V395H200Z"
            }
            fill="#dce4e1"
            stroke="#93a9b0"
            strokeWidth="5"
            fillOpacity={alternate ? 1 : 0.55}
          />
          {arrow(alternate ? "M80 190H340" : "M80 190H190")}
          {arrow("M590 240H730")}
          {text(
            45,
            45,
            alternate
              ? "门打开：暖空气进入，增加热负荷"
              : "门关闭：隔热结构减慢传热",
          )}
          {text(535, 375, "散热回到厨房")}
          {text(45, 435, "图示背面散热器；真实散热位置随型号不同")}
        </>
      );
      break;
    case "rice-cooker":
      body = (
        <>
          <path d="M220 170H580L555 350H245Z" fill="#c6d3d5" />
          <path d="M250 185H550L530 320H270Z" fill="#d5c9a7" />
          {!alternate && <path d="M250 185H550L540 240H260Z" fill="#7db7c7" />}
          {Array.from({ length: 35 }, (_, i) => (
            <ellipse
              key={i}
              cx={280 + (i % 7) * 36}
              cy={
                alternate
                  ? 205 + Math.floor(i / 7) * 21
                  : 255 + Math.floor(i / 7) * 12
              }
              rx="12"
              ry="5"
              fill="#eee5cd"
            />
          ))}
          <rect
            x="235"
            y="350"
            width="330"
            height="20"
            fill={alternate ? "#7f9999" : "#d49a68"}
          />
          <path
            d="M400 370v30h150v-35"
            stroke={alternate ? "#98b0b8" : "#eac17c"}
            strokeWidth="6"
            fill="none"
          />
          <path
            d={alternate ? "M550 365l30-27" : "M550 365h35"}
            stroke="#eac17c"
            strokeWidth="8"
          />
          {text(
            50,
            55,
            alternate
              ? "自由水显著减少 → 锅底更易升温"
              : "有自由水沸腾 → 输入热量用于汽化等过程",
          )}
          {text(
            55,
            430,
            alternate
              ? "温控根据变化切换状态"
              : "传统常压温控原理；不是所有型号的控制程序",
          )}
        </>
      );
      break;
    case "microwave":
      body = (
        <>
          <rect x="95" y="80" width="610" height="300" rx="25" fill="#9eb5bd" />
          <rect
            x="130"
            y="110"
            width="460"
            height="235"
            rx="10"
            fill="#233f51"
          />
          <circle cx="640" cy="190" r="25" fill="#d5dedb" />
          <rect x="615" y="260" width="48" height="42" fill="#d5dedb" />
          {Array.from({ length: 6 }, (_, i) => (
            <path
              key={i}
              d={`M145 ${130 + i * 33}q50-22 100 0t100 0t100 0t100 0`}
              fill="none"
              stroke="#75a9c4"
              strokeWidth="3"
            />
          ))}
          <ellipse cx="360" cy="300" rx="160" ry="24" fill="#b4c5c5" />
          <g transform={`rotate(${alternate ? p * 360 : 0} 360 240)`}>
            <rect
              x="270"
              y="180"
              width="180"
              height="105"
              rx="20"
              fill="#d8bf8d"
            />
            {Array.from({ length: 12 }, (_, i) => (
              <circle
                key={i}
                cx={290 + (i % 4) * 45}
                cy={200 + Math.floor(i / 4) * 30}
                r="12"
                fill={i % 3 ? "#cba97e" : "#e18b62"}
                opacity={alternate ? 0.7 : 0.9}
              />
            ))}
          </g>
          {text(45, 45, "转动改变食物与不均匀电磁场的相对位置")}
          {text(45, 425, "颜色只示意吸收差异，不能作为食物实际温度")}
        </>
      );
      break;
    case "induction":
      body = (
        <>
          <rect
            x="130"
            y="300"
            width="540"
            height="24"
            rx="10"
            fill="#8dabb5"
          />
          <path
            d="M205 165V275H595V165"
            fill={alternate ? "#9ab6bd" : "#bda78a"}
            fillOpacity={alternate ? 0.4 : 1}
            stroke="#c6d8dd"
            strokeWidth="8"
          />
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse
              key={i}
              cx="400"
              cy="355"
              rx={40 + i * 29}
              ry={10 + i * 3}
              fill="none"
              stroke="#b79467"
              strokeWidth="4"
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <path
              key={i}
              d={`M${250 + i * 70} 350q-45-70 0-140q45 70 0 140`}
              fill="none"
              stroke="#6babc1"
              strokeWidth="3"
              strokeDasharray="7 8"
            />
          ))}
          {!alternate && (
            <path d="M215 270H585" stroke="#e3a773" strokeWidth="12" />
          )}
          {text(
            45,
            45,
            alternate
              ? "普通玻璃容器：不匹配常见家用电磁炉"
              : "匹配的金属锅底：感应电流使锅底发热",
          )}
          {text(50, 425, "磁场为示意；面板仍可能被热锅加热")}
        </>
      );
      break;
    case "washer": {
      const a = p * Math.PI * 6,
        cx = 400,
        cy = 245,
        r = 135;
      const cloth = alternate
        ? [cx + Math.cos(a) * 95, cy + Math.sin(a) * 95]
        : [cx + Math.sin(a) * 80, cy + Math.max(-80, Math.cos(a) * 100)];
      body = (
        <>
          <rect
            x="180"
            y="45"
            width="440"
            height="380"
            rx="20"
            fill="#c3d0d1"
          />
          <circle cx={cx} cy={cy} r={r + 25} fill="#7e9ba5" />
          <circle cx={cx} cy={cy} r={r} fill="#294b5c" />
          {Array.from({ length: 24 }, (_, i) => (
            <circle
              key={i}
              cx={cx + Math.cos((i * Math.PI) / 12 + a) * 123}
              cy={cy + Math.sin((i * Math.PI) / 12 + a) * 123}
              r="4"
              fill="#cbd9db"
            />
          ))}
          {!alternate && (
            <path
              d="M285 300Q400 280 515 300A135 135 0 0 1 285 300"
              fill="#739da9"
            />
          )}
          <path
            d={`M${cloth[0] - 20} ${cloth[1] - 30}l40 12 15 35-40 12-30-20Z`}
            fill="#e2c68d"
          />
          {alternate &&
            [0, 1, 2, 3].map((i) => {
              const b = a + i * 0.2;
              return (
                <path
                  key={i}
                  d={`M${cx + Math.cos(b) * 140} ${cy + Math.sin(b) * 140}l${-Math.sin(b) * 18} ${Math.cos(b) * 18}`}
                  stroke="#8ed5e1"
                  strokeWidth="4"
                />
              );
            })}
          {text(
            45,
            35,
            alternate
              ? "脱水：衣物受筒壁约束，水从孔离开"
              : "洗涤：衣物被提升并翻落",
          )}
          {alternate && (
            <path
              d="M400 405V420H650"
              fill="none"
              stroke="#8ed5e1"
              strokeWidth="7"
              strokeDasharray="12 5"
            />
          )}
          {text(
            50,
            445,
            alternate
              ? "水穿过内筒孔 → 外筒收集 → 下部排水"
              : "观察同一件衣物被带起与翻落；不是始终贴壁",
          )}
        </>
      );
      break;
    }
    case "vacuum":
      body = (
        <>
          <path
            d="M85 340H200V230H330"
            fill="none"
            stroke="#b4c6cc"
            strokeWidth="40"
          />
          <rect
            x="310"
            y="130"
            width="170"
            height="210"
            rx="30"
            fill="#6c9aab"
          />
          <path
            d="M345 155l55 160 55-160"
            fill="none"
            stroke="#d7c194"
            strokeWidth="6"
          />
          <rect x="500" y="180" width="55" height="110" fill="#d8d5bd" />
          {Array.from({ length: 7 }, (_, i) => (
            <path
              key={i}
              d={`M${503 + i * 8} 185v100`}
              stroke="#7f9a9a"
              strokeWidth="3"
            />
          ))}
          <circle cx="620" cy="235" r="55" fill="#b8cccf" />
          <path
            d="M620 180v110M565 235h110"
            stroke="#3f6b7b"
            strokeWidth="13"
          />
          {arrow("M70 340H180V230H300", "#84c6df")}
          {arrow(alternate ? "M480 235H498" : "M480 235H560", "#84c6df")}
          {arrow("M680 235H755", "#84c6df")}
          {alternate && (
            <path
              d="M500 185l55 100m-55 0 55-100"
              stroke="#d59b73"
              strokeWidth="13"
            />
          )}
          {Array.from({ length: 15 }, (_, i) => (
            <circle
              key={i}
              cx={350 + (i % 5) * 23}
              cy={300 + Math.floor(i / 5) * 10}
              r="5"
              fill="#d2b58c"
            />
          ))}
          {text(
            45,
            45,
            alternate ? "过滤阻塞增加气路阻力" : "风机驱动气流，集尘区留下颗粒",
          )}
          {text(340, 390, "集尘")}
          {text(490, 390, "过滤")}
          {text(600, 390, "风机")}
        </>
      );
      break;
    case "air-filter":
      body = (
        <>
          {[310, 400, 490].map((x, i) => (
            <path
              key={x}
              d={`M${x} 80q${i % 2 ? -45 : 45} 90 0 180t0 130`}
              stroke="#b9c9c3"
              strokeWidth="20"
              fill="none"
            />
          ))}
          {[130, 225, 330].map((y) => (
            <path
              key={y}
              d={`M50 ${y}Q235 ${y - 40} 300 ${y}t140 0t200 0`}
              stroke="#5d9fb6"
              strokeWidth="3"
              fill="none"
            />
          ))}
          <path
            d={
              alternate
                ? "M60 210l32 15-5-40 36 25 20-35 5 50 35-20 20 35 42-50 18 20 49-5"
                : "M60 210L305 210"
            }
            stroke="#e9c382"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx={alternate ? 312 : 305}
            cy={210}
            r={alternate ? 6 : 13}
            fill="#e9c382"
          />
          {text(
            45,
            45,
            alternate
              ? "小颗粒：随机扩散可能增加碰到纤维的机会"
              : "较大颗粒：惯性与拦截可能促使接触纤维",
          )}
          {text(50, 430, "纤维与颗粒不按同一比例；不是简单筛孔模型")}
        </>
      );
      break;
    case "thermos":
      body = (
        <>
          <path d="M250 100V355Q250 400 400 400T550 355V100Z" fill="#a9bfc4" />
          <path
            d="M275 115V350Q275 375 400 375T525 350V115Z"
            fill={layer ? "#1d3947" : "#75939f"}
          />
          <path
            d="M300 120V345Q300 355 400 355T500 345V120Z"
            fill={alternate ? "#7ab7cf" : "#c99870"}
          />
          <rect x="240" y="75" width="320" height="50" rx="10" fill="#bacbc9" />
          {arrow(
            alternate ? "M90 240H235" : "M235 240H90",
            alternate ? "#8ebfd3" : "#e6bc80",
          )}
          {arrow(
            alternate ? "M700 240H565" : "M565 240H700",
            alternate ? "#8ebfd3" : "#e6bc80",
          )}
          {!layer &&
            [175, 305].map((y) => (
              <g key={y}>
                {arrow(
                  alternate ? `M700 ${y}H490` : `M490 ${y}H700`,
                  "#d5ad73",
                )}
                {arrow(alternate ? `M90 ${y}H310` : `M310 ${y}H90`, "#d5ad73")}
              </g>
            ))}
          {text(
            45,
            40,
            alternate ? "冷饮：减慢环境向杯内传热" : "热饮：减慢杯内向环境传热",
          )}
          {text(
            75,
            425,
            layer
              ? "低压间隙减弱气体传热；辐射与固体连接仍存在"
              : "含气间隙：气体导热与对流路径更明显",
          )}
        </>
      );
      break;
    case "hairdryer":
      body = (
        <>
          <path
            d="M150 140H560L670 175V275L560 300H150Q90 220 150 140Z"
            fill="#b4c5c8"
          />
          <path d="M280 300L330 420H405L370 300Z" fill="#91abb2" />
          <circle cx="220" cy="220" r="55" fill="#3b6677" />
          <path
            d="M220 165v110M165 220h110"
            stroke="#cad8d9"
            strokeWidth="13"
          />
          <path
            d="M330 180l25 80 25-80 25 80 25-80 25 80 25-80 25 80"
            fill="none"
            stroke={alternate ? "#e3a272" : "#82999e"}
            strokeWidth="8"
          />
          {[185, 220, 255].map((y) => (
            <g key={y}>
              {arrow(`M25 ${y}H130`, "#81bdd6")}
              {arrow(`M550 ${y}H745`, alternate ? "#e6b27e" : "#81bdd6")}
            </g>
          ))}
          {text(
            45,
            45,
            alternate
              ? "热风：风机送风，同时主动加热"
              : "冷风：送风继续，主动加热关闭",
          )}
          {text(130, 350, "风机")}
          {text(450, 350, "发热元件")}
          {text(40, 445, "关闭加热后，内部残余热量仍需一段时间散去")}
        </>
      );
      break;
    default:
      return null;
  }
  return (
    <svg
      viewBox="0 0 800 460"
      role="img"
      aria-label={`${id} 家电结构与路径示意`}
    >
      <defs>
        <marker
          id={`${uid}arrow`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10Z" fill="#c1d6cf" />
        </marker>
      </defs>
      <rect width="800" height="460" fill="#274854" />
      {body}
    </svg>
  );
}
const actions = {
  fridge: ["打开冰箱门", "关上冰箱门"],
  "rice-cooker": ["看水分减少之后", "看仍有自由水"],
  microwave: ["转动食物", "固定食物"],
  induction: ["换成普通玻璃容器", "换成匹配金属锅底"],
  washer: ["看脱水", "看洗涤"],
  vacuum: ["比较滤网阻塞", "恢复通畅滤网"],
  "air-filter": ["看更小颗粒的扩散", "看较大颗粒"],
  thermos: ["放入冷饮", "放入热饮"],
  hairdryer: ["打开主动加热", "关闭主动加热"],
};
function LegacyHomeScene({ topic, scene, chapter, active = true }) {
  const [value, setValue] = useState(0),
    [alternate, setAlternate] = useState(false),
    [layer, setLayer] = useState(true),
    [playing, setPlaying] = useState(false);
  const process = ["air-conditioner", "washer", "microwave"].includes(topic.id),
    movable = process && (topic.id !== "microwave" || alternate);
  useEffect(() => setPlaying(false), [chapter, active]);
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
      <HomeDiagram
        id={topic.id}
        value={value}
        alternate={alternate}
        layer={layer}
      />
      <div className="science-controls">
        {actions[topic.id] && (
          <Button
            aria-pressed={alternate}
            onClick={() => {
              setAlternate((v) => !v);
              set(0);
            }}
          >
            {actions[topic.id][alternate ? 1 : 0]}
          </Button>
        )}
        {topic.id === "thermos" && (
          <Button aria-pressed={layer} onClick={() => setLayer((v) => !v)}>
            {layer ? "比较含气间隙" : "恢复低压夹层"}
          </Button>
        )}
        {movable && (
          <>
            <label>
              {scene.control}
              <output>{value} / 100</output>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => set(Number(e.target.value))}
              />
            </label>
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
            setLayer(true);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      <p className="science-caption" role="status">
        {topic.id === "air-conditioner"
          ? value < 34
            ? "低压蒸气从蒸发器流向压缩机。"
            : value < 50
              ? "压缩后的高压蒸气流向室外换热器，在那里放热。"
              : value < 84
                ? "制冷剂冷凝后沿高压侧流向节流部件。"
                : "节流降压后，制冷剂回到室内蒸发器继续吸热。"
          : topic.id === "washer"
            ? alternate
              ? "脱水时衣物随内筒运动，液态水经小孔进入外筒并排出；这不是烘干，也不是把衣物甩出机器。"
              : "洗涤时衣物被提升并翻落，与水和洗涤剂共同作用。切换脱水后比较贴壁状态；动画节奏为慢放，不用于比较实际转速。"
            : scene.states[alternate ? 1 : 0]}
      </p>
    </div>
  );
}

export default function HomeScene(props) {
  return pathLessons[props.topic.id] ? (
    <HomePaths {...props} />
  ) : (
    <LegacyHomeScene {...props} />
  );
}
