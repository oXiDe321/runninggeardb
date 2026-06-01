import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { CurrencyProvider } from "@/lib/currency";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://runninggeardb.com";

export const metadata: Metadata = {
  title: {
    default: "RunningGearDB — Running Gear Specs & Comparisons",
    template: "%s | RunningGearDB",
  },
  description: "The running gear database built on spec depth: every shoe, vest, and gel ranked by real numbers — drop, stack height, weight, price. Trail, road, Hyrox, ultra.",
  metadataBase: new URL(SITE),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "RunningGearDB",
    locale: "en_US",
    url: SITE,
    title: "RunningGearDB — Running Gear Specs & Comparisons",
    description: "The running gear database built on spec depth: every shoe, vest, and gel ranked by real numbers — drop, stack height, weight, price. Trail, road, Hyrox, ultra.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@runninggeardb",
    title: "RunningGearDB — Running Gear Specs & Comparisons",
    description: "The running gear database built on spec depth: every shoe, vest, and gel ranked by real numbers — drop, stack height, weight, price. Trail, road, Hyrox, ultra.",
  },
  alternates: { canonical: SITE },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE}/#organization`,
                  name: "RunningGearDB",
                  url: SITE,
                  logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` },
                  sameAs: ["https://twitter.com/runninggeardb"],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE}/#website`,
                  url: SITE,
                  name: "RunningGearDB",
                  publisher: { "@id": `${SITE}/#organization` },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: { "@type": "EntryPoint", urlTemplate: `${SITE}/shoes?q={search_term_string}` },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        <CurrencyProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
