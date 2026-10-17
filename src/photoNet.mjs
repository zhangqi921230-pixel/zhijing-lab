import { photo } from "./models.mjs";
export function photoNet(p, respiration) {
  const gross = photo(p);
  let compensation = null;
  if (respiration === 0) compensation = 0;
  else if (photo({ ...p, light: 100 }) >= respiration) {
    let lo = 0,
      hi = 100;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (photo({ ...p, light: mid }) < respiration) lo = mid;
      else hi = mid;
    }
    compensation = (lo + hi) / 2;
  }
  return { gross, respiration, net: gross - respiration, compensation };
}
