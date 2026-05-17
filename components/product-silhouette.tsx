export default function ProductSilhouette({
  category,
}: {
  category: 'shoes' | 'vests' | 'gels';
}) {
  const accent =
    category === 'shoes'
      ? 'text-brand-200 dark:text-brand-800'
      : category === 'vests'
        ? 'text-blue-200 dark:text-blue-800'
        : 'text-emerald-200 dark:text-emerald-800';

  return (
    <div className="h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-8">
      {category === 'shoes' && (
        <svg
          viewBox="0 0 120 80"
          fill="none"
          className={`w-full h-full ${accent}`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Running shoe silhouette */}
          <path d="M8 55 L8 35 Q8 20 25 15 L95 10 Q110 8 112 20 L112 35 Q112 50 100 55 L70 60 L30 60 Z" />
          <path d="M30 60 L25 70 L35 68" strokeWidth="1.5" opacity="0.6" />
          <path d="M60 60 L58 68 L68 66" strokeWidth="1.5" opacity="0.6" />
          {/* Lace line */}
          <path d="M40 18 Q55 28 70 18" strokeWidth="1" opacity="0.5" />
          {/* Sole line */}
          <path d="M10 55 Q55 62 105 55" strokeWidth="3" opacity="0.7" />
        </svg>
      )}

      {category === 'vests' && (
        <svg
          viewBox="0 0 100 120"
          fill="none"
          className={`w-full h-full ${accent}`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Vest silhouette */}
          <path d="M30 10 L40 30 L50 10 L60 30 L70 10 L75 40 L65 110 L50 95 L35 110 L25 40 Z" />
          {/* Straps */}
          <path d="M35 50 L25 55" strokeWidth="1.5" opacity="0.5" />
          <path d="M65 50 L75 55" strokeWidth="1.5" opacity="0.5" />
          {/* Chest straps */}
          <path d="M35 60 L65 60" strokeWidth="1" opacity="0.4" />
          <path d="M35 70 L65 70" strokeWidth="1" opacity="0.4" />
          {/* Flasks */}
          <rect x="38" y="40" width="8" height="20" rx="3" opacity="0.6" />
          <rect x="54" y="40" width="8" height="20" rx="3" opacity="0.6" />
        </svg>
      )}

      {category === 'gels' && (
        <svg
          viewBox="0 0 70 110"
          fill="none"
          className={`w-full h-full ${accent}`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Gel packet silhouette */}
          <path d="M20 10 L50 10 L50 30 L45 35 L45 95 Q45 105 35 105 Q25 105 25 95 L25 35 L20 30 Z" />
          {/* Tear notch */}
          <path d="M30 8 L40 8" strokeWidth="1.5" opacity="0.6" />
          {/* Label line */}
          <path d="M28 45 L42 45" strokeWidth="1" opacity="0.4" />
          <path d="M28 55 L42 55" strokeWidth="1" opacity="0.4" />
          <path d="M28 65 L38 65" strokeWidth="1" opacity="0.4" />
          {/* Texture dots */}
          <circle cx="30" cy="80" r="2" opacity="0.3" />
          <circle cx="40" cy="80" r="2" opacity="0.3" />
          <circle cx="35" cy="88" r="2" opacity="0.3" />
        </svg>
      )}
    </div>
  );
}
