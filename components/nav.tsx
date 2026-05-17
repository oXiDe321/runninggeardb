import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-orange-600">
            RunningGearDB
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/shoes" className="text-slate-600 hover:text-slate-950">
              Shoes
            </Link>
            <Link href="/vests" className="text-slate-600 hover:text-slate-950">
              Vests
            </Link>
            <Link href="/gels" className="text-slate-600 hover:text-slate-950">
              Gels
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-950">
              Blog
            </Link>
            <Link href="/compare" className="text-slate-600 hover:text-slate-950">
              Compare
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
