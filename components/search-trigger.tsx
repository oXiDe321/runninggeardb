'use client';

import { useState } from 'react';
import SearchPalette from './search-palette';
import type { SearchResult } from '@/lib/search-data';

export default function SearchTrigger({ products }: { products: SearchResult[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden w-[220px] items-center gap-2 rounded border border-rule bg-paper px-3.5 py-2 font-mono text-[11.5px] text-ink-50 md:flex cursor-pointer"
        aria-label="Open search (⌘K)"
      >
        <span>⌕</span>
        <span className="truncate">search · drop, brand, terrain…</span>
        <span className="ml-auto rounded border border-rule bg-sand px-1.5 text-[10px] text-ink-50">
          ⌘K
        </span>
      </button>
      <SearchPalette products={products} open={open} onOpenChange={setOpen} />
    </>
  );
}
