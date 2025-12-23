// ============================================================================
// CART COMPONENT
// ============================================================================
// Shows the shopping cart with all items.
// This demonstrates:
// 1. Using context to access global state
// 2. Multiple event handlers
// 3. Mapping over items with complex UI
// 4. Early return for empty state
// ============================================================================

import { useCart } from '../context/CartContext';

export function Cart() {
  // Destructure everything we need from cart context
  // We get both STATE (items, total) and ACTIONS (functions)
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  // ---- EARLY RETURN FOR EMPTY STATE ----
  // If cart is empty, show a different UI
  if (items.length === 0) {
    return (
      <div className="cart empty">
        <h2>Your Cart</h2>
        <p>Your cart is empty</p>
      </div>
    );
  }

  // ---- MAIN RENDER (CART HAS ITEMS) ----
  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {/* List of cart items */}
      <div className="cart-items">
        {/* Map over items array to render each cart item */}
        {items.map((item) => (
          // key={item.product.id} is required for React's reconciliation
          <div key={item.product.id} className="cart-item">
            <img src={item.product.image} alt={item.product.name} />

            {/* Product details */}
            <div className="item-details">
              <h4>{item.product.name}</h4>
              <p>${item.product.price.toFixed(2)}</p>
            </div>

            {/* Quantity controls: - [qty] + */}
            <div className="quantity-controls">
              {/* Decrement quantity - if it goes to 0, item is removed */}
              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                -
              </button>
              <span>{item.quantity}</span>
              {/* Increment quantity */}
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                +
              </button>
            </div>

            {/* Remove button - deletes item entirely */}
            <button
              className="remove"
              onClick={() => removeFromCart(item.product.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart footer with total and clear button */}
      <div className="cart-footer">
        {/* Total is calculated in CartContext with reduce() */}
        <p className="total">Total: ${total.toFixed(2)}</p>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
}
