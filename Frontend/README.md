# Non Vintage Nepal - Frontend

React frontend for Non Vintage Nepal e-commerce platform.

## Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **Zustand** for state management (cart)
- **Axios** for API calls
- **Tailwind CSS** for styling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Features Implemented ✅

- ✅ Home page with featured products
- ✅ Product listing with category filter
- ✅ Product detail page with image gallery
- ✅ Shopping cart with Zustand state management
- ✅ Checkout flow (COD only for now)
- ✅ Responsive design with Tailwind CSS
- ✅ Login/Signup pages (UI ready, auth to be implemented)
- ✅ Admin pages structure (to be implemented)

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance & interceptors
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProductCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       └── AdminOrders.jsx
│   ├── store/
│   │   └── cartStore.js      # Zustand cart store
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── tailwind.config.js
```

## Next Steps

- [ ] Implement JWT authentication
- [ ] Build admin panel functionality
- [ ] Add payment gateway integrations
- [ ] Add loading states and error handling
- [ ] Optimize images and performance
