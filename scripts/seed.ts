import connectDB from '../lib/mongodb';
import Product from '../models/Product';

const sampleProducts = [
  {
    name: 'Organic Apples',
    description: 'Fresh, crispy organic apples from local orchards',
    price: 4.99,
    originalPrice: 6.99,
    category: 'fruits',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
        alt: 'Fresh organic apples'
      }
    ],
    stock: 50,
    unit: 'kg',
    featured: true,
    organic: true,
    rating: 4.8,
    nutritionInfo: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fiber: 2.4,
      vitamins: ['Vitamin C', 'Vitamin K']
    }
  },
  {
    name: 'Fresh Spinach',
    description: 'Nutrient-rich organic spinach leaves',
    price: 2.99,
    category: 'vegetables',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
        alt: 'Fresh spinach leaves'
      }
    ],
    stock: 30,
    unit: 'bunch',
    organic: true,
    rating: 4.6,
    nutritionInfo: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fiber: 2.2,
      vitamins: ['Vitamin A', 'Vitamin C', 'Iron']
    }
  },
  {
    name: 'Organic Carrots',
    description: 'Sweet and crunchy organic carrots',
    price: 3.49,
    category: 'vegetables',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800',
        alt: 'Fresh organic carrots'
      }
    ],
    stock: 40,
    unit: 'kg',
    featured: true,
    organic: true,
    rating: 4.7
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();