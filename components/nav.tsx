import Link from 'next/link';
import Logo from './logo';

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="transition hover:opacity-80">
            <Logo />
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/shoes" className="text-slate-600 hover:text-orange-600 transition font-medium">
              Shoes
            </Link>
            <Link href="/vests" className="text-slate-600 hover:text-orange-600 transition font-medium">
              Vests
            </Link>
            <Link href="/gels" className="text-slate-600 hover:text-orange-600 transition font-medium">
              Gels
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-orange-600 transition font-medium">
              Blog
            </Link>
            <Link href="/compare" className="text-slate-600 hover:text-orange-600 transition font-medium">
              Compare
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
