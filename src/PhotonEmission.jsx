import React, { useEffect, useState } from "react";
import Button from "./LabButton.jsx";
import { photonEnergy } from "./photonEnergy.mjs";
import "./PhotonEmission.css";
const steps = ["低能级", "吸收能量", "激发态", "发射光子"];
export default function PhotonEmission() {
  const [wavelength, setWavelength] = useState(589),
    [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false);
  const q = photonEnergy(wavelength),
    ground = 265,
    upper = ground - q.electronVolts * 55;
  useEffect(() => {
    if (!playing) return;
    const hidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", hidden);
    const timer = setTimeout(() => {
      if (step >= 2) {
        setStep(3);
        setPlaying(false);
      } else setStep(step + 1);
    }, 1100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [playing, step]);
  const change = (n) => {
    setWavelength(n);
    setStep(0);
    setPlaying(false);
  };
  const wave = Array.from(
    { length: 121 },
    (_, i) =>
      `${i ? "L" : "M"}${425 + i * 2.4} ${195 + 16 * Math.sin(((i * 2.4) / (wavelength / 10)) * 2 * Math.PI)}`,
  ).join(" ");
  return (
    <section className="photon-emission" aria-label="从激发到发光的能级示意">
      <header>
        <span>从现象到机制 · 高中拓展</span>
        <h3>颜色不同，光子的能量有什么不同？</h3>
      </header>
      <p>
        这里单独研究一个理想两能级体系。调节单色光波长，比较对应的能级差；它不代表具体盐样品的完整光谱。
      </p>
      <div className="photon-controls" aria-label="能级演示步骤">
        {steps.map((name, i) => (
          <Button
            key={name}
            aria-pressed={step === i}
            onClick={() => {
              setStep(i);
              setPlaying(false);
            }}
          >
            {i + 1}. {name}
          </Button>
        ))}
      </div>
      <div
        className="photon-stage"
        tabIndex="0"
        role="region"
        aria-label="能级示意图，可横向滚动"
      >
        <svg
          viewBox="0 0 760 350"
          role="img"
          aria-label={`当前步骤：${steps[step]}；能级差 ${q.electronVolts.toFixed(3)} 电子伏特`}
        >
          <path
            d="M65 292V48l-5 9m5 -9l5 9"
            fill="none"
            stroke="var(--ui-muted)"
            strokeWidth="2"
          />
          <text x="25" y="30">
            能量 / eV
          </text>
          {[0, 1, 2, 3].map((n) => (
            <g key={n}>
              <path d={`M59 ${ground - n * 55}H72`} stroke="var(--ui-muted)" />
              <text x="37" y={ground - n * 55 + 6}>
                {n}
              </text>
            </g>
          ))}
          <path
            d={`M105 ${ground}H360 M105 ${upper}H360`}
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
          <text x="112" y={ground + 28}>
            低能级 · 参考零点
          </text>
          <text x="112" y={upper - 18}>
            高能级
          </text>
          <circle
            data-testid="energy-state"
            cx="170"
            cy={step === 2 ? upper : ground}
            r="9"
            fill="var(--ui-gold)"
            stroke="var(--ui-ink)"
          />
          {(step === 1 || step === 3) && (
            <path
              d={
                step === 1
                  ? `M270 ${ground - 12}V${upper + 12}l-6 10m6 -10l6 10`
                  : `M270 ${upper + 12}V${ground - 12}l-6 -10m6 10l6 -10`
              }
              fill="none"
              stroke="var(--ui-gold)"
              strokeWidth="3"
            />
          )}
          <text x="390" y="70">
            ΔE = {q.electronVolts.toFixed(3)} eV
          </text>
          <text x="390" y="105">
            {step === 0
              ? "体系处于较低能量状态"
              : step === 1
                ? "吸收能量：跃迁箭头不是运动轨道"
                : step === 2
                  ? "激发态：用离散能级表示能量状态"
                  : "回到低能级：发射一个光子"}
          </text>
          {step === 3 && (
            <g>
              <path
                d={wave}
                fill="none"
                stroke="var(--ui-gold)"
                strokeWidth="3"
              />
              <text x="450" y="241">
                λ = {wavelength} nm　 E = hc/λ
              </text>
            </g>
          )}
          <text x="390" y="310">
            波形不按实际空间尺度绘制。
          </text>
        </svg>
      </div>
      <div className="photon-controls">
        <Button
          primary
          onClick={() => {
            if (step === 3) setStep(0);
            setPlaying((v) => !v);
          }}
        >
          {playing ? "暂停能级演示" : "播放能级演示"}
        </Button>
        <Button
          onClick={() => {
            setStep(0);
            setPlaying(false);
          }}
        >
          回到低能级
        </Button>
      </div>
      <label className="photon-wavelength">
        单色光波长 <output>{wavelength} nm</output>
        <input
          type="range"
          min="400"
          max="700"
          step="1"
          value={wavelength}
          onChange={(e) => change(Number(e.target.value))}
        />
      </label>
      <div className="photon-controls" aria-label="波长对照">
        {[450, 530, 589, 670].map((n) => (
          <Button
            key={n}
            aria-pressed={wavelength === n}
            onClick={() => change(n)}
          >
            {n} nm
          </Button>
        ))}
      </div>
      <dl>
        <div>
          <dt>单个光子能量</dt>
          <dd>{q.joules.toExponential(3)} J</dd>
        </div>
        <div>
          <dt>频率</dt>
          <dd>{(q.frequency / 1e12).toFixed(1)} THz</dd>
        </div>
      </dl>
      <p>
        波长越短，单个光子的能量越大。光的亮度还与光子数量等因素有关，不能把“更亮”当作“单个光子能量更高”。
      </p>
      <details>
        <summary>这个示意能说明什么？</summary>
        <p>
          纵轴画的是能量，不是电子离原子核的距离。圆点表示能量状态，跃迁不画成沿连续中间能级运动。实际原子和分子具有多个能级，真实焰色也可能包含多种发光粒子及多条谱线；本图不预测具体盐的光谱、跃迁概率或寿命。播放时间仅为教学分步时长。
        </p>
      </details>
    </section>
  );
}
