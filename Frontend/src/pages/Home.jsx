import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import HeroReel from '../components/HeroReel';
import NewDropSection from '../components/NewDropSection';
import FeaturedArchiveSection from '../components/FeaturedArchiveSection';
import { HOME_CATEGORIES as categories } from '../constants/categories';
import { useDrops } from '../hooks/useDrops';

/* ─── Scroll-reveal hook ───────────────────────────────────── */
function useReveal(enabled = true) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05, rootMargin: '120px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [enabled]);
  return [ref, visible];
}

/* ─── Main page ────────────────────────────────────────────── */
const FEATURED_TOTAL = 9;
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dropCounts, setDropCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { drops: newDropItems, loading: dropsLoading } = useDrops();

  // Reveal refs — pass enabled so observer runs after conditional sections mount
  const [newDropRef, newDropVisible] = useReveal(!dropsLoading && newDropItems.length > 0);
  const [featuredRef, featuredVisible] = useReveal();
  const [storyRef, storyVisible] = useReveal();

  /* fetch products */
  useEffect(() => {
    api.get('/products?status=available')
      .then(r => {
        const all = r.data.data || r.data.products || [];
        const available = all.filter(p => p.stock > 0);
        const inDrop = available.filter((p) => p.drop);
        const pool = inDrop.length >= 5 ? inDrop : available;
        setFeaturedProducts(pool.slice(0, FEATURED_TOTAL));

        const counts = {};
        available.forEach((p) => {
          if (p.drop) counts[p.drop] = (counts[p.drop] || 0) + 1;
        });
        setDropCounts(counts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white -mt-16 lg:-mt-20">
      <HeroReel />

      {/* ══════════════════════════════════════════
          SHOP BY CATEGORY — unchanged (user likes it)
      ══════════════════════════════════════════ */}
      <section className="w-full pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6 flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-black">
            Shop by Category
          </h2>
          <Link to="/products" className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors flex items-center gap-2 font-bold">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-0.5 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 lg:px-12 pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="relative flex-shrink-0 w-[50vw] sm:w-44 md:w-48 lg:w-52 snap-start aspect-[3/4] overflow-hidden bg-gray-100 group"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white font-black">{cat.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEW DROP — Staggered animated photo grid
      ══════════════════════════════════════════ */}
      {!dropsLoading && newDropItems.length > 0 && (
        <NewDropSection
          drops={newDropItems}
          dropCounts={dropCounts}
          sectionRef={newDropRef}
          visible={newDropVisible}
        />
      )}

      <FeaturedArchiveSection
        products={featuredProducts}
        loading={loading}
        sectionRef={featuredRef}
        visible={featuredVisible}
      />

      {/* ══════════════════════════════════════════
          BRAND STORY — clean editorial block
      ══════════════════════════════════════════ */}
      <section ref={storyRef} className="w-full bg-[#f4f4f2] border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end"
            style={{
              opacity: storyVisible ? 1 : 0,
              transform: storyVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 700ms ease, transform 700ms ease',
            }}
          >
            {/* Copy */}
            <div className="lg:col-span-5 lg:pb-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-4 font-bold">
                Kathmandu · Since 2023
              </p>
              <h2
                className="font-black uppercase text-black leading-[1.05] mb-6"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  letterSpacing: '-0.02em',
                }}
              >
                Curated vintage,
                <br />
                one piece at a time.
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-md mb-8">
                We source, authenticate, and shoot every item in-house. No bulk inventory — just rare finds
                that land once and leave when they&apos;re gone.
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-10 max-w-md">
                {[
                  ['01', 'Authenticated in-house'],
                  ['02', 'Weekly drops'],
                  ['03', 'Ships across Nepal'],
                  ['04', 'One-of-one pieces'],
                ].map(([num, text]) => (
                  <div key={num} className="border-t border-black/15 pt-3">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">{num}</p>
                    <p className="text-xs text-gray-800 font-medium leading-snug">{text}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 bg-black text-white px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.22em] hover:bg-gray-900 transition-colors"
                >
                  Shop Collection
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/our-story"
                  className="inline-flex items-center px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.22em] text-black border border-black/20 hover:border-black transition-colors"
                >
                  Our Story
                </Link>
                <a
                  href="https://www.instagram.com/nonvintagenepal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors px-2 py-3.5"
                >
                  @nonvintagenepal ↗
                </a>
              </div>
            </div>

            {/* Image grid — no overlays, no fake social UI */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-2 md:gap-3">
              <div className="col-span-7 aspect-[4/5] overflow-hidden bg-gray-200">
                <img
                  src="/hero/hero-src-1.jpg"
                  alt="Vintage collection at Non Vintage Nepal"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="col-span-5 flex flex-col gap-2 md:gap-3">
                <div className="flex-1 min-h-[120px] overflow-hidden bg-gray-200">
                  <img
                    src="/hero/hero-2.jpg"
                    alt="Curated vintage pieces"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-h-[120px] overflow-hidden bg-gray-200">
                  <img
                    src="/hero/hero-src-2.jpg"
                    alt="Streetwear and jerseys"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
