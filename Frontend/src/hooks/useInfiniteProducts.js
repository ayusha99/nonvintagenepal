import { useEffect, useRef, useState } from 'react';

const BATCH_SIZE = 8;

export function useInfiniteProducts(products, resetKey = '') {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [batchIndex, setBatchIndex] = useState(1);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    setBatchIndex(1);
  }, [resetKey, products.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (visibleCount >= products.length) return;

        setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, products.length));
        setBatchIndex((prev) => prev + 1);
      },
      { rootMargin: '120px', threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, products.length]);

  return {
    visibleProducts: products.slice(0, visibleCount),
    hasMore: visibleCount < products.length,
    batchesLoaded: batchIndex,
    sentinelRef,
    totalCount: products.length,
    visibleCount,
  };
}
