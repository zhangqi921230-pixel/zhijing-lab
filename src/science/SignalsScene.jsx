import React, { useState, useEffect, lazy, Suspense } from "react";
import Button from "../LabButton.jsx";
import { LaboratoryBoundary } from "../LaboratoryLoader.jsx";
const QrScene = lazy(() => import("./QrScene.jsx"));
const tx = (x, y, t) => (
  <text x={x} y={y} fill="#edf3ed" fontSize="22">
    {t}
  </text>
);
export const filmIntensity = (nm, wavelength, angle = 0) => {
  const r = Math.asin(Math.sin((angle * Math.PI) / 180) / 1.33);
  return Math.sin((2 * Math.PI * 1.33 * nm * Math.cos(r)) / wavelength) ** 2;
};
const curve = (fn, y, amp = 30) =>
  Array.from(
    { length: 181 },
    (_, i) => `${60 + i * 3.8},${y - amp * fn((i / 180) * Math.PI * 6)}`,
  ).join(" ");
export function SignalsDiagram({
  id,
  value = 40,
  alternate = false,
  extra = 0,
}) {
  const p = value / 100;
  let body;
  switch (id) {
    case "mirror": {
      const x = 110 + p * 180,
        virtual = 800 - x,
        eye = [110, 340],
        hit = 340 + ((140 - 340) * (400 - 110)) / (virtual - 110);
      body = (
        <>
          <path d="M400 70V400" stroke="#a9cbd5" strokeWidth="10" />
          <circle cx={x} cy="140" r="17" fill="#e6b668" />
          <circle
            cx={virtual}
            cy="140"
            r="17"
            fill="none"
            stroke="#e6b668"
            strokeDasharray="5 4"
          />
          <path
            d={`M${x} 140L400 ${hit}L${eye[0]} ${eye[1]}`}
            fill="none"
            stroke="#f5d282"
            strokeWidth="4"
          />
          <path
            d={`M400 ${hit}L${virtual} 140`}
            fill="none"
            stroke="#e4cd91"
            strokeDasharray="8 7"
            strokeWidth="3"
          />
          <ellipse cx={eye[0]} cy={eye[1]} rx="30" ry="15" fill="#e2ece5" />
          <circle cx={eye[0]} cy={eye[1]} r="9" fill="#274854" />
          {tx(60, 55, "实线：光的路线；虚线：反向延长")}
          {tx(x - 20, 105, "物体")}
          {tx(virtual - 20, 105, "虚像")}
          {tx(345, 440, "平面镜")}
        </>
      );
      break;
    }
    case "refraction": {
      const a = ((10 + p * 55) * Math.PI) / 180,
        r = Math.asin(Math.sin(a) / 1.33),
        hit = 270 + 170 * Math.tan(r),
        ex = hit + 125 * Math.tan(a),
        depth = (170 * Math.tan(r)) / Math.tan(a);
      body = (
        <>
          <rect x="0" y="190" width="800" height="270" fill="#376879" />
          <path d="M0 190H800" stroke="#b7d8d9" strokeWidth="3" />
          <path d="M235 115L270 360" stroke="#bea277" strokeWidth="13" />
          <path
            d={`M270 360L${hit} 190L${ex} 65`}
            fill="none"
            stroke="#f3ce83"
            strokeWidth="4"
          />
          <path
            d={`M${hit} 190L270 ${190 + depth}`}
            fill="none"
            stroke="#e7d9a6"
            strokeWidth="3"
            strokeDasharray="7 6"
          />
          <circle
            cx="270"
            cy={190 + depth}
            r="10"
            fill="none"
            stroke="#f9e6a8"
            strokeWidth="3"
          />
          <circle cx="270" cy="360" r="7" fill="#f9e6a8" />
          <path d={`M${hit} 90v240`} stroke="#d5e4e1" strokeDasharray="5 8" />
          {tx(30, 45, "水 → 空气：出射光偏离法线")}
          {tx(35, 420, "实体位置与反向延长的视位置不同")}
        </>
      );
      break;
    }
    case "soap-bubble": {
      const nm = value,
        angle = alternate ? 60 : 0,
        thick = 45 + nm * 0.1;
      body = (
        <>
          <rect
            x="120"
            y="150"
            width="300"
            height={thick}
            fill="#91bec8"
            opacity=".6"
          />
          <path
            d={`M175 65L225 150L275 65M225 150L${250 + thick * 0.3} ${150 + thick}L${275 + thick * 0.6} 150L${325 + thick * 0.6} 65`}
            fill="none"
            stroke="#f0d59b"
            strokeWidth="4"
          />
          <path d={`M95 150v${thick}`} stroke="#b7d5d7" strokeWidth="3" />
          {[650, 550, 450].map((w, i) => {
            const intensity = filmIntensity(nm, w, angle);
            return (
              <g key={w}>
                <rect
                  x={490 + i * 90}
                  y="120"
                  width="48"
                  height="230"
                  fill="#3b5f69"
                />
                <rect
                  x={490 + i * 90}
                  y={350 - intensity * 230}
                  width="48"
                  height={intensity * 230}
                  fill={["#e09a80", "#99bd8c", "#8bb8d3"][i]}
                />
                {tx(488 + i * 90, 390, `${w}`)}
              </g>
            );
          })}
          {tx(35, 42, `膜厚 ${nm} nm · 入射角 ${angle}°`)}
          {tx(70, 430, "示例波长的相对强度（右图单位：nm）")}
        </>
      );
      break;
    }
    case "glasses": {
      const corrected = alternate,
        far = extra === 1,
        focus = corrected ? 650 : far ? 735 : 550;
      body = (
        <>
          <ellipse
            cx="510"
            cy="240"
            rx="160"
            ry="140"
            fill="#a0bbb9"
            opacity=".35"
          />
          <path d="M650 130q40 110 0 220" stroke="#ddad91" strokeWidth="9" />
          <ellipse cx="365" cy="240" rx="15" ry="65" fill="#b8d6d4" />
          {corrected && (
            <path
              d={
                far
                  ? "M245 145q-28 95 0 190q28-95 0-190"
                  : "M230 145q25 95 0 190h30q-25-95 0-190Z"
              }
              fill="#94bbc9"
            />
          )}
          {[165, 240, 315].map((y) => (
            <path
              key={y}
              d={`M60 ${y}H${corrected ? 245 : 365}${corrected ? `L365 ${240 + (y - 240) * (far ? 0.75 : 1.25)}` : ""}L${focus} 240L770 ${240 + ((240 - (corrected ? 240 + (y - 240) * (far ? 0.75 : 1.25) : y)) * (770 - focus)) / (focus - 365)}`}
              fill="none"
              stroke="#e9c887"
              strokeWidth="3"
            />
          ))}
          <circle cx={focus} cy="240" r="7" fill="#f4da9b" />
          {tx(
            35,
            45,
            `${far ? "典型远视情境" : "典型近视情境"} · ${corrected ? "加入矫正镜片" : "不加镜片"}`,
          )}
          {tx(615, 410, "视网膜")}
          {tx(40, 440, "仅示意成像关系，不是处方计算")}
        </>
      );
      break;
    }
    case "sound": {
      const wave = alternate ? 120 : 220,
        phase = p * Math.PI * 4;
      body = (
        <>
          <rect x="25" y="140" width="20" height="180" fill="#d4b780" />
          {Array.from({ length: 37 }, (_, j) =>
            Array.from({ length: 6 }, (_, i) => {
              const base = 70 + j * 18,
                x = base + 12 * Math.sin((base / wave) * Math.PI * 2 - phase);
              return (
                <circle
                  key={`${i}-${j}`}
                  cx={x}
                  cy={160 + i * 27}
                  r={j === 10 && i === 2 ? 8 : 4}
                  fill={j === 10 && i === 2 ? "#f5ce79" : "#b4d0d0"}
                />
              );
            }),
          )}
          {tx(40, 55, "空气点局部往复，压缩与稀疏区向右传播")}
          <path
            d="M400 390H670l-20-9m20 9-20 9"
            stroke="#e5c789"
            strokeWidth="4"
            fill="none"
          />
          {tx(400, 430, "扰动传播方向")}
        </>
      );
      break;
    }
    case "noise-cancelling": {
      const phase = p * Math.PI;
      body = (
        <>
          {[120, 240, 360].map((y) => (
            <path key={y} d={`M60 ${y}H745`} stroke="#6e949e" strokeWidth="1" />
          ))}
          <polyline
            points={curve((x) => Math.sin(x), 120)}
            fill="none"
            stroke="#e1b686"
            strokeWidth="3"
          />
          <polyline
            points={curve((x) => -Math.sin(x + phase), 240)}
            fill="none"
            stroke="#9bc8d3"
            strokeWidth="3"
          />
          <polyline
            points={curve((x) => Math.sin(x) - Math.sin(x + phase), 360)}
            fill="none"
            stroke="#a7c997"
            strokeWidth="4"
          />
          {tx(40, 60, "原噪声")}
          {tx(40, 190, "控制声")}
          {tx(40, 310, "两者之和")}
          {tx(390, 435, `相位误差 ${Math.round(value * 1.8)}°`)}
        </>
      );
      break;
    }
    case "touchscreen": {
      const col = Math.round(p * 5),
        row = extra;
      body = (
        <>
          <rect x="80" y="80" width="640" height="300" rx="30" fill="#526c79" />
          {Array.from({ length: 24 }, (_, i) => {
            const c = i % 6,
              r = Math.floor(i / 6),
              d = Math.hypot(c - col, r - row);
            return (
              <rect
                key={i}
                x={105 + c * 100}
                y={105 + r * 64}
                width="85"
                height="50"
                rx="4"
                fill={
                  d < 0.1
                    ? alternate
                      ? "#8daea5"
                      : "#ead199"
                    : d < 1.5
                      ? "#83aaa7"
                      : "#385966"
                }
              />
            );
          })}
          <circle
            cx={147 + col * 100}
            cy={130 + row * 64}
            r="22"
            fill="none"
            stroke="#fff4ce"
            strokeWidth="4"
          />
          {tx(
            35,
            45,
            alternate
              ? "较弱耦合情境（不设通用检测阈值）"
              : "电极网格与局部变化示意",
          )}
          {tx(60, 430, `当前选择：第 ${row + 1} 行，第 ${col + 1} 列`)}
        </>
      );
      break;
    }
    case "qr-code":
      body = (
        <>
          {[
            [120, 80],
            [510, 80],
            [120, 300],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="90" height="90" fill="#f3f1db" />
              <rect
                x={x + 15}
                y={y + 15}
                width="60"
                height="60"
                fill="#274854"
              />
              <rect
                x={x + 30}
                y={y + 30}
                width="30"
                height="30"
                fill="#f3f1db"
              />
            </g>
          ))}
          {tx(285, 250, "定位 → 读取 → 纠错")}
          {tx(285, 310, "进入主题，实际遮挡和解码")}
        </>
      );
      break;
    case "wifi": {
      const stage = Math.min(3, Math.floor(p * 4)),
        xx = [95, 280, 490, 690];
      body = (
        <>
          <path
            d="M95 230H490"
            stroke="#9cc1cb"
            strokeWidth="5"
            strokeDasharray={alternate ? "10 12" : undefined}
          />
          <path
            d="M520 230q70-110 140 0"
            stroke="#bad9d6"
            strokeWidth="4"
            fill="none"
          />
          {["远端服务", "上游网络", "接入点", "手机"].map((t, i) => (
            <g key={t}>
              <rect
                x={xx[i] - 48}
                y="180"
                width="96"
                height="100"
                rx="15"
                fill={
                  i === stage && !(alternate && i < 2) ? "#d0b580" : "#577a84"
                }
              />
              <text
                x={xx[i]}
                y="320"
                fill="#e4ece3"
                fontSize="22"
                textAnchor="middle"
              >
                {t}
              </text>
            </g>
          ))}
          {alternate && (
            <path
              d="M345 200l50 60m0-60-50 60"
              stroke="#d99c7e"
              strokeWidth="8"
            />
          )}
          {tx(
            35,
            50,
            alternate
              ? "上游断开，手机与接入点仍可保持连接"
              : "数据需要经过完整链路",
          )}
          {tx(50, 430, "方块表示数据路径，不表示电波的真实形状")}
        </>
      );
      break;
    }
    case "navigation": {
      const target = [290 + p * 170, 240],
        nodes = [
          [190, 130],
          [610, 150],
          [440, 350],
        ],
        count = extra + 1;
      body = (
        <>
          {nodes.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="10" fill="#e6c38a" />
              {i < count && (
                <circle
                  cx={x}
                  cy={y}
                  r={Math.hypot(x - target[0], y - target[1])}
                  fill="none"
                  stroke={["#92c2d0", "#b0ca94", "#d4a78b"][i]}
                  strokeWidth="2"
                />
              )}
            </g>
          ))}
          <circle cx={target[0]} cy={target[1]} r="8" fill="#f8df93" />
          {tx(35, 45, `${count} 条距离约束 · 平面、时钟已知的简化模型`)}
          {tx(35, 440, "真实三维导航还要估计接收机钟差")}
        </>
      );
      break;
    }
    default:
      return null;
  }
  return (
    <svg viewBox="0 0 800 460" role="img" aria-label={`${id} 原理与对照示意`}>
      <rect width="800" height="460" fill="#274854" />
      {body}
    </svg>
  );
}
const toggles = {
  "soap-bubble": ["比较斜入射 60°", "恢复正入射"],
  glasses: ["加入矫正镜片", "移除镜片"],
  sound: ["比较较短波长", "恢复较长波长"],
  touchscreen: ["比较较弱耦合", "恢复较强耦合"],
  wifi: ["断开上游网络", "恢复上游网络"],
};
export default function SignalsScene({ topic, scene, chapter }) {
  const [value, setValue] = useState(topic.id === "soap-bubble" ? 200 : 0),
    [alternate, setAlternate] = useState(false),
    [extra, setExtra] = useState(0),
    [playing, setPlaying] = useState(false);
  const moving = ["sound", "wifi"].includes(topic.id);
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
      80,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const set = (v) => {
    setPlaying(false);
    setValue(v);
  };
  if (topic.id === "qr-code")
    return (
      <LaboratoryBoundary
        fallback={
          <p role="alert">
            二维码模块加载失败，请刷新后重试；下方讲解仍可阅读。
          </p>
        }
      >
        <Suspense fallback={<p role="status">正在准备本地编码与解码…</p>}>
          <QrScene />
        </Suspense>
      </LaboratoryBoundary>
    );
  return (
    <div>
      <SignalsDiagram
        id={topic.id}
        value={value}
        alternate={alternate}
        extra={extra}
      />
      <div className="science-controls">
        {topic.id !== "glasses" && (
          <label>
            {scene.control}
            <output>
              {topic.id === "soap-bubble"
                ? `${value} nm`
                : topic.id === "refraction"
                  ? `${(10 + value * 0.55).toFixed(0)}°`
                  : value}
            </output>
            <input
              type="range"
              min="0"
              max={topic.id === "soap-bubble" ? 800 : 100}
              step={topic.id === "soap-bubble" ? 5 : 1}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
            />
          </label>
        )}
        {toggles[topic.id] && (
          <Button
            aria-pressed={alternate}
            onClick={() => {
              setAlternate((v) => !v);
              setPlaying(false);
              if (moving) setValue(0);
            }}
          >
            {toggles[topic.id][alternate ? 1 : 0]}
          </Button>
        )}
        {topic.id === "glasses" && (
          <Button
            onClick={() => {
              setExtra((v) => (v ? 0 : 1));
              setAlternate(false);
            }}
          >
            {extra ? "比较近视情境" : "比较远视情境"}
          </Button>
        )}
        {topic.id === "touchscreen" && (
          <label>
            网格行<output>{extra + 1}</output>
            <input
              type="range"
              min="0"
              max="3"
              value={extra}
              onChange={(e) => setExtra(Number(e.target.value))}
            />
          </label>
        )}
        {topic.id === "navigation" &&
          [0, 1, 2].map((n) => (
            <Button
              key={n}
              aria-pressed={extra === n}
              onClick={() => setExtra(n)}
            >
              {n + 1} 条约束
            </Button>
          ))}
        {moving && (
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
            set(topic.id === "soap-bubble" ? 200 : 0);
            setAlternate(false);
            setExtra(0);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      <p className="science-caption" role="status">
        {scene.states[alternate ? 1 : 0]}
      </p>
    </div>
  );
}
