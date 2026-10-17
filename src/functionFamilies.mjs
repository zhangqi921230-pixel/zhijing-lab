// Stable IDs preserve saved experiments. Values and UI labels share this catalogue.
export const functionFamilies = [
  {
    name: "二次函数",
    short: "二次",
    formula: "a[k(x − h)]² + b",
    evaluate: (x) => x * x,
  },
  {
    name: "正弦函数",
    short: "正弦",
    formula: "a sin(k(x − h)) + b",
    evaluate: Math.sin,
  },
  {
    name: "绝对值函数",
    short: "绝对值",
    formula: "a|k(x − h)| + b",
    evaluate: Math.abs,
  },
  {
    name: "反比例形式",
    short: "反比例",
    formula: "a/[k(x − h)] + b",
    evaluate: (x) => (Math.abs(x) < 1e-12 ? null : 1 / x),
  },
  {
    name: "三次函数",
    short: "三次",
    formula: "a[k(x − h)]³ + b",
    evaluate: (x) => x ** 3,
  },
  {
    name: "平方根函数",
    short: "平方根",
    formula: "a√(k(x − h)) + b",
    evaluate: (x) => (x < 0 ? null : Math.sqrt(x)),
  },
  {
    name: "指数函数",
    short: "指数",
    formula: "a·2^[k(x − h)] + b",
    evaluate: (x) => 2 ** x,
  },
  {
    name: "对数函数",
    short: "对数",
    formula: "a log₂(k(x − h)) + b",
    evaluate: (x) => (x <= 0 ? null : Math.log2(x)),
  },
];
