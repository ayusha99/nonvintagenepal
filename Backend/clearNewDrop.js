import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './src/models/Product.js';

dotenv.config();

async function clear() {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await Product.deleteMany({
    description: { $regex: /new drop/i },
  });
  console.log(`Removed ${result.deletedCount} placeholder new-drop products`);
  await mongoose.disconnect();
}

clear().catch((err) => {
  console.error(err);
  process.exit(1);
});
