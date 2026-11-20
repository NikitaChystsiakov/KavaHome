/** Значок Instagram линией, как остальные значки шапки (рамка, объектив, точка). Размер и цвет задаёт родитель. */
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="15" height="15" rx="4.2" />
      <circle cx="10" cy="10" r="3.4" />
      <circle cx="14.4" cy="5.6" r="0.5" fill="currentColor" />
    </svg>
  );
}
