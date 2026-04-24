import 'dotenv/config';
import mongoose from 'mongoose';

async function test() {
  const uri = process.env.MONGODB_URI;
  console.log('Attempting connection to:', uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected!');
    // simple read
    const db = mongoose.connection.db;
    const stats = await db.stats();
    console.log('DB stats:', stats.ok);
  } catch (e) {
    console.error('❌ Connection error:', e.message);
  } finally {
    await mongoose.disconnect();
  }
}

test();
