import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';

function AnimatedProductCard({ product, index = 0, lookbook = true, compact = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(compact);
  const [touchActive, setTouchActive] = useState(false);

  useEffect(() => {
    if (compact) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '80px 0px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [compact]);

  const isSold = product.status === 'sold' || (product.stock ?? 1) <= 0;
  const primary = product.images?.[0] || 'https://via.placeholder.com/400';
  const hasSecond = (product.images?.length ?? 0) > 1;
  const secondary = hasSecond ? product.images[1] : primary;
  const showAlt = touchActive;

  if (!lookbook) {
    return (
      <Link to={`/products/${product._id}`} className="block group">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f4f2]">
          <img src={primary} alt={product.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
          {isSold && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">Sold</span>
            </div>
          )}
        </div>
        <div className="pt-3">
          <h3 className="text-xs font-bold text-black line-clamp-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1">Rs. {product.price?.toLocaleString()}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      ref={ref}
      to={`/products/${product._id}`}
      className="group block"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms ease ${(index % 4) * 80}ms, transform 600ms ease ${(index % 4) * 80}ms`,
      }}
      onTouchStart={() => setTouchActive(true)}
      onTouchEnd={() => setTouchActive(false)}
      onTouchCancel={() => setTouchActive(false)}
    >
      <div className="aspect-[3/4] overflow-hidden relative bg-[#f4f4f2]">
        <img
          src={primary}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
            showAlt ? 'opacity-0 scale-105' : 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105'
          }`}
        />
        <img
          src={secondary}
          alt={`${product.name} alternate view`}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
            showAlt ? 'opacity-100 scale-100' : 'opacity-0 scale-100 group-hover:opacity-100'
          }`}
        />

        {isSold && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-black text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em]">Sold Out</span>
          </div>
        )}

        {!isSold && product.stock <= 2 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="text-[9px] uppercase tracking-wider font-bold text-black/70 bg-white/90 px-2 py-0.5">
              {product.stock === 1 ? '1 left' : `${product.stock} left`}
            </span>
          </div>
        )}
      </div>

      <div className={compact ? 'pt-2.5' : 'pt-3'}>
        <h3 className={`font-bold text-black line-clamp-1 ${compact ? 'text-xs' : 'text-sm'}`}>
          {product.name}
        </h3>
        <p className={`text-gray-500 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
          Rs. {product.price?.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default AnimatedProductCard;
