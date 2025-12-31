# Exercise 2-1 Solution: Products Page

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
    cache: 'no-store',
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
            onAddToCart={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
```
