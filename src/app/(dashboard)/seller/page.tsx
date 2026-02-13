'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState('');
  const [showError, setShowError] = useState('');

  useEffect(() => {
    // Check for success/error messages
    if (searchParams.get('success') === 'product_added') {
      setShowSuccess('Product added successfully!');
      setTimeout(() => setShowSuccess(''), 5000);
    }
    if (searchParams.get('success') === 'product_updated') {
      setShowSuccess('Product updated successfully!');
      setTimeout(() => setShowSuccess(''), 5000);
    }
    if (searchParams.get('success') === 'product_deleted') {
      setShowSuccess('Product deleted successfully!');
      setTimeout(() => setShowSuccess(''), 5000);
    }
    if (searchParams.get('error') === 'product_not_found') {
      setShowError('Product not found');
      setTimeout(() => setShowError(''), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const user = session?.user as any;
      if (user?.role !== 'seller') {
        router.push('/');
      } else {
        fetchProducts();
      }
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      
      // Filter products by seller ID
      const user = session?.user as any;
      const sellerProducts = data.filter((p: any) => p.seller?._id === user.id);
      setProducts(sellerProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove product from state
        setProducts(products.filter(p => p._id !== productId));
        setShowSuccess('Product deleted successfully!');
        setTimeout(() => setShowSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setShowError('Failed to delete product');
      setTimeout(() => setShowError(''), 3000);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        setProducts(products.map(p => 
          p._id === productId 
            ? { ...p, isActive: !currentStatus }
            : p
        ));
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const user = session?.user as any;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalRevenue: products.reduce((sum, p) => sum + p.price, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Manage your products and sales.</p>
        </div>

        {/* Success/Error Messages */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✅ {showSuccess}
          </div>
        )}
        {showError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {showError}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Products</h3>
            <p className="text-3xl font-bold text-green-600">{stats.activeProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-amber-600">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products/add"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
            >
              <span>+</span> Add New Product
            </Link>
            <Link
              href="/products"
              className="bg-white border border-amber-600 text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-50 transition"
            >
              View Store
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">🛍️</div>
              <p className="text-gray-600 mb-4">You haven't added any products yet.</p>
              <Link
                href="/products/add"
                className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500 capitalize">{product.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${
                          product.stock > 0 ? 'text-gray-900' : 'text-red-600 font-medium'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleProductStatus(product._id, product.isActive)}
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            product.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <Link
                            href={`/products/${product._id}/edit`}
                            className="text-amber-600 hover:text-amber-900 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/products/${product._id}`}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            target="_blank"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}