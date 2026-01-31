'use server';

import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function getProducts(options?: {
  limit?: number;
  category?: string;
  search?: string;
}) {
  try {
    await connectDB();

    const query: any = { isActive: true };

    if (options?.category) {
      query.category = options.category;
    }

    if (options?.search) {
      query.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { description: { $regex: options.search, $options: 'i' } },
      ];
    }

    let productsQuery = Product.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    if (options?.limit) {
      productsQuery = productsQuery.limit(options.limit);
    }

    const products = await productsQuery.lean();
    
    // Convert MongoDB ObjectId to string for serialization
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    await connectDB();

    const product = await Product.findById(id)
      .populate('seller', 'name email')
      .lean();

    if (!product) {
      return null;
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}