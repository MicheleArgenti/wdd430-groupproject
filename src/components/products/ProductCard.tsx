import Link from 'next/link';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Product Image */}
        <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-4xl">🛍️</div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.title}
            </h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}