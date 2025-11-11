# Phase 2: WALK - Production Patterns & Next.js

## Overview

Welcome to the WALK phase! You've mastered the fundamentals in CRAWL - now it's time to learn **production-ready patterns** and professional development practices. You'll migrate to Next.js, add authentication, implement proper state management, and build features that real users need.

---

## 🎓 Learning Objectives

By the end of this phase, you will:
- ✅ Master Next.js App Router and Server Components
- ✅ Implement authentication (JWT or NextAuth.js)
- ✅ Use advanced state management (Zustand or Redux Toolkit)
- ✅ Handle forms with validation (React Hook Form + Zod)
- ✅ Write tests (Jest + React Testing Library)
- ✅ Use Prisma ORM for database access
- ✅ Implement proper error boundaries
- ✅ Build a complete checkout flow
- ✅ Optimize Docker builds

---

## 🛠️ Technology Stack Upgrade

```
CRAWL → WALK

React + Vite          → Next.js 14 App Router
useState + Context    → Zustand / Redux Toolkit
Express.js            → Next.js API Routes (still Express compatible)
Raw SQL               → Prisma ORM
No testing            → Jest + React Testing Library
Basic Docker          → Multi-stage Docker builds
No auth               → NextAuth.js / JWT
```

---

## 🏗️ What You'll Build

### Feature 1: Migration to Next.js

**Why Next.js?**
- Server-side rendering for better performance
- Built-in routing
- API routes
- Image optimization
- Better SEO

**Project Structure Evolution**:
```
apps/walk/
├── frontend/
│   ├── app/
│   │   ├── (auth)/                 # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx       # Dynamic route
│   │   │   └── page.tsx           # Products list
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── products/              # Product-specific components
│   │   └── cart/                  # Cart components
│   ├── lib/
│   │   ├── api.ts                 # API client
│   │   ├── auth.ts                # Auth utilities
│   │   ├── store.ts               # Zustand store
│   │   └── validation.ts          # Zod schemas
│   └── Dockerfile
└── backend/
    ├── prisma/
    │   └── schema.prisma          # Database schema
    └── src/
        ├── routes/
        ├── middleware/
        │   ├── auth.ts
        │   └── validation.ts
        └── services/
```

**Server Components Example**:
```typescript
// app/products/page.tsx (Server Component)
import { Suspense } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';

// This runs on the server!
async function getProducts(filters: SearchParams) {
  const response = await fetch('http://backend:3001/api/products', {
    cache: 'no-store', // or 'force-cache' for caching
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

interface SearchParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Data fetched on server
  const products = await getProducts(searchParams);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Filters */}
        <aside className="col-span-1">
          <ProductFilters />
        </aside>

        {/* Products with loading state */}
        <main className="col-span-3">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// Metadata for SEO
export function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  return {
    title: searchParams.category
      ? `${searchParams.category} Products - My Store`
      : 'All Products - My Store',
    description: 'Browse our collection of quality products',
  };
}
```

**Client Component (when needed)**:
```typescript
// components/products/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

export function AddToCartButton({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useStore(state => state.addToCart);

  const handleClick = async () => {
    setIsAdding(true);

    try {
      await addToCart(product);
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

---

### Feature 2: Authentication

**Implementation with NextAuth.js**:
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { prisma } from '@/lib/prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      // Show error toast
      console.error(result.error);
    } else {
      // Redirect to home
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full border rounded px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full border rounded px-3 py-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Protected route example
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/profile/:path*'],
};
```

---

### Feature 3: Advanced State Management with Zustand

**Why Zustand?**
- Simpler than Redux
- Less boilerplate
- Better TypeScript support
- Smaller bundle size

```typescript
// lib/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // UI
  isCartOpen: boolean;
  toggleCart: () => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        set((state) => {
          const existingItem = state.cart.find(
            item => item.product.id === product.id
          );

          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { product, quantity: 1 }],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter(item => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          cart: state.cart.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      isCartOpen: false,
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      totalItems: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().cart.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }), // Only persist cart
    }
  )
);

// Usage in components
'use client';

export function CartButton() {
  const totalItems = useStore(state => state.totalItems());
  const toggleCart = useStore(state => state.toggleCart);

  return (
    <button onClick={toggleCart} className="relative">
      🛒
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {totalItems}
        </span>
      )}
    </button>
  );
}
```

---

### Feature 4: Database with Prisma

**Why Prisma?**
- Type-safe database access
- Auto-completion
- Migrations
- Great developer experience

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

enum Role {
  USER
  ADMIN
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Decimal  @db.Decimal(10, 2)
  category    String
  imageUrl    String
  stock       Int
  orderItems  OrderItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([createdAt])
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  total       Decimal     @db.Decimal(10, 2)
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal @db.Decimal(10, 2)

  @@index([orderId])
  @@index([productId])
}
```

**Usage**:
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// app/api/products/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json(products);
}

// Migrations
// Run: npx prisma migrate dev --name init
// Run: npx prisma generate
```

---

### Feature 5: Testing

```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/products/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  category: 'electronics',
  imageUrl: '/test.jpg',
  stock: 10,
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls addToCart when button clicked', () => {
    const mockAddToCart = jest.fn();

    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});

// __tests__/api/products.test.ts
import { GET } from '@/app/api/products/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe('/api/products', () => {
  it('returns products', async () => {
    const mockProducts = [mockProduct];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const response = await GET(new Request('http://localhost:3000/api/products'));
    const data = await response.json();

    expect(data).toEqual(mockProducts);
  });
});
```

---

## ✅ Completion Checklist

### Concepts Mastered
- [ ] Next.js App Router
- [ ] Server vs Client Components
- [ ] Authentication with NextAuth.js
- [ ] Form handling with React Hook Form
- [ ] Validation with Zod
- [ ] State management with Zustand
- [ ] Database access with Prisma
- [ ] Testing with Jest
- [ ] API route handlers
- [ ] Middleware

### Features Built
- [ ] User registration
- [ ] User login
- [ ] Protected routes
- [ ] Persistent cart
- [ ] Checkout flow
- [ ] Order history
- [ ] Product search
- [ ] Form validation

### Testing
- [ ] Component tests
- [ ] API route tests
- [ ] Integration tests
- [ ] E2E tests (optional)

---

## 🎯 Next Steps

Ready for enterprise architecture? Move to [Phase 3: RUN](03-run.md) where you'll learn:
- NestJS microservices
- GraphQL
- Event-driven architecture
- Message queues
- Advanced caching

---

**Great work! You're building production-ready applications! 🚀**
