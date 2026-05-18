// components/category-header.tsx — reusable Specs-Engine page header.
// Server component: breadcrumb, title, metadata panel.

interface Row {
  k: string;
  v: string;
  good?: boolean;
}

interface Props {
  slug: string;
  title: string;
  total?: number;
  description?: string;
  metadata: Row[];
}

export default function CategoryHeader({ slug, title, total, description, metadata }: Props) {
  const slugClean = slug.replace('/', '');
  return (
    <header className="border-b border-rule px-8 py-9">
      <div className="mx-auto max-w-7xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
          rgd ▸ index ▸ <span className="text-rust">{slugClean}</span>
        </div>
        <div className="mt-3 grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_360px]">
          <div>
            <h1 className="m-0 font-display text-[72px] font-semibold leading-[0.95] tracking-[-0.04em]">
              {slugClean}
              {total !== undefined && (
                <> <span className="text-rust">· {total}</span></>
              )}
            </h1>
            {description && (
              <p className="mt-3 max-w-[640px] font-mono text-[14px] leading-[1.6] text-ink-70">
                {description}
              </p>
            )}
          </div>
          <div className="rounded border border-rule bg-paper p-4 font-mono text-[11.5px] leading-[1.8]">
            {metadata.map((m) => (
              <div key={m.k} className="flex justify-between">
                <span className="text-ink-50">{m.k}</span>
                <span className={m.good ? 'text-moss' : 'text-carbon'}>{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
