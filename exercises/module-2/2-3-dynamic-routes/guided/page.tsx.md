# Exercise 2-3 Guided: Dynamic Routes & Data Fetching

## Learning Goals
Create dynamic routes with [id] parameters and server-side data fetching.

## The Page

Create a product detail page that:
- Lives at `/products/[id]` route
- Fetches a single product by ID
- Pre-renders popular products at build time

## Step 1: Understanding Dynamic Routes

```
app/
  products/
    page.tsx           → /products
    [id]/
      page.tsx         → /products/123, /products/abc
```

The `[id]` folder creates a dynamic segment. The value is available via `params`.

## Step 2: Create the Route Structure

Create: `app/products/[id]/page.tsx`

## Step 3: Basic Dynamic Page

```tsx
// app/products/[id]/page.tsx

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  // params.id comes from the URL
  return (
    <div>
      <h1>Product {params.id}</h1>
    </div>
  );
}
```

## Step 4: Fetching Data with the ID

```tsx
import { Product } from '@/types';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const response = await fetch(
    `http://localhost:3001/api/products/${params.id}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    // We'll handle this better with error.tsx later
    return <div>Product not found</div>;
  }

  const product: Product = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl text-gray-600">${product.price}</p>
      <p className="mt-4">{product.description}</p>
    </div>
  );
}
```

## Step 5: Dynamic Metadata

```tsx
import { Metadata } from 'next';
import { Product } from '@/types';

interface ProductPageProps {
  params: { id: string };
}

// Generate metadata based on the product
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const response = await fetch(`http://localhost:3001/api/products/${params.id}`);
  const product: Product = await response.json();

  return {
    title: `${product.name} | E-Commerce`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // ... rest of component
}
```

## Step 6: Static Generation with generateStaticParams

```tsx
import { Metadata } from 'next';
import { Product } from '@/types';
import Link from 'next/link';

interface ProductPageProps {
  params: { id: string };
}

// Pre-render these product pages at build time
export async function generateStaticParams() {
  const response = await fetch('http://localhost:3001/api/products');
  const products: Product[] = await response.json();

  // Return array of params objects
  // Next.js will pre-render a page for each
  return products.slice(0, 10).map(product => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const response = await fetch(`http://localhost:3001/api/products/${params.id}`);
  const product: Product = await response.json();

  return {
    title: `${product.name} | E-Commerce`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const response = await fetch(
    `http://localhost:3001/api/products/${params.id}`,
    { cache: 'force-cache' } // Can cache since we pre-render
  );

  if (!response.ok) {
    return <div>Product not found</div>;
  }

  const product: Product = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="text-blue-500 hover:underline">
        ← Back to Products
      </Link>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
          <span className="text-gray-400">Product Image</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          <p className="text-2xl font-semibold mt-4">${product.price}</p>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <p className="mt-2 text-sm">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <button
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Key Concepts

1. **Dynamic segments**: `[id]` in folder name captures URL parameter
2. **params prop**: Access dynamic values via `params.id`
3. **generateStaticParams**: Pre-render pages at build time (SSG)
4. **generateMetadata**: Dynamic SEO metadata based on data
5. **Caching**: Use `force-cache` for pre-rendered, `no-store` for dynamic
