import React, { useState } from "react";
import { photo } from "./models.mjs";
import "./PhotoEvidence.css";
const fields = [
  ["light", "光照", "%"],
  ["co2", "CO₂ 供给", "%"],
  ["temp", "温度", "°C"],
];
export function changedPhotoFactors(a, b) {
  return fields
    .filter(([key]) => Math.abs(a[key] - b[key]) > 1e-7)
    .map(([, name]) => name);
}
export default function PhotoEvidence({ p, onRecord }) {
  const [rows, setRows] = useState([]);
  const reference = rows[0];
  const changed = reference ? changedPhotoFactors(reference, p) : [];
  const rate = photo(p);
  const duplicate = rows.some(
    (row) => changedPhotoFactors(row, p).length === 0,
  );
  return (
    <section className="photo-evidence" aria-label="光合作用观察记录">
      <h3>留下条件，再比较结果</h3>
      <p>
        先记录一组作为参照，再改变条件。表中为定性模型计算值，不是植物实验实测值。记录仅保留在当前章节，最多8组。
      </p>
      <div className="photo-scan-controls">
        <button
          disabled={rows.length >= 8 || duplicate}
          onClick={() => {
            onRecord();
            setRows((old) => [
              ...old,
              { light: p.light, co2: p.co2, temp: p.temp },
            ]);
          }}
        >
          记录当前条件{rows.length ? `（${rows.length}/8）` : ""}
        </button>
        <button disabled={!rows.length} onClick={() => setRows([])}>
          清空本节记录
        </button>
      </div>
      <p role="status">
        {reference
          ? changed.length === 0
            ? "当前与第1组条件相同，可以检查模型是否给出相同结果。"
            : changed.length === 1
              ? `相对第1组，仅改变${changed[0]}，其余两个条件保持不变，可在本模型中比较该因素的影响。`
              : `相对第1组，同时改变${changed.join("、")}，不能把速率差异单独归因于其中一个因素。`
          : "尚无记录。记录当前条件后，第1组将作为本节参照。"}
      </p>
      {reference && (
        <div className="photo-evidence-bars" aria-label="当前与参照速率比较">
          {[
            { name: "第1组参照", rate: photo(reference) },
            { name: "当前条件", rate },
          ].map((item) => (
            <div key={item.name}>
              <span>{item.name}</span>
              <div className="photo-evidence-track">
                <i style={{ width: `${item.rate}%` }} />
              </div>
              <strong>{item.rate.toFixed(2)}%</strong>
            </div>
          ))}
          <p>
            共同刻度 0—100%；相差 {(rate - photo(reference)).toFixed(2)}{" "}
            个百分点。显示总光合相对速率，未扣除呼吸消耗。
          </p>
        </div>
      )}
      {rows.length > 0 && (
        <div
          className="photo-evidence-table"
          tabIndex="0"
          role="region"
          aria-label="观察记录表，可横向滚动"
        >
          <table>
            <caption>本节条件与模型结果</caption>
            <thead>
              <tr>
                <th scope="col">组次</th>
                {fields.map(([, name, unit]) => (
                  <th scope="col" key={name}>
                    {name} / {unit}
                  </th>
                ))}
                <th scope="col">相对速率 / %</th>
                <th scope="col">相对第1组改变</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <th scope="row">
                    {i + 1}
                    {i === 0 ? " · 参照" : ""}
                  </th>
                  {fields.map(([key]) => (
                    <td key={key}>{Number(row[key].toFixed(2))}</td>
                  ))}
                  <td>{photo(row).toFixed(2)}</td>
                  <td>
                    {i === 0
                      ? "—"
                      : changedPhotoFactors(reference, row).join("、") ||
                        "条件相同"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {duplicate && <p>这组条件已经记录；改变条件后可以添加下一组。</p>}
      {rows.length >= 8 && <p>已记录8组。可清空记录后开始新一轮探究。</p>}
    </section>
  );
}
