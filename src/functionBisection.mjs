import { functionValue } from "./advancedModels.mjs";

export function functionBisection(p, left, right, steps = 0) {
  const fail = (message) => ({ valid: false, message, rows: [] });
  if (
    ![left, right].every(Number.isFinite) ||
    left < -5 ||
    right > 5 ||
    left >= right
  )
    return fail("请填写 −5 至 5 内的区间，且左端点小于右端点。");
  const k = p.k ?? 1;
  if (p.type === 3 && (k === 0 || (left <= p.shift && right >= p.shift)))
    return fail("区间包含反比例函数的无定义位置，不能用端点异号推断零点。");
  let lo = left,
    hi = right;
  let flo = functionValue(p, lo),
    fhi = functionValue(p, hi);
  if (![flo, fhi].every((v) => v !== null && Number.isFinite(v)))
    return fail("端点超出定义域或数值范围，请调整区间。");
  // All eight supported families are continuous between defined endpoints,
  // except the reciprocal pole, explicitly rejected above.
  if (flo !== 0 && fhi !== 0 && Math.sign(flo) === Math.sign(fhi))
    return fail("端点同号，当前区间不满足二分法条件；这不代表区间内没有零点。");
  let exact = flo === 0 ? lo : fhi === 0 ? hi : null;
  const rows = [];
  const count = Math.max(0, Math.min(30, Math.floor(steps)));
  for (let i = 0; i < count && exact === null; i++) {
    const mid = lo + (hi - lo) / 2,
      fm = functionValue(p, mid);
    if (fm === null || !Number.isFinite(fm))
      return fail("中点数值不可用，请调整区间。");
    rows.push({ left: lo, right: hi, mid, value: fm });
    if (fm === 0) {
      exact = mid;
      lo = hi = mid;
    } else if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
      fhi = fm;
    }
  }
  if (exact !== null) lo = hi = exact;
  return {
    valid: true,
    left: lo,
    right: hi,
    estimate: lo + (hi - lo) / 2,
    error: (hi - lo) / 2,
    exact,
    rows,
    message:
      exact !== null
        ? "当前浮点计算在此点得到 f(x)=0。"
        : "保留两端异号的半区间；中点近似值的误差不超过当前区间半宽。",
  };
}
