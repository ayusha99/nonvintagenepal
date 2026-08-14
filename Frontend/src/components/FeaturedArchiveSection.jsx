import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { getCategoryLabel } from '../constants/categories';
function LookbookCard({ product, index, visible, delay = 0 }) {
  const [touchActive, setTouchActive] = useState(false);
  const isSold = product.status === 'sold' || (product.stock ?? 1) <= 0;
  const primary = product.images?.[0] || 'https://via.placeholder.com/400';
  const secondary = product.images?.[1] || primary;
  const showAlt = touchActive;
  const number = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={`/products/${product._id}`}
      data-lookbook-card
      className="group block shrink-0 snap-center w-[78vw] sm:w-[300px] lg:w-[340px] outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms`,
      }}
      onTouchStart={() => setTouchActive(true)}
      onTouchEnd={() => setTouchActive(false)}
      onTouchCancel={() => setTouchActive(false)}
    >
      <div className="border border-gray-200 bg-white p-2.5 sm:p-3 transition-colors duration-300 group-hover:border-black">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f4f2]">
          <img
            src={primary}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
              showAlt ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
            }`}
          />
          <img
            src={secondary}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
              showAlt ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          />

          {isSold && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.25em]">
                Sold
              </span>
            </div>
          )}

          {!isSold && product.stock <= 2 && (
            <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider font-black bg-black text-white px-2 py-0.5">
              {product.stock === 1 ? '1 left' : `${product.stock} left`}
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 flex items-start justify-between gap-4 border-t border-transparent group-hover:border-gray-200 transition-colors mt-1">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1.5">
            {number}
            {product.category && (
              <span className="text-gray-300 mx-2">/</span>
            )}
            {product.category && (
              <span className="text-gray-500">{getCategoryLabel(product.category)}</span>
            )}
          </p>
          <h3
            className="text-sm sm:text-base font-black uppercase text-black leading-snug line-clamp-2 group-hover:underline decoration-1 underline-offset-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}
          >
            {product.name}
          </h3>
        </div>
        <p className="text-sm font-black text-black flex-shrink-0 pt-5">
          Rs. {product.price?.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden -mx-6 px-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="shrink-0 w-[300px]">
          <div className="border border-gray-200 p-3">
            <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
          </div>
          <div className="pt-4 space-y-2">
            <div className="h-2 w-16 bg-gray-200 animate-pulse" />
            <div className="h-4 w-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturedArchiveSection({ products, loading, sectionRef, visible }) {
  const items = products.slice(0, 9);
  const scrollRef = useRef(null);

  return (
    <section ref={sectionRef} className="w-full bg-white overflow-hidden -mt-2">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 lg:pt-8 pb-6">
        <div
          className="flex items-end justify-between mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-2 font-bold">
              Curated Selection
            </p>
            <h2
              className="text-3xl md:text-4xl font-black uppercase text-black leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
            >
              Featured Archive
            </h2>
          </div>

          <Link
            to="/products"
            className="group text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors flex items-center gap-2 font-bold"
          >
            View all
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      {loading ? (
        <FeaturedSkeleton />
      ) : items.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
          <div className="border border-gray-200 p-16 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">
              No products available yet.
            </p>
            <Link
              to="/products"
              className="inline-block mt-5 text-[10px] uppercase tracking-wider text-black border-b border-black pb-0.5 font-bold"
            >
              Browse Archive
            </Link>
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-16 lg:pb-20 px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+3rem))]"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 700ms ease 200ms',
          }}
        >
          {items.map((product, i) => (
            <LookbookCard
              key={product._id}
              product={product}
              index={i}
              visible={visible}
              delay={i * 70}
            />
          ))}
        </div>
      )}
    </section>
  );
}
