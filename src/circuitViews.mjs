export const circuitOverview = {
  target: [-0.3, 0.3, 0.7],
  position: [-5.8, 6.4, 9.8],
};
export const circuitViews = {
  switch: {
    label: "观察开关",
    target: [-0.22, 0.12, -1.3],
    position: [0.25, 1.7, 0.9],
    minDistance: 1.8,
  },
  supply: {
    label: "观察电源",
    target: [-2.9, 0.5, -0.1],
    position: [-4.2, 0.65, 3.6],
    minDistance: 3.3,
  },
  ammeter: {
    label: "读电流表",
    target: [1.8, 0.32, -0.101],
    position: [1.8, 0.32, 2.7],
    minDistance: 2.4,
  },
  voltmeter: {
    label: "读电压表",
    target: [-1.7, 0.32, 2.099],
    position: [-1.7, 0.32, 4.9],
    minDistance: 2.4,
  },
};

// Preserve the square-stage horizontal field on narrow screens.
export function circuitDetailFov(aspect) {
  return (
    (360 / Math.PI) *
    Math.atan(
      Math.tan((38 * Math.PI) / 360) * Math.max(1, 1 / Math.max(0.1, aspect)),
    )
  );
}

export const rcDetailViews = {
  source: {
    target: [-2.45, 0.03, 0.2],
    position: [-4, 0.75, 4.15],
    minDistance: 0.7,
  },
  selector: {
    target: [-1.05, -0.45, -1],
    position: [-0.6, 3.8, 0.1],
    minDistance: 0.6,
  },
  plates: {
    target: [1.8, 0.05, 0],
    position: [4.3, 1.5, 3.4],
    minDistance: 1.5,
  },
};
