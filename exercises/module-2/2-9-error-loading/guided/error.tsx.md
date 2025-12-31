# Exercise 2-9 Guided: Error Handling & Loading States

## Learning Goals
Create resilient UX with error boundaries, loading states, and Suspense.

## App Router Special Files

```
app/
  products/
    page.tsx       # The main page
    loading.tsx    # Loading UI (auto-wrapped in Suspense)
    error.tsx      # Error boundary (catches errors in page and children)
    not-found.tsx  # 404 page (triggered by notFound())
```

## Step 1: Loading State

```tsx
// app/products/loading.tsx

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Step 2: Error Boundary

```tsx
// app/products/error.tsx
'use client';  // Error boundaries must be Client Components

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to reporting service
    console.error('Products page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>

        <p className="text-gray-600 mb-6">
          We couldn't load the products. Please try again.
        </p>

        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Try again
          </button>

          <a
            href="/"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Go home
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 text-sm overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
```

## Step 3: Not Found Page

```tsx
// app/products/[id]/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="text-gray-600 mb-6">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/products"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Browse Products
      </Link>
    </div>
  );
}
```

## Step 4: Trigger Not Found

```tsx
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const response = await fetch(`http://localhost:3001/api/products/${params.id}`);

  if (!response.ok) {
    notFound(); // Triggers not-found.tsx
  }

  const product = await response.json();

  return (
    <div>
      <h1>{product.name}</h1>
      {/* ... */}
    </div>
  );
}
```

## Step 5: Suspense for Streaming

```tsx
// app/products/page.tsx
import { Suspense } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';

// Separate async component for data fetching
async function Products() {
  const response = await fetch('http://localhost:3001/api/products');
  const products = await response.json();

  return <ProductGrid products={products} />;
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {/* Suspense enables streaming - page renders immediately,
          skeleton shows while Products loads */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <Products />
      </Suspense>
    </div>
  );
}
```

## Step 6: Global Error Boundary

```tsx
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <button onClick={reset} className="bg-blue-500 text-white px-4 py-2 rounded">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

## Key Concepts

1. **loading.tsx**: Auto-wrapped in Suspense, shows during page load
2. **error.tsx**: Catches errors, must be 'use client', has reset()
3. **not-found.tsx**: Triggered by notFound() function
4. **Suspense**: Manual streaming boundaries for async components
5. **global-error.tsx**: Catches root layout errors
6. **reset()**: Re-renders the error boundary's children
