// components/review/disclosure-strip.tsx
// Above-the-fold FTC + trust signal. Honest about how the money flows.

export default function DisclosureStrip({ lastCheckedAt }: { lastCheckedAt?: string | null }) {
  const ago = lastCheckedAt ? timeAgo(lastCheckedAt) : null;
  return (
    <div className="border-b border-rule bg-ochre/15 px-8 py-2.5 font-mono text-[11.5px] text-carbon">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-ochre px-2 py-[2px] text-[10px] font-semibold tracking-[0.14em] text-carbon">
            ● DISCLOSURE
          </span>
          <span>
            RGD earns a commission from purchases via these links. We pay MSRP for every test
            unit.{' '}
            <a href="/methodology" className="border-b border-rust text-rust">
              How we earn &amp; test →
            </a>
          </span>
        </div>
        {ago && <span className="text-ink-50">last price-check · {ago} ago</span>}
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const sec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return `${Math.floor(sec)}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
  return `${Math.floor(sec / 86400)}d`;
}
