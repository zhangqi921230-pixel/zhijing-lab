import { rippleState } from "./intuitiveLessons.mjs";

// Sample in exactly the same coordinate system as the main wave panel.
// Merge horizontal runs: 4,608 samples produce only 16 SVG paths, not 4,608 nodes.
export function rippleFieldBands(p) {
  const columns = 96,
    rows = 48,
    width = 570 / columns,
    height = 280 / rows;
  const bands = Array.from({ length: 16 }, () => []);
  for (let row = 0; row < rows; row++) {
    let start = 0,
      last = -1;
    for (let col = 0; col <= columns; col++) {
      const x = 65 + (col + 0.5) * width,
        y = 115 + (row + 0.5) * height;
      const band =
        col === columns
          ? -1
          : Math.min(
              15,
              Math.floor(
                (rippleState(
                  { ...p, probeX: (x - 350) / 9, probeY: (260 - y) / 9 },
                  0,
                ).amplitude /
                  2) *
                  16,
              ),
            );
      if (col > 0 && band !== last) {
        bands[last].push(
          `M${(65 + start * width).toFixed(2)} ${(115 + row * height).toFixed(2)}h${((col - start) * width).toFixed(2)}v${height.toFixed(2)}h${(-((col - start) * width)).toFixed(2)}Z`,
        );
        start = col;
      }
      last = band;
    }
  }
  return bands.map((segments, index) => ({
    d: segments.join(""),
    opacity: 0.025 + (index / 15) * 0.38,
  }));
}

export function rippleSection(p) {
  return Array.from({ length: 241 }, (_, i) => {
    const x = -24 + i * 0.2;
    return { x, amplitude: rippleState({ ...p, probeX: x }, 0).amplitude };
  });
}
