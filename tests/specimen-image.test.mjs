import { it, expect } from "vitest";
import { validateSpecimenHeader } from "../src/specimenImage.mjs";
it("accepts supported signatures, rejects mislabeled SVG and large files", () => {
  expect(
    validateSpecimenHeader(new Uint8Array([255, 216, 255, 224]), 100),
  ).toBe("");
  expect(
    validateSpecimenHeader(
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      100,
    ),
  ).toBe("");
  expect(
    validateSpecimenHeader(new TextEncoder().encode("RIFF1234WEBP"), 100),
  ).toBe("");
  expect(
    validateSpecimenHeader(new TextEncoder().encode("<svg></svg>"), 100),
  ).toContain("有效");
  expect(
    validateSpecimenHeader(
      new Uint8Array([255, 216, 255]),
      10 * 1024 * 1024 + 1,
    ),
  ).toContain("10 MB");
  expect(validateSpecimenHeader(new Uint8Array(), 0)).toContain("有效");
});
