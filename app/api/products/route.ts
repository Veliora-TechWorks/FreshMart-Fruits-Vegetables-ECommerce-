import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const products = await Product.find({})
      .select('-reviews -nutritionInfo')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('Creating product with data:', body);
    
    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.category) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, description, price, category' 
      }, { status: 400 });
    }
    
    const product = await Product.create(body);
    console.log('Product created successfully:', product._id);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create product' 
    }, { status: 500 });
  }
}