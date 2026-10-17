import { hydraulicState } from "./discoveryModels.mjs";
export function hydraulicGeometry(p, time) {
  const q = hydraulicState(p, time),
    start = 260,
    inputWidth = 32,
    outputWidth = 32 * p.ratio;
  const inputHeight = q.distance * 10,
    outputHeight = q.outputDistance * 10;
  return {
    start,
    inputWidth,
    outputWidth,
    inputHeight,
    outputHeight,
    inputY: start + inputHeight,
    outputY: start - outputHeight,
    sweptInput: inputWidth * inputHeight,
    sweptOutput: outputWidth * outputHeight,
  };
}
