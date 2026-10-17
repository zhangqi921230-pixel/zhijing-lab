import React from "react";
import { format } from "./models.mjs";

function Terminal({ x, y, red = false }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 5} rx="9" ry="5" fill="#142c3a" />
      <rect
        x={x - 7}
        y={y - 6}
        width="14"
        height="10"
        rx="3"
        fill={red ? "#a92f2a" : "#273840"}
      />
      <ellipse
        cx={x}
        cy={y - 6}
        rx="7"
        ry="4"
        fill={red ? "#ed6c56" : "#627078"}
      />
      <circle cx={x} cy={y - 6} r="2" fill="#d5bf8c" />
    </g>
  );
}
function Cable({ d, color }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path
        d={d}
        stroke="#172b3420"
        strokeWidth="9"
        transform="translate(1 5)"
      />
      <path d={d} stroke={color} strokeWidth="5" />
      <path
        d={d}
        stroke="white"
        strokeOpacity=".24"
        strokeWidth="1.3"
        transform="translate(-1 -1)"
      />
    </g>
  );
}
function Meter({ x, y, unit, value, max }) {
  const a = ((-65 + (130 * value) / max) * Math.PI) / 180;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="85" cy="160" rx="91" ry="13" fill="#253e4820" />
      <path
        d="M5 12L19 0H163L175 13V150L162 162H13L0 148V24Z"
        fill="url(#housing)"
        stroke="#295064"
        strokeWidth="2"
      />
      <rect x="13" y="15" width="150" height="111" rx="8" fill="#213d4c" />
      <rect x="18" y="20" width="140" height="99" rx="4" fill="url(#dial)" />
      {Array.from({ length: 31 }, (_, i) => {
        const r = ((-65 + (i * 130) / 30) * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={88 + Math.sin(r) * 68}
            y1={108 - Math.cos(r) * 68}
            x2={88 + Math.sin(r) * (i % 5 === 0 ? 57 : 63)}
            y2={108 - Math.cos(r) * (i % 5 === 0 ? 57 : 63)}
            stroke="#52616a"
            strokeWidth={i % 5 === 0 ? 1.5 : 0.7}
          />
        );
      })}
      {[0, 1, 2, 3].map((i) => {
        const r = ((-65 + (i * 130) / 3) * Math.PI) / 180;
        return (
          <text
            key={i}
            x={88 + Math.sin(r) * 81}
            y={111 - Math.cos(r) * 81}
            textAnchor="middle"
            fontSize="10"
            fill="#2c404a"
          >
            {format((i * max) / 3)}
          </text>
        );
      })}
      <text
        x="88"
        y="83"
        textAnchor="middle"
        fontSize="25"
        fontFamily="Georgia"
        fill="#223e4d"
      >
        {unit}
      </text>
      <line
        x1="88"
        y1="108"
        x2={88 + Math.sin(a) * 65}
        y2={108 - Math.cos(a) * 65}
        stroke="#c45e42"
        strokeWidth="2"
      />
      <circle cx="88" cy="108" r="5" fill="#687a80" />
      <path d="M22 23H154L22 75Z" fill="white" opacity=".24" />
      <Terminal x={35} y={147} />
      <Terminal x={135} y={147} red />
      <rect x="46" y="133" width="77" height="20" rx="3" fill="#e7efee" />
      <text x="85" y="147" textAnchor="middle" fill="#254450" fontSize="12">
        {format(value)} {unit}
      </text>
    </g>
  );
}
export function OhmBench({ p }) {
  const current = p.closed ? p.u / p.r : 0;
  return (
    <g>
      <defs>
        <linearGradient id="housing" x2=".7" y2="1">
          <stop stopColor="#6d9bb1" />
          <stop offset=".35" stopColor="#3a6b83" />
          <stop offset="1" stopColor="#1c4057" />
        </linearGradient>
        <linearGradient id="dial" x2="0" y2="1">
          <stop stopColor="#ced8d9" />
          <stop offset=".3" stopColor="#fffef4" />
          <stop offset="1" stopColor="#edf0e5" />
        </linearGradient>
        <linearGradient id="metal">
          <stop stopColor="#455763" />
          <stop offset=".25" stopColor="#d8e2df" />
          <stop offset=".45" stopColor="#f4f8f2" />
          <stop offset=".7" stopColor="#a7b2b2" />
          <stop offset="1" stopColor="#50616b" />
        </linearGradient>
        <linearGradient id="ceramic" x2="0" y2="1">
          <stop stopColor="#8f714c" />
          <stop offset=".28" stopColor="#dec491" />
          <stop offset=".5" stopColor="#f1dfb7" />
          <stop offset="1" stopColor="#9e7848" />
        </linearGradient>
      </defs>
      <text x="48" y="48" fontSize="12" letterSpacing="3" fill="#618080">
        ELECTRICITY LAB / 01
      </text>
      <text x="48" y="74" fontSize="19" fill="#1c4851">
        调节电源，观察指针与电流的变化
      </text>
      <path d="M0 345L900 245V560H0Z" fill="#dce3e0" opacity=".32" />
      <ellipse cx="185" cy="317" rx="125" ry="19" fill="#203d4b20" />
      <path
        d="M69 169L91 143H286L307 162V296L287 312H69Z"
        fill="url(#housing)"
        stroke="#375c6b"
        strokeWidth="2"
      />
      <rect
        x="78"
        y="170"
        width="214"
        height="124"
        rx="6"
        fill="url(#dial)"
        stroke="#b1c3c8"
      />
      <rect x="91" y="182" width="98" height="45" rx="4" fill="#294346" />
      <text
        x="140"
        y="213"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="25"
        fill="#b9ead2"
      >
        {p.u.toFixed(1)} V
      </text>
      <circle
        cx="245"
        cy="221"
        r="25"
        fill="url(#metal)"
        stroke="#71868b"
        strokeWidth="2"
      />
      <line
        x1="245"
        y1="221"
        x2={245 + 18 * Math.sin((p.u / 12) * 4.6 - 2.3)}
        y2={221 - 18 * Math.cos((p.u / 12) * 4.6 - 2.3)}
        stroke="#415c64"
        strokeWidth="3"
      />
      <circle cx="261" cy="272" r="4" fill="#61b685" />
      <text x="191" y="251" textAnchor="middle" fontSize="10" fill="#6d8188">
        直流稳压电源 · 0–12 V
      </text>
      <text x="118" y="260" fill="#b34e40">
        +
      </text>
      <text x="172" y="260" fill="#415762">
        −
      </text>
      <path d="M397 223L412 204H520L532 223V247H397Z" fill="url(#housing)" />
      <path
        d={`M410 225L${p.closed ? "510 225" : "493 177"}`}
        stroke="url(#metal)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect
        x={p.closed ? 470 : 464}
        y={p.closed ? 212 : 174}
        width="30"
        height="12"
        rx="4"
        fill="#2e3b42"
        transform={p.closed ? undefined : "rotate(-28 479 180)"}
      />
      <text x="463" y="281" textAnchor="middle" fontSize="14" fill="#30525c">
        开关 · {p.closed ? "闭合" : "断开"}
      </text>
      <Meter x={615} y={123} unit="A" value={current} max={3} />
      <Meter x={209} y={315} unit="V" value={p.closed ? p.u : 0} max={15} />
      <path d="M525 403L545 379H746L763 402V431H525Z" fill="url(#housing)" />
      <rect
        x="577"
        y="369"
        width="126"
        height="40"
        rx="11"
        fill="url(#ceramic)"
        stroke="#a38d63"
      />
      {Array.from({ length: 25 }, (_, i) => (
        <path
          key={i}
          d={`M${581 + i * 4.8} 371q6 19 0 36`}
          stroke="#806b48"
          strokeWidth="1"
          fill="none"
        />
      ))}
      <path
        d="M550 413V388H577M703 388H735V413"
        stroke="url(#metal)"
        strokeWidth="6"
        fill="none"
      />
      <text x="642" y="353" textAnchor="middle" fontSize="15" fill="#30525c">
        定值电阻 · {p.r} Ω
      </text>
      <Cable d="M120 280C126 350 350 329 410 230" color="#c8493c" />
      <Cable d="M510 230C535 304 750 338 750 270" color="#c8493c" />
      <Cable d="M650 270C579 308 797 348 735 413" color="#344d5b" />
      <Cable d="M550 413C490 530 157 527 175 280" color="#344d5b" />
      <Cable d="M344 462C414 500 746 520 735 413" color="#d09f38" />
      <Cable d="M244 462C196 546 535 549 550 413" color="#5097ad" />
      {[
        [120, 280, true],
        [175, 280, false],
        [410, 230, true],
        [510, 230, false],
        [650, 270, false],
        [750, 270, true],
        [550, 413, false],
        [735, 413, true],
        [244, 462, false],
        [344, 462, true],
      ].map(([x, y, red]) => (
        <Terminal key={`${x}-${y}`} x={x} y={y} red={red} />
      ))}
      <text x="47" y="550" fontSize="11" fill="#60787d">
        理想电表 · 电流表串联，电压表并联 · 导线交叉处不相连
      </text>
    </g>
  );
}

export function OpticalRail() {
  return (
    <g>
      <ellipse cx="450" cy="449" rx="382" ry="16" fill="#29424b15" />
      <path
        d="M68 420H832L820 442H80Z"
        fill="url(#glassMetal)"
        stroke="#9caaa8"
      />
      <rect x="74" y="420" width="752" height="8" rx="3" fill="#f4f4e7" />
      {Array.from({ length: 76 }, (_, i) => (
        <line
          key={i}
          x1={75 + i * 10}
          x2={75 + i * 10}
          y1="420"
          y2={i % 5 === 0 ? 433 : 427}
          stroke="#81938d"
          strokeWidth="1"
        />
      ))}
      <rect x="432" y="411" width="36" height="22" rx="3" fill="#406878" />
      <rect x="447" y="394" width="6" height="20" fill="url(#glassMetal)" />
    </g>
  );
}
