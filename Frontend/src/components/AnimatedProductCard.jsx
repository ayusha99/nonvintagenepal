import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';

function AnimatedProductCard({ product, index = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '40px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.97]'
      }`}
      style={{ transitionDelay: visible ? `${(index % 8) * 70}ms` : '0ms' }}
    >
      <ProductCard product={product} />
    </div>
  );
}

export default AnimatedProductCard;
