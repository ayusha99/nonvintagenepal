import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HERO_INSTAGRAM_REEL, HERO_CONTENT } from '../constants/hero';

export default function HeroReel() {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => setVideoReady(true);

    video.muted = true;
    video.addEventListener('playing', markReady);
    video.addEventListener('canplay', markReady);

    video.play().catch(() => {
      /* autoplay blocked until user interacts */
    });

    return () => {
      video.removeEventListener('playing', markReady);
      video.removeEventListener('canplay', markReady);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        src={HERO_INSTAGRAM_REEL.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Soft bottom fade for text readability only */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col justify-end pb-14 px-6 lg:px-16 pointer-events-none">
        <div className="pointer-events-auto max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/50 mb-4 font-bold">
            {HERO_CONTENT.label}
          </p>

          <h1
            className="font-black uppercase leading-none text-white mb-6"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(36px, 6vw, 72px)',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              whiteSpace: 'pre-line',
            }}
          >
            {HERO_CONTENT.title}
          </h1>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="group bg-white text-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-300 inline-flex items-center gap-3 border-2 border-white"
            >
              Shop Archive
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/our-story"
              className="border-2 border-white/50 text-white px-8 py-4 text-xs font-black uppercase tracking-[0.25em] hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
