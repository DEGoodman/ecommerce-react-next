# Exercise 1-2 Solution: Components & Props

```tsx
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductDisplayProps {
  products: Product[];
  layout: 'grid' | 'list';
}

export function ProductDisplay({ products, layout }: ProductDisplayProps) {
  const className = layout === 'grid' ? 'products-grid' : 'products-list';

  return (
    <div className={className}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```
