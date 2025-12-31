# Exercise 2-3 Solution: Dynamic Product Page

```tsx
import { Metadata } from 'next';
import { Product } from '@/types';
import Link from 'next/link';

interface ProductPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const response = await fetch('http://localhost:3001/api/products');
  const products: Product[] = await response.json();

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
    { cache: 'force-cache' }
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
