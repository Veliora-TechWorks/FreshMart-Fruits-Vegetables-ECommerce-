import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

const sampleProducts = [
  {
    name: 'Fresh Organic Apples',
    description: 'Premium quality organic apples from Himachal Pradesh. Sweet, crispy, and packed with nutrients.',
    price: 120,
    originalPrice: 150,
    category: 'fruits',
    images: [{ url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop', alt: 'Fresh Organic Apples' }],
    stock: 50,
    unit: 'kg',
    featured: true,
    organic: true,
    rating: 4.5,
    deliveryTime: '15 MINS',
    offerText: 'Buy 2 Get 1 Free'
  },
  {
    name: 'Fresh Bananas',
    description: 'Sweet and ripe bananas perfect for breakfast or snacking. Rich in potassium and vitamins.',
    price: 60,
    originalPrice: 80,
    category: 'fruits',
    images: [{ url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop', alt: 'Fresh Bananas' }],
    stock: 100,
    unit: 'dozen',
    featured: true,
    organic: false,
    rating: 4.3,
    deliveryTime: '10 MINS'
  },
  {
    name: 'Organic Carrots',
    description: 'Fresh organic carrots grown without pesticides. Perfect for salads, cooking, and juicing.',
    price: 80,
    originalPrice: 100,
    category: 'vegetables',
    images: [{ url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=300&fit=crop', alt: 'Organic Carrots' }],
    stock: 75,
    unit: 'kg',
    featured: false,
    organic: true,
    rating: 4.6,
    deliveryTime: '15 MINS'
  },
  {
    name: 'Fresh Tomatoes',
    description: 'Juicy red tomatoes perfect for cooking and salads. Locally sourced and farm fresh.',
    price: 40,
    originalPrice: 50,
    category: 'vegetables',
    images: [{ url: 'https://images.unsplash.com/photo-1546470427-e9e3c8c3b6b0?w=400&h=300&fit=crop', alt: 'Fresh Tomatoes' }],
    stock: 80,
    unit: 'kg',
    featured: false,
    organic: false,
    rating: 4.2,
    deliveryTime: '15 MINS'
  },
  {
    name: 'Organic Spinach',
    description: 'Fresh organic spinach leaves rich in iron and vitamins. Perfect for healthy meals.',
    price: 30,
    originalPrice: 40,
    category: 'vegetables',
    images: [{ url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop', alt: 'Organic Spinach' }],
    stock: 60,
    unit: 'bunch',
    featured: false,
    organic: true,
    rating: 4.4,
    deliveryTime: '10 MINS'
  },
  {
    name: 'Fresh Oranges',
    description: 'Sweet and juicy oranges packed with Vitamin C. Perfect for fresh juice or snacking.',
    price: 100,
    originalPrice: 120,
    category: 'fruits',
    images: [{ url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop', alt: 'Fresh Oranges' }],
    stock: 90,
    unit: 'kg',
    featured: true,
    organic: false,
    rating: 4.7,
    deliveryTime: '15 MINS'
  }
];

export async function POST() {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    
    return NextResponse.json({ 
      message: 'Sample products seeded successfully',
      count: products.length,
      products 
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to seed products' 
    }, { status: 500 });
  }
}