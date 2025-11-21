import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart empty">
        <h2>Your Cart</h2>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.product.id} className="cart-item">
            <img src={item.product.image} alt={item.product.name} />
            <div className="item-details">
              <h4>{item.product.name}</h4>
              <p>${item.product.price.toFixed(2)}</p>
            </div>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <button
              className="remove"
              onClick={() => removeFromCart(item.product.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <p className="total">Total: ${total.toFixed(2)}</p>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
}
