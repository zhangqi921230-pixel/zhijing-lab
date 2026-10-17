export function unitCircleAngle(theta, radius = 28) {
  const turns = Math.trunc(theta / (2 * Math.PI));
  const remainder = theta - turns * 2 * Math.PI;
  if (Math.abs(remainder) < 1e-10) return { turns, remainder: 0, path: "" };
  const end = [
    120 + radius * Math.cos(remainder),
    120 - radius * Math.sin(remainder),
  ];
  return {
    turns,
    remainder,
    path: `M${120 + radius} 120A${radius} ${radius} 0 ${Math.abs(remainder) > Math.PI ? 1 : 0} ${remainder > 0 ? 0 : 1} ${end.join(" ")}`,
  };
}
