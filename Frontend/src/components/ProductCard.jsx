import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const isSold = product.status === 'sold' || (product.stock ?? 1) <= 0;

  return (
    <Link to={`/products/${product._id}`} className="block group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f4f2]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {isSold && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              Sold
            </span>
          </div>
        )}
      </div>

      <div className="pt-3">
        <h3 className="text-xs font-bold text-black line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1">Rs. {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
