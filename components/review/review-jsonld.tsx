// components/review/review-jsonld.tsx
// JSON-LD that wires Review + Product + Person + FAQPage + BreadcrumbList
// into a single @graph. This is the single biggest thing you can do for
// AI Overview eligibility in 2026.

import type { ShoeReviewPayload } from '@/lib/review-types';

export default function ReviewJsonLd({
  payload,
  siteUrl,
}: {
  payload: ShoeReviewPayload;
  siteUrl: string;
}) {
  const reviewUrl = `${siteUrl}/reviews/${payload.slug}`;
  const productUrl = `${siteUrl}/shoes/${payload.slug}`;

  const author = payload.tester
    ? {
        '@type': 'Person',
        '@id': `${siteUrl}/testers/${payload.tester.slug}#person`,
        name: payload.tester.name,
        jobTitle: payload.tester.title ?? undefined,
        description: payload.tester.bio ?? undefined,
        image: payload.tester.avatar_url ?? undefined,
        url: `${siteUrl}/testers/${payload.tester.slug}`,
        sameAs: [payload.tester.strava_url, payload.tester.linkedin_url].filter(Boolean),
        knowsAbout: payload.tester.credentials ?? undefined,
      }
    : {
        '@type': 'Organization',
        name: 'RunningGearDB Editors',
        url: siteUrl,
      };

  const offers = payload.retailer_prices.map((p) => ({
    '@type': 'Offer',
    price: p.price_usd,
    priceCurrency: 'AUD',
    availability: p.in_stock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    url: p.url,
    seller: { '@type': 'Organization', name: p.retailer },
  }));

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Shoes', item: `${siteUrl}/shoes` },
        { '@type': 'ListItem', position: 3, name: `${payload.brand} ${payload.model}`, item: reviewUrl },
      ],
    },
    {
      '@type': 'Product',
      '@id': `${productUrl}#product`,
      name: `${payload.brand} ${payload.model}`,
      brand: { '@type': 'Brand', name: payload.brand },
      image: payload.image_url ?? undefined,
      sku: payload.id,
      offers,
      ...(payload.our_rating != null
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: payload.our_rating,
              bestRating: 10,
              worstRating: 0,
              ratingCount: payload.peer_reviewer_count > 0 ? payload.peer_reviewer_count + 1 : 1,
            },
          }
        : {}),
    },
    {
      '@type': 'Review',
      '@id': `${reviewUrl}#review`,
      itemReviewed: { '@id': `${productUrl}#product` },
      url: reviewUrl,
      reviewRating: payload.our_rating != null
        ? {
            '@type': 'Rating',
            ratingValue: payload.our_rating,
            bestRating: 10,
            worstRating: 0,
          }
        : undefined,
      author,
      ...(payload.human_edited_at && { dateModified: payload.human_edited_at }),
      ...(payload.ai_drafted_at && { datePublished: payload.ai_drafted_at }),
      reviewBody: (payload.review_content ?? '').slice(0, 600),
      positiveNotes: payload.best_for.length
        ? { '@type': 'ItemList', itemListElement: payload.best_for.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n })) }
        : undefined,
      negativeNotes: payload.not_for.length
        ? { '@type': 'ItemList', itemListElement: payload.not_for.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n })) }
        : undefined,
      publisher: { '@type': 'Organization', name: 'RunningGearDB', url: siteUrl },
    },
  ];

  if (payload.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: payload.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 0),
      }}
    />
  );
}
