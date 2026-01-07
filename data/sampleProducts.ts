import { Product } from '@/types/product'

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Organic Apples',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
    price: 120,
    mrp: 150,
    unitOptions: [
      { value: 500, label: '500g', multiplier: 1 },
      { value: 1000, label: '1kg', multiplier: 2 }
    ],
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isOrganic: true,
    isSeasonal: false,
    isBestSeller: true,
    isFresh: true,
    stockLevel: 'high',
    freshnessScore: 95
  },
  {
    id: '2',
    name: 'Fresh Bananas',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    price: 60,
    mrp: 80,
    unitOptions: [
      { value: 6, label: '6 pieces', multiplier: 1 },
      { value: 12, label: '12 pieces', multiplier: 2 }
    ],
    rating: 4.3,
    reviews: 95,
    inStock: true,
    isOrganic: false,
    isSeasonal: false,
    isBestSeller: true,
    isFresh: true,
    stockLevel: 'high',
    freshnessScore: 92
  },
  {
    id: '3',
    name: 'Organic Carrots',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=300&fit=crop',
    price: 80,
    mrp: 100,
    unitOptions: [
      { value: 500, label: '500g', multiplier: 1 },
      { value: 1000, label: '1kg', multiplier: 2 }
    ],
    rating: 4.6,
    reviews: 76,
    inStock: true,
    isOrganic: true,
    isSeasonal: false,
    isFresh: true,
    stockLevel: 'medium',
    freshnessScore: 88
  },
  {
    id: '4',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1546470427-e9e3c8c3b6b0?w=400&h=300&fit=crop',
    price: 40,
    mrp: 50,
    unitOptions: [
      { value: 500, label: '500g', multiplier: 1 },
      { value: 1000, label: '1kg', multiplier: 2 }
    ],
    rating: 4.2,
    reviews: 112,
    inStock: true,
    isOrganic: false,
    isSeasonal: false,
    isFresh: true,
    stockLevel: 'high',
    freshnessScore: 90
  },
  {
    id: '5',
    name: 'Organic Spinach',
    category: 'Leafy Greens',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    price: 30,
    mrp: 40,
    unitOptions: [
      { value: 250, label: '250g', multiplier: 1 },
      { value: 500, label: '500g', multiplier: 2 }
    ],
    rating: 4.4,
    reviews: 68,
    inStock: true,
    isOrganic: true,
    isSeasonal: false,
    isFresh: true,
    stockLevel: 'medium',
    freshnessScore: 85
  },
  {
    id: '6',
    name: 'Fresh Oranges',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop',
    price: 100,
    mrp: 120,
    unitOptions: [
      { value: 6, label: '6 pieces', multiplier: 1 },
      { value: 12, label: '12 pieces', multiplier: 2 }
    ],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    isOrganic: false,
    isSeasonal: true,
    isFresh: true,
    stockLevel: 'high',
    freshnessScore: 93
  },
  {
    id: '7',
    name: 'Organic Broccoli',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
    price: 90,
    mrp: 110,
    unitOptions: [
      { value: 1, label: '1 piece', multiplier: 1 },
      { value: 2, label: '2 pieces', multiplier: 2 }
    ],
    rating: 4.5,
    reviews: 54,
    inStock: true,
    isOrganic: true,
    isSeasonal: false,
    isFresh: true,
    stockLevel: 'medium',
    freshnessScore: 87
  },
  {
    id: '8',
    name: 'Fresh Strawberries',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',
    price: 200,
    mrp: 250,
    unitOptions: [
      { value: 250, label: '250g', multiplier: 1 },
      { value: 500, label: '500g', multiplier: 2 }
    ],
    rating: 4.8,
    reviews: 142,
    inStock: true,
    isOrganic: true,
    isSeasonal: true,
    isBestSeller: true,
    isFresh: true,
    stockLevel: 'low',
    freshnessScore: 96
  }
]