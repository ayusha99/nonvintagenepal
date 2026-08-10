# Non Vintage Nepal - E-commerce Platform

Full-stack MERN e-commerce website for Non Vintage Nepal thrift store.

## 🚀 Current Progress

### ✅ Step 1: Backend Scaffolding (Complete)
- Express server with MongoDB
- Product, User, Order models
- Product CRUD API
- Error handling middleware
- Cloudinary configuration

### ✅ Step 2: Frontend Scaffolding (Complete)
- React + Vite + Tailwind CSS
- Enhanced home page
- Product listing & detail pages
- Shopping cart with Zustand
- Checkout flow (COD)
- Responsive design

### ✅ Step 3: Full Authentication (Complete)
**Backend:**
- JWT authentication with refresh tokens
- httpOnly cookies for security
- Password hashing with bcrypt
- Auth routes: signup, login, logout, getMe
- Protected route middleware
- Admin-only middleware

**Frontend:**
- Auth context with React Context API
- Login & Signup forms with validation
- Protected routes component
- User state management
- Admin route protection
- Navbar with user status

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Cloudinary (image uploads)
- Cookie-parser

**Frontend:**
- React 18 + Vite
- React Router v6
- Zustand (state management)
- Axios
- Tailwind CSS

## 📦 Installation

### Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on: http://localhost:3000

## 🔐 Test Authentication

1. **Create an account**: Go to `/signup`
2. **Login**: Go to `/login`
3. **Access admin**: First user needs to be manually set as admin in MongoDB

### Make First User Admin (MongoDB Compass):
```javascript
// Find your user and update role field to "admin"
{ "role": "admin" }
```

## 📋 Next Steps

### Step 3: Admin Product Management
- [ ] Admin dashboard UI
- [ ] Add product form with Cloudinary image upload
- [ ] Edit product functionality
- [ ] Delete product
- [ ] View all products (including sold items)

### Step 4: Complete Order Flow
- [ ] Create order API
- [ ] Order listing for admin
- [ ] Update order status
- [ ] User order history

### Step 5: Payment Gateways
- [ ] eSewa (ePay v2)
- [ ] Khalti (KPG v2)
- [ ] Fonepay (QR-based)
- [ ] Cash on Delivery (COD) - Already in UI

### Step 6: Polish & Deploy
- [ ] Image optimization
- [ ] Loading states
- [ ] Error boundaries
- [ ] SEO meta tags
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/non-vintage-nepal
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

## 📁 Project Structure

```
non-vintage-nepal/
├── backend/
│   ├── src/
│   │   ├── config/        (db, cloudinary)
│   │   ├── models/        (User, Product, Order)
│   │   ├── routes/        (auth, products)
│   │   ├── controllers/   (auth, products)
│   │   └── middleware/    (auth, error handler)
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/    (Navbar, ProductCard, ProtectedRoute)
│   │   ├── pages/         (Home, Products, Cart, Auth, Admin)
│   │   ├── context/       (AuthContext)
│   │   ├── store/         (cartStore)
│   │   └── api/           (axios config)
│   └── vite.config.js
└── README.md
```

## 🎯 Features

### Customer Features
- ✅ Browse products by category
- ✅ View product details
- ✅ Add to cart (unique items, qty=1)
- ✅ Checkout flow
- ✅ User authentication
- ⏳ Order history
- ⏳ Multiple payment methods

### Admin Features
- ✅ Protected admin routes
- ⏳ Add/Edit/Delete products
- ⏳ Upload images to Cloudinary
- ⏳ Manage orders
- ⏳ Update order status
- ⏳ Dashboard analytics

## 📝 Notes

- Each product is unique (quantity = 1)
- Products marked as "sold" after purchase
- Admin role required for product management
- JWT stored in memory/localStorage (not httpOnly for now)
- Refresh tokens in httpOnly cookies
- Payment gateways use sandbox credentials first

## 👨‍💻 Author

Built for Non Vintage Nepal thrift store.
