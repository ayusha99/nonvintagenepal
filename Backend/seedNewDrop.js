import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './src/models/Product.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.join(__dirname, '..', 'Frontend', 'public', 'products');
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));

// Rename cropped files to slug filenames
for (const item of catalog) {
  const src = path.join(productsDir, item.image);
  const dest = path.join(productsDir, `${item.slug}.png`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

const newDropProducts = catalog.map((item) => ({
  name: item.name,
  brand: item.brand,
  description: item.description,
  category: item.category,
  price: item.price,
  size: item.size,
  condition: item.condition,
  stock: item.stock,
  images: [`/products/${item.slug}.png`],
}));

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const deleted = await Product.deleteMany({ description: { $regex: /new drop/i } });
  console.log(`Removed ${deleted.deletedCount} existing new-drop products`);

  const created = await Product.insertMany(newDropProducts);
  console.log(`Seeded ${created.length} new drop products`);

  created.forEach((p) => console.log(`  ${p.name} — Rs.${p.price} (${p.size})`));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
