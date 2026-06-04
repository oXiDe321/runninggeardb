// app/reviews/[slug]/opengraph-image.tsx
// Auto-generated 1200×630 OG card for every review. Renders as PNG at
// request-time via next/og — no asset pipeline needed.
//
// Uses Geist via Google Fonts (the same family loaded in your root layout).

import { ImageResponse } from 'next/og';
import { getShoeReview } from '@/lib/review-data';

export const alt = 'RunningGearDB review';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OG({ params }: Props) {
  const { slug } = await params;
  const r = await getShoeReview(slug);

  const brand = r?.brand ?? 'RGDB';
  const model = r?.model ?? 'Review';
  const tagline = r?.tagline ?? '';
  const image = r?.image_url ?? null;
  const discipline = r?.discipline?.toUpperCase() ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#e8e2d5',
          padding: 56,
          fontFamily: 'sans-serif',
        }}
      >
        {/* topbar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 28,
            background: '#171615',
            display: 'flex',
            alignItems: 'center',
            padding: '0 32px',
            color: '#aea795',
            fontSize: 12,
            fontFamily: 'monospace',
            letterSpacing: 1.5,
          }}
        >
          <span style={{ color: '#d4a04c', marginRight: 12 }}>●</span>
          RGD/INDEX · {discipline} · SKU {(r?.id ?? '').slice(0, 4).toUpperCase()} · LIVE
        </div>

        {/* left: text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            paddingRight: 32,
            marginTop: 24,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 22,
                fontFamily: 'monospace',
                letterSpacing: 2,
                color: '#c4582c',
              }}
            >
              · RGD REVIEW ·
            </div>
            <div
              style={{
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: -4,
                lineHeight: 0.95,
                color: '#171615',
                marginTop: 16,
              }}
            >
              {brand}
            </div>
            <div
              style={{
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: -4,
                lineHeight: 0.95,
                color: '#c4582c',
              }}
            >
              {model}.
            </div>
            {tagline && (
              <div
                style={{
                  marginTop: 22,
                  fontSize: 26,
                  color: '#43403a',
                  fontFamily: 'monospace',
                  lineHeight: 1.4,
                  maxWidth: 580,
                }}
              >
                &gt; {tagline.length > 90 ? tagline.slice(0, 87) + '…' : tagline}
              </div>
            )}
          </div>

          {/* bottom row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                fontSize: 18,
                fontFamily: 'monospace',
                color: '#43403a',
                lineHeight: 1.5,
              }}
            >
              <div>runninggeardb.com</div>
              <div style={{ color: '#7a7466', fontSize: 14, marginTop: 4 }}>
                /reviews/{slug}
              </div>
            </div>
          </div>
        </div>

        {/* right: image */}
        {image && (
          <div
            style={{
              display: 'flex',
              width: 440,
              height: 530,
              marginTop: 28,
              overflow: 'hidden',
              border: '1px solid rgba(23,22,21,0.15)',
            }}
          >
            <img
              src={image}
              width={440}
              height={530}
              style={{ width: 440, height: 530, objectFit: 'cover' }}
              alt=""
            />
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
