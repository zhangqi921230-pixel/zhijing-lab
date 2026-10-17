import React, { useId } from "react";

// Small original vector plates: fixed paths, no image download or render loop.
export default function TrophicSpecimen({ index }) {
  const id = useId().replace(/:/g, "");
  const url = (name) => `url(#${id}-${name})`;
  return (
    <svg
      viewBox="0 0 200 130"
      aria-hidden="true"
      className={`energy-specimen specimen-${index}`}
    >
      <defs>
        <linearGradient id={`${id}-grass`} x1="0" y1="1" x2=".7" y2="0">
          <stop stopColor="#244d39" />
          <stop offset=".55" stopColor="#65904d" />
          <stop offset="1" stopColor="#b2be75" />
        </linearGradient>
        <radialGradient id={`${id}-fur`} cx=".45" cy=".25" r=".85">
          <stop stopColor="#d5c4a5" />
          <stop offset=".55" stopColor="#99876d" />
          <stop offset="1" stopColor="#5f584d" />
        </radialGradient>
        <linearGradient id={`${id}-fox`} x1="0" y1="0" x2=".4" y2="1">
          <stop stopColor="#d8a268" />
          <stop offset=".45" stopColor="#ba703b" />
          <stop offset="1" stopColor="#79472d" />
        </linearGradient>
        <linearGradient id={`${id}-cream`} x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor="#f0e9d6" />
          <stop offset="1" stopColor="#b9aa90" />
        </linearGradient>
        <clipPath id={`${id}-rabbit-body`}>
          <ellipse cx="88" cy="83" rx="43" ry="28" />
        </clipPath>
        <clipPath id={`${id}-fox-body`}>
          <path d="M60 73Q75 48 115 65L143 73 130 96 68 95Z" />
        </clipPath>
      </defs>
      <ellipse
        cx="100"
        cy="117"
        rx="76"
        ry="5"
        fill="var(--ui-ink)"
        opacity=".10"
      />
      {index === 0 ? (
        <g>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const x = 35 + i * 18,
              top = 20 + ((i * 17) % 37),
              bend = (i % 2 ? 1 : -1) * (8 + i);
            return (
              <g key={i}>
                <path
                  d={`M${x} 115Q${x + bend} 77 ${x + bend / 2} ${top}`}
                  stroke="#60784b"
                  strokeWidth="1.3"
                  fill="none"
                />
                <path
                  d={`M${x} 112Q${x - 22} 65 ${x - 20} 49Q${x - 6} 68 ${x} 112M${x} 105Q${x + 24} 60 ${x + 26} 53Q${x + 6} 60 ${x} 105`}
                  fill={url("grass")}
                />
                <path
                  d={`M${x} 109Q${x - 12} 75 ${x - 20} 49M${x} 104Q${x + 12} 75 ${x + 26} 53`}
                  stroke="#c7ce99"
                  strokeWidth=".45"
                  fill="none"
                  opacity=".7"
                />
                {i % 2 === 0 &&
                  [0, 1, 2, 3].map((j) => (
                    <g
                      key={j}
                      transform={`translate(${x + bend / 2} ${top + j * 4})`}
                    >
                      <ellipse
                        cx="-2.5"
                        cy="0"
                        rx="1.6"
                        ry="3.6"
                        transform="rotate(-38)"
                        fill="#a8a46a"
                      />
                      <ellipse
                        cx="2.5"
                        cy="0"
                        rx="1.6"
                        ry="3.6"
                        transform="rotate(38)"
                        fill="#c0b782"
                      />
                    </g>
                  ))}
              </g>
            );
          })}
          <path
            d="M26 117Q75 111 100 116T177 116"
            stroke="#797357"
            fill="none"
            strokeWidth="1.3"
          />
        </g>
      ) : index === 1 ? (
        <g stroke="#665b4a" strokeWidth=".7" strokeLinejoin="round">
          <ellipse cx="45" cy="85" rx="12" ry="11" fill={url("cream")} />
          <path d="M119 57Q105 27 115 6Q126 12 130 52Z" fill={url("fur")} />
          <path d="M135 54Q130 22 143 9Q153 25 143 57Z" fill={url("fur")} />
          <path
            d="M120 45Q111 19 116 13Q122 22 125 45M138 46Q138 25 144 17Q147 29 142 46"
            fill="#bca191"
            stroke="#ae9486"
          />
          <ellipse cx="88" cy="83" rx="43" ry="28" fill={url("fur")} />
          <g
            clipPath={url("rabbit-body")}
            stroke="#eee3cb"
            strokeWidth=".55"
            opacity=".38"
          >
            {Array.from({ length: 38 }, (_, i) => (
              <path
                key={i}
                d={`M${49 + ((i * 29) % 78)} ${60 + ((i * 13) % 45)}l4 2`}
              />
            ))}
          </g>
          <path
            d="M118 77Q130 85 132 107L146 111Q146 115 132 115L120 110 110 89"
            fill={url("fur")}
          />
          <ellipse cx="79" cy="97" rx="22" ry="16" fill={url("fur")} />
          <path
            d="M74 105Q100 105 109 112Q109 117 77 115L62 111"
            fill={url("cream")}
          />
          <path
            d="M113 53Q122 39 139 45Q151 49 152 60L161 69Q158 80 144 80Q120 81 113 67Z"
            fill={url("fur")}
          />
          <path
            d="M139 66Q153 63 160 70Q155 79 140 77"
            fill={url("cream")}
            stroke="none"
          />
          <ellipse cx="144" cy="57" rx="3.4" ry="4.1" fill="#252920" />
          <circle cx="145" cy="55.5" r="1" fill="#fff" stroke="none" />
          <path d="M158 67l5 2-4 3Z" fill="#665248" />
          <path
            d="M158 72v3l-5 1M151 73l18-2M151 75l18 3"
            fill="none"
            strokeWidth=".5"
          />
          <path d="M124 110l1 4m6-3 1 3M94 112l3 3M100 112l3 3" fill="none" />
        </g>
      ) : (
        <g stroke="#744b34" strokeWidth=".7" strokeLinejoin="round">
          <path
            d="M78 82Q50 61 28 78Q14 92 7 96Q25 115 58 106L89 91"
            fill={url("fox")}
          />
          <path
            d="M9 95Q24 91 33 83L29 94 37 91 31 101 38 101Q21 107 9 95"
            fill={url("cream")}
            stroke="none"
          />
          <path
            d="M69 85L62 115H74L87 87M111 86L112 115H125L127 82"
            fill="#5f4939"
          />
          <path
            d="M60 73Q75 48 115 65L143 73 130 96 68 95Z"
            fill={url("fox")}
          />
          <g
            clipPath={url("fox-body")}
            stroke="#e4b681"
            opacity=".45"
            strokeWidth=".5"
          >
            {Array.from({ length: 28 }, (_, i) => (
              <path
                key={i}
                d={`M${64 + ((i * 23) % 69)} ${65 + ((i * 11) % 26)}l5 2`}
              />
            ))}
          </g>
          <path
            d="M72 91L77 108 72 115H87L92 90M125 88L139 107 146 110 145 115H132L115 94"
            fill={url("fox")}
          />
          <path d="M77 108l-5 7h15l1-7M133 107l-1 8h13l1-5" fill="#403d36" />
          <path
            d="M117 66L117 34 134 48 145 30 155 61 178 75 157 89 133 85Z"
            fill={url("fox")}
          />
          <path d="M120 42l1 18 9-10M145 38l-7 15 12 7" fill="#403d36" />
          <path
            d="M125 64Q139 78 147 72L175 76 157 87 139 94Q129 89 125 64"
            fill={url("cream")}
            stroke="none"
          />
          <path d="M140 63l8 1-4 4Z" fill="#252920" />
          <circle cx="145" cy="64" r=".8" fill="#fff" stroke="none" />
          <ellipse cx="176" cy="75" rx="3.5" ry="2.5" fill="#252920" />
          <path
            d="M171 80l-10 2M162 79l17 3M160 80l15 7"
            fill="none"
            strokeWidth=".45"
          />
        </g>
      )}
    </svg>
  );
}
