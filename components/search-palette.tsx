'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import type { SearchResult } from '@/lib/search-data';

const FUSE_OPTS = {
  keys: [
    { name: 'brand', weight: 0.4 },
    { name: 'model', weight: 0.5 },
    { name: 'discipline', weight: 0.3 },
  ],
  threshold: 0.35,
  includeMatches: false,
};

const KIND_LABEL: Record<string, string> = { shoe: 'SHOES', vest: 'VESTS', gel: 'FUEL' };

export default function SearchPalette({
  products,
  open: controlledOpen,
  onOpenChange,
}: {
  products: SearchResult[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = useCallback(
    (v: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof v === 'function' ? v(open) : v;
      if (onOpenChange) onOpenChange(next);
      else setInternalOpen(next);
    },
    [open, onOpenChange],
  );
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const fuse = useMemo(() => new Fuse(products, FUSE_OPTS), [products]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return products.slice(0, 20);
    return fuse.search(trimmed, { limit: 20 }).map((r) => r.item);
  }, [query, fuse, products]);

  // Keyboard shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[cursor] as HTMLElement | undefined;
    if (item) item.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const navigate = useCallback(
    (slug: string, kind: string) => {
      setOpen(false);
      const base = kind === 'shoe' ? '/reviews/' : kind === 'vest' ? '/vests?highlight=' : '/gels?highlight=';
      router.push(`${base}${slug}`);
    },
    [router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === 'Enter' && results[cursor]) {
        navigate(results[cursor].slug, results[cursor].kind);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [cursor, navigate, results],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-carbon/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-[640px] rounded border border-rule bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
          <span className="font-mono text-[16px] text-ink-30">⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search shoes, vests, gels…"
            className="flex-1 font-mono text-[15px] text-carbon placeholder:text-ink-50 bg-transparent outline-none"
          />
          <kbd className="rounded border border-rule bg-sand px-1.5 py-0.5 font-mono text-[11px] text-ink-50">
            esc
          </kbd>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          className="max-h-[420px] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <li className="px-4 py-10 text-center font-mono text-[13px] text-ink-50">
              No results for &ldquo;{query}&rdquo; across {products.length} products
            </li>
          ) : (
            results.map((r, i) => (
              <li
                key={r.id}
                className={`flex items-center gap-3 rounded-[3px] px-3 py-2.5 cursor-pointer ${
                  i === cursor
                    ? 'bg-carbon text-sand'
                    : 'hover:bg-sand text-carbon'
                }`}
                onMouseEnter={() => setCursor(i)}
                onClick={() => navigate(r.slug, r.kind)}
              >
                {/* Thumbnail */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[2px] bg-sand-deep">
                  {r.image_url && (
                    <Image
                      src={r.image_url}
                      alt={r.model}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-mono text-[11px] uppercase tracking-[0.1em] ${i === cursor ? 'text-ochre' : 'text-ink-50'}`}>
                      {r.brand}
                    </span>
                    <span className="truncate font-mono text-[14px]">{r.model}</span>
                  </div>
                  <div className={`mt-0.5 flex gap-3 font-mono text-[10px] ${i === cursor ? 'text-ink-30' : 'text-ink-50'}`}>
                    {r.weight_g && <span>{r.weight_g}g</span>}
                    {r.drop_mm && <span>{r.drop_mm}mm</span>}
                    {r.discipline && <span>{r.discipline}</span>}
                    <span className="ml-auto">{KIND_LABEL[r.kind]}</span>
                  </div>
                </div>

                {/* Score + price */}
                <div className="flex shrink-0 items-center gap-3 text-right">
                  {r.our_rating && (
                    <span className={`font-mono text-[13px] font-semibold ${i === cursor ? 'text-sand' : 'text-rust'}`}>
                      {r.our_rating}
                    </span>
                  )}
                  {r.price_usd && (
                    <span className={`font-mono text-[11px] ${i === cursor ? 'text-sand' : 'text-ink-70'}`}>
                      ${r.price_usd}
                    </span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-rule px-5 py-2.5 font-mono text-[10px] text-ink-50 flex gap-5">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc dismiss</span>
          <span className="ml-auto">{products.length} products indexed</span>
        </div>
      </div>
    </div>
  );
}
