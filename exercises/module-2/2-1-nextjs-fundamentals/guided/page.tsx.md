# Exercise 2-1 Guided: Next.js Fundamentals - Products Page

## Learning Goals
Understand Next.js App Router, file-based routing, and layouts.

## The Page

Create a products page that:
- Lives at `/products` route
- Uses the shared layout
- Fetches and displays products
- Shows a heading and product grid

## Step 1: Understanding App Router

In Next.js App Router, routes are defined by folder structure:
```
app/
  page.tsx         → /
  products/
    page.tsx       → /products
    [id]/
      page.tsx     → /products/123
```

## Step 2: Create the Route Folder

Create the file at: `app/products/page.tsx`

## Step 3: Basic Page Structure

```tsx
// This is a Server Component by default (no 'use client')
// Server Components can fetch data directly

export default function ProductsPage() {
  // In Next.js, the default export is the page component
  // The function name can be anything, but convention is [Route]Page

  return (
    <div>
      <h1>Products</h1>
      {/* Product grid will go here */}
    </div>
  );
}
```

## Step 4: Adding Metadata

```tsx
import { Metadata } from 'next';

// Metadata export for SEO - only works in Server Components
export const metadata: Metadata = {
  title: 'Products | E-Commerce',
  description: 'Browse our product catalog',
};

export default function ProductsPage() {
  // ...
}
```

## Step 5: Fetching Data in Server Component

```tsx
import { Metadata } from 'next';
import { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Products | E-Commerce',
  description: 'Browse our product catalog',
};

// Server Components can be async!
export default async function ProductsPage() {
  // Fetch directly in the component - no useEffect needed
  const response = await fetch('http://localhost:3001/api/products');
  const products: Product[] = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Step 6: Using Existing Components

```tsx
import { Metadata } from 'next';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Products | E-Commerce',
  description: 'Browse our product catalog',
};

export default async function ProductsPage() {
  const response = await fetch('http://localhost:3001/api/products', {
    cache: 'no-store', // Disable caching for fresh data
  });
  const products: Product[] = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => {}} // We'll implement this later
          />
        ))}
      </div>
    </div>
  );
}
```

## Key Concepts

1. **File-based routing**: Folder structure = URL structure
2. **Server Components**: Default in App Router, can fetch data directly
3. **Metadata export**: For SEO, only works in Server Components
4. **Async components**: Server Components can be async functions
5. **No useEffect for data**: Fetch happens on the server
