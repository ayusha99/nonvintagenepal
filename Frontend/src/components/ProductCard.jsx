import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="group block border border-gray-200 rounded-md overflow-hidden bg-white hover:border-gray-300 hover:shadow-sm transition-all">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-black text-white px-4 py-2 text-xs font-bold tracking-widest uppercase">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 text-left">
        <p className="text-gray-900 font-bold text-[11px] md:text-xs tracking-tight">
          Rs{product.price.toLocaleString()}
        </p>
        <h3 className="text-gray-600 text-[10px] md:text-[11px] leading-snug mt-0.5 line-clamp-2">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}

export default ProductCard;
