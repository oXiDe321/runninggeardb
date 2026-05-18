// components/price-sparkline.tsx
// Minimal SVG sparkline — server-compatible, no client hooks.

interface Point {
  d: string;  // date
  v: number;  // price
}

export default function PriceSparkline({ points }: { points: Point[] }) {
  if (points.length < 2) {
    return (
      <svg viewBox="0 0 80 24" width="80" height="24" className="block">
        <line x1="0" y1="12" x2="80" y2="12" stroke="var(--color-rule)" strokeWidth="1" />
      </svg>
    );
  }

  const prices = points.map((p) => p.v);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const w = 80;
  const h = 24;
  const step = w / (points.length - 1);

  const yFor = (v: number) => (max === min ? h / 2 : h - ((v - min) / (max - min)) * (h - 4) - 2);

  const path = points
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)},${yFor(d.v).toFixed(1)}`)
    .join(' ');

  const last = points[points.length - 1].v;
  const trend = last > points[0].v ? 'var(--color-moss)' : 'var(--color-rust)';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="80" height="24" className="block">
      <path d={path} stroke={trend} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(points.length - 1) * step} cy={yFor(last)} r="2" fill={trend} />
    </svg>
  );
}
