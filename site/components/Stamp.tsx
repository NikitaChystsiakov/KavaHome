// Почтовый штемпель: кольцо с текстом по кругу, номер коллекции и волны гашения.
type Props = { id: string; ru: string; latin: string; country: string; center?: string; className?: string };

export function Stamp({ id, ru, latin, country, center = "МИНСК", className }: Props) {
  const ring = `stamp-ring-${id}`;
  const waves = Array.from({ length: 4 }, (_, i) => {
    let d = `M-156 ${-18 + i * 12}`;
    for (let x = 0; x < 6; x++) d += " q7 -5 14 0";
    return d;
  });
  return (
    <svg className={className} viewBox="-160 -66 228 132" aria-hidden="true">
      {waves.map((d) => (
        <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="1" />
      ))}
      <circle r="62" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle r="45" fill="none" stroke="currentColor" strokeWidth="1" />
      <defs>
        <path id={ring} d="M0 0m-53 0a53 53 0 1 1 106 0a53 53 0 1 1 -106 0" />
      </defs>
      <text fontFamily="var(--sans)" fontSize="8.6" fill="currentColor">
        <textPath href={`#${ring}`} textLength="326" lengthAdjust="spacing">
          {ru} · {latin} · {country} · KAVA HOME ·
        </textPath>
      </text>
      <text y="-3" textAnchor="middle" fontFamily="var(--sans)" fontSize="7.5" letterSpacing="2" fill="currentColor">
        ИЗ
      </text>
      <text y="14" textAnchor="middle" fontFamily="var(--serif)" fontSize={center.length > 3 ? 17 : 26} fill="currentColor">
        {center}
      </text>
    </svg>
  );
}
