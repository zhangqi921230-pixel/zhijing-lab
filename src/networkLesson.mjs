const field = (key, label, min, max, step, value, unit) => ({
  key,
  label,
  min,
  max,
  step,
  value,
  unit,
});
const chapter = (title, text, task, preset, time = 0) => ({
  title,
  text,
  task,
  preset,
  time,
});
export const networkLesson = {
  id: "resistor-network",
  subject: "physics",
  title: "串并联与电流分配",
  description: "保持同一电源，切换两只电阻的连接方式，追踪电流、电压和功率。",
  params: [
    field("u", "电源电压", 0, 12, 0.5, 6, "V"),
    field("r1", "电阻 R₁", 5, 60, 1, 10, "Ω"),
    field("r2", "电阻 R₂", 5, 60, 1, 20, "Ω"),
  ],
  chapters: [
    chapter(
      "串联：一条路径，相同电流",
      "串联电路只有一条电流路径。电流流过两只电阻，总电压等于两段电压之和。",
      "播放查看电流方向；核对 I₁、I₂ 与总电流。",
      { u: 6, r1: 10, r2: 20, mode: 0, closed: 1 },
    ),
    chapter(
      "串联：谁分到的电压更多",
      "串联时电流相同，U₁/U₂ = R₁/R₂。阻值较大的电阻分到更多电压。",
      "把 R₂ 从 30 Ω 改成 10 Ω，比较电压条带与电压之和。",
      { u: 6, r1: 10, r2: 30, mode: 0, closed: 1 },
      3,
    ),
    chapter(
      "并联：两条支路，相同电压",
      "两只电阻接在相同的两个节点之间，所以支路电压都等于电源电压。总电流等于支路电流之和。",
      "对照两个分支和节点，改变 R₂，观察 R₁ 的电流是否改变。",
      { u: 6, r1: 10, r2: 20, mode: 1, closed: 1 },
    ),
    chapter(
      "并联：电流怎样分配",
      "相同电压下，电阻越小的支路电流越大；I₁/I₂ = R₂/R₁。",
      "先比较 10 Ω 和 30 Ω，再把两支路设为相同阻值。",
      { u: 6, r1: 10, r2: 30, mode: 1, closed: 1 },
      3,
    ),
    chapter(
      "同样的电阻，换一种连接",
      "同一电源和两只电阻，串联的等效电阻比任一电阻大，并联的等效电阻比任一电阻小。",
      "只切换串联与并联，比较总电流与总功率；再断开总开关，检查读数。",
      { u: 6, r1: 20, r2: 20, mode: 0, closed: 1 },
      6,
    ),
    chapter(
      "断开一条支路，另一条怎样",
      "理想稳压电源下，两条并联支路独立。断开 R₂ 支路后，R₁ 两端电压不变，其电流也不变，总电流减少。",
      "反复闭合、断开 R₂ 支路，对照 R₁ 的电流、总电流与负载等效电阻。注意 R₂ 两端电压和断开的开关两端电压不是同一读数。",
      { u: 6, r1: 10, r2: 20, mode: 1, closed: 1, branch2: 0 },
      6,
    ),
  ],
  formula: "串联 R = R₁ + R₂；并联 1/R = 1/R₁ + 1/R₂；I = U/R",
  assumption:
    "理想直流稳压电源、恒温欧姆电阻、无电阻导线；不模拟温升、限流或额定功率。总开关位于电源与负载之间；断开后负载电流与电压为零，电源电压仍可非零。等效电阻指当前接入的负载网络。R₂ 支路开关只在并联模式生效，位于 R₂ 之前；该开关断开后 R₂ 电流和电压为零，开关两端电压可等于电源电压。亮点仅示意约定电流方向，不表示电子、真实速度或电荷数量。电路符号为原理示意，不是器材外形。",
};
export function networkState(p) {
  const branch2Connected = p.mode !== 1 || p.branch2 !== 0;
  const resistance =
    p.mode === 1
      ? branch2Connected
        ? (p.r1 * p.r2) / (p.r1 + p.r2)
        : p.r1
      : p.r1 + p.r2;
  const current = p.closed ? p.u / resistance : 0;
  const i1 = p.mode === 1 ? (p.closed ? p.u / p.r1 : 0) : current;
  const i2 =
    p.mode === 1 ? (p.closed && branch2Connected ? p.u / p.r2 : 0) : current;
  return {
    resistance,
    branch2Connected,
    switchVoltage: p.mode === 1 && !branch2Connected && p.closed ? p.u : 0,
    current,
    i1,
    i2,
    u1: i1 * p.r1,
    u2: i2 * p.r2,
    power: current * p.u,
    power1: i1 * i1 * p.r1,
    power2: i2 * i2 * p.r2,
  };
}
export function networkReadouts(p) {
  const q = networkState(p);
  return [
    ["负载等效电阻", `${q.resistance.toFixed(2)} Ω`],
    ["电源总电流", `${q.current.toFixed(3)} A`],
    ["负载总功率", `${q.power.toFixed(3)} W`],
  ];
}
