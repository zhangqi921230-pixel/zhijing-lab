import React from "react";

export function NatureMaterials() {
  return (
    <defs>
      <linearGradient id="leaf" x2=".9" y2="1">
        <stop stopColor="#b2ca77" />
        <stop offset=".42" stopColor="#638e46" />
        <stop offset="1" stopColor="#2b674d" />
      </linearGradient>
      <linearGradient id="soil" x2="0" y2="1">
        <stop stopColor="#b7a07c" />
        <stop offset=".2" stopColor="#897b66" />
        <stop offset=".55" stopColor="#b7a186" />
        <stop offset="1" stopColor="#655e55" />
      </linearGradient>
      <linearGradient id="mountain" x2="1" y2=".7">
        <stop stopColor="#c5c8ab" />
        <stop offset=".42" stopColor="#81986f" />
        <stop offset="1" stopColor="#466c5a" />
      </linearGradient>
      <linearGradient id="river" x2="0" y2="1">
        <stop stopColor="#c3e5e8" />
        <stop offset=".4" stopColor="#79b6c9" />
        <stop offset="1" stopColor="#387f9f" />
      </linearGradient>
      <linearGradient id="terracotta">
        <stop stopColor="#936545" />
        <stop offset=".35" stopColor="#d6ad84" />
        <stop offset=".7" stopColor="#b8895f" />
        <stop offset="1" stopColor="#865f44" />
      </linearGradient>
      <pattern
        id="rockStrata"
        width="130"
        height="38"
        patternUnits="userSpaceOnUse"
      >
        <rect width="130" height="38" fill="#b0997e" />
        <path
          d="M0 8Q45 2 85 10T130 8M0 22Q60 30 130 20M0 35H130"
          fill="none"
          stroke="#8c7964"
          strokeWidth="2"
        />
        <path d="M25 9L34 25M85 25L76 37" stroke="#d2bfa0" fill="none" />
      </pattern>
    </defs>
  );
}
export function Landscape() {
  return (
    <g>
      <path d="M60 400L845 430L820 482H86Z" fill="url(#soil)" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${66 + i * 6} ${423 + i * 16}Q370 ${432 + i * 16} ${838 - i * 6} ${441 + i * 16}`}
          stroke="#dfd4b1"
          strokeWidth="2"
          opacity=".4"
          fill="none"
        />
      ))}
      <path
        d="M60 400L300 125L460 290L620 230L845 430H60Z"
        fill="url(#mountain)"
      />
      <path
        d="M300 125L273 255L221 295L252 314L195 391L355 423L327 314L363 287Z"
        fill="#496b5b"
        opacity=".58"
      />
      <path
        d="M300 125L337 245L362 278L421 337L374 272Z"
        fill="#e5e4cf"
        opacity=".6"
      />
      <path
        d="M620 230L545 350L584 344L530 410L761 425L681 345Z"
        fill="#9baf7f"
      />
      <path d="M620 230L638 334L684 349L730 408L807 424Z" fill="#547660" />
      <path
        d="M243 190L300 125L346 183L329 180L310 215L292 179L272 212Z"
        fill="#ececdf"
      />
      <path
        d="M350 235Q320 320 475 350Q610 370 660 440H460Q530 400 420 383Q250 350 350 235"
        fill="url(#river)"
      />
      <path
        d="M348 255Q327 335 462 360Q563 379 583 421"
        fill="none"
        stroke="#d8f0ec"
        strokeWidth="3"
        opacity=".7"
      />
      <path d="M640 430H860V495H600Z" fill="url(#river)" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${675 - i * 10} ${447 + i * 10}h${105 + i * 10}`}
          stroke="#b9dce0"
          strokeWidth="2"
          fill="none"
          opacity=".55"
        />
      ))}
      {Array.from({ length: 50 }, (_, i) => {
        const x = 130 + ((i * 67) % 560),
          y = 385 + ((i * 17) % 40);
        if (x > 325 && x < 575) return null;
        const s = 0.6 + (i % 4) * 0.13;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M0 0V20" stroke="#675843" strokeWidth="3" />
            <path
              d="M0 -24L-12 6H-8L-15 16H15L8 6H12Z"
              fill={i % 2 ? "#315e49" : "#4a7554"}
            />
            <path d="M0 -24L0 14L12 16L8 6H12Z" fill="#254e41" opacity=".4" />
          </g>
        );
      })}
    </g>
  );
}
export function Plant() {
  return (
    <g>
      <ellipse cx="408" cy="504" rx="82" ry="12" fill="#31584719" />
      <path
        d="M401 431Q421 338 405 200"
        fill="none"
        stroke="#46754a"
        strokeWidth="9"
      />
      <path
        d="M399 426Q414 310 403 206"
        fill="none"
        stroke="#9ab573"
        strokeWidth="2"
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {[-1, 1].map((side) => (
            <g
              key={side}
              transform={`translate(${407 - i * 2} ${247 + i * 65}) scale(${side} 1) rotate(${i * 7 - 8})`}
            >
              <path
                d="M0 0C22 -37 77 -57 133 -24C90 -7 70 39 0 0Z"
                fill="url(#leaf)"
                stroke="#557e4f"
                strokeWidth="1"
              />
              <path
                d="M0 0Q57 -19 127 -24M26 -7L38 -27M47 -13L65 -35M71 -18L91 -36M34 -9L55 11M60 -15L80 2M84 -19L100 -9"
                fill="none"
                stroke="#c1d095"
                opacity=".7"
                strokeWidth="1.4"
              />
            </g>
          ))}
        </g>
      ))}
      <path
        d="M341 424h135l-23 76h-89Z"
        fill="url(#terracotta)"
        stroke="#aa805b"
      />
      <ellipse
        cx="408"
        cy="424"
        rx="68"
        ry="12"
        fill="#85684d"
        stroke="#c3a07c"
        strokeWidth="6"
      />
      <ellipse cx="408" cy="423" rx="57" ry="6" fill="#4e4935" />
      <path d="M400 425L404 401" stroke="#46754a" strokeWidth="8" />
    </g>
  );
}
