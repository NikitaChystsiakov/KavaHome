// Ветка хлопка линией, как гравюра: все полотенца KavaHome из чистого хлопка.
// Коробочки: круги с толстой обводкой, сверху те же круги заливкой — остаётся только внешний контур «облака».

type Boll = [cx: number, cy: number, r: number];

const LOBES: [number, number, number][] = [
  [-0.55, 0.12, 0.52],
  [0.55, 0.12, 0.52],
  [-0.3, -0.36, 0.5],
  [0.32, -0.34, 0.5],
  [0, 0.2, 0.6],
  [0, -0.58, 0.42],
];

const LEAF =
  "M0 0 C -10 -10 -30 -12 -36 -30 C -22 -30 -14 -36 -12 -50 C -4 -42 0 -44 0 -58 C 0 -44 4 -42 12 -50 C 14 -36 22 -30 36 -30 C 30 -12 10 -10 0 0 Z M0 -4 L0 -50 M0 -10 L-26 -28 M0 -10 L26 -28";

function CottonBoll({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const base = cy + r * 0.62;
  const sepals = [-160, -120, -60, -20];
  return (
    <g>
      <g fill="var(--cotton-leaf, #f3ece2)" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
        {sepals.map((a) => (
          <path key={a} d="M0 0 Q 9 -12 0 -34 Q -9 -12 0 0 Z" transform={`translate(${cx} ${base}) rotate(${a + 90})`} />
        ))}
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2.8">
        {LOBES.map(([x, y, s], i) => (
          <circle key={i} cx={cx + x * r} cy={cy + y * r} r={s * r} />
        ))}
      </g>
      <g fill="var(--cotton, #fffdf8)">
        {LOBES.map(([x, y, s], i) => (
          <circle key={i} cx={cx + x * r} cy={cy + y * r} r={s * r} />
        ))}
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.45">
        <path d={`M${cx - r * 0.08} ${cy + r * 0.55} C ${cx - r * 0.2} ${cy + r * 0.2} ${cx - r * 0.12} ${cy - r * 0.1} ${cx - r * 0.02} ${cy - r * 0.3}`} />
        <path d={`M${cx + r * 0.1} ${cy + r * 0.5} C ${cx + r * 0.3} ${cy + r * 0.3} ${cx + r * 0.42} ${cy + r * 0.05} ${cx + r * 0.62} ${cy - r * 0.02}`} />
      </g>
    </g>
  );
}

export function Cotton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const bolls: Boll[] = [
    [200, 80, 46],
    [326, 322, 40],
    [92, 192, 38],
  ];
  return (
    <svg viewBox="0 0 420 620" className={className} style={style} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M212 616 C 216 520 194 452 206 380 S 216 222 200 112" />
        <path d="M207 452 C 250 432 292 398 324 350" />
        <path d="M204 300 C 168 286 122 260 94 218" />
        <path d="M208 528 C 236 520 254 506 266 488" />
      </g>
      <g fill="var(--cotton-leaf, #f3ece2)" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <path d={LEAF} transform="translate(266 488) rotate(58) scale(1.15)" />
        <path d={LEAF} transform="translate(200 370) rotate(-52) scale(0.9)" />
        <path d={LEAF} transform="translate(210 204) rotate(38) scale(0.75)" />
      </g>
      {bolls.map(([cx, cy, r]) => (
        <CottonBoll key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </svg>
  );
}

// Тонкая веточка хлопка для подписи «100% хлопок»: одна раскрытая коробочка, чашелистики, лист.
// Без заливки и «облачков», ближе к ботанической гравюре.
export function CottonSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 64" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 25 C 21 36 18 46 20 62" />
        <path d="M10.5 21.5 C 5 20 5.5 12 10.5 11.2 C 10.5 5 17 3 20 7 C 23 3 29.5 5 29.5 11.2 C 34.5 12 35 20 29.5 21.5" />
        <path d="M20 7 C 19 12 19.2 17 20 22" opacity="0.55" />
        <path d="M13 12.5 C 14.6 15.5 15.6 18.5 16 21.5" opacity="0.55" />
        <path d="M27 12.5 C 25.4 15.5 24.4 18.5 24 21.5" opacity="0.55" />
        <path d="M10.5 21.5 C 12 25.5 16.5 26.5 20 24.6 C 23.5 26.5 28 25.5 29.5 21.5" />
        <path d="M12.5 24.5 L 9.5 28.5 M27.5 24.5 L 30.5 28.5 M20 25 L 20 29" />
        <path d="M20 44 C 25 40 31 41 34 35.5 C 28.5 34.8 23.5 38 20 44 Z" />
        <path d="M20.5 43 L 31 37.2" opacity="0.55" />
        <path d="M19.4 38.5 C 15.5 38 12.4 35.6 12 32 C 15.4 32.2 18.4 34.6 19.4 38.5 Z" />
      </g>
    </svg>
  );
}
