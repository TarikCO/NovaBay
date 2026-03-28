const STARS = [
  { cx: 64, cy: 42, r: 1.1, o: 0.56 },
  { cx: 128, cy: 110, r: 1.4, o: 0.42 },
  { cx: 212, cy: 68, r: 0.9, o: 0.63 },
  { cx: 286, cy: 152, r: 1.3, o: 0.38 },
  { cx: 352, cy: 86, r: 1.7, o: 0.54 },
  { cx: 438, cy: 126, r: 1.1, o: 0.46 },
  { cx: 510, cy: 52, r: 1.5, o: 0.6 },
  { cx: 604, cy: 170, r: 1.2, o: 0.35 },
  { cx: 676, cy: 96, r: 1.6, o: 0.67 },
  { cx: 756, cy: 136, r: 1.1, o: 0.4 },
  { cx: 824, cy: 58, r: 1.4, o: 0.57 },
  { cx: 900, cy: 172, r: 0.8, o: 0.33 },
  { cx: 978, cy: 94, r: 1.5, o: 0.61 },
  { cx: 1056, cy: 148, r: 1.2, o: 0.44 },
  { cx: 1136, cy: 40, r: 2, o: 0.5 },
  { cx: 1210, cy: 132, r: 1, o: 0.48 },
  { cx: 1282, cy: 74, r: 1.4, o: 0.62 },
  { cx: 1348, cy: 168, r: 1.1, o: 0.39 },
]

function HeroScene() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080f1c" />
          <stop offset="35%" stopColor="#0d1e35" />
          <stop offset="65%" stopColor="#0e3d4a" />
          <stop offset="85%" stopColor="#0f5a5a" />
          <stop offset="100%" stopColor="#1a7a6e" />
        </linearGradient>
        <linearGradient id="fogGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(20, 90, 90, 0)" />
          <stop offset="50%" stopColor="rgba(20, 90, 90, 0.25)" />
          <stop offset="100%" stopColor="rgba(20, 90, 90, 0)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1440" height="900" fill="url(#skyGradient)" />

      <path
        d="M900,280 C980,260 1100,240 1200,255 C1300,270 1380,290 1440,310 L1440,520 C1380,500 1300,488 1200,492 C1100,496 980,510 900,505 Z"
        fill="#0a1a2a"
        opacity="0.8"
      />

      <path
        className="scene-water-far"
        d="M0,400 C200,385 400,395 600,388 C800,381 1000,390 1200,385 C1320,382 1400,388 1440,390 L1440,480 L0,480 Z"
        fill="#0d4a52"
        opacity="0.9"
      />

      <path
        d="M0,460 C150,445 300,458 480,450 C660,442 820,455 1000,448 C1150,442 1320,452 1440,458 L1440,560 L0,560 Z"
        fill="#0e5c5c"
        opacity="0.85"
      />

      <path
        d="M0,530 C120,515 280,528 440,520 C600,512 760,525 920,518 C1080,511 1260,522 1440,528 L1440,640 L0,640 Z"
        fill="#126b6b"
        opacity="0.9"
      />

      <path
        d="M0,900 L0,320 C30,300 60,270 80,240 C100,210 110,195 130,210 C150,225 160,260 180,280 C200,300 230,290 260,310 C290,330 300,360 280,390 C260,420 240,440 250,470 C260,500 300,510 320,540 C340,570 330,610 310,650 C290,690 260,720 240,760 L240,900 L0,900 Z"
        fill="#060e18"
      />

      <path
        d="M0,900 L0,480 C40,460 90,440 130,450 C170,460 200,480 230,500 C260,520 280,550 270,590 C260,630 240,660 220,700 L220,900 L0,900 Z"
        fill="#0a1828"
        opacity="0.95"
      />

      <path
        d="M1280,900 L1270,600 C1275,560 1285,520 1295,490 C1305,460 1315,440 1310,410 C1305,380 1290,370 1295,340 C1300,310 1320,300 1330,320 C1340,340 1335,380 1340,420 C1345,460 1360,490 1365,530 C1370,570 1360,620 1355,680 C1350,740 1345,820 1340,900 L1280,900 Z"
        fill="#060d16"
      />

      <path
        d="M0,900 L0,835 C200,828 400,842 620,834 C840,826 1040,841 1240,833 C1320,830 1380,832 1440,835 L1440,900 Z"
        fill="#091520"
      />

      <g className="scene-shimmer scene-shimmer-1">
        <path
          d="M100,420 C300,417 500,422 700,419 C900,416 1100,421 1340,418"
          fill="none"
          stroke="#3ef0d0"
          strokeWidth="0.8"
          opacity="0.22"
        />
      </g>
      <g className="scene-shimmer scene-shimmer-2">
        <path
          d="M70,490 C280,486 510,494 740,489 C970,484 1160,492 1360,488"
          fill="none"
          stroke="#7fffd4"
          strokeWidth="0.8"
          opacity="0.18"
        />
      </g>
      <g className="scene-shimmer scene-shimmer-3">
        <path
          d="M110,545 C340,541 550,550 760,545 C970,540 1180,548 1330,544"
          fill="none"
          stroke="#3ef0d0"
          strokeWidth="0.8"
          opacity="0.2"
        />
      </g>
      <g className="scene-shimmer scene-shimmer-4">
        <path
          d="M180,575 C390,572 590,580 790,576 C990,572 1160,578 1290,575"
          fill="none"
          stroke="#7fffd4"
          strokeWidth="0.8"
          opacity="0.16"
        />
      </g>

      <rect
        className="scene-fog"
        x="0"
        y="440"
        width="1440"
        height="70"
        fill="url(#fogGradient)"
      />

      {STARS.map((star, index) => (
        <circle
          key={`star-${index}`}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#e8f4f8"
          opacity={star.o}
        />
      ))}
    </svg>
  )
}

export default HeroScene
