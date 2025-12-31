# Exercise 1-3: State with useState

## Goal
Add a favorites toggle button to the ProductCard component.

## Requirements
- Track favorite state locally with useState
- Toggle button shows current state (♡ / ♥)
- Clicking toggles between favorited and not favorited

## Key Concepts
- useState hook for local component state
- State toggle pattern: `setState(prev => !prev)`
- Conditional rendering based on state

## Starter Code

```tsx
import { Product } from '../types';
import { useCart } from '../context/CartContext';

// Import useState from 'react'

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Add favorite state here
  // Hint: const [isFavorite, setIsFavorite] = useState(...)

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
      {/* Add favorite toggle button here */}
      {/* Show ♥ when favorited, ♡ when not */}
    </div>
  );
}
```
