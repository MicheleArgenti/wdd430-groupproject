import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query: any = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const products = await Product.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .lean()
      .then(products => products.map(p => ({
        ...p,
        _id: p._id.toString(), // Convert ObjectId to string
        seller: p.seller ? {
          ...p.seller,
          _id: p.seller._id.toString()
        } : null
      })));
    
    console.log(`📦 API: Returning ${products.length} products`);
    
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const product = await Product.create(data);
    
    return NextResponse.json(
      { 
        message: 'Product created successfully', 
        product: {
          ...product.toObject(),
          _id: product._id.toString()
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}