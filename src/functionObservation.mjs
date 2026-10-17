import { topicChapters } from "./topicChapters.mjs";
import { functionBisection } from "./functionBisection.mjs";
export const bisectionSignature = (p) =>
  [p.type, p.a, p.k, p.b, p.shift].join("|");
export function functionObservation(value, p) {
  const signature = bisectionSignature(p);
  const chapter =
    Number.isInteger(value?.chapter) &&
    value.chapter >= 0 &&
    value.chapter < topicChapters.functions.length
      ? value.chapter
      : 0;
  const source = value?.bisection;
  const empty = { signature, left: "0", right: "2", steps: 0 };
  if (!source || source.signature !== signature)
    return { chapter, bisection: empty };
  const validText = (v) =>
    typeof v === "string" &&
    v.length <= 40 &&
    (v.trim() === "" || Number.isFinite(Number(v)));
  const left = validText(source.left) ? source.left : "0",
    right = validText(source.right) ? source.right : "2";
  let steps =
    Number.isInteger(source.steps) && source.steps >= 0 && source.steps <= 30
      ? source.steps
      : 0;
  if (
    !functionBisection(
      p,
      left.trim() === "" ? NaN : Number(left),
      right.trim() === "" ? NaN : Number(right),
      steps,
    ).valid
  )
    steps = 0;
  return { chapter, bisection: { signature, left, right, steps } };
}
