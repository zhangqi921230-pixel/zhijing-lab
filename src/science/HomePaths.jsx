import React, { useEffect, useId, useState } from "react";
import Button from "../LabButton.jsx";

export const pathLessons = {
  vacuum: [
    [
      "空气从入口进入",
      "风机工作时建立压力差，外界空气携带颗粒进入软管。蓝色路径表示空气，金色圆点表示被放大的灰尘，两者不是同一种物质。",
    ],
    [
      "穿过集尘袋",
      "灰尘多留在袋内或袋材上，空气穿过多孔袋材，进入袋外壳体空间。集尘袋不是只储存灰尘的密闭塑料袋；空气也不是绕过袋口直接去风机。",
    ],
    [
      "经过滤层与风机",
      "空气继续经过电机前滤层和风机组件。这里把密封风道展开成一条线路；实际产品还有可能配置排气滤层。过滤是减少颗粒，不意味着排气绝对没有任何颗粒。",
    ],
    [
      "比较通畅与积尘",
      "同一风机设置下，滤材积尘通常增大气路阻力，实际通过的风量下降。比较时蓝线仍贯通整个气路；变细仅表示流量较小，不代表滤网后方空气凭空消失，也不是实测风量。",
    ],
  ],
  "air-filter": [
    [
      "空气绕过纤维",
      "蓝线表示局部气流绕过一根滤材纤维；金点代表颗粒。实际滤材由许多交错纤维组成，并不是只有一层均匀小孔的筛子。这里放大一处接触机会。",
    ],
    [
      "惯性碰撞",
      "气流在纤维前转弯，部分颗粒因惯性不能完全跟随弯曲的流线，继续前行而碰到纤维。金色路径终止于纤维表面；它不是所有颗粒必定经过的轨迹。",
    ],
    [
      "拦截",
      "颗粒大致随气流绕行，但颗粒本身有大小。中心仍沿附近流线前进时，边缘可能碰到纤维并被捕集；这与惯性偏离流线是两种不同机制。",
    ],
    [
      "扩散",
      "很小颗粒受到气体分子碰撞，运动有随机性，更有机会接触纤维。折线路径是一次示意，不表示每颗粒走相同路线。更小并不总是更容易穿透；整体效率还取决于材料、速度、厚度和密封。",
    ],
  ],
  thermos: [
    [
      "先比较热流方向",
      "热量净传递通常从较热处到较冷处。切换热饮和冷饮，比较箭头方向。保温杯减慢热交换，本身不会识别饮品并主动加热或制冷。",
    ],
    [
      "低压夹层减弱气体传热",
      "两层杯壁之间的大部分气体被抽走，因此气体导热与对流显著减弱。切换含气夹层看额外路径；低压夹层在杯壁之间，饮品上方的空间并不是真空夹层。",
    ],
    [
      "辐射仍能跨越夹层",
      "热辐射不需要空气，也能通过真空。波形线表示辐射交换中的净传热方向。反射性表面可以减小辐射换热，但不能把它理解成所有热量都被完全反弹回去。",
    ],
    [
      "杯口与杯盖仍会传热",
      "杯口的金属连接、杯盖等固体仍能导热。打开盖子还增加杯口空气交换和蒸发等热损失，形成绕过杯壁隔热的通路。因此盖好也不等于永远保持原温度。",
    ],
  ],
  hairdryer: [
    [
      "从进风口到叶轮",
      "电机带动叶轮，建立穿过机身的气流。蓝色箭头从进风侧到出风侧连续相接；送风不是仅靠发热丝让空气膨胀产生的。",
    ],
    [
      "经过加热区",
      "开启主动加热后，电阻性发热元件把电能转化为热，气流从它附近经过并带走热量。橙色只表示加热状态，不是明火，也不表示实际必须烧得通红。",
    ],
    [
      "出风带走水汽",
      "流动空气帮助带走头发附近的水汽；加热也会影响蒸发条件。这里只展示空气路径，没有根据功率计算风温、干燥时间或温度安全范围。",
    ],
    [
      "冷风仍然有气流",
      "关闭主动加热后，电机仍能驱动叶轮送风。刚切换时可能有残余热量，所以冷风不必瞬间达到环境温度。图中没有制冷回路，不应把冷风理解成冰箱式制冷。",
    ],
  ],
};

export default function HomePaths({ topic, chapter }) {
  const [step, setStep] = useState(0),
    [compare, setCompare] = useState(false);
  const uid = useId().replaceAll(":", ""),
    id = topic.id,
    lessons = pathLessons[id];
  useEffect(() => {
    setStep(0);
    setCompare(false);
  }, [id, chapter]);
  const blue = "#91d3e4",
    gold = "#f2c47b";
  const path = (d, color = blue, width = 6, dash) => (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dash}
      markerEnd={`url(#${uid})`}
    />
  );
  const text = (x, y, t) => (
    <text x={x} y={y} fill="#f0f4ef" fontSize="22">
      {t}
    </text>
  );
  let picture;
  if (id === "vacuum")
    picture = (
      <>
        <path d="M40 230H165" stroke="#63818b" strokeWidth="55" />
        <rect
          x="160"
          y="115"
          width="300"
          height="235"
          rx="25"
          fill="#395b66"
          stroke="#c3d2cf"
          strokeWidth="3"
        />
        <path
          d="M165 205H210V150H360Q395 150 395 190V300H210V255H165"
          fill="#d4c7a5"
          stroke="#efe2bd"
          strokeWidth="4"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={235 + i * 24} cy={278} r="6" fill="#936f42" />
        ))}
        <rect
          x="480"
          y="155"
          width="45"
          height="150"
          fill={compare ? "#827b68" : "#d5decf"}
        />
        <circle
          cx="600"
          cy="230"
          r="48"
          fill="#637e88"
          stroke="#c3d2cf"
          strokeWidth="3"
        />
        <path
          d="M570 200L630 260M570 260L630 200"
          stroke="#d5e1df"
          strokeWidth="12"
        />
        {path("M40 230H270", blue, compare ? 3 : 7)}
        {step >= 1 && path("M280 230H430", blue, compare ? 3 : 7)}
        {step >= 2 && path("M430 230H555", blue, compare ? 3 : 7)}
        {step >= 2 && path("M650 230H755", blue, compare ? 3 : 7)}
        {text(185, 395, "多孔集尘袋")}
        {text(455, 395, "滤层")}
        {text(565, 395, "风机")}
        {text(
          45,
          65,
          compare
            ? "积尘：整条气路风量减小（定性）"
            : "通畅：空气穿过袋材后继续流动",
        )}
      </>
    );
  if (id === "air-filter")
    picture = (
      <>
        <circle cx="420" cy="230" r="70" fill="#afc5c5" />
        {path("M50 230H210C300 230 300 120 420 120S540 230 740 230")}
        {path("M50 290H230C310 290 310 340 420 340S550 290 740 290", blue, 3)}
        {step === 1 && (
          <>
            {path("M70 230H337", gold, 5)}
            <circle cx="337" cy="230" r="13" fill={gold} />
          </>
        )}
        {step === 2 && (
          <>
            <path
              d="M70 160H280Q350 160 420 145"
              fill="none"
              stroke={gold}
              strokeWidth="5"
            />
            <circle cx="420" cy="145" r="15" fill={gold} />
          </>
        )}
        {step === 3 && (
          <>
            <path
              d="M70 160L110 180 128 142 168 192 198 152 228 172 253 137 283 185 310 190 325 220 343 230"
              fill="none"
              stroke={gold}
              strokeWidth="4"
            />
            <circle cx="343" cy="230" r="7" fill={gold} />
          </>
        )}
        {text(45, 65, lessons[step][0])}
        {text(365, 235, "纤维截面")}
        {text(45, 405, "蓝线：气流；金线 / 点：颗粒路径与接触")}
      </>
    );
  if (id === "thermos")
    picture = (
      <>
        <path
          d="M270 135V345Q270 390 400 390T530 345V135"
          fill="#183640"
          stroke="#adc3c6"
          strokeWidth="18"
        />
        <path
          d="M305 135V330Q305 350 400 350T495 330V135"
          fill={step === 0 && compare ? "#669eb3" : "#a87655"}
          stroke="#d7ded7"
          strokeWidth="9"
        />
        <rect x="260" y="100" width="280" height="40" rx="8" fill="#c6ccc2" />
        {step === 0 && path(compare ? "M100 245H265" : "M265 245H100", gold)}
        {step === 0 && path(compare ? "M700 245H535" : "M535 245H700", gold)}
        {step === 1 && (
          <>
            {path(
              compare ? "M305 210H270" : "M305 210H285",
              gold,
              compare ? 7 : 2,
            )}
            {compare && path("M280 280q-10-35 0-65", gold, 4)}
            {text(
              40,
              65,
              compare ? "含气夹层：气体传热增加" : "低压夹层：气体传热减弱",
            )}
          </>
        )}
        {step === 2 && (
          <>
            {path("M493 245q8-20 16 0t16 0", gold, compare ? 3 : 6)}
            {text(
              40,
              65,
              compare
                ? "反射表面：辐射路径仍存在，交换减弱"
                : "辐射能通过低压夹层",
            )}
          </>
        )}
        {step === 3 && (
          <>
            {path("M400 155V75", gold, 5)}
            {path("M310 165V140H270V180", gold, 4)}
            {text(40, 65, "杯盖、杯口连接仍有固体导热路径")}
          </>
        )}
        {text(45, 435, "只表示主要路径；箭头粗细不是实测热量")}
      </>
    );
  if (id === "hairdryer")
    picture = (
      <>
        <path
          d="M110 140H580L690 180V280L580 320H110Z"
          fill="#42616c"
          stroke="#bacccc"
          strokeWidth="4"
        />
        <circle cx="230" cy="230" r="55" fill="#5b7d88" />
        <path
          d="M200 190L260 270M200 270L260 190"
          stroke="#c9d6d4"
          strokeWidth="14"
        />
        <path
          d="M360 180l22 100 22-100 22 100 22-100 22 100 22-100 22 100"
          fill="none"
          stroke={compare ? "#edb36f" : "#bcc6bc"}
          strokeWidth="6"
        />
        {path("M40 230H170")}
        {step >= 1 && path("M290 230H535")}
        {step >= 2 && path("M555 230H755", compare ? gold : blue)}
        {text(160, 390, "电机 / 叶轮")}
        {text(360, 390, "发热元件")}
        {text(610, 390, "出风")}
        {text(40, 65, compare ? "送风 + 主动加热" : "送风保持，主动加热关闭")}
      </>
    );
  const compareText =
    id === "vacuum"
      ? ["比较积尘滤材", "恢复通畅滤材"]
      : id === "hairdryer"
        ? ["开启主动加热", "关闭主动加热"]
        : step === 0
          ? ["换成冷饮", "换成热饮"]
          : step === 1
            ? ["比较含气夹层", "恢复低压夹层"]
            : ["比较反射表面", "返回普通表面"];
  return (
    <div>
      <svg
        viewBox="0 0 800 460"
        role="img"
        aria-label={`${topic.title}：${lessons[step][0]}`}
      >
        <defs>
          <marker
            id={uid}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" fill="#e9d9ad" />
          </marker>
        </defs>
        <rect width="800" height="460" fill="#274854" />
        {picture}
      </svg>
      <div className="science-controls" role="group" aria-label="选择追踪路径">
        {lessons.map(([title], i) => (
          <Button
            key={title}
            aria-pressed={step === i}
            onClick={() => {
              setStep(i);
              setCompare(false);
            }}
          >
            {i + 1} {title}
          </Button>
        ))}
      </div>
      <div className="science-controls">
        {id !== "air-filter" && (id !== "thermos" || step < 3) && (
          <Button aria-pressed={compare} onClick={() => setCompare((v) => !v)}>
            {compareText[compare ? 1 : 0]}
          </Button>
        )}
        <Button
          onClick={() => {
            setStep(0);
            setCompare(false);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      <p className="science-caption" role="status">
        <strong>{lessons[step][0]}：</strong>
        {lessons[step][1]}
      </p>
      <p className="science-caption">
        路径、材料和颗粒均为教学示意，不按比例；每一步突出一种关系，不代表设备其余过程停止。
      </p>
    </div>
  );
}
