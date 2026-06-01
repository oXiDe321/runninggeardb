'use client';
// components/review/sticky-buy-bar.tsx
// Sticky affiliate bar pinned to the bottom of the review.
// Slides up once the user scrolls past the hero (~600px in).

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { affiliateUrl } from '@/lib/amazon';
import { useCurrency } from '@/lib/currency';

interface Props {
  brand: string;
  model: string;
  discipline: string;
  rating: number | null;
  price: number | null;
  retailer: string;
  buyUrl: string;
  image: string | null;
}

export default function StickyBuyBar({
  brand,
  model,
  discipline,
  rating,
  price,
  retailer,
  buyUrl,
  image,
}: Props) {
  const [shown, setShown] = useState(false);
  const { fmt } = useCurrency();

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-rust bg-carbon text-sand transition-transform duration-200"
      style={{ transform: shown ? 'translateY(0)' : 'translateY(110%)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3.5 lg:px-8">
        {image && (
          <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-[3px] sm:block">
            <Image src={image} alt="" fill className="object-cover" sizes="48px" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] tracking-[0.14em] text-ink-30 sm:text-[10.5px]">
            {brand.toUpperCase()} · {discipline.toUpperCase()}
          </div>
          <div className="truncate font-display text-[15px] font-medium tracking-[-0.02em] sm:text-[19px]">
            {model}
            {rating != null && (
              <span className="hidden sm:inline">
                {' · '}
                <span className="text-rust">{rating.toFixed(1)}/10</span>
              </span>
            )}
          </div>
        </div>
        <span className="hidden font-mono text-[11.5px] text-ink-30 md:inline">{retailer} · live</span>
        {price != null && (
          <span className="font-display text-[22px] font-semibold tracking-[-0.03em] sm:text-[30px]">
            {fmt(price)}
          </span>
        )}
        <a
          href={affiliateUrl(buyUrl)}
          rel="sponsored nofollow noopener"
          target="_blank"
          className="shrink-0 rounded-[3px] bg-rust px-4 py-2.5 font-mono text-[12px] font-semibold tracking-[0.04em] text-sand sm:px-[22px] sm:py-3 sm:text-[13px]"
        >
          BUY · →
        </a>
      </div>
    </div>
  );
}
