import React, { useEffect, useState } from "react";
import "./FunctionParameterInput.css";

function NumberField({ name, label, value, min, max, onChange }) {
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState("");
  useEffect(() => {
    setDraft(String(value));
    setError("");
  }, [value]);
  const reset = () => {
    setDraft(String(value));
    setError("");
  };
  const commit = () => {
    const number = draft.trim() === "" ? NaN : Number(draft);
    if (!Number.isFinite(number) || number < min || number > max) {
      setError(`请输入 ${min} 到 ${max} 之间的数值`);
      return;
    }
    setError("");
    if (number !== value) onChange(name, number);
  };
  return (
    <label className="function-number-field">
      <span>{label}</span>
      <input
        type="text"
        inputMode="decimal"
        aria-label={`精确输入${label}`}
        value={draft}
        aria-invalid={!!error}
        aria-describedby={error ? `function-input-${name}-error` : undefined}
        onChange={(e) => {
          setDraft(e.target.value);
          setError("");
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            reset();
          }
        }}
      />
      <small>
        {min} ≤ {name === "shift" ? "h" : name === "probe" ? "x" : name} ≤ {max}
      </small>
      {error && (
        <span
          id={`function-input-${name}-error`}
          role="alert"
          className="function-input-error"
        >
          {error}
        </span>
      )}
    </label>
  );
}
export default function FunctionParameterInput({ p, onChange }) {
  return (
    <details className="function-exact-input">
      <summary>精确输入参数</summary>
      <p>
        输入后按 Enter 或离开输入框应用；Esc
        撤回未应用的输入。保留当前函数类型。
      </p>
      <div className="function-number-grid">
        {[
          ["a", "纵向系数 a", -3, 3],
          ["k", "横向系数 k", -3, 3],
          ["shift", "左右平移 h", -3, 3],
          ["b", "上下平移 b", -3, 3],
          ["probe", "探针 x", -5, 5],
        ].map(([name, label, min, max]) => (
          <NumberField
            key={name}
            {...{ name, label, min, max, onChange }}
            value={p[name] ?? (name === "k" ? 1 : 0)}
          />
        ))}
      </div>
    </details>
  );
}
