'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; 

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  stock: number;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchProduct(params.id as string);
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [params?.id]);

  const fetchProduct = async (id: string) => {
    
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch(`/api/products/${id}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        
        if (res.status === 404) {
          throw new Error('Product not found in database');
        } else {
          throw new Error(`API error: ${res.status} ${errorText}`);
        }
      }
      
      const data = await res.json();
      
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
  console.log('🛒 handleAddToCart called', { session: !!session, product });
  
  if (!session) {
    console.log('🛒 No session, redirecting to login');
    router.push(`/login?redirect=product&id=${product?._id}`);
    return;
  }

  if (!product) return;

  setAddingToCart(true);
  
  try {
    console.log('🛒 Calling addItem with:', {
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '',
      stock: product.stock,
      quantity
    });
    
    // Add to cart using the context
    addItem({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '',
      stock: product.stock,
    }, quantity);
    
    console.log('🛒 Item added to cart state');
    
    // Show success message
    alert(`✅ Added ${quantity} "${product.title}" to cart!`);
    
  } catch (error) {
    console.error('🛒 Error adding to cart:', error);
    alert('Failed to add to cart. Please try again.');
  } finally {
    setAddingToCart(false);
  }
};

  const handleBuyNow = () => {
    if (!session) {
      router.push(`/login?redirect=product&id=${product?._id}`);
      return;
    }
    
    if (product) {
      addItem({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || '',
        stock: product.stock,
      }, quantity);
      
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
            <p className="text-sm text-gray-500 mt-2">ID: {params?.id}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error ? 'Error Loading Product' : 'Product Not Found'}
            </h2>
            <p className="text-gray-600 mb-4">
              {error || 'The product you are looking for does not exist.'}
            </p>
            <div className="mb-6 p-4 bg-gray-100 rounded text-left">
              <p className="text-sm text-gray-700">
                <strong>Debug Info:</strong>
              </p>
              <p className="text-sm text-gray-600">Product ID: {params?.id}</p>
              <p className="text-sm text-gray-600">Type: {typeof params?.id}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/products"
                className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition"
              >
                ← Back to Products
              </Link>
              <button 
                onClick={() => params?.id && fetchProduct(params.id as string)}
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Debug banner - remove in production */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <strong>Debug:</strong> Showing product: {product._id}
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-amber-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle" dy=".3em">No Image</text></svg>';
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-6xl mb-4">🛍️</span>
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Uncategorized'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Free shipping on orders over $50</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center text-green-600">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span>In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= product.stock) {
                        setQuantity(value);
                      }
                    }}
                    className="w-16 h-10 border-t border-b border-gray-300 text-center"
                  />
                  <button 
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="w-10 h-10 border border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {addingToCart ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Seller Info */}
              {product.seller && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sold by</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-amber-600 font-medium">
                        {product.seller?.name?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.seller?.name || 'Handcrafted Seller'}</p>
                      <p className="text-sm text-gray-500">Artisan Member</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 text-gray-900 capitalize">{product.category || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Listed:</span>
                  <span className="ml-2 text-gray-900">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Product ID:</span>
                  <span className="ml-2 text-gray-900 font-mono text-xs">{product._id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Placeholder related products */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-3xl">{['💎', '🎨', '🏺', '🧵'][i-1]}</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Handmade Product {i}</h3>
                <p className="text-gray-600 text-sm mb-3">Beautiful handmade creation</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">${(29.99 + i * 10).toFixed(2)}</span>
                  <Link 
                    href="/products" 
                    className="text-amber-600 text-sm hover:text-amber-700"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}