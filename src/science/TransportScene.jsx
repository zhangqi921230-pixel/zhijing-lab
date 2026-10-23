import React from "react";
import BrakeSection from "./BrakeSection.jsx";
import {
  bicycleModel,
  brakeModel,
  elevatorModel,
  shipModel,
} from "./transportModels.mjs";
import ScenePlayer from "./ScenePlayer.jsx";
const tx = (x, y, t) => (
  <text x={x} y={y} fill="#edf3ed" fontSize="22">
    {t}
  </text>
);
const arrow = (x, y, dx, dy, color = "#e3c388") => {
  const a = Math.atan2(dy, dx),
    ex = x + dx,
    ey = y + dy;
  return (
    <path
      d={`M${x} ${y}L${ex} ${ey}M${ex - 12 * Math.cos(a - 0.55)} ${ey - 12 * Math.sin(a - 0.55)}L${ex} ${ey}L${ex - 12 * Math.cos(a + 0.55)} ${ey - 12 * Math.sin(a + 0.55)}`}
      fill="none"
      stroke={color}
      strokeWidth="4"
    />
  );
};
export function escalatorPosition(t) {
  // Closed capsule loop, with a horizontal tread on the passenger run.
  const a = [130, 340],
    b = [650, 140],
    r = 35,
    dx = b[0] - a[0],
    dy = b[1] - a[1],
    length = Math.hypot(dx, dy),
    ux = dx / length,
    uy = dy / length,
    nx = uy,
    ny = -ux,
    total = 2 * length + 2 * Math.PI * r,
    d = (((t % 1) + 1) % 1) * total;
  if (d < length)
    return { x: a[0] + ux * d + nx * r, y: a[1] + uy * d + ny * r, angle: 0 };
  if (d < length + Math.PI * r) {
    const q = (d - length) / r;
    return {
      x: b[0] + r * (nx * Math.cos(q) + ux * Math.sin(q)),
      y: b[1] + r * (ny * Math.cos(q) + uy * Math.sin(q)),
      angle: (q * 180) / Math.PI,
    };
  }
  if (d < 2 * length + Math.PI * r) {
    const q = d - length - Math.PI * r;
    return { x: b[0] - ux * q - nx * r, y: b[1] - uy * q - ny * r, angle: 180 };
  }
  const q = (d - 2 * length - Math.PI * r) / r;
  return {
    x: a[0] + r * (-nx * Math.cos(q) - ux * Math.sin(q)),
    y: a[1] + r * (-ny * Math.cos(q) - uy * Math.sin(q)),
    angle: 180 + (q * 180) / Math.PI,
  };
}
export function TransportDiagram({ id, value = 40, variant = 0 }) {
  const p = value / 100;
  let body;
  switch (id) {
    case "airplane": {
      const a = -2 + p * 16;
      body = (
        <>
          {[-2, -1, 0, 1, 2].map((k, i) => (
            <path
              key={k}
              d={`M35 ${215 + k * 48}C200 ${215 + k * 48} 235 ${185 + k * 52} 400 ${200 + k * 48}S620 ${235 + k * 44} 770 ${250 + k * 44}`}
              stroke="#99c4d1"
              strokeWidth="3"
              fill="none"
            />
          ))}
          <g transform={`rotate(${-a} 400 230)`}>
            <path
              d="M225 240Q270 155 430 203L650 240Q370 264 225 240Z"
              fill="#d9e2de"
              stroke="#6c8790"
              strokeWidth="3"
            />
          </g>
          {arrow(425, 185, 0, -80)}
          {arrow(425, 280, 0, 80, "#c7b4a4")}
          {arrow(225, 270, 80, 0)}
          {arrow(610, 280, -65, 0, "#c7b4a4")}
          {tx(440, 110, "升力")}
          {tx(440, 360, "重力")}
          {tx(245, 310, "推力")}
          {tx(540, 325, "阻力")}
          {tx(30, 45, `机翼迎角 ${a.toFixed(1)}° · 定性流线`)}
          {tx(30, 435, "不采用“上下气团等时到达”假设")}
        </>
      );
      break;
    }
    case "high-speed-rail": {
      const stage = Math.min(3, Math.floor(p * 4));
      body = (
        <>
          <path d="M20 95H780" stroke="#d6bb8c" strokeWidth="5" />
          <path
            d="M400 95L340 145L420 185"
            fill="none"
            stroke={stage === 0 ? "#f7d27b" : "#94afb7"}
            strokeWidth="6"
          />
          <path
            d="M100 190H640Q710 200 750 275H70Q75 225 100 190Z"
            fill="#d5e0dd"
          />
          <rect x="160" y="215" width="420" height="35" fill="#577987" />
          <rect
            x="230"
            y="265"
            width="320"
            height="35"
            fill={stage === 1 ? "#d3b377" : "#6f8c96"}
          />
          {[280, 500].map((x) => (
            <g key={x}>
              <circle cx={x} cy="330" r="40" fill="#7a939b" />
              <path
                d={`M${x - 40} 330h80`}
                stroke={stage === 2 ? "#f0c978" : "#aabcc0"}
                strokeWidth="5"
                transform={`rotate(${p * 360} ${x} 330)`}
              />
            </g>
          ))}
          <path
            d="M220 303l15-12 15 24 15-24 15 24 15-24 15 12M430 303l15-12 15 24 15-24 15 24 15-24 15 12"
            stroke="#bba777"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M35 372H770"
            stroke={stage === 3 ? "#f5d59a" : "#b3c5c4"}
            strokeWidth="7"
          />
          {tx(
            40,
            45,
            [
              "受电弓：接触供电网络",
              "牵引设备：转换和控制电能",
              "电机与传动：输出转矩",
              "轮轨接触：把作用传到轨道",
            ][stage],
          )}
          {tx(45, 435, "典型功能路径；车底结构并非按实际比例")}
        </>
      );
      break;
    }
    case "bicycle": {
      const rear = variant ? 32 : 16,
        r = rear * 2,
        model = bicycleModel(value, rear),
        ratio = model.ratio,
        a = p * 360;
      body = (
        <>
          <circle
            cx="570"
            cy="245"
            r="150"
            fill="none"
            stroke="#9fb6bb"
            strokeWidth="8"
          />
          <path
            d={model.chain}
            fill="none"
            stroke="#c0d2ce"
            strokeWidth="5"
            strokeDasharray="9 3.56637"
            strokeDashoffset={-model.chainTravel}
          />
          {[
            [220, 80, a],
            [570, r, a * ratio],
          ].map(([x, rr, ang]) => (
            <g key={x} transform={`rotate(${ang} ${x} 245)`}>
              <circle cx={x} cy="245" r={rr} fill="#af9874" />
              {Array.from({ length: x === 220 ? 40 : rear }, (_, i) => (
                <path
                  key={i}
                  d={`M${x} ${245 - rr - 4}v8`}
                  stroke="#e8d29d"
                  strokeWidth="5"
                  transform={`rotate(${(i * 360) / (x === 220 ? 40 : rear)} ${x} 245)`}
                />
              ))}
              <path
                d={`M${x} 245V${245 - rr}`}
                stroke="#234d56"
                strokeWidth="7"
              />
            </g>
          ))}
          <path
            d="M570 245V95"
            stroke="#ead39a"
            strokeWidth="3"
            transform={`rotate(${a * ratio} 570 245)`}
          />
          {tx(35, 45, `前盘 40 齿 / 后齿轮 ${rear} 齿 = ${ratio.toFixed(2)}`)}
          {tx(
            100,
            435,
            `脚踏 ${p.toFixed(2)} 圈 → 后轮 ${(p * ratio).toFixed(2)} 圈`,
          )}
        </>
      );
      break;
    }
    case "brakes": {
      body = <BrakeSection value={value} />;
      break;
    }
    case "ship": {
      const { top, load } = shipModel(value);
      body = (
        <>
          <rect x="0" y="250" width="800" height="210" fill="#326779" />
          <path
            d={`M155 ${top}H645L590 ${top + 160}H210Z`}
            fill="#aabfc1"
            stroke="#e0e8dc"
            strokeWidth="4"
          />
          {Array.from({ length: load }, (_, i) => (
            <rect
              key={i}
              x={220 + (i % 4) * 85}
              y={top - 35 - Math.floor(i / 4) * 38}
              width="75"
              height="32"
              fill="#b69c74"
            />
          ))}
          <path d="M0 250H800" stroke="#92c8d5" strokeWidth="4" />
          {arrow(390, top + 70, 0, -80 - (load / 8) * 30)}
          {arrow(450, top + 70, 0, 80 + (load / 8) * 30, "#e1b6a1")}
          {tx(30, 45, "载荷增加，新的漂浮平衡需要更多排水量")}
          {tx(40, 425, "图示范围内仍有干舷；不计算真实载重极限")}
        </>
      );
      break;
    }
    case "submarine": {
      const depth = 190;
      body = (
        <>
          <rect width="800" height="460" fill="#305d6b" />
          <rect
            x="120"
            y={depth}
            width="560"
            height="145"
            rx="72"
            fill="#afc3c4"
          />
          <rect
            x="205"
            y={depth + 27}
            width="380"
            height="88"
            rx="40"
            fill="#627d83"
          />
          <path d="M360 190V145H430V190" fill="#a6babc" />
          {[150, 590].map((x) => (
            <g key={x}>
              <rect
                x={x}
                y={depth + 40}
                width="55"
                height="70"
                rx="12"
                fill="#d4e1dc"
              />
              <rect
                x={x}
                y={depth + 110 - p * 70}
                width="55"
                height={p * 70}
                fill="#5a9cb3"
              />
            </g>
          ))}
          {arrow(350, 190, 0, -75, "#d3dcb4")}
          {arrow(450, 330, 0, 35 + p * 80, "#e0b08d")}
          {tx(
            30,
            45,
            p < 0.45
              ? "浮力较大：上浮趋势"
              : p > 0.55
                ? "总重较大：下沉趋势"
                : "浮力与总重接近",
          )}
          {tx(35, 430, "外部体积固定；变化的是压载水与总重")}
        </>
      );
      break;
    }
    case "elevator": {
      const { car, counter, angle } = elevatorModel(value);
      body = (
        <>
          <path d="M190 80V420M550 80V420" stroke="#78979e" strokeWidth="8" />
          <circle cx="380" cy="85" r="55" fill="#a6b9bc" />
          <path
            d={`M325 ${car}V85A55 55 0 0 1 435 85V${counter}`}
            stroke="#e0c291"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M325 85H435"
            stroke="#5d7b83"
            strokeWidth="6"
            transform={`rotate(${angle} 380 85)`}
          />
          <rect x="245" y={car} width="160" height="100" fill="#9db8ba" />
          <path d={`M325 ${car}v100`} stroke="#668d94" strokeWidth="4" />
          <rect x="402.5" y={counter} width="65" height="95" fill="#baa47e" />
          {tx(245, car + 60, "轿厢")}
          {tx(490, counter + 55, "对重")}
          {tx(30, 45, "典型 1∶1 曳引结构")}
          {tx(35, 445, "绳带绕过驱动轮，两侧反向运动")}
        </>
      );
      break;
    }
    case "escalator": {
      const line = Array.from({ length: 161 }, (_, i) => {
        const q = escalatorPosition(i / 160);
        return `${q.x},${q.y}`;
      }).join(" ");
      body = (
        <>
          <polyline
            points={line}
            fill="none"
            stroke="#668894"
            strokeWidth="10"
          />
          {Array.from({ length: 26 }, (_, i) => {
            const q = escalatorPosition(i / 26 + p);
            return (
              <g
                key={i}
                transform={`translate(${q.x} ${q.y}) rotate(${q.angle})`}
              >
                <path
                  d="M-14 0H14V23H-14Z"
                  fill={i === 0 ? "#f2ca7b" : "#a9c0c2"}
                  stroke="#355967"
                  strokeWidth="2"
                />
              </g>
            );
          })}
          <path d="M130 275L650 75" stroke="#acbfc0" strokeWidth="6" />
          {tx(30, 45, "金色梯级保持同一身份，沿完整闭环循环")}
          {tx(410, 330, "下方回程")}
          {tx(30, 435, "轨道与梯级轮廓为运动原理示意")}
        </>
      );
      break;
    }
    case "bridges": {
      const sag = variant === 0 ? p * 20 : 0;
      body = (
        <>
          <rect x="100" y="300" width="45" height="120" fill="#8ea5a8" />
          <rect x="655" y="300" width="45" height="120" fill="#8ea5a8" />
          <path
            d={`M100 300Q400 ${300 + sag} 700 300`}
            stroke="#c1cfc7"
            strokeWidth="14"
            fill="none"
          />
          {variant === 1 && (
            <>
              <path
                d="M120 390Q400 210 680 390"
                stroke="#d5bd89"
                strokeWidth="18"
                fill="none"
              />
              {arrow(150, 355, -70, 25)}
              {arrow(650, 355, 70, 25)}
            </>
          )}
          {variant === 2 && (
            <>
              <path
                d="M190 90V410M610 90V410"
                stroke="#9cb5ba"
                strokeWidth="13"
              />
              <path
                d="M65 320L190 100Q400 350 610 100L745 320"
                stroke="#e0c999"
                strokeWidth="5"
                fill="none"
              />
              {Array.from({ length: 11 }, (_, i) => {
                const x = 190 + i * 42,
                  t = i / 10,
                  y = 100 + 500 * t * (1 - t);
                return (
                  <path
                    key={i}
                    d={`M${x} ${y}V300`}
                    stroke="#b8cfd0"
                    strokeWidth="3"
                  />
                );
              })}
            </>
          )}
          {arrow(400, 125, 0, 120 + p * 35)}
          {tx(
            35,
            45,
            [
              "梁：弯曲后把载荷传向支点",
              "拱：主要受压，支承还承受水平推力",
              "悬索：吊索与主缆受拉，塔与锚碇承接",
            ][variant],
          )}
          {tx(35, 445, "相同示意载荷，不等于相同承载能力")}
        </>
      );
      break;
    }
    case "expansion": {
      const gap = variant ? 50 : 90 - p * 65;
      body = (
        <>
          <path d="M60 240H740" stroke="#67888e" strokeWidth="40" />
          <rect
            x="60"
            y="210"
            width={340 - gap / 2}
            height="60"
            fill={variant ? `rgb(${155 + p * 65},150,124)` : "#afc3c1"}
          />
          <rect
            x={400 + gap / 2}
            y="210"
            width={340 - gap / 2}
            height="60"
            fill="#afc3c1"
          />
          {variant ? (
            <>
              <path
                d="M50 170V310M750 170V310"
                stroke="#e0cfa6"
                strokeWidth="13"
              />
              {arrow(115, 140, p * 110, 0)}
              {arrow(685, 140, -p * 110, 0)}
            </>
          ) : (
            <>
              <path
                d={`M${400 - gap / 2} 300v40h${gap}v-40`}
                stroke="#e0cfa6"
                strokeWidth="4"
                fill="none"
              />
              {tx(310, 385, "接缝变化放大")}
            </>
          )}
          {tx(
            30,
            45,
            variant
              ? "受约束：伸长受限，出现温度应力"
              : "可移动：温度升高，接缝相对缩小",
          )}
          {tx(30, 435, "画面不对应实际允许位移或安全温度")}
        </>
      );
      break;
    }
    default:
      return null;
  }
  return (
    <svg viewBox="0 0 800 470" role="img" aria-label={`${id} 结构与运动示意`}>
      <rect width="800" height="470" fill="#274854" />
      {body}
    </svg>
  );
}
const variants = {
  bicycle: ["后齿轮 16 齿", "后齿轮 32 齿"],
  bridges: ["梁桥", "拱桥", "悬索桥"],
  expansion: ["允许移动", "限制伸长"],
};
export default function TransportScene(props) {
  return (
    <ScenePlayer
      {...props}
      Diagram={TransportDiagram}
      variants={variants[props.topic.id]}
      caption={
        ["brakes", "bicycle", "elevator", "ship"].includes(props.topic.id)
          ? transportCaption(props.topic.id)
          : undefined
      }
      motion={[
        "high-speed-rail",
        "bicycle",
        "brakes",
        "elevator",
        "escalator",
      ].includes(props.topic.id)}
    />
  );
}

export function transportCaption(id) {
  return (value, variant) => {
    if (id === "brakes")
      return brakeModel(value).contact
        ? "两侧摩擦片已接触盘面，随后产生制动力矩和热。盘面正视图只用于看转速趋势；不计算整车制动距离。"
        : "间隙正在缩小，盘仍保持转动。此段未施加盘面摩擦减速，间隙为放大示意。";
    if (id === "bicycle") {
      const m = bicycleModel(value, variant ? 32 : 16);
      return `前盘转 ${m.frontTurns.toFixed(2)} 圈，后轮转 ${m.rearTurns.toFixed(2)} 圈，齿比 ${m.ratio.toFixed(2)}。前盘与后齿轮同向，链条沿闭环移动；只展示持续蹬踏且传动接合，不表示滑行。`;
    }
    if (id === "elevator")
      return "选定1:1悬挂：轿厢与对重移动距离相等、方向相反，曳引轮按绳带行程转动。绳长和轮半径在模型中保持不变；不代表所有电梯的绕绳方式。";
    if (id === "ship")
      return `模型载荷 ${shipModel(value).load} 格：每个位置是一种静态漂浮平衡，浮力与总重相等；不模拟下沉瞬间或摇晃。格数不是实际吨数，横截面面积不能直接当作整船排水体积。`;
    return undefined;
  };
}
