# Non Vintage Nepal - Backend

Backend API for Non Vintage Nepal e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your actual credentials:
   - MongoDB Atlas connection string
   - JWT secrets
   - Cloudinary credentials
   - Payment gateway credentials (sandbox for now)

4. Start development server:
```bash
npm run dev
```

## Step 1 Complete ✓

Backend scaffolding complete with:
- ✅ Express server setup
- ✅ MongoDB connection configuration
- ✅ Product, User, and Order models
- ✅ Product CRUD routes and controllers
- ✅ Cloudinary configuration for image uploads
- ✅ Error handling middleware
- ✅ CORS and security setup

## Test the API

The server runs on `http://localhost:5000`

### Test endpoints with Postman or curl:

**Get all products:**
```bash
curl http://localhost:5000/api/products
```

**Create a product (after uploading images):**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vintage Denim Jacket",
    "description": "Classic blue denim jacket in great condition",
    "category": "outerwear",
    "price": 2500,
    "images": ["https://res.cloudinary.com/your-cloud/image1.jpg"],
    "condition": "good",
    "size": "M",
    "brand": "Levi'\''s"
  }'
```

**Get product by ID:**
```bash
curl http://localhost:5000/api/products/{productId}
```

## Next Steps

Once you confirm this works locally:
1. ✅ Test MongoDB connection
2. ✅ Test product CRUD operations
3. Move to Step 2: Frontend scaffolding
