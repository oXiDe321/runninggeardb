// components/review/best-for-matrix.tsx
// Snippet-bait. This is the block Google is most likely to lift into an
// AI Overview citation. Keep entries short, declarative, and parallel.

export default function BestForMatrix({
  bestFor,
  notFor,
}: {
  bestFor: string[];
  notFor: string[];
}) {
  if (!bestFor.length && !notFor.length) return null;
  return (
    <div className="mt-[18px] grid grid-cols-2 overflow-hidden rounded border border-rule">
      <div className="bg-moss/5 p-[18px]">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-moss">
          · best for ·
        </div>
        <ul className="mt-2.5 list-none p-0 text-[14px] leading-[1.6]">
          {bestFor.map((t) => (
            <li key={t} className="flex gap-2.5 py-1">
              <span className="mt-0.5 font-mono text-[13px] text-moss">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l border-rule bg-rust/5 p-[18px]">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
          · not for ·
        </div>
        <ul className="mt-2.5 list-none p-0 text-[14px] leading-[1.6]">
          {notFor.map((t) => (
            <li key={t} className="flex gap-2.5 py-1">
              <span className="mt-0.5 font-mono text-[13px] text-rust">✗</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
