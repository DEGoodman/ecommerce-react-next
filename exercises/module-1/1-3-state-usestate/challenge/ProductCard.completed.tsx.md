# Exercise 1-3 Solution

```tsx
import { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
      <button
        className="favorite-btn"
        onClick={() => setIsFavorite(prev => !prev)}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
    </div>
  );
}
```
