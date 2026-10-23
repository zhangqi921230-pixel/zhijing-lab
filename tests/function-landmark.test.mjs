import { expect, it } from "vitest";
import { functionLandmark } from "../src/functionLandmark.mjs";

it("按函数结构标记顶点、折点、拐点和定义域端点", () => {
  const p = { a: -2, b: 3, k: -0.5, shift: 2 };
  for (const [type, name] of [
    [0, "顶点"],
    [2, "折点"],
    [4, "拐点"],
    [5, "定义域端点"],
  ]) {
    expect(functionLandmark({ ...p, type })).toMatchObject({
      x: 2,
      y: 3,
      name,
      sourceX: 0,
      sourceY: 0,
    });
  }
  expect(functionLandmark({ ...p, type: 7 })).toMatchObject({
    x: 0,
    y: 3,
    sourceX: 1,
    sourceY: 0,
  });
  expect(functionLandmark({ ...p, type: 3 })).toMatchObject({
    x: 0,
    y: 1,
    sourceX: 1,
    sourceY: 1,
  });
});
it("常函数没有孤立顶点或拐点，但平方根定义域端点仍存在", () => {
  const p = { a: 0, b: 3, k: 1, shift: 2 };
  for (const type of [0, 1, 2, 4])
    expect(functionLandmark({ ...p, type }).name).toBe("对应点");
  expect(functionLandmark({ ...p, type: 5 }).name).toBe("定义域端点");
  expect(functionLandmark({ ...p, type: 0, k: 0 })).toBeNull();
});
