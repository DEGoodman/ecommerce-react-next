# Exercise 2-2 Guided: Server vs Client Components

## Learning Goals
Master the mental model of React Server Components and know when to use 'use client'.

## The Component Split

We'll refactor the products page to:
- Keep data fetching in Server Components
- Move interactivity to Client Components
- Minimize JavaScript sent to the browser

## Step 1: Understanding the Split

```
Server Components (default):        Client Components ('use client'):
├── Can fetch data directly         ├── Can use useState, useEffect
├── Access backend resources        ├── Can handle events (onClick)
├── Keep secrets server-side        ├── Can use browser APIs
├── Zero JavaScript to client       ├── Needed for interactivity
└── Cannot use hooks                └── Must be explicitly marked
```

## Step 2: Identify What Needs Client

Looking at ProductCard, it has:
- `onAddToCart` callback (needs onClick handler)
- Potential for hover states, animations

The page itself just renders data - can stay Server Component.

## Step 3: Create a Client Wrapper

Create `components/ProductGrid.tsx`:

```tsx
'use client';

// This directive makes this a Client Component
// All children components will also be client-rendered

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const handleAddToCart = (product: Product) => {
    // This needs client-side JavaScript
    console.log('Adding to cart:', product.name);
    // We'll connect to real cart state later
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => handleAddToCart(product)}
        />
      ))}
    </div>
  );
}
```

## Step 4: Update the Server Component Page

The page stays as a Server Component but uses the Client Component:

```tsx
// app/products/page.tsx
// NO 'use client' - this is a Server Component

import { Metadata } from 'next';
import { Product } from '@/types';
import { ProductGrid } from '@/components/ProductGrid';

export const metadata: Metadata = {
  title: 'Products | E-Commerce',
  description: 'Browse our product catalog',
};

export default async function ProductsPage() {
  // Data fetching happens on the server
  const response = await fetch('http://localhost:3001/api/products', {
    cache: 'no-store',
  });
  const products: Product[] = await response.json();

  // Pass data to Client Component
  // Products are serialized and sent to the client
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

## Step 5: The Mental Model

```
Browser Request
     │
     ▼
┌─────────────────────────────────────┐
│  Server Component (ProductsPage)    │
│  - Runs on server only              │
│  - Fetches data                     │
│  - Returns HTML + serialized props  │
└─────────────────────────────────────┘
     │
     ▼ (HTML + data as props)
┌─────────────────────────────────────┐
│  Client Component (ProductGrid)     │
│  - Hydrates on client               │
│  - Handles interactivity            │
│  - Has access to React hooks        │
└─────────────────────────────────────┘
```

## Key Concepts

1. **Server by default**: Components without 'use client' are Server Components
2. **Client boundary**: 'use client' marks where client-side JS begins
3. **Props serialization**: Data passed to Client Components must be serializable
4. **Push interactivity down**: Keep as much as possible on the server
5. **No hooks in Server**: useState, useEffect only work in Client Components
