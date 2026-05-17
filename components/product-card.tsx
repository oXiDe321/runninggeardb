import ProductSilhouette from './product-silhouette';

interface ProductCardProps {
  product: Record<string, unknown>;
  category: 'shoes' | 'vests' | 'gels';
}

const categoryAccents = {
  shoes: {
    strip: 'bg-gradient-to-r from-brand-500 to-red-500',
    badge: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  },
  vests: {
    strip: 'bg-gradient-to-r from-blue-500 to-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  gels: {
    strip: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
};

export default function ProductCard({ product, category }: ProductCardProps) {
  const accent = categoryAccents[category];
  const brand = String(product.brand ?? '');
  const model = String(product.model ?? product.product ?? '');
  const rating = product.our_rating ? Number(product.our_rating) : null;
  const amazonUrl = product.amazon_url ? String(product.amazon_url) : null;
  const imageUrl = product.image_url ? String(product.image_url) : null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 surface-elevated card-hover">
      {/* Category color strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent.strip}`} />

      {/* Product image or silhouette */}
      {imageUrl ? (
        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={`${brand} ${model}`}
            className="w-full h-full object-contain p-4"
            loading="lazy"
          />
        </div>
      ) : (
        <ProductSilhouette category={category} />
      )}

      {/* Rating badge */}
      {rating && (
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold ${accent.badge}`}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating}
          </span>
        </div>
      )}

      {/* Card body */}
      <div className="p-5">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">
          {brand}
        </p>
        <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4 leading-tight">
          {model}
        </h3>

        {/* Specs grid — varies by category */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {category === 'shoes' && (
            <>
              <SpecItem label="Drop" value={product.drop_mm ? `${product.drop_mm}mm` : null} />
              <SpecItem label="Weight" value={product.weight_g ? `${product.weight_g}g` : null} />
              <SpecItem label="Carbon" value={product.carbon_plate ? 'Yes' : 'No'} />
              <SpecItem label="Price" value={product.price_usd ? `$${product.price_usd}` : null} />
            </>
          )}
          {category === 'vests' && (
            <>
              <SpecItem label="Capacity" value={product.capacity_l ? `${product.capacity_l}L` : null} />
              <SpecItem label="Weight" value={product.weight_g ? `${product.weight_g}g` : null} />
              <SpecItem label="UTMB" value={product.utmb_compliant ? 'Yes' : 'No'} />
              <SpecItem label="Price" value={product.price_usd ? `$${product.price_usd}` : null} />
            </>
          )}
          {category === 'gels' && (
            <>
              <SpecItem label="Carbs" value={product.carbs_per_serving_g ? `${product.carbs_per_serving_g}g` : null} />
              <SpecItem label="Caffeine" value={product.caffeine_mg ? `${product.caffeine_mg}mg` : null} />
              <SpecItem label="Real Food" value={product.real_food ? 'Yes' : 'No'} />
              <SpecItem label="Price/serve" value={product.price_per_serving ? `$${product.price_per_serving}` : null} />
            </>
          )}
        </div>

        {/* Buy button */}
        {amazonUrl ? (
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-brand-700 dark:hover:bg-brand-500 interactive"
          >
            Buy on Amazon
          </a>
        ) : (
          <span className="block w-full text-center px-4 py-2.5 text-slate-400 dark:text-slate-600 text-sm">
            —
          </span>
        )}
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
        {value ?? '—'}
      </dd>
    </div>
  );
}
