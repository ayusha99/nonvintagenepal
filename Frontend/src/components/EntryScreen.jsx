import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'nvn_entry_seen';

export default function EntryScreen({ onEnter }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const dragYRef = useRef(0);
  const enteredRef = useRef(false);
  const THRESHOLD = 120;

  const finish = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setExiting(true);
    sessionStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => {
      setVisible(false);
      onEnter?.();
    }, 700);
  }, [onEnter]);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setVisible(true);
    } else if (!enteredRef.current) {
      enteredRef.current = true;
      onEnter?.();
    }
  }, [onEnter]);

  const handlePointerDown = (e) => {
    setDragging(true);
    startY.current = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const delta = startY.current - y;
    dragYRef.current = Math.max(0, delta);
    setDragY(dragYRef.current);
    if (delta >= THRESHOLD) finish();
  };

  const handlePointerUp = () => {
    setDragging(false);
    if (dragYRef.current < THRESHOLD) {
      dragYRef.current = 0;
      setDragY(0);
    }
  };

  if (!visible) return null;

  const progress = Math.min(dragY / THRESHOLD, 1);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center select-none touch-none"
      style={{
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateY(-100%)' : `translateY(-${dragY * 0.15}px)`,
        transition: exiting ? 'opacity 700ms ease, transform 700ms ease' : dragging ? 'none' : 'transform 300ms ease',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="relative z-10 flex flex-col items-center gap-8">
        <img
          src="/Non_Vintage_Nepal_Logo_Transparent.png"
          alt="Non Vintage Nepal"
          className="h-20 w-auto"
          draggable={false}
        />

        <div className="text-center">
          <p
            className="text-black font-black uppercase leading-none mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 6vw, 56px)', letterSpacing: '-0.03em' }}
          >
            NON VINTAGE
          </p>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.5em] font-bold">Nepal · Kathmandu</p>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-4 z-10">
        <div className="relative w-12 h-16 border border-gray-200 rounded-full flex items-end justify-center pb-3 overflow-hidden">
          <div
            className="w-1 bg-black rounded-full transition-all duration-100"
            style={{ height: `${12 + progress * 28}px`, opacity: 0.3 + progress * 0.7 }}
          />
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); finish(); }}
          className="group flex flex-col items-center gap-2 text-gray-400 hover:text-black transition-colors"
        >
          <ChevronUp className="w-5 h-5 animate-bounce" style={{ animationDuration: '1.8s' }} />
          <span className="text-[9px] uppercase tracking-[0.4em] font-black">
            Swipe up to enter
          </span>
        </button>

        <div className="w-32 h-[2px] bg-gray-100 overflow-hidden mt-2">
          <div
            className="h-full bg-black transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <p className="absolute bottom-6 right-6 text-[8px] uppercase tracking-[0.3em] text-gray-300 font-bold">
        SS 2025
      </p>
    </div>
  );
}
