import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const values = [
  'Authenticated & photographed in-house',
  'New drops every week',
  'Ships across Nepal — fast',
  'One-of-one vintage pieces',
];

const editorialPhotos = [
  'https://i.pinimg.com/736x/b0/1b/5a/b01b5ac04e33adc3c50204ad44fe0c3a.jpg',
  'https://i.pinimg.com/1200x/63/6f/9c/636f9cb9bbabb0ff06ec05c729b9384a.jpg',
  'https://i.pinimg.com/736x/9f/40/a5/9f40a56f0cff722fbe9b84146db7f0a8.jpg',
];

export default function OurStory() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              <img src={editorialPhotos[0]} alt="Non Vintage Nepal collection" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-2/5 aspect-[3/4] overflow-hidden bg-gray-200 border-4 border-white shadow-xl hidden lg:block">
              <img src={editorialPhotos[1]} alt="Vintage detail" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 left-4 bg-white text-black px-3 py-2 border border-gray-100 shadow-sm">
              <p className="text-[9px] uppercase tracking-widest font-black">Since 2023</p>
              <p className="text-[9px] uppercase tracking-widest text-gray-400">Kathmandu</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-5 font-bold">Our Story</p>
            <h1
              className="font-black uppercase text-black leading-none mb-8"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 4.5vw, 56px)', letterSpacing: '-0.02em' }}
            >
              WE FIND THE PIECES<br />
              <span className="text-gray-300">OTHERS MISS</span>
            </h1>

            <div className="space-y-5 text-sm text-gray-500 leading-relaxed max-w-lg mb-10">
              <p>
                Non Vintage Nepal started in Kathmandu with one idea: give great vintage clothing a second life
                instead of letting it sit forgotten in a rack somewhere.
              </p>
              <p>
                Every piece we sell is sourced by hand, checked for quality, and photographed by our in-house team.
                No mass production — just unique finds from jerseys and graphic tees to rare streetwear drops.
              </p>
              <p>
                We drop fresh inventory regularly and ship across Nepal. When you shop with us, you&apos;re not buying
                off a factory line — you&apos;re claiming something that won&apos;t come back once it&apos;s gone.
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              {values.map((text) => (
                <li key={text} className="flex items-center gap-4 text-sm text-gray-700 font-medium">
                  <span className="text-black text-xs">✦</span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/products?search=new+drop"
                className="group bg-black text-white px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                Shop New Drop <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="border border-gray-300 text-black px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:border-black transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="https://www.instagram.com/nonvintagenepal/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 text-black px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] hover:border-black transition-colors"
              >
                Instagram ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 lg:mt-28 border-t border-gray-100 pt-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 font-bold">From the feed</p>
          <a
            href="https://www.instagram.com/nonvintagenepal/"
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-2xl aspect-video bg-gray-100 overflow-hidden group"
          >
            <img
              src={editorialPhotos[2]}
              alt="Non Vintage Nepal on Instagram"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
