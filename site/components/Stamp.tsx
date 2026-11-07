// Почтовый штемпель: кольцо с текстом по кругу, крупная середина и волны гашения слева.
// ink — неровный оттиск: шум выедает часть краски, как у настоящего штемпеля.
type Props = {
  id: string;
  ring: string;
  center: string;
  sub?: string;
  waves?: boolean;
  ink?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function Stamp({
  id,
  ring,
  center,
  sub,
  waves = true,
  ink = false,
  className,
  style,
}: Props) {
  const ringId = `stamp-ring-${id}`;
  const inkId = `stamp-ink-${id}`;
  const lines = Array.from({ length: 4 }, (_, i) => {
    let d = `M-156 ${-18 + i * 12}`;
    for (let x = 0; x < 6; x++) d += " q7 -5 14 0";
    return d;
  });
  return (
    <svg
      className={className}
      style={style}
      viewBox={waves ? "-160 -66 228 132" : "-66 -66 132 132"}
      aria-hidden="true"
    >
      <defs>
        <path id={ringId} d="M0 0m-53 0a53 53 0 1 1 106 0a53 53 0 1 1 -106 0" />
        {ink && (
          <filter
            id={inkId}
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed={id.length * 7}
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.8 0 0 0 1.75"
              result="holes"
            />
            <feComposite in="SourceGraphic" in2="holes" operator="in" />
          </filter>
        )}
      </defs>
      <g filter={ink ? `url(#${inkId})` : undefined}>
        {waves &&
          lines.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          ))}
        <circle r="62" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle r="44" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <text
          fontFamily="var(--sans)"
          fontSize="9"
          fontWeight="600"
          fill="currentColor"
        >
          <textPath href={`#${ringId}`} textLength="326" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
        <text
          y={sub ? 6 : 10}
          textAnchor="middle"
          fontFamily="var(--serif)"
          fontSize={center.length > 3 ? 20 : 34}
          fill="currentColor"
        >
          {center}
        </text>
        {sub && (
          <text
            y="24"
            textAnchor="middle"
            fontFamily="var(--sans)"
            fontSize="8.5"
            fontWeight="600"
            letterSpacing="1.5"
            fill="currentColor"
          >
            {sub}
          </text>
        )}
      </g>
    </svg>
  );
}
