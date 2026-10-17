import React from "react";
import { functionRates } from "./advancedModels.mjs";
import "./SecantConvergence.css";
const show = (value) =>
  value === null
    ? "无定义"
    : Number(value.toFixed(5)).toLocaleString("zh-CN", {
        maximumFractionDigits: 5,
      });
export function convergenceRows(p) {
  return [1, 0.5, 0.1, 0.01].map((h) => ({
    h,
    left: functionRates({ ...p, dx: -h }),
    right: functionRates({ ...p, dx: h }),
  }));
}
export default function SecantConvergence({ p, onChange }) {
  const rows = convergenceRows(p),
    derivative = rows[0].left.tangent;
  return (
    <section className="secant-convergence" aria-label="左右差商对照">
      <h3>从左、从右，是否趋向同一个值？</h3>
      <p>
        固定 P 的横坐标 x = {show(p.probe)}。点击表中数值，将对应 Q
        点和割线同步到主图；操作会暂停播放。
      </p>
      <div
        className="secant-convergence-scroll"
        tabIndex="0"
        role="region"
        aria-label="左右差商表，可横向滚动"
      >
        <table>
          <caption>逐渐缩小两点间距；数值保留至多5位小数</caption>
          <thead>
            <tr>
              <th scope="col">间距 |Δx|</th>
              <th scope="col">从左侧 · Δx &lt; 0</th>
              <th scope="col">从右侧 · Δx &gt; 0</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.h}>
                <th scope="row">{row.h}</th>
                {[row.left, row.right].map((rate) => (
                  <td key={rate.dx}>
                    {rate.secant === null ? (
                      <span>不可计算</span>
                    ) : (
                      <button
                        aria-pressed={Math.abs(p.dx - rate.dx) < 1e-10}
                        onClick={() => onChange("dx", rate.dx)}
                        aria-label={`${rate.dx < 0 ? "左侧" : "右侧"}间距${row.h}，差商${show(rate.secant)}${rate.crossesGap ? "，跨越间断" : ""}`}
                      >
                        {show(rate.secant)}
                        {rate.crossesGap && <small>跨越间断</small>}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="secant-convergence-result">
        解析导数：
        {derivative === null ? "此点无有限两侧导数" : show(derivative)}。
      </p>
      <p>
        差商 = [f(x+Δx)−f(x)] /
        Δx。左右表项接近可帮助观察，但有限个数值不能证明极限存在；标为“跨越间断”的割线不用于连续趋近。Δx=0不能代入差商，表中不设零间距。
      </p>
    </section>
  );
}
