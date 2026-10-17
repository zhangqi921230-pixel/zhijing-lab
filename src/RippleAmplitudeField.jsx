import React, { memo, useMemo } from "react";
import { rippleFieldBands } from "./rippleField.mjs";
export default memo(function RippleAmplitudeField({
  separation,
  wavelength,
  phase,
}) {
  const bands = useMemo(
    () => rippleFieldBands({ separation, wavelength, phase }),
    [separation, wavelength, phase],
  );
  return (
    <g
      data-testid="ripple-amplitude-field"
      aria-label="静态合振幅分布，颜色越显著振幅越大"
      fill="var(--ui-primary)"
    >
      {bands.map((b, i) => (
        <path key={i} d={b.d} fillOpacity={b.opacity} />
      ))}
    </g>
  );
});
