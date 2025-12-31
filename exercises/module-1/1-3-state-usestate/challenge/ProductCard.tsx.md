# Exercise 1-3: State with useState

## User Story
As a shopper, I want to mark products as favorites so I can easily find items I'm interested in.

## Acceptance Criteria
- [ ] Each product card has a favorite toggle button
- [ ] Clicking the button toggles the favorite state
- [ ] Visual indicator shows whether product is favorited (♥) or not (♡)
- [ ] State persists while browsing (local component state is fine)

## Starter Code

```tsx
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}
```
