// app/robots.ts
// Open crawl, sitemap declared, drafts disallowed. The api route is
// disallowed in case you add unauthenticated probes later.

import type { MetadataRoute } from 'next';

const SITE = 'https://runninggeardb.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/drafts/', '/admin/'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
