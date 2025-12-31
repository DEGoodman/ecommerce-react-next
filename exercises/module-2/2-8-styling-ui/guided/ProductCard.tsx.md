# Exercise 2-8 Guided: Styling & UI Patterns with Tailwind CSS

## Learning Goals
Build polished, responsive UI components with Tailwind CSS best practices.

## Tailwind Fundamentals

Tailwind uses utility classes to style elements directly in JSX:
- Layout: `flex`, `grid`, `container`
- Spacing: `p-4`, `m-2`, `gap-6`
- Colors: `bg-blue-500`, `text-gray-600`
- Responsive: `md:grid-cols-2`, `lg:px-8`
- States: `hover:bg-blue-600`, `focus:ring-2`

## Step 1: Responsive Product Card

```tsx
// components/ProductCard.tsx
import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category}
        </p>

        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        <p className="mt-2 text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>

        <button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg
                     hover:bg-blue-600 active:bg-blue-700
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
```

## Step 2: Responsive Grid Layout

```tsx
// components/ProductGrid.tsx
'use client';

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product.name);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

## Step 3: Container and Layout

```tsx
// app/products/page.tsx
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Products
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ProductGrid products={products} />
      </main>
    </div>
  );
}
```

## Step 4: Loading Skeleton

```tsx
// components/ProductCardSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded w-full mt-4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

## Step 5: Dark Mode Support

```tsx
// Tailwind config enables dark mode
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for system preference
  // ...
};

// Component with dark mode
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-gray-900 dark:text-white">{product.name}</h3>
      <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
      <button className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  );
}
```

## Key Patterns

1. **Responsive breakpoints**: `sm:`, `md:`, `lg:`, `xl:`
2. **Group hover**: `group` + `group-hover:` for parent-child effects
3. **Transitions**: `transition-*` + `duration-*` for smooth animations
4. **Focus states**: `focus:ring-*` for accessibility
5. **Dark mode**: `dark:` prefix for dark theme styles
6. **Container**: `container mx-auto px-4` for consistent max-width
