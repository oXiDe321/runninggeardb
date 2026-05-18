// components/review/tester-byline.tsx
// The single most important E-E-A-T signal: a real, named, verifiable human.

import type { Tester } from '@/lib/review-types';

interface Props {
  tester: Tester;
  milesTested: number | null;
  weeksTested: number | null;
  testTerrain: string | null;
  reviewCount?: number;
  peerReviewers?: number;
}

export default function TesterByline({
  tester,
  milesTested,
  weeksTested,
  testTerrain,
  reviewCount,
  peerReviewers = 0,
}: Props) {
  const initials = tester.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded border border-rule bg-paper p-[18px]">
      {tester.avatar_url ? (
        <img
          src={tester.avatar_url}
          alt={tester.name}
          className="h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-moss to-carbon font-display text-[22px] font-semibold tracking-[-0.02em] text-sand">
          {initials}
        </div>
      )}

      <div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
          · tested by · field unit 03 ·
        </span>
        <div className="mt-0.5 font-display text-[19px] font-semibold tracking-[-0.02em] text-carbon">
          {tester.name}
          {tester.title && (
            <span className="ml-1 font-mono text-[13px] font-normal text-ink-50">
              · {tester.title}
            </span>
          )}
        </div>
        <div className="mt-1 font-mono text-[11.5px] text-ink-70">
          {milesTested != null && <>{milesTested} mi tested · </>}
          {weeksTested != null && <>{weeksTested} wk · </>}
          {testTerrain && <>{testTerrain} · </>}
          {tester.credentials && tester.credentials.length > 0 && (
            <>{tester.credentials.join(' · ')} · </>
          )}
          {tester.joined_at && (
            <>with RGDB since {new Date(tester.joined_at).getFullYear()} · </>
          )}
          {reviewCount != null && (
            <span className="text-rust">{reviewCount} reviews</span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 font-mono text-[10.5px] text-ink-50">
        <span>● VERIFIED HUMAN</span>
        <span>
          {tester.strava_url && <a href={tester.strava_url}>strava</a>}
          {tester.strava_url && tester.linkedin_url && ' · '}
          {tester.linkedin_url && <a href={tester.linkedin_url}>in</a>}
        </span>
        {peerReviewers > 0 && <span>peer-reviewed by {peerReviewers}</span>}
      </div>
    </div>
  );
}
