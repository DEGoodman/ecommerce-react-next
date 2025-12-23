// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================
// A reusable component that displays a single product.
// This demonstrates:
// 1. Component props with TypeScript
// 2. Using a custom hook (useCart)
// 3. Event handlers (onClick)
// ============================================================================

import { Product } from '../types';
import { useCart } from '../context/CartContext';

// PROPS INTERFACE
// Defines what props this component accepts
// TypeScript will error if you try to use <ProductCard> without a product prop
interface ProductCardProps {
  product: Product;  // Required: Must pass a Product object
}

// COMPONENT FUNCTION
// Syntax: ({ propName }: PropsType) - destructuring props with TypeScript type
export function ProductCard({ product }: ProductCardProps) {
  // Get addToCart function from cart context
  // We only need addToCart, so we destructure just that one function
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      {/* TypeScript knows product.image and product.name exist! */}
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>

      {/* toFixed(2) formats number to 2 decimal places */}
      <p className="price">${product.price.toFixed(2)}</p>

      {/* onClick event handler - arrow function calls addToCart */}
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}
