import React, { useEffect, useState } from "react";
import { functionBisection } from "./functionBisection.mjs";
import { graphPoint } from "./LinearScene.jsx";
import "./BisectionWorkbench.css";
import { bisectionSignature } from "./functionObservation.mjs";
import { bisectionExport } from "./bisectionExport.mjs";
import { downloadCsv } from "./csvDownload.mjs";
import BisectionInterval from "./BisectionInterval.jsx";

const number = (value) => Number(value.toPrecision(8)).toString();
export function useBisection(p, value, onChange) {
  const signature = bisectionSignature(p);
  const [internal, setInternal] = useState({});
  const stored = onChange ? (value ?? {}) : internal;
  const setStored = onChange ?? setInternal;
  useEffect(() => {
    if (stored.signature !== signature)
      setStored({ signature, left: "0", right: "2", steps: 0 });
  }, [signature, stored.signature, setStored]);
  const current =
    stored.signature === signature
      ? stored
      : { left: "0", right: "2", steps: 0 };
  const change = (next) => setStored({ ...current, ...next, signature });
  const left = current.left.trim() === "" ? NaN : Number(current.left);
  const right = current.right.trim() === "" ? NaN : Number(current.right);
  return {
    p,
    ...current,
    change,
    result: functionBisection(p, left, right, current.steps),
  };
}

export function BisectionLayer({ result, extent, labels, guides = true }) {
  if (!result.valid) return null;
  const x1 = graphPoint(result.left, 0, extent)[0],
    x2 = graphPoint(result.right, 0, extent)[0];
  const mid = graphPoint(result.estimate, 0, extent)[0];
  return (
    <g aria-label="二分法保留区间">
      <rect
        x={x1}
        y="60"
        width={Math.max(0, x2 - x1)}
        height="460"
        fill="#2878b5"
        opacity=".09"
      />
      {guides && (
        <path
          d={`M${x1} 60V520M${x2} 60V520`}
          stroke="#2878b5"
          strokeDasharray="5 5"
        />
      )}
      <circle
        cx={mid}
        cy="290"
        r="6"
        fill="#2878b5"
        stroke="white"
        strokeWidth="2"
      />
      {labels && (
        <text x={mid + 10} y="275" fill="#2878b5" fontSize="17">
          近似零点 {number(result.estimate)}
        </text>
      )}
    </g>
  );
}

export default function BisectionWorkbench({ state }) {
  const { p, result, change, steps, left, right } = state;
  const [exportStatus, setExportStatus] = useState("");
  useEffect(
    () => setExportStatus(""),
    [left, right, steps, p.type, p.a, p.k, p.b, p.shift],
  );
  return (
    <section className="bisection-workbench" aria-label="零点与二分法实验">
      <div className="bisection-heading">
        <strong>逐步缩小零点所在区间</strong>
        <span>高中拓展 · 连续性与异号条件</span>
      </div>
      <div className="bisection-controls">
        <label>
          左端点
          <input
            type="number"
            min="-5"
            max="5"
            step="any"
            value={left}
            onChange={(e) => change({ left: e.target.value, steps: 0 })}
          />
        </label>
        <label>
          右端点
          <input
            type="number"
            min="-5"
            max="5"
            step="any"
            value={right}
            onChange={(e) => change({ right: e.target.value, steps: 0 })}
          />
        </label>
        <button
          onClick={() => change({ steps: steps + 1 })}
          disabled={!result.valid || result.exact !== null || steps >= 30}
        >
          折半一步
        </button>
        <button
          onClick={() => change({ steps: Math.max(0, steps - 1) })}
          disabled={steps === 0}
        >
          上一步
        </button>
        <button onClick={() => change({ steps: 0 })} disabled={steps === 0}>
          重新开始
        </button>
        <button
          disabled={!result.valid}
          onClick={() => {
            try {
              const rows = bisectionExport(p, left, right, steps);
              if (!rows) return;
              downloadCsv("functions-二分法计算步骤.csv", rows);
              setExportStatus("已生成当前函数、区间和全部折半步骤的 CSV。");
            } catch {
              setExportStatus("导出未成功，请重新尝试。");
            }
          }}
        >
          导出计算步骤
        </button>
      </div>
      <p role="status">{result.message}</p>
      {exportStatus && <p role="status">{exportStatus}</p>}
      {result.valid && (
        <>
          <dl className="bisection-readouts">
            <div>
              <dt>已折半</dt>
              <dd>{result.rows.length} 次</dd>
            </div>
            <div>
              <dt>保留区间</dt>
              <dd>
                [{number(result.left)}, {number(result.right)}]
              </dd>
            </div>
            <div>
              <dt>中点近似值</dt>
              <dd>{number(result.estimate)}</dd>
            </div>
            <div>
              <dt>误差上界（近似显示）</dt>
              <dd>{number(result.error)}</dd>
            </div>
          </dl>
          <BisectionInterval result={result} left={left} right={right} />
          {result.rows.length > 0 && (
            <details>
              <summary>查看逐步计算（{result.rows.length} 步）</summary>
              <div className="bisection-history">
                <table>
                  <caption>每次折半前的区间和中点函数值</caption>
                  <thead>
                    <tr>
                      <th>步</th>
                      <th>原区间</th>
                      <th>中点</th>
                      <th>f(中点)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          [{number(row.left)}, {number(row.right)}]
                        </td>
                        <td>{number(row.mid)}</td>
                        <td>{number(row.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </>
      )}
      <small>
        修改区间或函数会重新开始；显示数值已舍入，计算使用未舍入数值。最多 30
        步，不把极小函数值自动当作精确零点。
      </small>
    </section>
  );
}
