'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function EditProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'jewelry',
    stock: '1',
    images: [''],
    isActive: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState(['']);

  // Check if user is authenticated and is a seller
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const user = session?.user as any;
  if (user?.role !== 'seller') {
    router.push('/');
    return null;
  }

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        
        // Check if current user is the seller
        if (data.seller._id !== user.id) {
          router.push('/dashboard/seller');
          return;
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          category: data.category || 'jewelry',
          stock: data.stock?.toString() || '1',
          images: data.images || [''],
          isActive: data.isActive !== false,
        });
        
        setImageUrls(data.images?.length ? data.images : ['']);
        
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/dashboard/seller?error=product_not_found');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && user?.id) {
      fetchProduct();
    }
  }, [productId, user?.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...imageUrls];
    newImages[index] = value;
    setImageUrls(newImages);
    setFormData(prev => ({ ...prev, images: newImages.filter(url => url.trim() !== '') }));
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageField = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    setFormData(prev => ({ ...prev, images: newImages.filter(url => url.trim() !== '') }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: imageUrls.filter(url => url.trim() !== ''),
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      router.push('/dashboard/seller?success=product_updated');
      router.refresh();
      
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      router.push('/dashboard/seller?success=product_deleted');
      router.refresh();
      
    } catch (error: any) {
      setErrors({ submit: error.message });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading product...</div>
      </div>
    );
  }

  const categories = [
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'home-decor', label: 'Home Decor' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'art', label: 'Art' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/seller" className="text-amber-600 hover:text-amber-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update your product information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Status Toggle */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-gray-700">
                <span className="font-medium">Product is active</span>
                <span className="text-sm text-gray-500 block">
                  Inactive products won't appear in the store
                </span>
              </span>
            </label>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/1000 characters
            </p>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (Optional)
            </label>
            
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addImageField}
              className="mt-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              + Add another image
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
            >
              Delete Product
            </button>
            
            <Link
              href="/dashboard/seller"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}