import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
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