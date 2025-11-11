# Phase 1: CRAWL - React & TypeScript Fundamentals

## Welcome to Your Learning Journey! 🎯

The CRAWL phase is all about building a **solid foundation**. You'll create a working e-commerce application using React and TypeScript fundamentals, with Docker from day one. No fancy frameworks yet - just core concepts that everything else builds upon.

---

## 🎓 Learning Objectives

By the end of this phase, you will:
- ✅ Understand React component composition
- ✅ Write type-safe code with TypeScript
- ✅ Manage state with useState and Context API
- ✅ Fetch data from APIs with useEffect
- ✅ Style components with Tailwind CSS
- ✅ Build a simple Express backend
- ✅ Run everything with Docker
- ✅ Understand the basics of REST APIs

---

## 🛠️ Technology Stack

Keep it simple:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js (simple REST API)
- **Database**: PostgreSQL (via Docker)
- **Styling**: Tailwind CSS
- **State**: React useState + Context API
- **Build Tool**: Vite (fast, modern)
- **Container**: Docker & Docker Compose

---

## 📁 Project Structure

```
apps/crawl/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.tsx      # Single product display
│   │   │   ├── ProductList.tsx      # Grid of products
│   │   │   ├── ProductDetail.tsx    # Detailed product view
│   │   │   ├── Cart.tsx             # Shopping cart
│   │   │   ├── CartItem.tsx         # Single cart item
│   │   │   └── Header.tsx           # Site header
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Homepage with product list
│   │   │   ├── ProductPage.tsx      # Individual product page
│   │   │   └── CartPage.tsx         # Shopping cart page
│   │   ├── context/
│   │   │   └── CartContext.tsx      # Shared cart state
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   ├── api/
│   │   │   └── client.ts            # API functions
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Express server
│   │   ├── routes/
│   │   │   └── products.ts          # Product routes
│   │   ├── db/
│   │   │   ├── connection.ts        # Database connection
│   │   │   └── seed.ts              # Sample data
│   │   └── types/
│   │       └── index.ts             # Shared types
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
└── docker-compose.yml
```

---

## 🏗️ What You'll Build

### Feature 1: Product Listing
**Goal**: Display products in a responsive grid

**Concepts Learned**:
- Component composition
- Props
- Mapping arrays to components
- Responsive grid layout

**Implementation**:
```typescript
// types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

// components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="mt-2 font-bold text-lg">{product.name}</h3>
      <p className="text-gray-600 text-sm">{product.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// components/ProductList.tsx
interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// pages/Home.tsx
import { useState, useEffect } from 'react';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading products...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center p-6">Our Products</h1>
      <ProductList products={products} />
    </div>
  );
}
```

**Exercises**:
- [ ] Add a loading spinner component
- [ ] Handle error states (what if the API fails?)
- [ ] Add a filter dropdown for categories
- [ ] Implement a search bar (filter products by name)

---

### Feature 2: Shopping Cart with Context
**Goal**: Add products to cart and manage cart state globally

**Concepts Learned**:
- Context API for shared state
- useState for local state
- Event handlers
- Conditional rendering

**Implementation**:
```typescript
// context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems(currentItems => {
      // Check if product already in cart
      const existingItem = currentItems.find(
        item => item.product.id === product.id
      );

      if (existingItem) {
        // Increase quantity
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new item
      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems =>
      currentItems.filter(item => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// Usage in ProductCard
export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4">
      {/* ... */}
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}

// Header with cart count
export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My E-Commerce Store</h1>
        <div className="relative">
          <button className="flex items-center">
            🛒 Cart
            {totalItems > 0 && (
              <span className="ml-2 bg-red-500 rounded-full px-2 py-1 text-xs">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
```

**Exercises**:
- [ ] Add local storage persistence (save cart when page reloads)
- [ ] Show a toast notification when item is added
- [ ] Prevent adding out-of-stock items
- [ ] Add a "Remove all" button to cart

---

### Feature 3: Simple Backend API
**Goal**: Create a REST API with Express

**Concepts Learned**:
- Express routing
- Database queries
- RESTful API design
- CORS
- Error handling

**Implementation**:
```typescript
// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import { productRoutes } from './routes/products';
import { connectDatabase } from './db/connection';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

// backend/src/routes/products.ts
import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: 5432,
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM products';
    let params: any[] = [];

    if (category) {
      query += ' WHERE category = $1';
      params = [category];
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export { router as productRoutes };
```

**Exercises**:
- [ ] Add pagination (limit and offset)
- [ ] Add sorting (by price, name, date)
- [ ] Create POST endpoint to add products
- [ ] Add input validation with a library like Zod

---

## 🐳 Docker Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
    environment:
      - VITE_API_URL=http://localhost:3001
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    volumes:
      - ./backend/src:/app/src
    environment:
      - DB_HOST=postgres
      - DB_NAME=ecommerce
      - DB_USER=postgres
      - DB_PASSWORD=postgres
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=ecommerce
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

**Start everything**:
```bash
docker-compose up
```

---

## ✅ Completion Checklist

### Core Concepts Mastered
- [ ] React components (function components)
- [ ] Props and prop types
- [ ] useState hook
- [ ] useEffect hook
- [ ] Context API
- [ ] TypeScript interfaces
- [ ] Array mapping
- [ ] Event handlers
- [ ] Conditional rendering

### Features Built
- [ ] Product listing page
- [ ] Product detail view
- [ ] Shopping cart
- [ ] Category filtering
- [ ] Search functionality
- [ ] Express API
- [ ] Database queries
- [ ] Docker setup

### Best Practices
- [ ] Components are small and focused
- [ ] Types defined for all data
- [ ] Error handling in place
- [ ] Loading states shown
- [ ] Code is well-commented

---

## 🎯 Next Steps

Ready to level up? Move to [Phase 2: WALK](02-walk.md) where you'll learn:
- Next.js and Server Components
- Authentication
- Advanced state management
- Form handling and validation
- Testing

---

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Express.js Docs](https://expressjs.com/)
- [Docker Compose](https://docs.docker.com/compose/)

**Happy Learning! 🚀**
