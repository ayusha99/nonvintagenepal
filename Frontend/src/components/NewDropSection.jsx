import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

function DropCard({ drop, index, featured = false, visible, delay = 0, pieceCount }) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={drop.link}
      className={`group relative block overflow-hidden bg-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
        featured ? 'min-h-[420px] lg:min-h-0 lg:h-full' : 'min-h-[220px] sm:min-h-[260px]'
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={drop.image}
          alt={drop.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1.2s] ease-out scale-[1.12] group-hover:scale-[1.18]"
        />
      </div>

      <div className="absolute -inset-px bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute -inset-px bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

      <span
        className="absolute -right-2 top-4 font-black uppercase text-white/[0.12] pointer-events-none select-none leading-none"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: featured ? 'clamp(96px, 14vw, 180px)' : 'clamp(64px, 10vw, 120px)',
          letterSpacing: '-0.04em',
        }}
        aria-hidden
      >
        {number}
      </span>

      {featured && (
        <div className="absolute top-5 left-5 z-10">
          <span className="inline-block bg-white text-black px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] font-black">
            Latest
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[9px] uppercase tracking-[0.35em] text-white/70 font-bold">
                {drop.subtitle}
              </span>
              {pieceCount > 0 && (
                <span className="text-[9px] uppercase tracking-[0.2em] text-white font-black bg-white/15 backdrop-blur-sm px-2 py-0.5">
                  {pieceCount} pcs
                </span>
              )}
            </div>
            <h3
              className={`font-black uppercase text-white leading-[1.05] ${
                featured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-lg lg:text-xl'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
            >
              {drop.title}
            </h3>
          </div>

          <span
            className={`flex-shrink-0 inline-flex items-center justify-center border border-white/40 text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white ${
              featured ? 'w-12 h-12' : 'w-10 h-10'
            }`}
          >
            <ArrowUpRight className={featured ? 'w-5 h-5' : 'w-4 h-4'} />
          </span>
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-white/0 group-hover:text-white/90 transition-all duration-300 translate-y-2 group-hover:translate-y-0 font-bold">
          Shop this drop
        </p>
      </div>
    </Link>
  );
}

export default function NewDropSection({ drops, dropCounts = {}, sectionRef, visible }) {
  if (!drops.length) return null;

  const [featured, ...rest] = drops;

  return (
    <section ref={sectionRef} className="w-full bg-[#f5f5f5] overflow-hidden border-t border-gray-200/60 -mt-2">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-10 lg:pt-10 lg:pb-12">
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 lg:mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-2 font-bold">Just In</p>
            <h2
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-black uppercase text-black leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
            >
              New Drop
            </h2>
            <p className="mt-4 text-sm text-gray-500 max-w-md leading-relaxed">
              Fresh pulls from this week&apos;s archive — curated grids, shot in-house, gone when they sell.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-3 self-start lg:self-auto border border-gray-300 bg-white px-5 py-3 text-[10px] uppercase tracking-[0.25em] font-black text-black hover:bg-black hover:text-white hover:border-black transition-colors"
          >
            Shop all drops
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {drops.length === 1 ? (
          <div className="max-w-3xl">
            <DropCard
              drop={featured}
              index={0}
              featured
              visible={visible}
              pieceCount={dropCounts[featured.id] || 0}
            />
          </div>
        ) : drops.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            {drops.map((drop, index) => (
              <DropCard
                key={drop.id}
                drop={drop}
                index={index}
                featured={index === 0}
                visible={visible}
                delay={index * 120}
                pieceCount={dropCounts[drop.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 lg:min-h-[540px]">
            <div className="lg:col-span-7 lg:row-span-2 min-h-[420px] lg:min-h-0 overflow-hidden">
              <DropCard
                drop={featured}
                index={0}
                featured
                visible={visible}
                pieceCount={dropCounts[featured.id] || 0}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3 lg:gap-4">
              {rest.map((drop, index) => (
                <div key={drop.id} className="flex-1 min-h-[220px] overflow-hidden">
                  <DropCard
                    drop={drop}
                    index={index + 1}
                    visible={visible}
                    delay={(index + 1) * 120}
                    pieceCount={dropCounts[drop.id] || 0}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="mt-10 pt-8 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 700ms ease 400ms',
          }}
        >
          {drops.slice(0, 4).map((drop, index) => (
            <Link key={drop.id} to={drop.link} className="group block">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300 font-bold mb-1">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-600 font-bold group-hover:text-black transition-colors line-clamp-2">
                {drop.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
