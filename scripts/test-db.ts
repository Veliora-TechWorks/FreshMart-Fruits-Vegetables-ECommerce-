import { config } from 'dotenv';
config({ path: '.env.local' });

import mongoose from 'mongoose';

async function testConnection() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('🔍 Testing MongoDB connection...');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

testConnection();