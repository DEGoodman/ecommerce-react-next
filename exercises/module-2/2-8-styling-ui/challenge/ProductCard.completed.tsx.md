# Exercise 2-8 Solution: Styled ProductCard

```tsx
import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

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
