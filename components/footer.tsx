import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-slate-950 mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/shoes" className="hover:text-slate-950">
                  Shoes
                </Link>
              </li>
              <li>
                <Link href="/vests" className="hover:text-slate-950">
                  Vests
                </Link>
              </li>
              <li>
                <Link href="/gels" className="hover:text-slate-950">
                  Nutrition
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-950 mb-4">Tools</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/compare" className="hover:text-slate-950">
                  Compare Gear
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-slate-950">
                  Guides
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-950 mb-4">Info</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-slate-950">
                  Affiliate Disclosure
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-950">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              RunningGearDB is a data-first running gear comparison site. All products tested by runners, for runners.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
          <p>&copy; 2026 RunningGearDB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
