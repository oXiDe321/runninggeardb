'use client';
// components/review/sticky-buy-bar.tsx
// Sticky affiliate bar pinned to the bottom of the review.
// Slides up once the user scrolls past the hero (~600px in).

import { useEffect, useState } from 'react';
import { affiliateUrl } from '@/lib/amazon';

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
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-8 py-3.5">
        {image && (
          <div className="h-12 w-12 overflow-hidden rounded-[3px]">
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <div className="font-mono text-[10.5px] tracking-[0.14em] text-ink-30">
            {brand.toUpperCase()} · {discipline.toUpperCase()}
          </div>
          <div className="font-display text-[19px] font-medium tracking-[-0.02em]">
            {model}
            {rating != null && (
              <>
                {' · '}
                <span className="text-rust">{rating.toFixed(1)}/10</span>
              </>
            )}
          </div>
        </div>
        <span className="font-mono text-[11.5px] text-ink-30">{retailer} · live</span>
        {price != null && (
          <span className="font-display text-[30px] font-semibold tracking-[-0.03em]">
            ${price}
          </span>
        )}
        <a
          href={affiliateUrl(buyUrl)}
          rel="sponsored nofollow noopener"
          target="_blank"
          className="rounded-[3px] bg-rust px-[22px] py-3 font-mono text-[13px] font-semibold tracking-[0.04em] text-sand"
        >
          BUY · →
        </a>
      </div>
    </div>
  );
}
