import { natureLessons } from "./natureLessons.mjs";
import React from "react";
import usePreviewClock from "./usePreviewClock.js";
import MotionScene from "./MotionScene.jsx";
export default function MotionPreview({ id, playing = true }) {
  const elapsed = usePreviewClock(playing);
  const time =
    elapsed %
    (id === "gear-drive" ? 30 : id === "circular-motion" ? 2 * Math.PI : 6);
  return (
    <div
      className="poster"
      style={{
        display: "grid",
        alignItems: "center",
        background: "var(--ui-paper)",
      }}
    >
      <MotionScene
        id={id}
        p={
          natureLessons.find((x) => x.id === id)?.chapters[0].preset ??
          (id === "vector-sum"
            ? { a: 3, b: 3, angle: 75 }
            : id === "fence-area"
              ? { perimeter: 20, share: 85 }
              : id === "similar-area"
                ? { scale: 3, shape: 0 }
                : id === "polarization"
                  ? {
                      angle: 45 + 45 * Math.sin((time * Math.PI) / 3),
                      insert: 1,
                      middle: 45,
                    }
                  : id === "radian-arc"
                    ? { radius: 2, angle: 180 }
                    : id === "beat-frequency"
                      ? { frequency: 3, difference: 0.5, amplitude: 1 }
                      : id === "square-difference"
                        ? { a: 6, b: 2 }
                        : id === "ripple-interference"
                          ? {
                              separation: 16,
                              wavelength: 16,
                              phase: 0,
                              probeX: 4,
                              probeY: 0,
                            }
                          : id === "polygon-turn"
                            ? { sides: 5, direction: 1 }
                            : id === "thermal-length"
                              ? { length: 3, delta: 60, gap: 5 }
                              : id === "gear-drive"
                                ? { driver: 18, driven: 30, rpm: 10 }
                                : id === "buoyancy-lift"
                                  ? {
                                      volume: 300,
                                      bodyDensity: 2000,
                                      liquidDensity: 1000,
                                    }
                                  : id === "cylinder-net"
                                    ? { radius: 2, height: 4 }
                                    : id === "additive-light"
                                      ? { red: 100, green: 100, blue: 100 }
                                      : id === "solid-volume"
                                        ? { radius: 2, height: 6 }
                                        : id === "water-pressure"
                                          ? { depth: 4, density: 1000 }
                                          : id === "shadow-height"
                                            ? { pole: 2, height: 8, angle: 35 }
                                            : id === "circular-motion"
                                              ? { radius: 2, speed: 2, mass: 1 }
                                              : id === "resistor-network"
                                                ? {
                                                    u: 6,
                                                    r1: 10,
                                                    r2: 20,
                                                    closed: 1,
                                                    mode: 1,
                                                  }
                                                : id === "prism"
                                                  ? {
                                                      angle: 50,
                                                      index: 1.52,
                                                      color: 0,
                                                    }
                                                  : id === "circle-area"
                                                    ? { radius: 3, sectors: 24 }
                                                    : id === "pinhole"
                                                      ? {
                                                          object: 20,
                                                          screen: 15,
                                                          height: 6,
                                                        }
                                                      : id === "inscribed-angle"
                                                        ? {
                                                            central: 110,
                                                            position: 50,
                                                          }
                                                        : id ===
                                                            "pythagoras-proof"
                                                          ? { a: 3, b: 4 }
                                                          : id ===
                                                              "plane-mirror"
                                                            ? {
                                                                distance: 3,
                                                                objectHeight: 2,
                                                                eyeDistance: 5,
                                                                eyeHeight: 4,
                                                              }
                                                            : id ===
                                                                "triangle-angles"
                                                              ? {
                                                                  base: 6,
                                                                  offset: 2,
                                                                  height: 3,
                                                                }
                                                              : id ===
                                                                  "communicating"
                                                                ? {
                                                                    ratio: 2,
                                                                    left: 24,
                                                                    right: 12,
                                                                  }
                                                                : id ===
                                                                    "area-cut"
                                                                  ? {
                                                                      base: 4,
                                                                      height: 2,
                                                                      shear: 1.5,
                                                                    }
                                                                  : id ===
                                                                      "hydraulic"
                                                                    ? {
                                                                        ratio: 4,
                                                                        force: 40,
                                                                        stroke: 8,
                                                                      }
                                                                    : id ===
                                                                        "symmetry"
                                                                      ? {
                                                                          mode: 1,
                                                                          axis: 90,
                                                                          turn: 180,
                                                                        }
                                                                      : id ===
                                                                          "pulley"
                                                                        ? {
                                                                            mode: 1,
                                                                            mass: 5,
                                                                            lift: 0.6,
                                                                          }
                                                                        : id ===
                                                                            "polar"
                                                                          ? {
                                                                              shape: 2,
                                                                              petals: 3,
                                                                              radius: 3,
                                                                            }
                                                                          : id ===
                                                                              "ballistics"
                                                                            ? {
                                                                                speed: 18,
                                                                                angle: 40,
                                                                                height: 0,
                                                                                gravity: 9.8,
                                                                              }
                                                                            : id ===
                                                                                "lissajous"
                                                                              ? {
                                                                                  fx: 2,
                                                                                  fy: 3,
                                                                                  phase: 30,
                                                                                  height: 1,
                                                                                }
                                                                              : id ===
                                                                                  "standing"
                                                                                ? {
                                                                                    mode: 3,
                                                                                    tension: 36,
                                                                                    amplitude: 18,
                                                                                    probe: 50,
                                                                                  }
                                                                                : id ===
                                                                                    "cycloid"
                                                                                  ? {
                                                                                      radius: 1.2,
                                                                                      ratio: 1,
                                                                                    }
                                                                                  : {
                                                                                      mach: 0.55,
                                                                                      frequency: 1.5,
                                                                                    })
        }
        time={
          ["vector-sum", "fence-area", "similar-area", "radian-arc"].includes(
            id,
          )
            ? 3 - 3 * Math.cos((time * Math.PI) / 3)
            : id === "ripple-interference"
              ? time * 0.8
              : id === "square-difference"
                ? 3.5 - 2.5 * Math.cos((time * Math.PI) / 3)
                : [
                      "polygon-turn",
                      "thermal-length",
                      "buoyancy-lift",
                      "cylinder-net",
                      "additive-light",
                      "solid-volume",
                      "water-pressure",
                      "circle-area",
                      "area-cut",
                      "hydraulic",
                      "triangle-angles",
                    ].includes(id)
                  ? 3 - 3 * Math.cos((time * Math.PI) / 3)
                  : time
        }
      />
    </div>
  );
}
